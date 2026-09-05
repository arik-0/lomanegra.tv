import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getStoredMatches, addStoredMatch, updateStoredMatch, deleteStoredMatch, MatchData } from '@/lib/adminStore';
import crypto from 'crypto';

export async function GET() {
  try {
    const { data: dbMatches, error } = await supabaseAdmin
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbMatches && dbMatches.length > 0) {
      return NextResponse.json({ matches: dbMatches, source: 'database' });
    }

    // Retornar partidos del almacén en memoria
    return NextResponse.json({ matches: getStoredMatches(), source: 'memory' });
  } catch (error: any) {
    return NextResponse.json({ matches: getStoredMatches(), source: 'fallback' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newMatch: MatchData = {
      id: crypto.randomUUID(),
      title: body.title || 'Nuevo Partido',
      description: body.description || '',
      date: body.is_date_confirmed ? body.date || new Date().toISOString() : null,
      is_date_confirmed: Boolean(body.is_date_confirmed),
      price: Number(body.price) || 3500,
      cloudflare_live_input_uid: body.cloudflare_live_input_uid || 'mock_live_stream',
      image_url: body.image_url || null,
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    };

    // Intentar guardar en Supabase si está disponible
    try {
      await supabaseAdmin.from('matches').insert([{
        id: newMatch.id,
        title: newMatch.title,
        description: newMatch.description,
        date: newMatch.date || new Date().toISOString(),
        price: newMatch.price,
        cloudflare_live_input_uid: newMatch.cloudflare_live_input_uid,
        image_url: newMatch.image_url,
        is_active: newMatch.is_active,
      }]);
    } catch {
      // Ignorar si Supabase no está configurado aún
    }

    addStoredMatch(newMatch);
    return NextResponse.json({ success: true, match: newMatch });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creando partido' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido.' }, { status: 400 });
    }

    // Intentar actualizar en Supabase
    try {
      await supabaseAdmin
        .from('matches')
        .update({
          ...updates,
          ...(updates.date ? { date: updates.date } : {}),
        })
        .eq('id', id);
    } catch {
      // Continuar con store en memoria
    }

    const updated = updateStoredMatch(id, updates);
    return NextResponse.json({ success: true, match: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error actualizando partido' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido.' }, { status: 400 });
    }

    try {
      await supabaseAdmin.from('matches').delete().eq('id', id);
    } catch {
      // Continuar
    }

    deleteStoredMatch(id);
    return NextResponse.json({ success: true, message: 'Partido eliminado.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error eliminando partido' }, { status: 500 });
  }
}
