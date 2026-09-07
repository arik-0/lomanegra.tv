import { NextResponse } from 'next/server';
import { getStandings, updateStandings, resetStandings, TorneoType } from '@/lib/standingsStore';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const torneo = searchParams.get('torneo') || undefined;
    const data = getStandings(torneo as TorneoType);
    return NextResponse.json({ success: true, standings: data, torneo: data.torneo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error obteniendo tablas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const torneo = searchParams.get('torneo') || undefined;
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
    }

    const updated = updateStandings(body, (torneo || body.torneo) as TorneoType);
    return NextResponse.json({ success: true, standings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error guardando tablas' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const torneo = searchParams.get('torneo') || undefined;
    const reset = resetStandings(torneo as TorneoType);
    return NextResponse.json({ success: true, standings: reset, message: 'Tablas restablecidas' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error restableciendo tablas' }, { status: 500 });
  }
}
