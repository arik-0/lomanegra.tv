import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'lomonegro2026';

export async function POST(req: Request) {
  try {
    const { password } = await req.json().catch(() => ({}));

    if (!password || password.trim() !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Clave de operador incorrecta.' },
        { status: 401 }
      );
    }

    // Establecer cookie de sesión de operador por 24 horas
    const cookieStore = cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Acceso autorizado al panel de operaciones.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error de autenticación' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true, message: 'Sesión cerrada.' });
}
