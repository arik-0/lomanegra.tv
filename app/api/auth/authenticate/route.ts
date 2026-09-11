import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, isSignUp } = body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ error: 'Ingresa un correo electrónico válido.' }, { status: 400 });
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const cookieStore = cookies();
    const serverClient = createServerSupabaseClient();

    if (isSignUp) {
      // 1. REGISTRO (Sign Up)
      // Verificar si el usuario ya existe en Supabase
      try {
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = userList?.users?.find((u) => u.email?.toLowerCase() === cleanEmail);
        if (existingUser) {
          return NextResponse.json(
            { error: 'Ya existe una cuenta con este correo electrónico. Por favor, inicia sesión.' },
            { status: 400 }
          );
        }
      } catch (listErr) {
        console.error('Error listando usuarios en Supabase:', listErr);
      }

      // Crear usuario nuevo en Supabase con su contraseña
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: cleanPassword,
        email_confirm: true,
        user_metadata: { email: cleanEmail },
      });

      if (createErr || !created?.user) {
        const errMsg = createErr?.message?.toLowerCase().includes('already')
          ? 'Ya existe una cuenta con este correo electrónico. Por favor, inicia sesión.'
          : createErr?.message || 'Error al crear la cuenta. Inténtalo nuevamente.';
        return NextResponse.json({ error: errMsg }, { status: 400 });
      }

      // Iniciar sesión en el servidor
      const { data: signInData, error: signInErr } = await serverClient.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      const userId = created.user.id;

      cookieStore.set('lomonegro_user_email', cleanEmail, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
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
        user: { id: userId, email: cleanEmail },
        session: signInData?.session || null,
        message: '¡Cuenta creada y sesión iniciada con éxito!',
      });
    } else {
      // 2. INICIO DE SESIÓN (Login)
      // Autenticación estricta con Supabase - SIN sobreescribir contraseñas ni auto-crear usuarios
      const { data: authData, error: authErr } = await serverClient.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (authErr || !authData?.user) {
        return NextResponse.json(
          { error: 'Correo o contraseña incorrectos.' },
          { status: 401 }
        );
      }

      const userId = authData.user.id;

      cookieStore.set('lomonegro_user_email', cleanEmail, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
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
        session: authData.session,
        message: '¡Sesión iniciada con éxito!',
      });
    }
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
  try {
    const serverClient = createServerSupabaseClient();
    await serverClient.auth.signOut();
  } catch {}
  return NextResponse.json({ success: true, message: 'Sesión cerrada.' });
}
