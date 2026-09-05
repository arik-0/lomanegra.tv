import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const VALID_PASSWORDS = new Set([
  (process.env.ADMIN_SECRET_KEY || 'lomonegro2026').trim().toLowerCase(),
  'lomonegro2026',
  'pasionlomonegra',
  'admin',
  'admin123',
  'lomanegra',
  'blancoynegro',
  '123456',
  'operador',
]);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPassword = (body.password || '').toString().trim().toLowerCase();

    // Permitir si coincide con alguna de las contraseñas válidas o si viene con flag de operador
    const isAuthorized =
      body.quickAccess === true ||
      VALID_PASSWORDS.has(rawPassword) ||
      (process.env.ADMIN_SECRET_KEY && rawPassword === process.env.ADMIN_SECRET_KEY.trim().toLowerCase());

    if (!isAuthorized) {
      return NextResponse.json(
        { 
          error: 'Clave de operador incorrecta. Usa: lomonegro2026 o admin',
          hint: 'Puedes usar "lomonegro2026" o pulsar el botón de Acceso Rápido.'
        },
        { status: 401 }
      );
    }

    // Establecer cookie de sesión de operador por 7 días
    const cookieStore = cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Acceso autorizado al panel de operaciones.',
      role: 'admin'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error de autenticación' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true, message: 'Sesión cerrada.' });
}
