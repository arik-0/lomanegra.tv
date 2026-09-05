import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const body = await req.json().catch(() => ({}));
    const { matchId, guestEmail } = body;

    const payerEmail = user?.email || guestEmail;

    if (!payerEmail) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión o ingresar tu correo electrónico para comprar el pase.' },
        { status: 400 }
      );
    }

    if (!matchId) {
      return NextResponse.json(
        { error: 'El parámetro matchId es requerido.' },
        { status: 400 }
      );
    }

    // 1. Obtener detalles del partido
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .eq('is_active', true)
      .single();

    if (matchError || !match) {
      return NextResponse.json(
        { error: 'Partido no encontrado o no disponible para la venta.' },
        { status: 404 }
      );
    }

    // 2. Verificar si el usuario o invitado ya posee el pase aprobado
    let existingPurchase = null;
    if (user) {
      const { data } = await supabase
        .from('purchases')
        .select('status')
        .eq('user_id', user.id)
        .eq('match_id', match.id)
        .eq('status', 'approved')
        .maybeSingle();
      existingPurchase = data;
    } else {
      const { data } = await supabase
        .from('purchases')
        .select('status')
        .eq('guest_email', payerEmail)
        .eq('match_id', match.id)
        .eq('status', 'approved')
        .maybeSingle();
      existingPurchase = data;
    }

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Este correo ya cuenta con un pase aprobado para este partido.' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrlParam = user ? '' : `&guest_email=${encodeURIComponent(payerEmail)}`;

    // 3. Crear preferencia en Mercado Pago Checkout Pro
    const preference = new Preference(mpClient);
    const response = await preference.create({
      body: {
        items: [
          {
            id: match.id,
            title: `Pasión Lomonegra: ${match.title}`,
            description: match.description || 'Acceso a transmisión en vivo HD',
            quantity: 1,
            unit_price: Number(match.price),
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: payerEmail,
        },
        metadata: {
          user_id: user ? user.id : null,
          guest_email: user ? null : payerEmail,
          match_id: match.id,
        },
        back_urls: {
          success: `${appUrl}/partido/${match.id}?payment=success${returnUrlParam}`,
          failure: `${appUrl}/partido/${match.id}?payment=failure`,
          pending: `${appUrl}/partido/${match.id}?payment=pending`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({
      preferenceId: response.id,
      init_point: response.init_point,
    });
  } catch (error: any) {
    console.error('Error en POST /api/checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al generar el checkout' },
      { status: 500 }
    );
  }
}
