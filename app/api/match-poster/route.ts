import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sanitizeRegionalText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Cache en memoria de los logos en base64 para respuesta instantánea (<2ms)
const logoBase64Cache = new Map<string, string>();

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getTeamLogoBase64(name: string): string | null {
  if (!name) return null;
  const clean = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  
  if (logoBase64Cache.has(clean)) {
    return logoBase64Cache.get(clean)!;
  }

  const teamsDir = path.join(process.cwd(), 'public', 'teams');
  if (!fs.existsSync(teamsDir)) return null;

  const files = fs.readdirSync(teamsDir);
  let matchedFile: string | null = null;

  // 1. Coincidencia directa por nombre de archivo
  for (const f of files) {
    const fClean = f.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace('.png', '');
    if (clean === fClean || clean.includes(fClean) || fClean.includes(clean)) {
      matchedFile = f;
      break;
    }
  }

  // 2. Mapeo específico por alias de clubes de la Liga Deportiva del Sur
  if (!matchedFile) {
    if (clean.includes('carreras')) matchedFile = 'Carreras.png';
    else if (clean.includes('blanco') || clean.includes('negro') || clean.includes('byn') || clean.includes('lomonegr')) matchedFile = 'Blanco y Negro.png';
    else if (clean.includes('alberdi')) matchedFile = 'Nuevo Alberdi.png';
    else if (clean.includes('acebal')) matchedFile = 'Atletico Acebal.png';
    else if (clean.includes('paz')) matchedFile = 'Atletico Paz.png';
    else if (clean.includes('firmat')) matchedFile = 'Firmat FBC.png';
    else if (clean.includes('argentino')) matchedFile = 'Argentino de Firmat.png';
    else if (clean.includes('ifc') || clean.includes('independiente')) matchedFile = 'ifc.png';
    else if (clean.includes('bombal') && clean.includes('sportivo')) matchedFile = 'Sportivo Bombal.png';
    else if (clean.includes('bombal')) matchedFile = 'Bombal Juniors.png';
    else if (clean.includes('sporting')) matchedFile = 'Sporting de Bigan.png';
    else if (clean.includes('san martin')) matchedFile = 'San Martin.png';
    else if (clean.includes('hertz')) matchedFile = 'Eduardo Hertz.png';
    else if (clean.includes('los andes') || clean.includes('andes')) matchedFile = 'Los Andes.png';
    else if (clean.includes('hughes')) matchedFile = 'Hughes.png';
    else if (clean.includes('italo')) matchedFile = 'Italo Argentino.png';
    else if (clean.includes('miguel torres')) matchedFile = 'Miguel Torres.png';
    else if (clean.includes('olimpia')) matchedFile = 'Olimpia de Santa Teresa.png';
    else if (clean.includes('fredriksson')) matchedFile = 'Fredriksson.png';
    else if (clean.includes('rivadavia')) matchedFile = 'Bernardino Rivadavia.png';
  }

  if (matchedFile) {
    const fullPath = path.join(teamsDir, matchedFile);
    if (fs.existsSync(fullPath)) {
      try {
        const base64 = 'data:image/png;base64,' + fs.readFileSync(fullPath).toString('base64');
        logoBase64Cache.set(clean, base64);
        return base64;
      } catch (err) {
        console.error('[MatchPoster] Error leyendo logo:', matchedFile, err);
      }
    }
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawTitle = searchParams.get('title') || 'Partido en Vivo';
    const cleanTitle = sanitizeRegionalText(rawTitle);

    const category = searchParams.get('category') || 'Primera División';
    const league = searchParams.get('league') || 'Liga Deportiva del Sur';

    // Extraer equipos del título
    const parts = cleanTitle.split(/vs\.?|\s+-\s+/i);
    const homeName = parts[0]?.trim() || 'Blanco y Negro';
    const awayName = parts[1]?.trim() || 'Rival';

    const homeLogo = getTeamLogoBase64(homeName);
    const awayLogo = getTeamLogoBase64(awayName);

    const homeDisplay = escapeXml(homeName.toUpperCase());
    const awayDisplay = escapeXml(awayName.toUpperCase());
    const titleDisplay = escapeXml(cleanTitle.toUpperCase());
    const leagueDisplay = escapeXml(league.toUpperCase());
    const categoryDisplay = escapeXml(category.toUpperCase());

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360" fill="none">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#241318" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#0e0f14" stop-opacity="1"/>
      <stop offset="100%" stop-color="#08080a" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Fondo deportivo premium con atmósfera broadcast -->
  <rect width="640" height="360" fill="#0c0d12"/>
  <rect width="640" height="360" fill="url(#bgGlow)"/>

  <!-- Trama técnica cuadrícula sutil -->
  <path d="M0 60h640M0 120h640M0 180h640M0 240h640M0 300h640" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
  <path d="M128 0v360M256 0v360M384 0v360M512 0v360" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>

  <!-- Resplandores de escudos -->
  <circle cx="170" cy="130" r="70" fill="#ffffff" fill-opacity="0.05"/>
  <circle cx="470" cy="130" r="70" fill="#ef4444" fill-opacity="0.08"/>

  <!-- Esquinas HUD técnicas en rojo carmesí -->
  <path d="M20 30v-12h12M620 30v-12h-12M20 330v12h12M620 330v12h-12" stroke="#dc2626" stroke-width="2" stroke-opacity="0.6"/>

  <!-- Barra superior oficial -->
  <g transform="translate(30, 28)">
    <circle cx="0" cy="0" r="4" fill="#ef4444"/>
    <text x="10" y="4" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="900" fill="#ffffff" letter-spacing="1.5">PASIÓN LOMONEGRA</text>
  </g>
  <g transform="translate(610, 28)">
    <rect x="-155" y="-11" width="155" height="22" rx="6" fill="#181924" stroke="#ef4444" stroke-opacity="0.4" stroke-width="1"/>
    <text x="-77" y="4" font-family="monospace" font-size="10" font-weight="800" fill="#f87171" text-anchor="middle" letter-spacing="1">TRANSMISIÓN EN VIVO HD</text>
  </g>

  <!-- Escudo Local (Izquierda) -->
  <g transform="translate(170, 130)">
    <circle cx="0" cy="0" r="52" fill="#12131c" stroke="#ffffff" stroke-width="2" stroke-opacity="0.3"/>
    ${
      homeLogo
        ? `<image href="${homeLogo}" x="-40" y="-40" width="80" height="80" preserveAspectRatio="xMidYMid meet"/>`
        : `<text x="0" y="8" font-family="system-ui" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">${homeDisplay.slice(0, 3)}</text>`
    }
  </g>
  <text x="170" y="206" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${homeDisplay}</text>

  <!-- VS Central Deportivo -->
  <g transform="translate(320, 130)">
    <circle cx="0" cy="0" r="26" fill="url(#redGrad)" stroke="#ffffff" stroke-width="2.5" filter="url(#glow)"/>
    <text x="0" y="6" font-family="system-ui, sans-serif" font-size="15" font-weight="900" font-style="italic" fill="#ffffff" text-anchor="middle">VS</text>
  </g>

  <!-- Escudo Visitante (Derecha) -->
  <g transform="translate(470, 130)">
    <circle cx="0" cy="0" r="52" fill="#12131c" stroke="#ffffff" stroke-width="2" stroke-opacity="0.3"/>
    ${
      awayLogo
        ? `<image href="${awayLogo}" x="-40" y="-40" width="80" height="80" preserveAspectRatio="xMidYMid meet"/>`
        : `<text x="0" y="8" font-family="system-ui" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">${awayDisplay.slice(0, 3)}</text>`
    }
  </g>
  <text x="470" y="206" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${awayDisplay}</text>

  <!-- Título y Liga en el tercio inferior -->
  <text x="320" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">${titleDisplay}</text>
  <text x="320" y="286" font-family="monospace" font-size="11" font-weight="800" fill="#ef4444" text-anchor="middle" letter-spacing="2">${leagueDisplay} // ${categoryDisplay}</text>

  <!-- Botón decorativo Pase Oficial -->
  <g transform="translate(320, 318)">
    <rect x="-120" y="-12" width="240" height="24" rx="6" fill="#12131c" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1"/>
    <circle cx="-95" cy="0" r="3" fill="#22c55e"/>
    <text x="10" y="4" font-family="monospace" font-size="10" font-weight="800" fill="#d4d4d8" text-anchor="middle" letter-spacing="1">PASE OFICIAL DE TRANSMISIÓN</text>
  </g>
</svg>`;

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error: any) {
    console.error('[MatchPoster] Error generando afiche SVG:', error);
    // Fallback mínimo para nunca romper la respuesta
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360" fill="#0c0d12"><text x="320" y="180" font-family="sans-serif" font-size="20" fill="#ffffff" text-anchor="middle">PASIÓN LOMONEGRA HD</text></svg>`;
    return new Response(fallbackSvg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
    });
  }
}
