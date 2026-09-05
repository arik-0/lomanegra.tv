import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { updateStoredMatch } from '@/lib/adminStore';

export async function POST(req: Request) {
  try {
    const { matchId, streamUid } = await req.json();

    if (!matchId || !streamUid) {
      return NextResponse.json(
        { error: 'matchId y streamUid son obligatorios.' },
        { status: 400 }
      );
    }

    // Actualizar en Supabase
    try {
      await supabaseAdmin
        .from('matches')
        .update({ cloudflare_live_input_uid: streamUid.trim() })
        .eq('id', matchId);
    } catch {
      // Continuar con store local
    }

    const updated = updateStoredMatch(matchId, {
      cloudflare_live_input_uid: streamUid.trim(),
    });

    return NextResponse.json({
      success: true,
      message: '¡Stream anclado exitosamente!',
      match: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error anclando el stream.' },
      { status: 500 }
    );
  }
}
