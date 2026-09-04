import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const body = await req.json().catch(() => ({}));
    const { sessionId, guestEmail } = body;

    const sessionKey = user ? user.id : (guestEmail ? `guest_${guestEmail.toLowerCase().trim()}` : null);

    if (!sessionKey) {
      return NextResponse.json(
        { error: 'No autorizado o falta identificador de sesión.' },
        { status: 401 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId es requerido.' },
        { status: 400 }
      );
    }

    // 1. Consultar la sesión activa del usuario o invitado
    const { data: activeSession, error: sessionError } = await supabaseAdmin
      .from('active_sessions')
      .select('session_id')
      .eq('user_id', sessionKey)
      .single();

    if (sessionError || !activeSession) {
      return NextResponse.json(
        { error: 'No existe una sesión activa registrada.' },
        { status: 404 }
      );
    }

    // 2. Comprobar si la sesión coincide (Anti-concurrencia)
    if (activeSession.session_id !== sessionId) {
      return NextResponse.json(
        {
          code: 'CONCURRENT_SESSION_DETECTED',
          error:
            'Se ha iniciado la transmisión en otro dispositivo o ventana con este pase. Solo se permite una transmisión simultánea.',
        },
        { status: 409 }
      );
    }

    // 3. Actualizar la marca de tiempo de último latido
    await supabaseAdmin
      .from('active_sessions')
      .update({ last_heartbeat: new Date().toISOString() })
      .eq('user_id', sessionKey);

    return NextResponse.json({ status: 'alive' }, { status: 200 });
  } catch (error: any) {
    console.error('Error en POST /api/stream/heartbeat:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno en heartbeat' },
      { status: 500 }
    );
  }
}
