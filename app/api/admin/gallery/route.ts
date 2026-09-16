import { NextResponse } from 'next/server';
import { getGalleryData, saveGalleryData } from '@/lib/galleryPersistence';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getGalleryData();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al obtener galería' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 });
    }
    const updated = await saveGalleryData(body);
    return NextResponse.json({ success: true, ...updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al guardar galería' }, { status: 500 });
  }
}
