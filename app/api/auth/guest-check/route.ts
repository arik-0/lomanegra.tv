import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';

if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function POST(req: Request) {
  try {
    const { email, matchId } = await req.json();

    if (!email || !matchId) {
      return NextResponse.json(
        { error: 'Email y matchId son requeridos.' },
        { status: 400 }
      );
    }

    const isValidUUID = (str?: string | null): boolean =>
      !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    const cleanEmail = email.toLowerCase().trim();

    let purchase = null;

    // 1. Buscar compra específica para el matchId por guest_email (solo si matchId es UUID válido)
    if (isValidUUID(matchId)) {
      const { data: directPurchase } = await supabaseAdmin
        .from('purchases')
        .select('id, status, created_at, match_id')
        .eq('match_id', matchId)
        .ilike('guest_email', cleanEmail)
        .eq('status', 'approved')
        .limit(1)
        .maybeSingle();
      purchase = directPurchase;
    }

    // 2. Fallback: buscar cualquier compra aprobada para este email
    if (!purchase) {
      const { data: anyPurchase } = await supabaseAdmin
        .from('purchases')
        .select('id, status, created_at, match_id')
        .ilike('guest_email', cleanEmail)
        .eq('status', 'approved')
        .limit(1)
        .maybeSingle();
      purchase = anyPurchase;
    }

    // 3. Fallback: verificar si pertenece a un usuario registrado en auth.users
    if (!purchase) {
      try {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const matchedUser = usersData?.users?.find(
          (u) => u.email?.toLowerCase().trim() === cleanEmail
        );
        if (matchedUser) {
          const { data: userPurch } = await supabaseAdmin
            .from('purchases')
            .select('id, status, created_at')
            .eq('user_id', matchedUser.id)
            .eq('status', 'approved')
            .limit(1)
            .maybeSingle();
          if (userPurch) purchase = userPurch;
        }
      } catch {}
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

    return NextResponse.json({
      hasAccess: true,
      email: cleanEmail,
      purchaseId: purchase.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
