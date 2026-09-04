import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabaseAdmin } from '@/lib/supabase/admin';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam =
      url.searchParams.get('id') ||
      url.searchParams.get('data.id');

    let paymentId = idParam;

    // Si no está en URL query, verificar si viene en el cuerpo JSON
    if (!paymentId) {
      const body = await req.json().catch(() => ({}));
      if (body?.data?.id) {
        paymentId = String(body.data.id);
      } else if (body?.id) {
        paymentId = String(body.id);
      }
    }

    if (!paymentId) {
      // Retornar 200 para no bloquear la cola de notificaciones de Mercado Pago
      return NextResponse.json(
        { message: 'Notificación ignorada: sin ID de pago' },
        { status: 200 }
      );
    }

    // 1. Consultar el pago en la API oficial de Mercado Pago para verificar autenticidad
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    if (!paymentData || !paymentData.metadata) {
      return NextResponse.json(
        { message: 'Pago consultado no contiene la metadata esperada' },
        { status: 200 }
      );
    }

    const { user_id, guest_email, match_id } = paymentData.metadata;

    if (!match_id || (!user_id && !guest_email)) {
      return NextResponse.json(
        { message: 'Metadata incompleta: falta match_id o datos de comprador' },
        { status: 200 }
      );
    }

    // 2. Determinar estado de la compra
    let purchaseStatus = 'pending';
    if (paymentData.status === 'approved') {
      purchaseStatus = 'approved';
    } else if (
      paymentData.status === 'rejected' ||
      paymentData.status === 'cancelled'
    ) {
      purchaseStatus = 'rejected';
    }

    // 3. Persistir o actualizar la compra usando Supabase Service Role (Bypass de RLS)
    let existingQuery = supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('match_id', match_id);

    if (user_id) {
      existingQuery = existingQuery.eq('user_id', user_id);
    } else {
      existingQuery = existingQuery.eq('guest_email', guest_email.toLowerCase().trim());
    }

    const { data: existingPurchase } = await existingQuery.maybeSingle();

    let saveError = null;

    if (existingPurchase) {
      const { error } = await supabaseAdmin
        .from('purchases')
        .update({
          status: purchaseStatus,
          mp_payment_id: String(paymentData.id),
        })
        .eq('id', existingPurchase.id);
      saveError = error;
    } else {
      const { error } = await supabaseAdmin
        .from('purchases')
        .insert({
          user_id: user_id || null,
          guest_email: user_id ? null : guest_email.toLowerCase().trim(),
          match_id,
          status: purchaseStatus,
          mp_payment_id: String(paymentData.id),
          created_at: new Date().toISOString(),
        });
      saveError = error;
    }

    if (saveError) {
      console.error('Error registrando compra en Supabase:', saveError);
      return NextResponse.json(
        { error: 'Error al persistir la compra en la base de datos' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, status: purchaseStatus, paymentId: paymentData.id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error en Webhook de Mercado Pago:', error);
    // Retornamos 500 solo en fallos inesperados graves
    return NextResponse.json(
      { error: error.message || 'Error interno en webhook' },
      { status: 500 }
    );
  }
}
