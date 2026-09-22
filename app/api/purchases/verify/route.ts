import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
    const isSupabaseConfigured = true;

    const body = await req.json().catch(() => ({}));
    const { matchId, paymentId, guestEmail } = body;

    if (!matchId) {
      return NextResponse.json(
        { error: 'El parámetro matchId es requerido.' },
        { status: 400 }
      );
    }

    let user: any = null;
    try {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch {
      user = null;
    }

    const isValidUUID = (str?: string | null): boolean =>
      !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const cleanEmail = (user?.email || guestEmail)?.toLowerCase()?.trim();

    // 1. Verificar si ya está aprobada en Supabase
    if (user || cleanEmail) {
      try {
        let confirmedPurchase = null;

        if (user && isValidUUID(user.id)) {
          let userQ = supabaseAdmin
            .from('purchases')
            .select('id, status, guest_email')
            .eq('user_id', user.id)
            .eq('status', 'approved');
          if (isValidUUID(matchId)) {
            userQ = userQ.eq('match_id', matchId);
          }
          const { data: userPurch } = await userQ.maybeSingle();
          confirmedPurchase = userPurch;
        }

        if (!confirmedPurchase && cleanEmail) {
          let guestQ = supabaseAdmin
            .from('purchases')
            .select('id, status, guest_email')
            .ilike('guest_email', cleanEmail)
            .eq('status', 'approved');
          if (isValidUUID(matchId)) {
            guestQ = guestQ.eq('match_id', matchId);
          }
          const { data: guestPurch } = await guestQ.maybeSingle();
          confirmedPurchase = guestPurch;
        }

        // Fallback: si compró para cualquier partido con este correo
        if (!confirmedPurchase && cleanEmail) {
          const { data: anyApproved } = await supabaseAdmin
            .from('purchases')
            .select('id, status, guest_email, match_id')
            .ilike('guest_email', cleanEmail)
            .eq('status', 'approved')
            .limit(1)
            .maybeSingle();
          if (anyApproved) confirmedPurchase = anyApproved;
        }

        if (confirmedPurchase) {
          const buyerEmail = cleanEmail || confirmedPurchase.guest_email;
          const cookieStore = cookies();
          cookieStore.set('lomonegro_user_email', buyerEmail, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
          });

          return NextResponse.json({
            approved: true,
            email: buyerEmail,
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
              : null) ||
            matchId;

          const payerEmail = (
            paymentData.metadata?.guest_email ||
            paymentData.payer?.email ||
            cleanEmail
          )?.toLowerCase()?.trim() || 'hincha@pasionlomonegra.com';

          // Registrar de inmediato para ambos correos (formulario y cuenta MP)
          const allEmails = new Set<string>();
          if (payerEmail) allEmails.add(payerEmail);
          if (paymentData.metadata?.guest_email) allEmails.add(paymentData.metadata.guest_email.toLowerCase().trim());
          if (paymentData.payer?.email) allEmails.add(paymentData.payer.email.toLowerCase().trim());
          if (cleanEmail) allEmails.add(cleanEmail);

          if (isSupabaseConfigured && mpMatchId) {
            for (const em of Array.from(allEmails)) {
              try {
                const { data: exists } = await supabaseAdmin
                  .from('purchases')
                  .select('id')
                  .eq('match_id', mpMatchId)
                  .ilike('guest_email', em)
                  .maybeSingle();

                if (exists) {
                  await supabaseAdmin
                    .from('purchases')
                    .update({ status: 'approved', mp_payment_id: String(paymentData.id) })
                    .eq('id', exists.id);
                } else {
                  await supabaseAdmin
                    .from('purchases')
                    .insert({
                      user_id: user && isValidUUID(user.id) ? user.id : null,
                      guest_email: em,
                      match_id: mpMatchId,
                      status: 'approved',
                      mp_payment_id: String(paymentData.id),
                      created_at: new Date().toISOString(),
                    });
                }
              } catch (insErr) {
                console.warn(`Error guardando compra para ${em}:`, insErr);
              }
            }
          }

          const cookieStore = cookies();
          cookieStore.set('lomonegro_user_email', payerEmail, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
          });

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
