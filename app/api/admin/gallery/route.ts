import { NextResponse } from 'next/server';
import {
  getGalleryData,
  saveGalleryData,
  deleteGalleryPhoto,
  deleteGalleryPlaylist,
} from '@/lib/galleryPersistence';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getGalleryData();
    return NextResponse.json(
      { success: true, ...data },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    let type = searchParams.get('type') || 'photo';

    if (!id) {
      try {
        const body = await req.json();
        if (body?.id) {
          id = body.id;
          if (body.type) type = body.type;
        }
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'ID requerido para eliminar elemento de galería' }, { status: 400 });
    }

    const updated =
      type === 'playlist'
        ? await deleteGalleryPlaylist(id)
        : await deleteGalleryPhoto(id);

    return NextResponse.json({
      success: true,
      message: `${type === 'playlist' ? 'Playlist' : 'Foto'} eliminada correctamente`,
      ...updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al eliminar elemento de galería' },
      { status: 500 }
    );
  }
}

