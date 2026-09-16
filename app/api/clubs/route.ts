import { NextResponse } from 'next/server';
import { getClubsData } from '@/lib/clubsPersistence';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clubs = await getClubsData();
    return NextResponse.json({ success: true, clubs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al obtener clubes' }, { status: 500 });
  }
}
