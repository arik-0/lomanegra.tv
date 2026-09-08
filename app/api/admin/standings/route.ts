import { NextResponse } from 'next/server';
import { getStandings, updateStandings, resetStandings } from '@/lib/standingsPersistence';
import { TorneoType } from '@/lib/standingsStore';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deporte = searchParams.get('deporte') || undefined;
    const categoria = searchParams.get('categoria') || undefined;
    const torneo = searchParams.get('torneo') || undefined;
    const data = await getStandings({ deporte, categoria, torneo });
    return NextResponse.json({
      success: true,
      standings: data,
      deporte: data.deporte,
      categoria: data.categoria,
      torneo: data.torneo,
      source: 'supabase',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error obteniendo tablas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deporteParam = searchParams.get('deporte') || undefined;
    const categoriaParam = searchParams.get('categoria') || undefined;
    const torneoParam = searchParams.get('torneo') || undefined;
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: 'Datos no válidos' }, { status: 400 });
    }

    const deporte = deporteParam || body.deporte;
    const categoria = categoriaParam || body.categoria;
    const torneo = torneoParam || body.torneo;

    const updated = await updateStandings(body, { deporte, categoria, torneo });
    return NextResponse.json({ success: true, standings: updated, source: 'supabase' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error guardando tablas' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const deporte = searchParams.get('deporte') || undefined;
    const categoria = searchParams.get('categoria') || undefined;
    const torneo = searchParams.get('torneo') || undefined;
    const reset = await resetStandings({ deporte, categoria, torneo });
    return NextResponse.json({ success: true, standings: reset, message: 'Tablas restablecidas', source: 'supabase' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error restableciendo tablas' }, { status: 500 });
  }
}
