import { NextResponse } from 'next/server';
import { getGalleryData } from '@/lib/galleryPersistence';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getGalleryData();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al obtener galería' }, { status: 500 });
  }
}
