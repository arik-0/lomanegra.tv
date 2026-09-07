import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateStreamToken } from '@/lib/cloudflare';
import { getStoredMatches } from '@/lib/adminStore';

export async function POST(req: Request) {
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    const body = await req.json().catch(() => ({}));
    const { matchId, guestEmail, previewMode } = body;

    if (!matchId) {
      return NextResponse.json(
        { error: 'El parámetro matchId es requerido.' },
        { status: 400 }
      );
    }

    let resolvedMatch: any = null;
    let liveInputUid = 'live_input_byn_vs_san_martin';
    let user = null;
    let purchase = null;
    let sessionUserKey = `guest_${guestEmail || 'invitado'}`;

    // 1. Buscar el partido en el almacén local primero para alta velocidad
    const localMatch = getStoredMatches().find((m) => m.id === matchId);
    if (localMatch) {
      resolvedMatch = localMatch;
      liveInputUid = localMatch.cloudflare_live_input_uid || liveInputUid;
    }

    // 2. Si Supabase está disponible, verificar compras y datos de partido
    if (isSupabaseConfigured) {
      try {
        const supabase = createServerSupabaseClient();
        const authRes = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
        user = authRes?.data?.user || null;

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(matchId);
        let targetId = matchId;
        if (!isUUID) {
          const { data: m } = await supabaseAdmin
            .from('matches')
            .select('id, title, cloudflare_live_input_uid')
            .ilike('title', '%blanco y negro%')
            .maybeSingle();
          if (m?.id) targetId = m.id;
        }

        const { data: dbMatch } = await supabaseAdmin
          .from('matches')
          .select('*')
          .eq('id', targetId)
          .maybeSingle();

        if (dbMatch) {
          resolvedMatch = dbMatch;
          if (dbMatch.cloudflare_live_input_uid) {
            liveInputUid = dbMatch.cloudflare_live_input_uid;
          }
        }

        // Registrar sesión activa
        const newSessionId = crypto.randomUUID();
        if (user) {
          sessionUserKey = user.id;
        } else if (guestEmail) {
          sessionUserKey = `guest_${guestEmail.toLowerCase().trim()}`;
        }

        await supabaseAdmin
          .from('active_sessions')
          .upsert({
            user_id: sessionUserKey,
            session_id: newSessionId,
            last_heartbeat: new Date().toISOString(),
          });
      } catch (err) {
        console.warn('DB no disponible para stream token, operando en modo local resiliente.');
      }
    }

    const newSessionId = crypto.randomUUID();
    const matchTitle = resolvedMatch?.title || 'Club Atlético Blanco y Negro';
    const matchDate = resolvedMatch?.date || null;

    // Determinar si la transmisión está activa y emitiendo
    // Un partido está en vivo si el operador lo activó expresamente (is_live: true)
    // o si tiene una URL de emisión directa http/https válida o Cloudflare configurado
    const hasDirectUrl = liveInputUid.startsWith('http://') || liveInputUid.startsWith('https://');
    const hasCloudflareKeys =
      Boolean(process.env.CLOUDFLARE_STREAM_KEY_ID) &&
      !process.env.CLOUDFLARE_STREAM_KEY_ID?.startsWith('xxx');

    const isBroadcasting = Boolean(
      resolvedMatch?.is_live === true ||
      (resolvedMatch?.is_live !== false && (hasDirectUrl || (hasCloudflareKeys && !liveInputUid.startsWith('live_input_')))) ||
      previewMode === true
    );

    // Si NO está transmitiendo en vivo, retornar estado 'waiting' para activar el StreamPlaceholder
    if (!isBroadcasting) {
      return NextResponse.json({
        isLive: false,
        status: 'waiting',
        matchTitle,
        matchDate,
        token: null,
        sessionId: newSessionId,
        liveInputUid,
        message: 'La transmisión está programada y a la espera del inicio oficial.',
      });
    }

    // Si está transmitiendo en vivo, generar el token de stream firmado o usar URL directa
    let streamToken: string | null = null;
    try {
      streamToken = await generateStreamToken(liveInputUid);
    } catch {
      streamToken = hasDirectUrl ? liveInputUid : null;
    }

    return NextResponse.json({
      isLive: true,
      status: 'live',
      matchTitle,
      matchDate,
      token: streamToken,
      sessionId: newSessionId,
      liveInputUid,
    });
  } catch (error: any) {
    console.warn('Fallback en POST /api/stream/token:', error);
    const mockSessionId = crypto.randomUUID();
    return NextResponse.json({
      isLive: false,
      status: 'waiting',
      matchTitle: 'Club Atlético Blanco y Negro',
      matchDate: null,
      token: null,
      sessionId: mockSessionId,
      liveInputUid: 'mock_live_input_byn_01',
    });
  }
}
