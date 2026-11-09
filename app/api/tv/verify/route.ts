import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getTvPairingSession, authorizeTvPairingSession } from '@/lib/tvPairingStore';
import { getStoredMatches } from '@/lib/adminStore';
import { verifyAdminSession, verifyPassword, getAdminPasswordHash } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { code, email, adminPassword } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'El código de TV es obligatorio.' }, { status: 400 });
    }

    const session = getTvPairingSession(code);
    if (!session) {
      return NextResponse.json(
        { error: 'El código de TV no existe o ha expirado. Por favor, genera uno nuevo en tu pantalla.' },
        { status: 404 }
      );
    }

    const cleanEmail = (email || '').toLowerCase().trim();

    // 1. Acceso de Operador / Administrador verificado criptográficamente
    const isAdminCookie = verifyAdminSession();
    const isOperatorPassword =
      typeof adminPassword === 'string' &&
      adminPassword.trim().length > 0 &&
      verifyPassword(adminPassword.trim(), getAdminPasswordHash());

    if (isAdminCookie || isOperatorPassword) {
      const authResult = authorizeTvPairingSession(code, cleanEmail || 'operador@pasionlomonegra.com');
      return NextResponse.json({
        success: true,
        message: 'Acceso de operador autorizado en tu Android TV.',
        session: authResult.session,
      });
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Por favor, ingresa el correo electrónico válido con el que compraste tu entrada.' },
        { status: 400 }
      );
    }

    // 2. Verificar compra aprobada en Supabase
    let isAuthorized = false;
    let targetMatchId = session.matchId;

    // Si la sesión no tiene matchId asignado, buscar el partido activo principal
    if (!targetMatchId) {
      const activeMatch = getStoredMatches().find((m) => m.is_active);
      if (activeMatch) targetMatchId = activeMatch.id;
    }

    try {
      let q = supabaseAdmin
        .from('purchases')
        .select('id, status, match_id')
        .eq('status', 'approved')
        .ilike('guest_email', cleanEmail);

      if (targetMatchId) {
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetMatchId);
        if (isValidUUID) {
          q = q.eq('match_id', targetMatchId);
        }
      }

      const { data: purchases } = await q.limit(1);
      if (purchases && purchases.length > 0) {
        isAuthorized = true;
      }
    } catch (dbErr) {
      console.warn('Error verificando compra en base de datos para TV:', dbErr);
    }

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error:
            'No encontramos un pago aprobado con este correo para este partido. Si acabas de abonar con Mercado Pago, aguarda unos segundos a que se confirme.',
          code: 'PAYMENT_NOT_FOUND',
        },
        { status: 403 }
      );
    }

    // Autorizar sesión de televisión
    const result = authorizeTvPairingSession(code, cleanEmail);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: '¡Televisor vinculado exitosamente! En tu pantalla ya comenzará la transmisión.',
      session: result.session,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Error al validar código' },
      { status: 500 }
    );
  }
}
