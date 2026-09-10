import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createServerSupabaseClient } from '@/lib/supabase/server';

if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    const body = await req.json().catch(() => ({}));
    const { matchId, guestEmail, userEmail, email } = body;

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

    const payerEmail = (user?.email || guestEmail || userEmail || email)?.toLowerCase()?.trim();

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

    // 1. Obtener detalles del partido de forma instantánea
    let match: any = null;

    if (isSupabaseConfigured) {
      try {
        const supabase = createServerSupabaseClient();
        const { data } = await supabase
          .from('matches')
          .select('*')
          .eq('id', matchId)
          .eq('is_active', true)
          .single();
        match = data;
      } catch {
        match = null;
      }
    }

    // Fallback de alta velocidad si no está en la base de datos
    if (!match) {
      if (matchId === '07ced47c-9f9a-4bce-a073-2c8e84b3de67') {
        return NextResponse.json(
          { error: 'Las entradas para este partido no están habilitadas: la fecha aún está a confirmar.' },
          { status: 400 }
        );
      } else if (matchId === 'de261139-f0e7-43d3-bd24-f2f9a7262fdf') {
        match = {
          id: matchId,
          title: 'Atlético Acebal vs Blanco y Negro',
          description: 'Liga Deportiva del Sur • Semifinal en vivo HD',
          price: 4500,
          is_date_confirmed: true,
          date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
        };
      } else {
        match = {
          id: matchId || '0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
          title: 'Blanco y Negro vs I. F. C.',
          description: 'El gran clásico regional en vivo con relatos en directo para toda la hinchada.',
          price: 3500,
          is_date_confirmed: true,
          date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        };
      }
    }

    // Validar si la fecha está confirmada antes de permitir el checkout
    if (match.is_date_confirmed === false || !match.date) {
      return NextResponse.json(
        { error: 'Las entradas para este partido no están habilitadas: la fecha aún está a confirmar.' },
        { status: 400 }
      );
    }

    // 2. Verificar si el usuario o invitado ya posee el pase aprobado (solo si DB está activa)
    let existingPurchase = null;
    if (isSupabaseConfigured) {
      try {
        const supabase = createServerSupabaseClient();
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
      } catch {
        existingPurchase = null;
      }
    }

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Este correo ya cuenta con un pase aprobado para este partido.' },
        { status: 400 }
      );
    }

    // Determinar URL base dinámica según el dominio real del usuario
    const origin = req.headers.get('origin') || req.headers.get('referer');
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';

    let appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (origin && !origin.includes('localhost')) {
      try {
        const parsed = new URL(origin);
        appUrl = `${parsed.protocol}//${parsed.host}`;
      } catch {}
    } else if (forwardedHost && !forwardedHost.includes('localhost')) {
      appUrl = `${forwardedProto}://${forwardedHost}`;
    } else if (origin) {
      try {
        const parsed = new URL(origin);
        appUrl = `${parsed.protocol}//${parsed.host}`;
      } catch {}
    }

    const returnUrlParam = user ? '' : `&guest_email=${encodeURIComponent(payerEmail)}`;

    // Si las credenciales de Mercado Pago están en placeholder, responder en 0ms
    const isMockMp =
      !process.env.MP_ACCESS_TOKEN ||
      process.env.MP_ACCESS_TOKEN.includes('xxxx');

    if (isMockMp) {
      return NextResponse.json({
        preferenceId: 'mock_pref_' + Date.now(),
        init_point: `${appUrl}/partido/${match.id}?payment=success${returnUrlParam}`,
        sandbox_init_point: `${appUrl}/partido/${match.id}?payment=success${returnUrlParam}`,
        publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '',
        isMock: true,
      });
    }

    const isTestToken = process.env.MP_ACCESS_TOKEN?.startsWith('TEST-');

    // 3. Crear preferencia en Mercado Pago Checkout Pro oficial
    const preference = new Preference(mpClient);
    const response = await preference.create({
      body: {
        items: [
          {
            id: match.id,
            title: `Pasión Lomonegra: ${match.title}`,
            description: `Pase oficial de transmisión en vivo HD • ${match.category || 'Fútbol Mayor'}`,
            picture_url: match.image_url
              ? (match.image_url.startsWith('http') ? match.image_url : `${appUrl}${match.image_url}`)
              : `${appUrl}/logo-pasion-lomonegra.png`,
            category_id: 'sports',
            quantity: 1,
            unit_price: Number(match.price) || 3500,
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
        external_reference: `match_${match.id}_${Date.now()}_${payerEmail}`,
        statement_descriptor: 'LOMONEGRA TV',
        back_urls: {
          success: `${appUrl}/partido/${match.id}?payment=success${returnUrlParam}`,
          failure: `${appUrl}/partido/${match.id}?payment=failure`,
          pending: `${appUrl}/partido/${match.id}?payment=pending`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        payment_methods: {
          installments: 6,
        },
      },
    });

    const initPoint =
      isTestToken && response.sandbox_init_point
        ? response.sandbox_init_point
        : (response.init_point || response.sandbox_init_point);

    return NextResponse.json({
      preferenceId: response.id,
      init_point: initPoint,
      sandbox_init_point: response.sandbox_init_point,
      publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '',
      isMock: false,
    });
  } catch (error: any) {
    console.error('Error en POST /api/checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al generar el checkout' },
      { status: 500 }
    );
  }
}
