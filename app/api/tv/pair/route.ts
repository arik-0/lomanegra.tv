import { NextResponse } from 'next/server';
import { createTvPairingSession, getTvPairingSession } from '@/lib/tvPairingStore';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { deviceId, matchId, matchTitle } = body;

    const effectiveDeviceId = deviceId || `tv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const session = createTvPairingSession(effectiveDeviceId, matchId, matchTitle);

    return NextResponse.json({
      success: true,
      code: session.code,
      status: session.status,
      expiresAt: session.expiresAt,
      guestEmail: session.guestEmail,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error al generar código para Android TV' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Parámetro code requerido' }, { status: 400 });
    }

    const session = getTvPairingSession(code);
    if (!session) {
      return NextResponse.json({
        status: 'expired',
        message: 'Código expirado o no encontrado',
      });
    }

    return NextResponse.json({
      code: session.code,
      status: session.status,
      guestEmail: session.guestEmail,
      matchId: session.matchId,
      expiresAt: session.expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error consultando estado del código' },
      { status: 500 }
    );
  }
}
