import { NextResponse } from 'next/server';
import { resetStandings, ensureGlobalStore } from '@/lib/standingsPersistence';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categoriesToSync: { deporte: string; categoria: string; torneo: string }[] = [
      // Fútbol Senior y Reserva +30
      { deporte: 'futbol', categoria: 'senior', torneo: 'clausura' },
      { deporte: 'futbol', categoria: 'senior', torneo: 'apertura' },
      { deporte: 'futbol', categoria: 'reserva_30', torneo: 'clausura' },
      { deporte: 'futbol', categoria: 'reserva_30', torneo: 'apertura' },

      // Fútbol Clausura Fecha 5
      { deporte: 'futbol', categoria: 'mayor', torneo: 'clausura' },
      { deporte: 'futbol', categoria: 'reserva', torneo: 'clausura' },

      // Hockey Fecha 18 LCUH
      { deporte: 'hockey', categoria: 'primera_hockey', torneo: 'apertura' },
      { deporte: 'hockey', categoria: 'primera_hockey', torneo: 'clausura' },
      { deporte: 'hockey', categoria: 'sub19_hockey', torneo: 'apertura' },
      { deporte: 'hockey', categoria: 'sub19_hockey', torneo: 'clausura' },
      { deporte: 'hockey', categoria: 'sub16_hockey', torneo: 'apertura' },
      { deporte: 'hockey', categoria: 'sub16_hockey', torneo: 'clausura' },
      { deporte: 'hockey', categoria: 'sub13_hockey', torneo: 'apertura' },
      { deporte: 'hockey', categoria: 'sub13_hockey', torneo: 'clausura' },
      { deporte: 'hockey', categoria: 'mas30_hockey', torneo: 'apertura' },
      { deporte: 'hockey', categoria: 'mas30_hockey', torneo: 'clausura' },
    ];

    const results: string[] = [];
    for (const item of categoriesToSync) {
      const res = await resetStandings(item as any);
      results.push(`${item.deporte}_${item.categoria}_${item.torneo} (${res.zones?.length || 0} zonas, ${res.goleadores?.length || 0} goleadores)`);
    }

    const store = await ensureGlobalStore();

    return NextResponse.json({
      success: true,
      message: 'Tablas sincronizadas con éxito según boletines oficiales',
      syncedKeys: results,
      totalStoreKeys: Object.keys(store).length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error sincronizando tablas' },
      { status: 500 }
    );
  }
}
