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

    // Resolver ID real si vino como slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(matchId);
    let resolvedMatchId = matchId;
    if (!isUUID) {
      const { data: m } = await supabaseAdmin
        .from('matches')
        .select('id')
        .ilike('title', '%blanco y negro%')
        .maybeSingle();
      if (m?.id) resolvedMatchId = m.id;
    }

    const { data: purchase, error } = await supabaseAdmin
      .from('purchases')
      .select('id, status, created_at')
      .eq('match_id', resolvedMatchId)
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
