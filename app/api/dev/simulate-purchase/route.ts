import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { matchId, guestEmail } = body;

    const targetEmail = guestEmail || 'invitado@pasionlomonegra.com';

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId es requerido.' },
        { status: 400 }
      );
    }

    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (isSupabaseConfigured) {
      try {
        const supabase = createServerSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

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

        if (existing) {
          await supabaseAdmin
            .from('purchases')
            .update({
              status: 'approved',
              mp_payment_id: `SIMULATED_${Date.now()}`,
            })
            .eq('id', existing.id);
        } else {
          await supabaseAdmin
            .from('purchases')
            .insert({
              user_id: user ? user.id : null,
              guest_email: user ? null : targetEmail.toLowerCase().trim(),
              match_id: resolvedMatchId,
              status: 'approved',
              mp_payment_id: `SIMULATED_${Date.now()}`,
              created_at: new Date().toISOString(),
            });
        }
      } catch (dbErr) {
        console.warn('Aviso: Base de datos no disponible durante simulación, usando modo local.');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pase aprobado simulado exitosamente',
      guestEmail: targetEmail.toLowerCase().trim(),
    });
  } catch {
    return NextResponse.json({
      success: true,
      message: 'Pase simulado en modo local',
      guestEmail: 'invitado@pasionlomonegra.com',
    });
  }
}
