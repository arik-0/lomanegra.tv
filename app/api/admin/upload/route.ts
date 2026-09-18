import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitizar nombre de archivo y generar nombre único
    const originalName = file.name || 'uploaded_image.png';
    const extension = path.extname(originalName).toLowerCase() || '.png';
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${baseName}_${Date.now()}${extension}`;
    const contentType = file.type || 'image/png';

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
