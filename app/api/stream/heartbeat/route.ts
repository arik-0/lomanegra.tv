import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin_session');
    if (adminSession?.value === 'authenticated') {
      return NextResponse.json({ success: true, mode: 'admin' }, { status: 200 });
    }

    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const body = await req.json().catch(() => ({}));
    const { sessionId, guestEmail } = body;

    const cleanGuest = guestEmail ? guestEmail.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') : null;
    const rawGuest = guestEmail ? guestEmail.toLowerCase().trim() : null;
    const sessionKey = user ? user.id : (cleanGuest ? `guest_${cleanGuest}` : null);

    if (!sessionKey || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Sesión no identificada.' },
        { status: 200 }
      );
    }

    // 1. Consultar la sesión activa del usuario o invitado (soporta clave sanitizada o cruda)
    let activeSession = null;
    const { data: s1 } = await supabaseAdmin
      .from('active_sessions')
      .select('session_id')
      .eq('user_id', sessionKey)
      .maybeSingle();

    if (s1) {
      activeSession = s1;
    } else if (rawGuest && `guest_${rawGuest}` !== sessionKey) {
      const { data: s2 } = await supabaseAdmin
        .from('active_sessions')
        .select('session_id')
        .eq('user_id', `guest_${rawGuest}`)
        .maybeSingle();
      if (s2) activeSession = s2;
    }

    if (!activeSession) {
      return NextResponse.json(
        { success: false, error: 'No existe una sesión activa registrada.' },
        { status: 200 }
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
    const matchedKey = s1 ? sessionKey : `guest_${rawGuest}`;
    await supabaseAdmin
      .from('active_sessions')
      .update({ last_heartbeat: new Date().toISOString() })
      .eq('user_id', matchedKey);

    return NextResponse.json({ status: 'alive' }, { status: 200 });
  } catch (error: any) {
    console.error('Error en POST /api/stream/heartbeat:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno en heartbeat' },
      { status: 500 }
    );
  }
}
