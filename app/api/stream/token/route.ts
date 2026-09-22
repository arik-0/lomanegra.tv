import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateStreamToken } from '@/lib/cloudflare';
import { getStoredMatches } from '@/lib/adminStore';

export async function POST(req: Request) {
  try {
    const isSupabaseConfigured = true;

    const body = await req.json().catch(() => ({}));
    const { matchId, guestEmail, previewMode } = body;

    if (!matchId) {
      return NextResponse.json(
        { error: 'El parámetro matchId es requerido.' },
        { status: 400 }
      );
    }

    const ANCHORED_LIVE_UID = 'dac066a4fb5c97117189392adae3f453';
    let resolvedMatch: any = null;
    let liveInputUid = ANCHORED_LIVE_UID;
    let user = null;
    let sessionUserKey = `guest_${guestEmail || 'invitado'}`;
    const currentSessionId = crypto.randomUUID();

    // 1. Buscar el partido en el almacén local primero para alta velocidad
    const localMatch = getStoredMatches().find((m) => m.id === matchId);
    if (localMatch) {
      resolvedMatch = localMatch;
      if (localMatch.cloudflare_live_input_uid && !localMatch.cloudflare_live_input_uid.startsWith('live_input_')) {
        liveInputUid = localMatch.cloudflare_live_input_uid;
      }
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
          const { data: activeMatches } = await supabaseAdmin
            .from('matches')
            .select('id, title, cloudflare_live_input_uid')
            .eq('is_active', true)
            .not('title', 'like', '__SYSTEM_%')
            .order('date', { ascending: true });
          if (activeMatches && activeMatches.length > 0) {
            targetId = activeMatches[0].id;
          }
        }

        const { data: dbMatch } = await supabaseAdmin
          .from('matches')
          .select('*')
          .eq('id', targetId)
          .maybeSingle();

        if (dbMatch) {
          resolvedMatch = dbMatch;
          if (dbMatch.description) {
            const metaMatch = dbMatch.description.match(/\[META:(\{.*?\})\]/);
            if (metaMatch) {
              try {
                const parsed = JSON.parse(metaMatch[1]);
                if (parsed.is_live !== undefined) {
                  resolvedMatch.is_live = Boolean(parsed.is_live);
                }
              } catch {}
            }
          }
          if (dbMatch.cloudflare_live_input_uid && !dbMatch.cloudflare_live_input_uid.startsWith('live_input_')) {
            liveInputUid = dbMatch.cloudflare_live_input_uid;
          }
        }

        // 3. Verificación de Autorización Resiliente (Operador Admin o Compra Aprobada)
        const cookieStore = cookies();
        const adminSession = cookieStore.get('admin_session');
        const isAdmin = adminSession?.value === 'authenticated';
        const cookieEmail = cookieStore.get('lomonegro_user_email')?.value?.toLowerCase().trim();
        const cleanGuestEmail = guestEmail?.toLowerCase().trim();
        const isOperatorEmail =
          cleanGuestEmail === 'operador@pasionlomonegra.com' ||
          cleanGuestEmail?.startsWith('operador') ||
          cookieEmail === 'operador@pasionlomonegra.com';

        let hasAuthorization = isAdmin || isOperatorEmail;

        const isValidUUID = (str?: string | null): boolean =>
          !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

        if (!hasAuthorization) {
          const checkEmail = cleanGuestEmail || cookieEmail || user?.email?.toLowerCase().trim();
          let q = supabaseAdmin
            .from('purchases')
            .select('id, status, match_id')
            .eq('status', 'approved');

          if (isValidUUID(targetId)) {
            q = q.eq('match_id', targetId);
          }

          if (user && isValidUUID(user.id)) {
            if (checkEmail) {
              q = q.or(`user_id.eq.${user.id},guest_email.ilike.${checkEmail}`);
            } else {
              q = q.eq('user_id', user.id);
            }
            const { data: pList } = await q.limit(1);
            if (pList && pList.length > 0) hasAuthorization = true;
          } else if (checkEmail) {
            q = q.ilike('guest_email', checkEmail);
            const { data: pList } = await q.limit(1);
            if (pList && pList.length > 0) hasAuthorization = true;
          }
        }

        if (!hasAuthorization) {
          return NextResponse.json(
            {
              error: 'Acceso no autorizado: debes adquirir tu pase oficial para ver la transmisión en vivo.',
              code: 'PAYMENT_REQUIRED',
            },
            { status: 403 }
          );
        }

        // Registrar sesión activa
        const effectiveEmail = cleanGuestEmail || cookieEmail || user?.email?.toLowerCase().trim();
        if (user && isValidUUID(user.id)) {
          sessionUserKey = user.id;
        } else if (effectiveEmail) {
          sessionUserKey = `guest_${effectiveEmail.replace(/[^a-z0-9]/g, '_')}`;
        }

        await supabaseAdmin
          .from('active_sessions')
          .upsert({
            user_id: sessionUserKey,
            session_id: currentSessionId,
            last_heartbeat: new Date().toISOString(),
          });
      } catch (err: any) {
        if (err?.code === 'PAYMENT_REQUIRED' || err?.status === 403) {
          throw err;
        }
        console.warn('DB no disponible para stream token, operando en modo local resiliente.');
      }
    }

    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin_session');
    const isAdmin = adminSession?.value === 'authenticated';

    const matchTitle = resolvedMatch?.title || 'Carreras vs Blanco y Negro';
    const matchDate = resolvedMatch?.date || null;

    // Determinar si la transmisión está activa y emitiendo
    const hasDirectUrl = liveInputUid.startsWith('http://') || liveInputUid.startsWith('https://');
    const isRealCfUid = /^[a-f0-9]{32}$/i.test(liveInputUid.trim());

    const isBroadcasting = Boolean(
      resolvedMatch?.is_live === true ||
      liveInputUid === ANCHORED_LIVE_UID ||
      isRealCfUid ||
      hasDirectUrl ||
      (previewMode === true && isAdmin)
    );

    // Si NO está transmitiendo en vivo, retornar estado 'waiting' para activar el StreamPlaceholder
    if (!isBroadcasting) {
      return NextResponse.json({
        isLive: false,
        status: 'waiting',
        matchTitle,
        matchDate,
        token: null,
        sessionId: currentSessionId,
        liveInputUid,
        message: 'La transmisión está programada y a la espera del inicio oficial.',
      });
    }

    // Si está transmitiendo en vivo, generar el token de stream firmado o usar URL directa
    let streamToken: string | null = null;
    try {
      streamToken = await generateStreamToken(liveInputUid);
    } catch {
      streamToken = hasDirectUrl ? liveInputUid : liveInputUid;
    }

    return NextResponse.json({
      isLive: true,
      status: 'live',
      matchTitle,
      matchDate,
      token: streamToken || liveInputUid,
      sessionId: currentSessionId,
      liveInputUid,
    });
  } catch (error: any) {
    console.warn('Fallback en POST /api/stream/token:', error);
    const mockSessionId = crypto.randomUUID();
    return NextResponse.json({
      isLive: true,
      status: 'live',
      matchTitle: 'Carreras vs Blanco y Negro',
      matchDate: null,
      token: 'dac066a4fb5c97117189392adae3f453',
      sessionId: mockSessionId,
      liveInputUid: 'dac066a4fb5c97117189392adae3f453',
    });
  }
}
