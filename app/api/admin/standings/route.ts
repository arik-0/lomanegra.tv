import { NextResponse } from 'next/server';
import { getStandings, updateStandings, resetStandings } from '@/lib/standingsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getStandings();
    return NextResponse.json({ success: true, standings: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error obteniendo tablas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
    }

    const updated = updateStandings(body);
    return NextResponse.json({ success: true, standings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error guardando tablas' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const reset = resetStandings();
    return NextResponse.json({ success: true, standings: reset, message: 'Tablas restablecidas' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error restableciendo tablas' }, { status: 500 });
  }
}
