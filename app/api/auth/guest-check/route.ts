import { NextResponse } from 'next/server';
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

    const cleanEmail = email.toLowerCase().trim();

    const { data: purchase, error } = await supabaseAdmin
      .from('purchases')
      .select('id, status, created_at')
      .eq('match_id', matchId)
      .eq('guest_email', cleanEmail)
      .eq('status', 'approved')
      .maybeSingle();

    if (error || !purchase) {
      return NextResponse.json(
        { hasAccess: false, message: 'No se encontró un pase aprobado con este correo.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hasAccess: true,
      email: cleanEmail,
      purchaseId: purchase.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
