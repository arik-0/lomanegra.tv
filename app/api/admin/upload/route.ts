import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere sesión de operador o administrador para subir archivos.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'El archivo supera el tamaño máximo permitido de 10 MB.' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'uploaded_image.png';
    const extension = path.extname(originalName).toLowerCase() || '.png';
    const contentType = (file.type || 'image/png').toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(extension) || !ALLOWED_MIME_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se admiten imágenes (JPG, PNG, WEBP, GIF, SVG, AVIF).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitizar nombre de archivo y generar nombre único
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${baseName}_${Date.now()}${extension}`;

    // 1. Intentar subir a Supabase Storage (bucket: 'images')
    try {
      const { data, error } = await supabaseAdmin.storage
        .from('images')
        .upload(`uploads/${uniqueFileName}`, buffer, {
          contentType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicData } = supabaseAdmin.storage
          .from('images')
          .getPublicUrl(`uploads/${uniqueFileName}`);

        if (publicData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicData.publicUrl,
            fileName: uniqueFileName,
            storage: 'supabase',
          });
        }
      } else if (error) {
        console.warn('[Upload API] Supabase storage upload error:', error);
      }
    } catch (sbErr) {
      console.warn('[Upload API] Supabase storage no disponible:', sbErr);
    }

    // 2. Intentar Almacenamiento Local en /public/uploads (si el sistema de archivos permite escritura)
    try {
      const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const localFilePath = path.join(publicUploadsDir, uniqueFileName);
      await fs.promises.writeFile(localFilePath, buffer);

      const localUrl = `/uploads/${uniqueFileName}`;
      return NextResponse.json({
        success: true,
        url: localUrl,
        fileName: uniqueFileName,
        storage: 'local',
      });
    } catch (fsErr) {
      console.warn('[Upload API] Almacenamiento local no disponible (read-only filesystem), usando Data URL:', fsErr);
    }

    // 3. Fallback ultra confiable: Data URL Base64 (funciona 100% en cualquier servidor de solo lectura)
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: uniqueFileName,
      storage: 'base64',
    });
  } catch (error: any) {
    console.error('[Upload API] Error subiendo archivo:', error);
    return NextResponse.json(
      { error: error.message || 'Error procesando la subida del archivo' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Blindaje de seguridad: requerir sesión de administrador para eliminar archivos
    if (!verifyAdminSession()) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere sesión de operador o administrador para eliminar archivos.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let url = searchParams.get('url');

    if (!url) {
      try {
        const body = await req.json();
        if (body?.url) url = body.url;
      } catch {}
    }

    if (!url) {
      return NextResponse.json({ error: 'URL requerida para eliminar archivo' }, { status: 400 });
    }

    // Si es un archivo local /uploads/nombre.ext
    if (url.startsWith('/uploads/')) {
      const fileName = path.basename(url);
      const publicUploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
      const localFilePath = path.resolve(publicUploadsDir, fileName);

      // Protección contra Path Traversal
      if (!localFilePath.startsWith(publicUploadsDir)) {
        return NextResponse.json({ error: 'Ruta de archivo inválida' }, { status: 400 });
      }

      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return NextResponse.json({ success: true, message: 'Archivo local eliminado correctamente' });
    }

    // Si es una URL de Supabase Storage
    if (url.includes('supabase.co') && url.includes('/images/')) {
      const match = url.match(/\/images\/(.+)$/);
      if (match && match[1]) {
        const storagePath = decodeURIComponent(match[1]);
        await supabaseAdmin.storage.from('images').remove([storagePath]);
      }
      return NextResponse.json({ success: true, message: 'Archivo de Supabase Storage eliminado' });
    }

    return NextResponse.json({ success: true, message: 'Imagen descartada' });
  } catch (error: any) {
    console.warn('[Upload API] Error al eliminar archivo:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar archivo' },
      { status: 500 }
    );
  }
}
