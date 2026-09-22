import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email, matchId } = await req.json();

    if (!email || !matchId) {
      return NextResponse.json(
        { error: 'Email y matchId son requeridos.' },
        { status: 400 }
      );
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { hasAccess: false, message: 'Modo local.' },
        { status: 200 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Buscar compra específica para el matchId
    let { data: purchase } = await supabaseAdmin
      .from('purchases')
      .select('id, status, created_at')
      .eq('match_id', matchId)
      .ilike('guest_email', cleanEmail)
      .eq('status', 'approved')
      .limit(1)
      .maybeSingle();

    // 2. Fallback: buscar cualquier compra aprobada para este email
    if (!purchase) {
      const { data: anyPurchase } = await supabaseAdmin
        .from('purchases')
        .select('id, status, created_at')
        .ilike('guest_email', cleanEmail)
        .eq('status', 'approved')
        .limit(1)
        .maybeSingle();
      purchase = anyPurchase;
    }

    if (!purchase) {
      return NextResponse.json(
        { hasAccess: false, message: 'No se encontró un pase aprobado con este correo.' },
        { status: 200 }
      );
    }

    const cookieStore = cookies();
    cookieStore.set('lomonegro_user_email', cleanEmail, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    cookieStore.set('lomonegro_user_id', `guest_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return NextResponse.json({
      hasAccess: true,
      email: cleanEmail,
      purchaseId: purchase.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
