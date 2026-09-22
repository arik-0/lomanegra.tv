import { NextResponse } from 'next/server';
import { getClubsData, saveClubsData } from '@/lib/clubsPersistence';
import { verifyAdminSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clubs = await getClubsData();
    return NextResponse.json({ success: true, clubs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al obtener clubes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere sesión de operador o administrador.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body || !Array.isArray(body.clubs)) {
      return NextResponse.json({ error: 'Formato de clubes inválido' }, { status: 400 });
    }
    const updated = await saveClubsData(body.clubs);
    return NextResponse.json({ success: true, clubs: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al guardar clubes' }, { status: 500 });
  }
}
