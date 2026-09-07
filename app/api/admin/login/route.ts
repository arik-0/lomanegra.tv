import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyPassword, getAdminPasswordHash } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPassword = (body.password || '').toString().trim();

    if (!rawPassword) {
      return NextResponse.json(
        { error: 'Debe ingresar la contraseña de administrador.' },
        { status: 400 }
      );
    }

    const adminHash = getAdminPasswordHash();
    const isAuthorized = verifyPassword(rawPassword, adminHash);

    if (!isAuthorized) {
      return NextResponse.json(
        { 
          error: 'Credenciales inválidas. Acceso restringido al operador autorizado.'
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
