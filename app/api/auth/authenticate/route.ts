import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, isSignUp } = body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ error: 'Ingresa un correo electrónico válido.' }, { status: 400 });
    }

    const cleanPassword = (password || '').trim() || 'pasion2026';
    if (cleanPassword.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const cookieStore = cookies();

    // 1. Buscar si el usuario ya existe en Supabase
    let targetUser: any = null;
    try {
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      targetUser = userList?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);
    } catch (listErr) {
      console.error('Error listando usuarios en Supabase:', listErr);
    }

    let userId: string;

    if (targetUser) {
      userId = targetUser.id;
      // Confirmar usuario automáticamente y sincronizar contraseña
      try {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: cleanPassword,
          email_confirm: true,
          user_metadata: { email: cleanEmail },
        });
      } catch (updateErr) {
        console.error('Error actualizando usuario en Supabase:', updateErr);
      }
    } else {
      // Crear usuario confirmado inmediatamente
      try {
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: cleanPassword,
          email_confirm: true,
          user_metadata: { email: cleanEmail },
        });
        if (createErr) throw createErr;
        userId = created.user.id;
      } catch (createErr: any) {
        console.error('Error creando usuario en Supabase:', createErr);
        userId = 'user-' + cleanEmail.replace(/[^a-z0-9]/gi, '-');
      }
    }

    // 2. Establecer sesión en el servidor con @supabase/ssr
    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
        ? process.env.NEXT_PUBLIC_SUPABASE_URL
        : 'https://cyigamszhhdluqstjcut.supabase.co';

    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        : 'sb_publishable_0DiTRMSrhy3FU8Jc-gl-0A_L6_ORFWP';

    const serverClient = createServerClient(url, key, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {}
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {}
        },
      },
    });

    let sessionData = null;
    try {
      const { data } = await serverClient.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });
      if (data?.session) {
        sessionData = data.session;
      }
    } catch (authErr) {
      console.error('Error en signInWithPassword:', authErr);
    }

    // 3. Establecer cookies de sesión de Pasión Lomonegra para disponibilidad inmediata
    cookieStore.set('lomonegro_user_email', cleanEmail, {
      httpOnly: false, // Disponible en frontend
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/',
    });

    cookieStore.set('lomonegro_user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
      },
      session: sessionData,
      message: isSignUp ? '¡Cuenta creada y sesión iniciada con éxito!' : '¡Sesión iniciada con éxito!',
    });
  } catch (error: any) {
    console.error('Error general en endpoint de autenticación:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la autenticación.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('lomonegro_user_email');
  cookieStore.delete('lomonegro_user_id');
  return NextResponse.json({ success: true, message: 'Sesión cerrada.' });
}
