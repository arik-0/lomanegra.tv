import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { updateStoredMatch } from '@/lib/adminStore';
import { verifyAdminSession } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    if (!verifyAdminSession()) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere sesión de operador o administrador.' },
        { status: 401 }
      );
    }

    const { matchId, streamUid, isLive } = await req.json();

    if (!matchId) {
      return NextResponse.json(
        { error: 'El parámetro matchId es obligatorio.' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (streamUid !== undefined && streamUid !== null) {
      let cleanUid = String(streamUid).trim();
      if (cleanUid.startsWith('/partido/') || cleanUid.includes('/partido/')) {
        return NextResponse.json(
          { error: 'Has ingresado la ruta web del partido (/partido/...). En este campo debes colocar el Live Input UID de Cloudflare de 32 dígitos (ej: 465cbf95482c042491bca5b69708e97c).' },
          { status: 400 }
        );
      }
      const cfMatch = cleanUid.match(/(?:videodelivery\.net|cloudflarestream\.com)\/([a-fA-F0-9]{32})/);
      if (cfMatch && cfMatch[1]) {
        cleanUid = cfMatch[1];
      }
      updates.cloudflare_live_input_uid = cleanUid;
    }
    if (isLive !== undefined && isLive !== null) {
      updates.is_live = Boolean(isLive);
    }

    // Actualizar en Supabase
    try {
      if (isLive !== undefined) {
        const { data: currentMatch } = await supabaseAdmin
          .from('matches')
          .select('description')
          .eq('id', matchId)
          .maybeSingle();

        if (currentMatch) {
          const rawDesc = currentMatch.description || '';
          let meta: Record<string, any> = {};
          const metaMatch = rawDesc.match(/\[META:(\{.*?\})\]/);
          if (metaMatch) {
            try {
              meta = JSON.parse(metaMatch[1]);
            } catch {}
          }
          meta.is_live = Boolean(isLive);
          const cleanDesc = rawDesc.replace(/\[META:\{.*?\}\]/g, '').trim();
          const newDesc = `[META:${JSON.stringify(meta)}] ${cleanDesc}`.trim();

          const dbUpdate: any = { description: newDesc };
          if (streamUid !== undefined && streamUid !== null) {
            dbUpdate.cloudflare_live_input_uid = String(streamUid).trim();
          }
          await supabaseAdmin.from('matches').update(dbUpdate).eq('id', matchId);
        } else if (streamUid !== undefined && streamUid !== null) {
          await supabaseAdmin
            .from('matches')
            .update({ cloudflare_live_input_uid: String(streamUid).trim() })
            .eq('id', matchId);
        }
      } else if (streamUid !== undefined && streamUid !== null) {
        await supabaseAdmin
          .from('matches')
          .update({ cloudflare_live_input_uid: String(streamUid).trim() })
          .eq('id', matchId);
      }
    } catch {
      // Continuar con store local resiliente
    }

    const updated = updateStoredMatch(matchId, updates);

    return NextResponse.json({
      success: true,
      message: '¡Configuración de transmisión actualizada exitosamente!',
      match: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error anclando el stream.' },
      { status: 500 }
    );
  }
}
