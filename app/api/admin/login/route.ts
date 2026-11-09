import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import {
  verifyPassword,
  getAdminPasswordHash,
  verifyAdminSession,
  createAdminSessionToken,
  checkAdminLoginRateLimit,
  recordAdminLoginFailure,
  resetAdminLoginFailures,
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getClientIp(): string {
  try {
    const h = headers();
    const forwarded = h.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return h.get('x-real-ip') || 'unknown_ip';
  } catch {
    return 'unknown_ip';
  }
}

export async function GET() {
  const isAuthorized = verifyAdminSession();
  return NextResponse.json(
    { authenticated: isAuthorized },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp();
    const rateCheck = checkAdminLoginRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Demasiados intentos fallidos. Por seguridad, reintenta en ${Math.ceil(
            (rateCheck.retryAfterSeconds || 60) / 60
          )} minutos.`,
        },
        { status: 429 }
      );
    }

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
      recordAdminLoginFailure(ip);
      return NextResponse.json(
        {
          error: 'Credenciales inválidas. Acceso restringido al operador autorizado.',
        },
        { status: 401 }
      );
    }

    resetAdminLoginFailures(ip);

    // Establecer cookie de sesión de operador firmada criptográficamente con HMAC-SHA256 por 7 días
    const signedToken = createAdminSessionToken();
    const cookieStore = cookies();
    cookieStore.set('admin_session', signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Acceso autorizado al panel de operaciones.',
      role: 'admin',
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
