import { NextResponse } from 'next/server';
import fallbackData from '@/lib/promiedosFallback.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Intentar obtener datos frescos de Promiedos en vivo con timeout de 3 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('https://www.promiedos.com.ar/league/liga-profesional/hc', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

      if (match && match[1]) {
        const json = JSON.parse(match[1]);
        const groups = json.props?.pageProps?.data?.tables_groups;
        const clausura = groups?.[0];

        if (clausura && Array.isArray(clausura.tables) && clausura.tables.length > 0) {
          const tables = clausura.tables.map((t: any) => {
            return {
              name: t.name,
              destinations: t.table?.destinations || [],
              rows: (t.table?.rows || []).map((r: any) => {
                const valMap: Record<string, any> = {};
                (r.values || []).forEach((v: any) => {
                  valMap[v.key] = v.value;
                });
                const goalsParts = (valMap['Goals'] || '0:0').split(':');
                return {
                  pos: r.num,
                  teamId: r.entity?.object?.id || '',
                  teamName: r.entity?.object?.name || '',
                  teamShort: r.entity?.object?.short_name || r.entity?.object?.name || '',
                  logoUrl: r.entity?.object?.id
                    ? `https://api.promiedos.com.ar/images/team/${r.entity.object.id}/1`
                    : '',
                  pts: Number(valMap['Points'] || 0),
                  pj: Number(valMap['GamePlayed'] || 0),
                  pg: Number(valMap['GamesWon'] || 0),
                  pe: Number(valMap['GamesEven'] || 0),
                  pp: Number(valMap['GamesLost'] || 0),
                  gf: Number(goalsParts[0] || 0),
                  gc: Number(goalsParts[1] || 0),
                  dif: Number(valMap['Ratio'] || 0),
                  trend: Array.isArray(valMap['{trend}']) ? valMap['{trend}'] : [],
                  destinationColor: r.destination_color || null,
                };
              }),
            };
          });

          return NextResponse.json({
            success: true,
            isLive: true,
            updatedAt: new Date().toISOString(),
            league: 'Liga Profesional de Fútbol (AFA)',
            tournament: clausura.name || 'Torneo Clausura',
            tables,
          });
        }
      }
    }
  } catch (err) {
    // Si la conexión directa falla o agota el tiempo, usamos el snapshot de respaldo oficial
    console.warn('[Promiedos API] Live fetch error, sirviendo snapshot local:', err);
  }

  // Fallback seguro de alta disponibilidad
  return NextResponse.json({
    success: true,
    isLive: false,
    fallback: true,
    ...fallbackData,
  });
}
