import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getStoredMatches, addStoredMatch, updateStoredMatch, deleteStoredMatch, MatchData } from '@/lib/adminStore';
import crypto from 'crypto';
import { sanitizeRegionalText } from '@/lib/sanitize';

// Utilidad para evitar cuelgues si la red está caída
async function withTimeout<T>(promise: PromiseLike<T>, ms = 3000): Promise<T | null> {
  let timer: any;
  const timeoutPromise = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    const res = await Promise.race([Promise.resolve(promise), timeoutPromise]);
    clearTimeout(timer);
    return res as T;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

function encodeDescription(
  rawDesc: string,
  isDateConfirmed: boolean,
  league?: string,
  category?: string,
  isLive?: boolean
): string {
  const clean = (rawDesc || '')
    .replace(/\[META:\{.*?\}\]/g, '')
    .replace('[A CONFIRMAR]', '')
    .trim();

  const meta: Record<string, any> = {};
  if (league) meta.league = league;
  if (category) meta.category = category;
  if (isLive !== undefined) meta.is_live = isLive;

  let out = '';
  if (!isDateConfirmed) {
    out += '[A CONFIRMAR] ';
  }
  if (Object.keys(meta).length > 0) {
    out += `[META:${JSON.stringify(meta)}] `;
  }
  out += clean;
  return out.trim();
}

function decodeMatchFields(m: any): MatchData {
  const rawDesc = m.description || '';
  const isTbd =
    rawDesc.includes('[A CONFIRMAR]') ||
    (m.date && new Date(m.date).getFullYear() >= 2099);

  let league = m.league || 'Liga Deportiva del Sur';
  let category = m.category || 'Fútbol Mayor';
  let isLive = m.is_live !== undefined ? Boolean(m.is_live) : false;

  const metaMatch = rawDesc.match(/\[META:(\{.*?\})\]/);
  if (metaMatch) {
    try {
      const parsed = JSON.parse(metaMatch[1]);
      if (parsed.league) league = parsed.league;
      if (parsed.category) category = parsed.category;
      if (parsed.is_live !== undefined) isLive = Boolean(parsed.is_live);
    } catch {}
  }

  const cleanDesc = rawDesc
    .replace(/\[META:\{.*?\}\]/g, '')
    .replace('[A CONFIRMAR]', '')
    .trim();

  return {
    id: m.id,
    title: sanitizeRegionalText(m.title || ''),
    description: sanitizeRegionalText(cleanDesc),
    date: isTbd ? null : m.date,
    is_date_confirmed: !isTbd,
    price: Number(m.price) || 3500,
    cloudflare_live_input_uid: m.cloudflare_live_input_uid || 'live_input_byn',
    image_url: m.image_url || '/matches/blanco-y-negro-vs-ifc.png',
    is_active: m.is_active !== undefined ? Boolean(m.is_active) : true,
    is_live: isLive,
    league: sanitizeRegionalText(league),
    category: sanitizeRegionalText(category),
  };
}

export async function GET() {
  try {
    const res: any = await withTimeout(
      supabaseAdmin.from('matches').select('*').order('date', { ascending: true })
    );

    if (res && !res.error && res.data && res.data.length > 0) {
      // Filtrar filas del sistema (como persistencia de tablas)
      const realMatches = res.data.filter((m: any) => !m.title?.startsWith('__SYSTEM_'));
      const normalized = realMatches.map(decodeMatchFields);
      return NextResponse.json({ matches: normalized, source: 'supabase' });
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
      matchDate = '2099-12-31T23:59:59.000Z';
    }

    const cleanTitle = sanitizeRegionalText(body.title || 'Blanco y Negro vs Rival');
    const rawDesc = sanitizeRegionalText(body.description || 'Fútbol Mayor • Torneo Oficial');
    const league = body.league ? sanitizeRegionalText(body.league) : 'Liga Deportiva del Sur';
    const category = body.category ? sanitizeRegionalText(body.category) : 'Fútbol Mayor';
    const isLive = body.is_live !== undefined ? Boolean(body.is_live) : false;

    const dbDescription = encodeDescription(rawDesc, isDateConfirmed, league, category, isLive);

    const newMatch: MatchData = {
      id: matchId,
      title: cleanTitle,
      description: rawDesc.replace(/\[META:\{.*?\}\]/g, '').replace('[A CONFIRMAR]', '').trim(),
      date: isDateConfirmed ? matchDate : null,
      is_date_confirmed: isDateConfirmed,
      price: Number(body.price) || 3500,
      cloudflare_live_input_uid: body.cloudflare_live_input_uid || 'live_input_byn',
      image_url: body.image_url || '/matches/blanco-y-negro-vs-ifc.png',
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
      is_live: isLive,
      league,
      category,
    };

    // Guardar inmediatamente en memoria y disco
    addStoredMatch(newMatch);

    // Guardar directamente en Supabase
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

    try {
      const { error: dbError } = await supabaseAdmin.from('matches').insert([dbPayload]);
      if (dbError) {
        console.error('[Matches API] Error insertando partido en Supabase:', dbError);
      } else {
        console.log('[Matches API] Partido insertado exitosamente en Supabase:', newMatch.id);
      }
    } catch (dbEx) {
      console.error('[Matches API] Excepción insertando en Supabase:', dbEx);
    }

    return NextResponse.json({ success: true, match: newMatch, source: 'supabase' });
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
    if (updates.league) updates.league = sanitizeRegionalText(updates.league);
    if (updates.category) updates.category = sanitizeRegionalText(updates.category);

    // Actualizar en el almacén de memoria primero
    const updated = updateStoredMatch(id, updates);

    // Preparar payload para Supabase
    const payload: Record<string, any> = {};
    if (updates.title) payload.title = updates.title;
    if (updates.price !== undefined) payload.price = Number(updates.price);
    if (updates.cloudflare_live_input_uid) payload.cloudflare_live_input_uid = updates.cloudflare_live_input_uid;
    if (updates.image_url !== undefined) payload.image_url = updates.image_url;
    if (updates.is_active !== undefined) payload.is_active = updates.is_active;

    const isDateConfirmed = updates.is_date_confirmed !== undefined
      ? Boolean(updates.is_date_confirmed)
      : (updated ? updated.is_date_confirmed : true);

    const descToUse = updates.description || updated?.description || '';
    const leagueToUse = updates.league || updated?.league;
    const catToUse = updates.category || updated?.category;
    const isLiveToUse = updates.is_live !== undefined ? Boolean(updates.is_live) : updated?.is_live;

    payload.description = encodeDescription(descToUse, isDateConfirmed, leagueToUse, catToUse, isLiveToUse);

    if (updates.date) {
      payload.date = new Date(updates.date).toISOString();
    } else if (isDateConfirmed === false) {
      payload.date = '2099-12-31T23:59:59.000Z';
    }

    if (Object.keys(payload).length > 0) {
      try {
        const { error: dbError } = await supabaseAdmin.from('matches').update(payload).eq('id', id);
        if (dbError) {
          console.error('[Matches API] Error actualizando partido en Supabase:', dbError);
        } else {
          console.log('[Matches API] Partido actualizado en Supabase:', id);
        }
      } catch (dbEx) {
        console.error('[Matches API] Excepción actualizando en Supabase:', dbEx);
      }
    }

    return NextResponse.json({ success: true, match: updated, source: 'supabase' });
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

    try {
      const { error: dbError } = await supabaseAdmin.from('matches').delete().eq('id', id);
      if (dbError) {
        console.error('[Matches API] Error eliminando partido en Supabase:', dbError);
      } else {
        console.log('[Matches API] Partido eliminado en Supabase:', id);
      }
    } catch (dbEx) {
      console.error('[Matches API] Excepción eliminando en Supabase:', dbEx);
    }

    return NextResponse.json({ success: true, message: 'Partido eliminado.', source: 'supabase' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error eliminando partido' }, { status: 500 });
  }
}
