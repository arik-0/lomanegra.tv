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

    // 1. Verificar compra con status = 'approved' (por usuario o por email de invitado)
    let purchase = null;
    let sessionUserKey = '';

    if (user) {
      const { data } = await supabaseAdmin
        .from('purchases')
        .select('status')
        .eq('user_id', user.id)
        .eq('match_id', matchId)
        .eq('status', 'approved')
        .maybeSingle();
      purchase = data;
      sessionUserKey = user.id;
    } else if (guestEmail) {
      const { data } = await supabaseAdmin
        .from('purchases')
        .select('status')
        .eq('guest_email', guestEmail.toLowerCase().trim())
        .eq('match_id', matchId)
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
      .eq('id', matchId)
      .single();

    if (matchError || !match?.cloudflare_live_input_uid) {
      return NextResponse.json(
        { error: 'Configuración de transmisión en vivo no encontrada.' },
        { status: 404 }
      );
    }

    // 3. Generar nuevo Session ID y registrar en active_sessions (Anti-concurrencia)
    const newSessionId = crypto.randomUUID();
    const { error: sessionError } = await supabaseAdmin
      .from('active_sessions')
      .upsert({
        user_id: sessionUserKey,
        session_id: newSessionId,
        last_heartbeat: new Date().toISOString(),
      });

    if (sessionError) {
      console.error('Error registrando sesión activa:', sessionError);
      return NextResponse.json(
        { error: 'No se pudo inicializar la sesión única de reproducción.' },
        { status: 500 }
      );
    }

    // 4. Firmar el JWT RSA-256 de Cloudflare Stream
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
