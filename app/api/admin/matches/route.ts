import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getStoredMatches, addStoredMatch, updateStoredMatch, deleteStoredMatch, MatchData } from '@/lib/adminStore';
import crypto from 'crypto';
import { sanitizeRegionalText } from '@/lib/sanitize';

// Utilidad para evitar cuelgues o timeouts con la base de datos
async function withTimeout<T>(promise: PromiseLike<T>, ms = 2500): Promise<T | null> {
  let timer: any;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    const res = await Promise.race([Promise.resolve(promise), timeoutPromise]);
    clearTimeout(timer);
    return res as T;
  } catch (err) {
    clearTimeout(timer);
    return null;
  }
}

export async function GET() {
  try {
    const res: any = await withTimeout(
      supabaseAdmin.from('matches').select('*').order('date', { ascending: true })
    );

    if (res && !res.error && res.data && res.data.length > 0) {
      // Normalizar campos para compatibilidad con la vista
      const normalized = res.data.map((m: any) => {
        const isTbd =
          m.description?.includes('[A CONFIRMAR]') ||
          (m.date && new Date(m.date).getFullYear() >= 2099);
        return {
          ...m,
          title: sanitizeRegionalText(m.title),
          is_date_confirmed: !isTbd,
          date: isTbd ? null : m.date,
          description: sanitizeRegionalText((m.description || '').replace('[A CONFIRMAR]', '').trim()),
        };
      });
      return NextResponse.json({ matches: normalized, source: 'database' });
    }

    // Retornar partidos del almacén en memoria
    const memMatches = getStoredMatches().map((m) => ({
      ...m,
      title: sanitizeRegionalText(m.title),
      description: sanitizeRegionalText(m.description),
    }));
    return NextResponse.json({ matches: memMatches, source: 'memory' });
  } catch (error: any) {
    const memMatches = getStoredMatches().map((m) => ({
      ...m,
      title: sanitizeRegionalText(m.title),
      description: sanitizeRegionalText(m.description),
    }));
    return NextResponse.json({ matches: memMatches, source: 'fallback' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const matchId = body.id || crypto.randomUUID();
    const isDateConfirmed = Boolean(body.is_date_confirmed);

    // Si la fecha está confirmada, validar y formatear
    let matchDate: string;
    if (isDateConfirmed && body.date) {
      try {
        matchDate = new Date(body.date).toISOString();
      } catch {
        matchDate = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      }
    } else {
      // Para esquemas con NOT NULL constraint en 'date'
      matchDate = '2099-12-31T23:59:59.000Z';
    }

    const cleanTitle = sanitizeRegionalText(body.title || 'Blanco y Negro vs Rival');
    const rawDesc = sanitizeRegionalText(body.description || 'Fútbol Mayor • Torneo Oficial');
    const cleanDesc = rawDesc.replace('[A CONFIRMAR]', '').trim();
    const dbDescription = !isDateConfirmed ? `[A CONFIRMAR] ${cleanDesc}` : cleanDesc;

    const newMatch: MatchData = {
      id: matchId,
      title: cleanTitle,
      description: cleanDesc,
      date: isDateConfirmed ? matchDate : null,
      is_date_confirmed: isDateConfirmed,
      price: Number(body.price) || 3500,
      cloudflare_live_input_uid: body.cloudflare_live_input_uid || 'live_input_byn',
      image_url: body.image_url || '/matches/blanco-y-negro-vs-ifc.png',
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      is_live: body.is_live !== undefined ? Boolean(body.is_live) : false,
    };

    // Guardar inmediatamente en memoria
    addStoredMatch(newMatch);

    // Guardar en Supabase con timeout protegido
    const dbPayload = {
      id: newMatch.id,
      title: newMatch.title,
      description: dbDescription,
      date: matchDate,
      price: newMatch.price,
      cloudflare_live_input_uid: newMatch.cloudflare_live_input_uid,
      image_url: newMatch.image_url,
      is_active: newMatch.is_active,
    };

    withTimeout(supabaseAdmin.from('matches').insert([dbPayload]).select(), 2500)
      .then((res: any) => {
        if (res?.error) console.error('Supabase match insert error:', res.error);
      })
      .catch((err) => console.error('Supabase match insert exception:', err));

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

    if (updates.title) updates.title = sanitizeRegionalText(updates.title);
    if (updates.description) updates.description = sanitizeRegionalText(updates.description);

    // Actualizar en el almacén de memoria primero
    const updated = updateStoredMatch(id, updates);

    // Actualizar en Supabase en segundo plano con timeout
    const payload: Record<string, any> = {};
    if (updates.title) payload.title = updates.title;
    if (updates.price) payload.price = Number(updates.price);
    if (updates.cloudflare_live_input_uid) payload.cloudflare_live_input_uid = updates.cloudflare_live_input_uid;
    if (updates.image_url !== undefined) payload.image_url = updates.image_url;
    if (updates.is_active !== undefined) payload.is_active = updates.is_active;
    if (updates.is_live !== undefined) payload.is_live = updates.is_live;

    const isDateConfirmed = updates.is_date_confirmed !== undefined ? Boolean(updates.is_date_confirmed) : undefined;
    if (isDateConfirmed !== undefined || updates.description !== undefined) {
      const desc = sanitizeRegionalText(updates.description || updated?.description || '');
      const cleanDesc = desc.replace('[A CONFIRMAR]', '').trim();
      payload.description = isDateConfirmed === false ? `[A CONFIRMAR] ${cleanDesc}` : cleanDesc;
    }

    if (updates.date) {
      payload.date = new Date(updates.date).toISOString();
    } else if (isDateConfirmed === false) {
      payload.date = '2099-12-31T23:59:59.000Z';
    }

    if (Object.keys(payload).length > 0) {
      withTimeout(supabaseAdmin.from('matches').update(payload).eq('id', id), 2500)
        .catch((err) => console.error('Supabase update exception:', err));
    }

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

    deleteStoredMatch(id);

    withTimeout(supabaseAdmin.from('matches').delete().eq('id', id), 2500)
      .catch((err) => console.error('Supabase delete exception:', err));

    return NextResponse.json({ success: true, message: 'Partido eliminado.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error eliminando partido' }, { status: 500 });
  }
}
