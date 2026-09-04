import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateStreamToken } from '@/lib/cloudflare';

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const body = await req.json().catch(() => ({}));
    const { matchId, guestEmail } = body;

    if (!matchId) {
      return NextResponse.json(
        { error: 'El parámetro matchId es requerido.' },
        { status: 400 }
      );
    }

    // Resolver ID real si vino como slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(matchId);
    let resolvedMatchId = matchId;
    if (!isUUID) {
      const { data: m } = await supabaseAdmin
        .from('matches')
        .select('id')
        .ilike('title', '%blanco y negro%')
        .maybeSingle();
      if (m?.id) resolvedMatchId = m.id;
    }

    // 1. Verificar compra con status = 'approved' (por usuario o por email de invitado)
    let purchase = null;
    let sessionUserKey = '';

    if (user) {
      const { data } = await supabaseAdmin
        .from('purchases')
        .select('status')
        .eq('user_id', user.id)
        .eq('match_id', resolvedMatchId)
        .eq('status', 'approved')
        .maybeSingle();
      purchase = data;
      sessionUserKey = user.id;
    } else if (guestEmail) {
      const { data } = await supabaseAdmin
        .from('purchases')
        .select('status')
        .eq('guest_email', guestEmail.toLowerCase().trim())
        .eq('match_id', resolvedMatchId)
        .eq('status', 'approved')
        .maybeSingle();
      purchase = data;
      sessionUserKey = `guest_${guestEmail.toLowerCase().trim()}`;
    }

    if (!purchase) {
      return NextResponse.json(
        {
          error:
            'Acceso denegado: No cuentas con un pase aprobado para este partido. Adquiere tu pase para ver en vivo.',
        },
        { status: 403 }
      );
    }

    // 2. Obtener el UID de Cloudflare Stream del partido
    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .select('cloudflare_live_input_uid, title')
      .eq('id', resolvedMatchId)
      .maybeSingle();

    if (matchError || !match?.cloudflare_live_input_uid) {
      return NextResponse.json(
        { error: 'Configuración de transmisión en vivo no encontrada.' },
        { status: 404 }
      );
    }

    // 3. Generar nuevo Session ID y registrar en active_sessions de forma segura
    const newSessionId = crypto.randomUUID();

    const { data: existingSession } = await supabaseAdmin
      .from('active_sessions')
      .select('user_id')
      .eq('user_id', sessionUserKey)
      .maybeSingle();

    let sessionError = null;
    if (existingSession) {
      const { error } = await supabaseAdmin
        .from('active_sessions')
        .update({
          session_id: newSessionId,
          last_heartbeat: new Date().toISOString(),
        })
        .eq('user_id', sessionUserKey);
      sessionError = error;
    } else {
      const { error } = await supabaseAdmin
        .from('active_sessions')
        .insert({
          user_id: sessionUserKey,
          session_id: newSessionId,
          last_heartbeat: new Date().toISOString(),
        });
      sessionError = error;
    }

    if (sessionError) {
      console.error('Error registrando sesión activa:', sessionError);
      // No bloquear la visualización si hay un fallo de tabla de sesiones en Vercel
    }

    // 4. Firmar el JWT RSA-256 de Cloudflare Stream o retornar fallback HD demo
    const streamToken = await generateStreamToken(
      match.cloudflare_live_input_uid
    );

    return NextResponse.json({
      token: streamToken,
      sessionId: newSessionId,
    });
  } catch (error: any) {
    console.error('Error en POST /api/stream/token:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al generar el token de video' },
      { status: 500 }
    );
  }
}
