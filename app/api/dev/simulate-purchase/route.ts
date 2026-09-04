import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await req.json().catch(() => ({}));
    const { matchId, guestEmail } = body;

    const targetEmail = user?.email || guestEmail || 'invitado@lomanegratv.com';

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId es requerido.' },
        { status: 400 }
      );
    }

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

    // 1. Comprobar si ya existe un registro de compra para este usuario o invitado
    let existingQuery = supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('match_id', resolvedMatchId);

    if (user) {
      existingQuery = existingQuery.eq('user_id', user.id);
    } else {
      existingQuery = existingQuery.eq('guest_email', targetEmail.toLowerCase().trim());
    }

    const { data: existing } = await existingQuery.maybeSingle();

    let saveError = null;

    // 2. Actualizar si existe, o insertar si es nuevo
    if (existing) {
      const { error } = await supabaseAdmin
        .from('purchases')
        .update({
          status: 'approved',
          mp_payment_id: `SIMULATED_${Date.now()}`,
        })
        .eq('id', existing.id);
      saveError = error;
    } else {
      const { error } = await supabaseAdmin
        .from('purchases')
        .insert({
          user_id: user ? user.id : null,
          guest_email: user ? null : targetEmail.toLowerCase().trim(),
          match_id: resolvedMatchId,
          status: 'approved',
          mp_payment_id: `SIMULATED_${Date.now()}`,
          created_at: new Date().toISOString(),
        });
      saveError = error;
    }

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pase aprobado simulado exitosamente',
      guestEmail: user ? null : targetEmail.toLowerCase().trim(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
