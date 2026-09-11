import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const MP_ACCESS_TOKEN =
  process.env.MP_ACCESS_TOKEN ||
  'APP_USR-986783594759193-091018-1c247a8e6ab68cc9d78064011e59e75a-1162474788';

const mpClient = new MercadoPagoConfig({
  accessToken: MP_ACCESS_TOKEN,
});

export async function POST(req: Request) {
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    const body = await req.json().catch(() => ({}));
    const { matchId, paymentId, guestEmail } = body;

    if (!matchId) {
      return NextResponse.json(
        { error: 'El parámetro matchId es requerido.' },
        { status: 400 }
      );
    }

    let user: any = null;
    if (isSupabaseConfigured) {
      try {
        const supabase = createServerSupabaseClient();
        const { data } = await supabase.auth.getUser();
        user = data?.user || null;
      } catch {
        user = null;
      }
    }

    const cleanEmail = (user?.email || guestEmail)?.toLowerCase()?.trim();

    // 1. Verificar si ya está aprobada en Supabase
    if (isSupabaseConfigured && (user || cleanEmail)) {
      try {
        const query = user
          ? supabaseAdmin
              .from('purchases')
              .select('id, status, guest_email')
              .eq('match_id', matchId)
              .eq('user_id', user.id)
              .eq('status', 'approved')
              .maybeSingle()
          : supabaseAdmin
              .from('purchases')
              .select('id, status, guest_email')
              .eq('match_id', matchId)
              .eq('guest_email', cleanEmail)
              .eq('status', 'approved')
              .maybeSingle();

        const { data: existing } = await query;
        if (existing) {
          return NextResponse.json({
            approved: true,
            email: cleanEmail || existing.guest_email,
            source: 'database',
          });
        }
      } catch (err) {
        console.warn('Error consultando compra en DB:', err);
      }
    }

    // 2. Si no está en DB aún, pero vino paymentId, consultar API de Mercado Pago
    if (paymentId && process.env.MP_ACCESS_TOKEN && !process.env.MP_ACCESS_TOKEN.includes('xxxx')) {
      try {
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({ id: String(paymentId) });

        if (paymentData && paymentData.status === 'approved') {
          // Extraer match_id y email del pago de Mercado Pago
          const mpMatchId =
            paymentData.metadata?.match_id ||
            (paymentData.external_reference?.startsWith('match_')
              ? paymentData.external_reference.split('_')[1]
              : null);

          const payerEmail =
            paymentData.metadata?.guest_email ||
            paymentData.payer?.email ||
            cleanEmail;

          // Registrar de inmediato en Supabase para habilitar el acceso
          if (isSupabaseConfigured && mpMatchId) {
            await supabaseAdmin.from('purchases').upsert({
              user_id: user ? user.id : null,
              guest_email: user ? null : (payerEmail?.toLowerCase()?.trim() || 'invitado@pasionlomonegra.com'),
              match_id: mpMatchId,
              status: 'approved',
              mp_payment_id: String(paymentData.id),
              created_at: new Date().toISOString(),
            });
          }

          return NextResponse.json({
            approved: true,
            email: payerEmail,
            source: 'mercadopago_verified',
          });
        }
      } catch (mpErr: any) {
        console.warn('Error validando pago en Mercado Pago:', mpErr?.message || mpErr);
      }
    }

    // Si no se pudo comprobar aprobación legítima
    return NextResponse.json(
      {
        approved: false,
        message: 'No se encontró un pago aprobado para este partido y usuario.',
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error en /api/purchases/verify:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al verificar la compra' },
      { status: 500 }
    );
  }
}
