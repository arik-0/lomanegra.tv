// Almacén central de datos deportivos de la Liga Deportiva del Sur
// Soporta División en Zonas, Llaves de Play-offs (16avos, 8vos, Cuartos, Semis, Final) y Goleadores

import {
  officialClausuraFixturesZonaA,
  officialClausuraFixturesZonaB,
  CLAUSURA_TEAMS_ZONA_A,
  CLAUSURA_TEAMS_ZONA_B,
} from './clausuraFixtures';

export type DeporteType = 'futbol' | 'hockey';
export type TorneoType = 'apertura' | 'clausura' | 'primer' | 'segundo';
export type CategoriaType =
  | 'mayor'
  | 'reserva'
  | 'tercera'
  | 'cuarta'
  | 'quinta'
  | 'primera_hockey'
  | 'reserva_hockey'
  | 'sub18_hockey'
  | 'sub16_hockey'
  | 'sub14_hockey'
  | 'sub12_hockey';

export type PlayoffRound = '16avos' | '8vos' | 'cuartos' | 'semifinal' | 'final';
export type PlayoffModality = '16avos' | '8vos' | 'cuartos' | 'semifinal' | 'final' | 'none';

export const FUTBOL_CATEGORIES: { id: CategoriaType; label: string }[] = [
  { id: 'mayor', label: 'Primera División' },
  { id: 'reserva', label: 'Reserva' },
  { id: 'tercera', label: 'Tercera División' },
  { id: 'cuarta', label: 'Cuarta División' },
  { id: 'quinta', label: 'Quinta División' },
];

export const HOCKEY_CATEGORIES: { id: CategoriaType; label: string }[] = [
  { id: 'primera_hockey', label: 'Primera División' },
  { id: 'reserva_hockey', label: 'Reserva' },
  { id: 'sub18_hockey', label: 'Sub-18' },
  { id: 'sub16_hockey', label: 'Sub-16' },
  { id: 'sub14_hockey', label: 'Sub-14' },
  { id: 'sub12_hockey', label: 'Sub-12' },
];

export interface TeamStandingsRow {
  id: string;
  pos: number;
  name: string;
  logoUrl?: string;
  isBlancoYNegro?: boolean;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dif: number;
  pts: number;
  form: ('W' | 'D' | 'L')[];
  qualified?: boolean;
}

// Función normalizadora canónica para reconocimiento unívoco de clubes de la LDDS
export function canonicalTeamKey(name: string): string {
  if (!name) return '';
  const clean = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const norm = clean.replace(/[.\-]/g, ' ').replace(/\s+/g, ' ').trim();

  if (norm.includes('italo')) return 'italo';
  if (norm.includes('argentino')) return 'argentino';
  if (norm.includes('firmat')) return 'firmat';
  if (norm.includes('sportivo') || (norm.includes('sp') && norm.includes('bombal'))) return 'sp_bombal';
  if (norm.includes('bombal')) return 'bombal_jrs';
  if (norm.includes('sporting')) return 'sporting';
  if (norm.includes('independiente') || norm === 'ifc' || norm === 'i f c') return 'independiente';
  if (norm.includes('miguel torres') || norm.includes('torres')) return 'miguel_torres';
  if (norm.includes('fredriksson')) return 'fredriksson';
  if (norm.includes('olimpia')) return 'olimpia';
  if (norm.includes('hughes')) return 'hughes';
  if (norm.includes('rivadavia')) return 'rivadavia';
  if (norm.includes('carreras')) return 'carreras';
  if (norm.includes('acebal')) return 'acebal';
  if (norm.includes('paz')) return 'paz';
  if (norm.includes('alberdi')) return 'alberdi';
  if (norm.includes('hertz')) return 'hertz';
  if (norm.includes('los andes') || norm.includes('andes')) return 'los_andes';
  if (norm.includes('san martin')) return 'san_martin';
  if (norm.includes('blanco y negro') || norm === 'byd' || norm === 'byn') return 'blanco_y_negro';

  return norm;
}

export const CANONICAL_LOGOS: Record<string, string> = {
  argentino: '/teams/Argentino de Firmat.png',
  firmat: '/teams/Firmat FBC.png',
  sp_bombal: '/teams/Sportivo Bombal.png',
  bombal_jrs: '/teams/Bombal Juniors.png',
  sporting: '/teams/Sporting de Bigan.png',
  independiente: '/teams/ifc.png',
  miguel_torres: '/teams/Miguel Torres.png',
  fredriksson: '/teams/Fredriksson.png',
  olimpia: '/teams/Olimpia de Santa Teresa.png',
  hughes: '/teams/Hughes.png',
  rivadavia: '/teams/Bernardino Rivadavia.png',
  carreras: '/teams/Carreras.png',
  acebal: '/teams/Atletico Acebal.png',
  paz: '/teams/Atletico Paz.png',
  alberdi: '/teams/Nuevo Alberdi.png',
  hertz: '/teams/Eduardo Hertz.png',
  los_andes: '/teams/Los Andes.png',
  san_martin: '/teams/San Martin.png',
  italo: '/teams/Italo Argentino.png',
  blanco_y_negro: '/teams/Blanco y Negro.png',
};

// Mapeo exhaustivo de escudos y equipos reales presentes en la carpeta public/teams/
export const TEAM_LOGOS: Record<string, string> = {
  'blanco y negro': '/teams/Blanco y Negro.png',
  'byd': '/teams/Blanco y Negro.png',
  'byn': '/teams/Blanco y Negro.png',
  'san martín': '/teams/San Martin.png',
  'san martin': '/teams/San Martin.png',
  'argentino de firmat': '/teams/Argentino de Firmat.png',
  'argentino firmat': '/teams/Argentino de Firmat.png',
  'c.a. argentino': '/teams/Argentino de Firmat.png',
  'ca argentino': '/teams/Argentino de Firmat.png',
  'firmat fbc': '/teams/Firmat FBC.png',
  'firmat': '/teams/Firmat FBC.png',
  'atlético acebal': '/teams/Atletico Acebal.png',
  'atletico acebal': '/teams/Atletico Acebal.png',
  'atl. acebal': '/teams/Atletico Acebal.png',
  'atl acebal': '/teams/Atletico Acebal.png',
  'atlético paz': '/teams/Atletico Paz.png',
  'atletico paz': '/teams/Atletico Paz.png',
  'bernardino rivadavia': '/teams/Bernardino Rivadavia.png',
  'b. rivadavia': '/teams/Bernardino Rivadavia.png',
  'b rivadavia': '/teams/Bernardino Rivadavia.png',
  'bombal juniors': '/teams/Bombal Juniors.png',
  'bombal jrs': '/teams/Bombal Juniors.png',
  'bombal jr': '/teams/Bombal Juniors.png',
  'carreras': '/teams/Carreras.png',
  'carreras ac': '/teams/Carreras.png',
  'eduardo hertz': '/teams/Eduardo Hertz.png',
  'fredriksson': '/teams/Fredriksson.png',
  'fredriksson fbc': '/teams/Fredriksson.png',
  'hughes': '/teams/Hughes.png',
  'hughes fbc': '/teams/Hughes.png',
  'independiente de bigand': '/teams/ifc.png',
  'independiente de bigan': '/teams/ifc.png',
  'independiente fútbol club': '/teams/ifc.png',
  'independiente futbol club': '/teams/ifc.png',
  'independiente fc': '/teams/ifc.png',
  'independiente': '/teams/ifc.png',
  'i. f. c.': '/teams/ifc.png',
  'i.f.c.': '/teams/ifc.png',
  'ifc': '/teams/ifc.png',
  'i f c': '/teams/ifc.png',
  'ítalo argentino': '/teams/Italo Argentino.png',
  'italo argentino': '/teams/Italo Argentino.png',
  'italo argenitno': '/teams/Italo Argentino.png',
  'los andes': '/teams/Los Andes.png',
  'miguel torres': '/teams/Miguel Torres.png',
  'dep. miguel torres': '/teams/Miguel Torres.png',
  'dep miguel torres': '/teams/Miguel Torres.png',
  'nuevo alberdi': '/teams/Nuevo Alberdi.png',
  'olimpia de santa teresa': '/teams/Olimpia de Santa Teresa.png',
  'olimpia': '/teams/Olimpia de Santa Teresa.png',
  'sporting de bigand': '/teams/Sporting de Bigan.png',
  'sporting de bigan': '/teams/Sporting de Bigan.png',
  'sporting cs': '/teams/Sporting de Bigan.png',
  'sportivo bombal': '/teams/Sportivo Bombal.png',
  'sp. bombal': '/teams/Sportivo Bombal.png',
  'sp bombal': '/teams/Sportivo Bombal.png',
};

// Algoritmo de reconocimiento inteligente y robusto de escudos de clubes
export function getTeamLogo(teamName: string): string {
  if (!teamName) return '/teams/Blanco y Negro.png';
  const cKey = canonicalTeamKey(teamName);
  if (CANONICAL_LOGOS[cKey]) {
    return CANONICAL_LOGOS[cKey];
  }
  const clean = teamName.toLowerCase().trim();
  const normalized = clean.replace(/\./g, '').replace(/\s+/g, ' ').trim();

  // 1. REGLAS PRIORITARIAS ANTI-COLISIÓN (Soluciona error de Imagen 1)
  // Argentino de Firmat: NO debe ser capturado por "Firmat FBC"
  if (
    clean.includes('argentino de firmat') ||
    clean.includes('argentino firmat') ||
    normalized.includes('argentino firmat') ||
    clean.startsWith('argentino')
  ) {
    return '/teams/Argentino de Firmat.png';
  }

  // Firmat FBC (solo si no es Argentino de Firmat)
  if (
    clean.includes('firmat fbc') ||
    clean.includes('firmat fútbol club') ||
    clean.includes('firmat futbol club') ||
    clean === 'firmat' ||
    clean.startsWith('firmat')
  ) {
    return '/teams/Firmat FBC.png';
  }

  // Sportivo Bombal: NO debe confundirse con Bombal Juniors
  if (
    clean.includes('sportivo bombal') ||
    clean.startsWith('sportivo')
  ) {
    return '/teams/Sportivo Bombal.png';
  }

  // Bombal Juniors
  if (
    clean.includes('bombal juniors') ||
    clean.includes('bombal jr') ||
    clean === 'bombal'
  ) {
    return '/teams/Bombal Juniors.png';
  }

  // Sporting de Bigand: NO debe confundirse con Independiente de Bigand
  if (
    clean.includes('sporting de bigand') ||
    clean.includes('sporting bigand') ||
    clean.startsWith('sporting')
  ) {
    return '/teams/Sporting de Bigan.png';
  }

  // Independiente de Bigand / IFC
  if (
    normalized === 'ifc' ||
    normalized === 'i f c' ||
    clean.includes('ifc') ||
    clean.includes('i. f. c') ||
    clean.includes('i.f.c') ||
    clean.includes('independiente de bigand') ||
    clean.includes('independiente de bigan') ||
    clean.includes('independiente')
  ) {
    return '/teams/ifc.png';
  }

  // Blanco y Negro / ByD / ByN
  if (clean.includes('blanco y negro') || clean === 'byd' || clean === 'byn') {
    return '/teams/Blanco y Negro.png';
  }

  // 2. Coincidencia directa exacta
  if (TEAM_LOGOS[clean]) {
    return TEAM_LOGOS[clean];
  }
  if (TEAM_LOGOS[normalized]) {
    return TEAM_LOGOS[normalized];
  }

  // 3. Coincidencia por frases más largas primero (longitud descendente para evitar falsos positivos)
  const sortedKeys = Object.keys(TEAM_LOGOS).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (key.length >= 4 && clean.includes(key)) {
      return TEAM_LOGOS[key];
    }
  }

  // 4. Si el usuario está escribiendo y lleva 4 o más caracteres, autocompletar por prefijo
  if (clean.length >= 4) {
    for (const key of sortedKeys) {
      if (key.startsWith(clean)) {
        return TEAM_LOGOS[key];
      }
    }
  }

  return '/teams/Blanco y Negro.png';
}

export interface FixtureMatch {
  id: string;
  roundName?: string; // ej: "Fecha 1", "Fecha 2", etc.
  date?: string; // ej: "6/9/2026", "20/9/2026"
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  homeGoals: number | null;
  awayGoals: number | null;
}

export interface ZoneData {
  id: string;
  name: string; // ej: "Zona A", "Zona B"
  teams: TeamStandingsRow[];
  fixtures?: FixtureMatch[];
}

export interface PlayoffMatch {
  id: string;
  round: PlayoffRound;
  title: string; // ej: "16avos 1", "8vos 1", "Cuartos 1", "Semifinal A", "Gran Final"
  seed1?: string; // Expresión de casillero ej: "1ero A", "1A", "1° Zona A"
  seed2?: string; // Expresión de casillero ej: "2do B", "4to B", "8vo B"
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  penalties1?: number | null;
  penalties2?: number | null;
  winner?: 1 | 2;
  status: 'programado' | 'en_juego' | 'finalizado';
  dateInfo?: string; // ej: "Domingo 15:30 hs"
}

export interface GoleadorRow {
  id: string;
  pos: number;
  name: string;
  category: string;
  goals: number;
}

export interface TournamentStandings {
  year: string;
  torneo: TorneoType;
  deporte?: DeporteType;
  categoria: CategoriaType;
  playoffModality?: PlayoffModality;
  zones: ZoneData[];
  playoffs: PlayoffMatch[];
  goleadores: GoleadorRow[];
}

// Función que recalcula automáticamente la tabla de posiciones a partir de los partidos cargados,
// preservando al mismo tiempo la capacidad de edición manual en cualquier momento.
export function recalculateZoneStandings(zone: ZoneData): ZoneData {
  const fixtures = (zone.fixtures || []).filter(
    (f) => f.homeGoals !== null && f.awayGoals !== null && !isNaN(Number(f.homeGoals)) && !isNaN(Number(f.awayGoals))
  );

  if (fixtures.length === 0) {
    return zone;
  }

  const statsMap: Record<
    string,
    {
      team: TeamStandingsRow;
      pj: number;
      pg: number;
      pe: number;
      pp: number;
      gf: number;
      gc: number;
      dif: number;
      pts: number;
      form: ('W' | 'D' | 'L')[];
    }
  > = {};

  zone.teams.forEach((t) => {
    const key = canonicalTeamKey(t.name);
    statsMap[key] = {
      team: { ...t },
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      dif: 0,
      pts: 0,
      form: [],
    };
  });

  fixtures.forEach((fix) => {
    const homeKey = canonicalTeamKey(fix.homeTeamName);
    const awayKey = canonicalTeamKey(fix.awayTeamName);
    const hg = Number(fix.homeGoals);
    const ag = Number(fix.awayGoals);

    if (statsMap[homeKey]) {
      const h = statsMap[homeKey];
      h.pj += 1;
      h.gf += hg;
      h.gc += ag;
      if (hg > ag) {
        h.pg += 1;
        h.pts += 3;
        h.form.push('W');
      } else if (hg === ag) {
        h.pe += 1;
        h.pts += 1;
        h.form.push('D');
      } else {
        h.pp += 1;
        h.form.push('L');
      }
    }

    if (statsMap[awayKey]) {
      const a = statsMap[awayKey];
      a.pj += 1;
      a.gf += ag;
      a.gc += hg;
      if (ag > hg) {
        a.pg += 1;
        a.pts += 3;
        a.form.push('W');
      } else if (ag === hg) {
        a.pe += 1;
        a.pts += 1;
        a.form.push('D');
      } else {
        a.pp += 1;
        a.form.push('L');
      }
    }
  });

  const updatedTeams: TeamStandingsRow[] = Object.values(statsMap).map((entry) => {
    const dif = entry.gf - entry.gc;
    return {
      ...entry.team,
      pj: entry.pj,
      pg: entry.pg,
      pe: entry.pe,
      pp: entry.pp,
      gf: entry.gf,
      gc: entry.gc,
      dif: dif,
      pts: entry.pts,
      form: entry.form.length > 0 ? entry.form.slice(-5) : entry.team.form,
    };
  });

  updatedTeams.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dif !== a.dif) return b.dif - a.dif;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return b.pg - a.pg;
  });

  const finalizedTeams = updatedTeams.map((t, idx) => ({
    ...t,
    pos: idx + 1,
    qualified: idx < 4,
  }));

  return {
    ...zone,
    teams: finalizedTeams,
  };
}

// Generador automático de fixture completo estilo todos contra todos (Round Robin)
// Crea todas las fechas al principio del torneo y preserva cualquier resultado ya cargado.
export function generateFullRoundRobinFixture(
  zone: ZoneData,
  existingFixtures?: FixtureMatch[]
): FixtureMatch[] {
  let teams = [...zone.teams];
  if (teams.length < 2) return [];

  const isOdd = teams.length % 2 !== 0;
  if (isOdd) {
    teams.push({
      id: '__libre__',
      pos: 999,
      name: 'LIBRE',
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      dif: 0,
      pts: 0,
      form: [],
    });
  }

  const n = teams.length;
  const numRounds = n - 1;
  const half = n / 2;
  const list = [...teams];
  const allMatches: FixtureMatch[] = [];

  // Mapear partidos existentes para conservar los goles si ya fueron cargados
  const existingMap = new Map<string, FixtureMatch>();
  (existingFixtures || zone.fixtures || []).forEach((f) => {
    const key1 = `${f.homeTeamName.trim().toLowerCase()}_vs_${f.awayTeamName.trim().toLowerCase()}`;
    const key2 = `${f.awayTeamName.trim().toLowerCase()}_vs_${f.homeTeamName.trim().toLowerCase()}`;
    existingMap.set(key1, f);
    if (!existingMap.has(key2)) {
      existingMap.set(key2, f);
    }
  });

  for (let r = 0; r < numRounds; r++) {
    const roundNum = r + 1;
    let matchInRound = 1;
    for (let i = 0; i < half; i++) {
      const t1 = list[i];
      const t2 = list[n - 1 - i];

      if (t1.id === '__libre__' || t2.id === '__libre__') continue;

      let home = t1;
      let away = t2;
      // Alternar localía para equilibrar local y visitante
      if (r % 2 === 1 && i === 0) {
        home = t2;
        away = t1;
      }

      const pairKey = `${home.name.trim().toLowerCase()}_vs_${away.name.trim().toLowerCase()}`;
      const revKey = `${away.name.trim().toLowerCase()}_vs_${home.name.trim().toLowerCase()}`;
      const existing = existingMap.get(pairKey) || existingMap.get(revKey);

      let homeGoals: number | null = null;
      let awayGoals: number | null = null;
      if (existing && existing.homeGoals !== null && existing.awayGoals !== null) {
        if (existing.homeTeamName.trim().toLowerCase() === home.name.trim().toLowerCase()) {
          homeGoals = existing.homeGoals;
          awayGoals = existing.awayGoals;
        } else {
          homeGoals = existing.awayGoals;
          awayGoals = existing.homeGoals;
        }
      }

      allMatches.push({
        id: existing?.id || `fix-${zone.id}-f${roundNum}-${matchInRound}`,
        roundName: `Fecha ${roundNum}`,
        homeTeamId: home.id,
        homeTeamName: home.name,
        awayTeamId: away.id,
        awayTeamName: away.name,
        homeGoals,
        awayGoals,
      });
      matchInRound++;
    }

    // Rotación de polígono: mantener list[0] fijo y rotar el resto
    const last = list.pop()!;
    list.splice(1, 0, last);
  }

  return allMatches;
}

// Resuelve dinámicamente el equipo que ocupa la posición especificada en una zona
// Admite expresiones de casillero flexibles: "1ero A", "1A", "1° A", "2do B", "4to B", "8vo A", "16vo B", etc.
export function resolvePlayoffSeed(expression?: string, zones?: ZoneData[]): string | null {
  if (!expression || typeof expression !== 'string' || !zones || zones.length === 0) return null;
  const clean = expression.trim().toLowerCase();
  if (!clean) return null;

  // Extraer número de posición
  let pos: number | null = null;
  const numMatch = clean.match(/(\d+)/);
  if (numMatch) {
    pos = parseInt(numMatch[1], 10);
  } else if (clean.includes('primer') || clean.includes('1ero') || clean.includes('1ro')) {
    pos = 1;
  } else if (clean.includes('segund') || clean.includes('2do')) {
    pos = 2;
  } else if (clean.includes('tercer') || clean.includes('3ro') || clean.includes('3er')) {
    pos = 3;
  } else if (clean.includes('cuart') || clean.includes('4to')) {
    pos = 4;
  } else if (clean.includes('quint') || clean.includes('5to')) {
    pos = 5;
  } else if (clean.includes('sext') || clean.includes('6to')) {
    pos = 6;
  } else if (clean.includes('septim') || clean.includes('7mo')) {
    pos = 7;
  } else if (clean.includes('octav') || clean.includes('8vo')) {
    pos = 8;
  } else if (clean.includes('dieciseis') || clean.includes('16vo')) {
    pos = 16;
  }

  if (!pos || pos < 1) return null;

  // Extraer identificador de zona (ej: "A", "B", "C", etc.)
  let zoneIdent: string | null = null;
  const zoneNamedMatch = clean.match(/zona\s*([a-z0-9]+)/i);
  if (zoneNamedMatch) {
    zoneIdent = zoneNamedMatch[1].toLowerCase();
  } else {
    const letterMatch = clean.match(/[0-9a-z°º\s]+([a-z])$/i) || clean.match(/([a-z])$/i);
    if (letterMatch) {
      zoneIdent = letterMatch[1].toLowerCase();
    }
  }

  if (!zoneIdent) return null;

  const targetZone = zones.find((z) => {
    const zName = z.name.toLowerCase();
    const zId = z.id.toLowerCase();
    return (
      zId === `zona-${zoneIdent}` ||
      zId === zoneIdent ||
      zName.includes(`zona ${zoneIdent}`) ||
      zName.endsWith(` ${zoneIdent}`) ||
      zName === zoneIdent
    );
  });

  if (!targetZone || !targetZone.teams || targetZone.teams.length === 0) return null;

  const sorted = [...targetZone.teams].sort((a, b) => {
    if (a.pos && b.pos) return a.pos - b.pos;
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.dif !== a.dif) return b.dif - a.dif;
    return b.gf - a.gf;
  });

  const team = sorted[pos - 1];
  return team ? team.name : null;
}

// Función que propaga automáticamente los ganadores de cada fase de play-off a la siguiente ronda
export function advancePlayoffWinners(playoffs: PlayoffMatch[]): PlayoffMatch[] {
  if (!playoffs || playoffs.length === 0) return playoffs;

  const getWinner = (m?: PlayoffMatch): string | null => {
    if (!m || !m.team1 || !m.team2 || m.team1 === 'A definir' || m.team2 === 'A definir') return null;
    if (m.winner === 1) return m.team1;
    if (m.winner === 2) return m.team2;
    if (m.score1 !== null && m.score2 !== null) {
      if (m.score1 > m.score2) return m.team1;
      if (m.score2 > m.score1) return m.team2;
      if (typeof m.penalties1 === 'number' && typeof m.penalties2 === 'number') {
        if (m.penalties1 > m.penalties2) return m.team1;
        if (m.penalties2 > m.penalties1) return m.team2;
      }
    }
    return null;
  };

  const matchMap = new Map<string, PlayoffMatch>();
  playoffs.forEach((m) => matchMap.set(m.id, { ...m }));

  // 1. De 8vos a Cuartos
  for (let i = 1; i <= 4; i++) {
    const cId = `c${i}`;
    const cuarto = matchMap.get(cId);
    if (cuarto) {
      const w1 = getWinner(matchMap.get(`o${i * 2 - 1}`));
      const w2 = getWinner(matchMap.get(`o${i * 2}`));
      if (w1 && (!cuarto.seed1 || cuarto.seed1.toLowerCase().includes('ganador') || cuarto.team1 === 'A definir')) {
        cuarto.team1 = w1;
      }
      if (w2 && (!cuarto.seed2 || cuarto.seed2.toLowerCase().includes('ganador') || cuarto.team2 === 'A definir')) {
        cuarto.team2 = w2;
      }
    }
  }

  // 2. De Cuartos a Semifinal
  const s1 = matchMap.get('s1');
  if (s1) {
    const w1 = getWinner(matchMap.get('c1'));
    const w2 = getWinner(matchMap.get('c2'));
    if (w1 && (!s1.seed1 || s1.seed1.toLowerCase().includes('ganador') || s1.team1 === 'A definir')) {
      s1.team1 = w1;
    }
    if (w2 && (!s1.seed2 || s1.seed2.toLowerCase().includes('ganador') || s1.team2 === 'A definir')) {
      s1.team2 = w2;
    }
  }
  const s2 = matchMap.get('s2');
  if (s2) {
    const w1 = getWinner(matchMap.get('c3'));
    const w2 = getWinner(matchMap.get('c4'));
    if (w1 && (!s2.seed1 || s2.seed1.toLowerCase().includes('ganador') || s2.team1 === 'A definir')) {
      s2.team1 = w1;
    }
    if (w2 && (!s2.seed2 || s2.seed2.toLowerCase().includes('ganador') || s2.team2 === 'A definir')) {
      s2.team2 = w2;
    }
  }

  // 3. De Semifinal a Gran Final
  const f1 = matchMap.get('f1');
  if (f1) {
    const w1 = getWinner(matchMap.get('s1'));
    const w2 = getWinner(matchMap.get('s2'));
    if (w1 && (!f1.seed1 || f1.seed1.toLowerCase().includes('ganador') || f1.team1 === 'A definir')) {
      f1.team1 = w1;
    }
    if (w2 && (!f1.seed2 || f1.seed2.toLowerCase().includes('ganador') || f1.team2 === 'A definir')) {
      f1.team2 = w2;
    }
  }

  return Array.from(matchMap.values());
}

// Sincroniza dinámicamente los cruces de PLAY-OFFS (16avos, 8vos, Cuartos, Semifinal, Final)
// a partir de los casilleros de semillas (seed1 / seed2), tablas de posiciones y avance de ganadores.
export function syncPlayoffMatches(standings: TournamentStandings): TournamentStandings {
  if (!standings) return standings;
  const currentPlayoffs = standings.playoffs || [];

  if (!standings.zones || standings.zones.length === 0) {
    return { ...standings, playoffs: advancePlayoffWinners(currentPlayoffs) };
  }

  // Si no hay cuartos definidos por defecto, proveer los cruces reglamentarios estándar
  const defaultCuartosSeeds: Record<string, { seed1: string; seed2: string; title: string }> = {
    c1: { seed1: '1ero A', seed2: '4to B', title: 'Cuartos 1 (1°A vs 4°B)' },
    c2: { seed1: '2do A', seed2: '3ro B', title: 'Cuartos 2 (2°A vs 3°B)' },
    c3: { seed1: '1ero B', seed2: '4to A', title: 'Cuartos 3 (1°B vs 4°A)' },
    c4: { seed1: '2do B', seed2: '3ro A', title: 'Cuartos 4 (2°B vs 3°A)' },
  };

  const updatedPlayoffs = currentPlayoffs.map((m) => {
    let seed1 = m.seed1;
    let seed2 = m.seed2;
    let title = m.title;

    if (!seed1 && !seed2 && defaultCuartosSeeds[m.id]) {
      seed1 = defaultCuartosSeeds[m.id].seed1;
      seed2 = defaultCuartosSeeds[m.id].seed2;
      title = defaultCuartosSeeds[m.id].title;
    }

    let team1 = m.team1;
    let team2 = m.team2;

    if (seed1 && !seed1.toLowerCase().includes('ganador')) {
      const resolved = resolvePlayoffSeed(seed1, standings.zones);
      if (resolved) team1 = resolved;
    }

    if (seed2 && !seed2.toLowerCase().includes('ganador')) {
      const resolved = resolvePlayoffSeed(seed2, standings.zones);
      if (resolved) team2 = resolved;
    }

    const teamsChanged = team1 !== m.team1 || team2 !== m.team2;

    return {
      ...m,
      title,
      seed1,
      seed2,
      team1,
      team2,
      score1: teamsChanged ? null : m.score1,
      score2: teamsChanged ? null : m.score2,
      penalties1: teamsChanged ? null : m.penalties1,
      penalties2: teamsChanged ? null : m.penalties2,
      winner: teamsChanged ? undefined : m.winner,
      status: teamsChanged ? ('programado' as const) : m.status,
    };
  });

  // Auto-propagar ganadores a las siguientes rondas
  const finalizedPlayoffs = advancePlayoffWinners(updatedPlayoffs);

  return {
    ...standings,
    playoffs: finalizedPlayoffs,
  };
}

// Generador de estructura de Play-Offs según modalidad seleccionada
export function generatePlayoffsByModality(
  standings: TournamentStandings,
  modality: PlayoffModality
): TournamentStandings {
  let list: PlayoffMatch[] = [];

  if (modality === '8vos') {
    const octavosSeeds = [
      { id: 'o1', s1: '1ero A', s2: '8vo B', title: '8vos 1 (1°A vs 8°B)' },
      { id: 'o2', s1: '4to A', s2: '5to B', title: '8vos 2 (4°A vs 5°B)' },
      { id: 'o3', s1: '2do A', s2: '7mo B', title: '8vos 3 (2°A vs 7°B)' },
      { id: 'o4', s1: '3ro A', s2: '6to B', title: '8vos 4 (3°A vs 6°B)' },
      { id: 'o5', s1: '1ero B', s2: '8vo A', title: '8vos 5 (1°B vs 8°A)' },
      { id: 'o6', s1: '4to B', s2: '5to A', title: '8vos 6 (4°B vs 5°A)' },
      { id: 'o7', s1: '2do B', s2: '7mo A', title: '8vos 7 (2°B vs 7°A)' },
      { id: 'o8', s1: '3ro B', s2: '6to A', title: '8vos 8 (3°B vs 6°A)' },
    ];
    octavosSeeds.forEach((o) => {
      list.push({
        id: o.id,
        round: '8vos',
        title: o.title,
        seed1: o.s1,
        seed2: o.s2,
        team1: 'A definir',
        team2: 'A definir',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A disputarse',
      });
    });

    for (let i = 1; i <= 4; i++) {
      list.push({
        id: `c${i}`,
        round: 'cuartos',
        title: `Cuartos ${i} (Ganador 8vos ${i * 2 - 1} vs ${i * 2})`,
        seed1: `Ganador 8vos ${i * 2 - 1}`,
        seed2: `Ganador 8vos ${i * 2}`,
        team1: 'A definir',
        team2: 'A definir',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A disputarse',
      });
    }

    list.push({
      id: 's1',
      round: 'semifinal',
      title: 'Semifinal 1 (Ganador C1 vs C2)',
      seed1: 'Ganador C1',
      seed2: 'Ganador C2',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
    list.push({
      id: 's2',
      round: 'semifinal',
      title: 'Semifinal 2 (Ganador C3 vs C4)',
      seed1: 'Ganador C3',
      seed2: 'Ganador C4',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
    list.push({
      id: 'f1',
      round: 'final',
      title: 'Gran Final del Torneo',
      seed1: 'Ganador Semi 1',
      seed2: 'Ganador Semi 2',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
  } else if (modality === 'cuartos') {
    const cuartosSeeds = [
      { id: 'c1', s1: '1ero A', s2: '4to B', title: 'Cuartos 1 (1°A vs 4°B)' },
      { id: 'c2', s1: '2do A', s2: '3ro B', title: 'Cuartos 2 (2°A vs 3°B)' },
      { id: 'c3', s1: '1ero B', s2: '4to A', title: 'Cuartos 3 (1°B vs 4°A)' },
      { id: 'c4', s1: '2do B', s2: '3ro A', title: 'Cuartos 4 (2°B vs 3°A)' },
    ];
    cuartosSeeds.forEach((c) => {
      list.push({
        id: c.id,
        round: 'cuartos',
        title: c.title,
        seed1: c.s1,
        seed2: c.s2,
        team1: 'A definir',
        team2: 'A definir',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A disputarse',
      });
    });

    list.push({
      id: 's1',
      round: 'semifinal',
      title: 'Semifinal 1 (Ganador C1 vs C2)',
      seed1: 'Ganador C1',
      seed2: 'Ganador C2',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
    list.push({
      id: 's2',
      round: 'semifinal',
      title: 'Semifinal 2 (Ganador C3 vs C4)',
      seed1: 'Ganador C3',
      seed2: 'Ganador C4',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
    list.push({
      id: 'f1',
      round: 'final',
      title: 'Gran Final del Torneo',
      seed1: 'Ganador Semi 1',
      seed2: 'Ganador Semi 2',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
  } else if (modality === 'semifinal') {
    list.push({
      id: 's1',
      round: 'semifinal',
      title: 'Semifinal 1 (1°A vs 2°B)',
      seed1: '1ero A',
      seed2: '2do B',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
    list.push({
      id: 's2',
      round: 'semifinal',
      title: 'Semifinal 2 (1°B vs 2°A)',
      seed1: '1ero B',
      seed2: '2do A',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
    list.push({
      id: 'f1',
      round: 'final',
      title: 'Gran Final del Torneo',
      seed1: 'Ganador Semi 1',
      seed2: 'Ganador Semi 2',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
  } else if (modality === 'final') {
    list.push({
      id: 'f1',
      round: 'final',
      title: 'Gran Final del Torneo (1°A vs 1°B)',
      seed1: '1ero A',
      seed2: '1ero B',
      team1: 'A definir',
      team2: 'A definir',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'A disputarse',
    });
  } else if (modality === 'none') {
    list = [];
  }

  const updated: TournamentStandings = {
    ...standings,
    playoffModality: modality,
    playoffs: list,
  };

  return syncPlayoffMatches(updated);
}

// Alias para compatibilidad hacia atrás
export const syncPlayoffQuarterfinals = syncPlayoffMatches;

// Datos iniciales auténticos para la Liga Regional y Blanco y Negro
const rawDefaultStandings: TournamentStandings = {
  year: '2026',
  torneo: 'apertura',
  categoria: 'mayor',
  zones: [
    {
      id: 'zona-a',
      name: 'Zona A',
      teams: [
        {
          id: 'san-martin',
          pos: 1,
          name: 'San Martín',
          logoUrl: '/teams/San Martin.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['W', 'D', 'W', 'W', 'W'],
          qualified: true,
        },
        {
          id: 'eduardo-hertz',
          pos: 2,
          name: 'Eduardo Hertz',
          logoUrl: '/teams/Eduardo Hertz.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['L', 'L', 'D', 'L', 'L'],
          qualified: true,
        },
        {
          id: 'argentino-firmat',
          pos: 3,
          name: 'Argentino de Firmat',
          logoUrl: '/teams/Argentino de Firmat.png',
          pj: 1,
          pg: 0,
          pe: 0,
          pp: 1,
          gf: 0,
          gc: 2,
          dif: -2,
          pts: 0,
          form: ['L'],
          qualified: true,
        },
        {
          id: 'los-andes',
          pos: 4,
          name: 'Los Andes',
          logoUrl: '/teams/Los Andes.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: true,
        },
        {
          id: 'sportivo-bombal',
          pos: 5,
          name: 'Sportivo Bombal',
          logoUrl: '/teams/Sportivo Bombal.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'italo-argentino',
          pos: 6,
          name: 'Ítalo Argentino',
          logoUrl: '/teams/Italo Argentino.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'sporting-bigand',
          pos: 7,
          name: 'Sporting de Bigand',
          logoUrl: '/teams/Sporting de Bigan.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'miguel-torres',
          pos: 8,
          name: 'Miguel Torres',
          logoUrl: '/teams/Miguel Torres.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'olimpia-st',
          pos: 9,
          name: 'Olimpia de Santa Teresa',
          logoUrl: '/teams/Olimpia de Santa Teresa.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'fredriksson',
          pos: 10,
          name: 'Fredriksson',
          logoUrl: '/teams/Fredriksson.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
      ],
      fixtures: [
        {
          id: 'fix-a-1',
          roundName: 'Fecha 1',
          homeTeamId: 'san-martin',
          homeTeamName: 'San Martín',
          awayTeamId: 'argentino-firmat',
          awayTeamName: 'Argentino de Firmat',
          homeGoals: 2,
          awayGoals: 0,
        },
      ],
    },
    {
      id: 'zona-b',
      name: 'Zona B',
      teams: [
        {
          id: 'hughes',
          pos: 1,
          name: 'Hughes',
          logoUrl: '/teams/Hughes.png',
          pj: 1,
          pg: 1,
          pe: 0,
          pp: 0,
          gf: 2,
          gc: 1,
          dif: 1,
          pts: 3,
          form: ['W'],
          qualified: true,
        },
        {
          id: 'nuevo-alberdi',
          pos: 2,
          name: 'Nuevo Alberdi',
          logoUrl: '/teams/Nuevo Alberdi.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D', 'W', 'L', 'L', 'D'],
          qualified: true,
        },
        {
          id: 'independiente-bigand',
          pos: 3,
          name: 'Independiente de Bigand',
          logoUrl: '/teams/Independiente de Bigan.png',
          pj: 1,
          pg: 0,
          pe: 0,
          pp: 1,
          gf: 1,
          gc: 2,
          dif: -1,
          pts: 0,
          form: ['L'],
          qualified: true,
        },
        {
          id: 'byn',
          pos: 4,
          name: 'Blanco y Negro',
          logoUrl: '/teams/Blanco y Negro.png',
          isBlancoYNegro: true,
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: true,
        },
        {
          id: 'carreras',
          pos: 5,
          name: 'Carreras',
          logoUrl: '/teams/Carreras.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'firmat-fbc',
          pos: 6,
          name: 'Firmat FBC',
          logoUrl: '/teams/Firmat FBC.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'atletico-acebal',
          pos: 7,
          name: 'Atlético Acebal',
          logoUrl: '/teams/Atletico Acebal.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'atletico-paz',
          pos: 8,
          name: 'Atlético Paz',
          logoUrl: '/teams/Atletico Paz.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'bombal-juniors',
          pos: 9,
          name: 'Bombal Juniors',
          logoUrl: '/teams/Bombal Juniors.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
        {
          id: 'bernardino-rivadavia',
          pos: 10,
          name: 'Bernardino Rivadavia',
          logoUrl: '/teams/Bernardino Rivadavia.png',
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['D'],
          qualified: false,
        },
      ],
      fixtures: [
        {
          id: 'fix-b-1',
          roundName: 'Fecha 1',
          homeTeamId: 'hughes',
          homeTeamName: 'Hughes',
          awayTeamId: 'independiente-bigand',
          awayTeamName: 'Independiente de Bigand',
          homeGoals: 2,
          awayGoals: 1,
        },
      ],
    },
  ],
  playoffs: [
    {
      id: 'c1',
      round: 'cuartos',
      title: 'Cuartos 1',
      team1: 'Blanco y Negro',
      team2: 'Independiente de Bigand',
      score1: 3,
      score2: 1,
      winner: 1,
      status: 'finalizado',
      dateInfo: 'Ida: 2-0 | Vuelta: 1-1',
    },
    {
      id: 'c2',
      round: 'cuartos',
      title: 'Cuartos 2',
      team1: 'San Martín',
      team2: 'Ítalo Argentino',
      score1: 2,
      score2: 0,
      winner: 1,
      status: 'finalizado',
      dateInfo: 'Finalizado',
    },
    {
      id: 'c3',
      round: 'cuartos',
      title: 'Cuartos 3',
      team1: 'Hughes',
      team2: 'Firmat FBC',
      score1: 1,
      score2: 2,
      winner: 2,
      status: 'finalizado',
      dateInfo: 'Definido por penales (4-5)',
    },
    {
      id: 'c4',
      round: 'cuartos',
      title: 'Cuartos 4',
      team1: 'Los Andes',
      team2: 'Argentino de Firmat',
      score1: 2,
      score2: 1,
      winner: 1,
      status: 'finalizado',
      dateInfo: 'Finalizado',
    },
    {
      id: 's1',
      round: 'semifinal',
      title: 'Semifinal 1',
      team1: 'Blanco y Negro',
      team2: 'Firmat FBC',
      score1: 2,
      score2: 0,
      winner: 1,
      status: 'finalizado',
      dateInfo: 'Global 3-1',
    },
    {
      id: 's2',
      round: 'semifinal',
      title: 'Semifinal 2',
      team1: 'San Martín',
      team2: 'Hughes',
      score1: 2,
      score2: 1,
      winner: 1,
      status: 'finalizado',
      dateInfo: 'Global 3-2',
    },
    {
      id: 'f1',
      round: 'final',
      title: 'Gran Final del Torneo',
      team1: 'Blanco y Negro',
      team2: 'San Martín',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'Próximo Domingo 16:30 hs • En vivo en Pasión Lomonegra',
    },
  ],
  // Goleadores EXCLUSIVOS del Club Atlético Blanco y Negro divididos por categoría (sin partidos jugados)
  goleadores: [
    // Fútbol Mayor
    {
      id: 'g1',
      pos: 1,
      name: 'Gonzalo Cendra',
      category: 'Fútbol Mayor',
      goals: 9,
    },
    {
      id: 'g2',
      pos: 2,
      name: 'Facundo Sánchez',
      category: 'Fútbol Mayor',
      goals: 7,
    },
    {
      id: 'g3',
      pos: 3,
      name: 'Joaquín Kraft',
      category: 'Fútbol Mayor',
      goals: 5,
    },
    // Reserva
    {
      id: 'g4',
      pos: 1,
      name: 'Lucas Balvidares',
      category: 'Reserva',
      goals: 6,
    },
    {
      id: 'g5',
      pos: 2,
      name: 'Benjamín Schtreimbuger',
      category: 'Reserva',
      goals: 4,
    },
    {
      id: 'g6',
      pos: 3,
      name: 'Santiago Echeverría',
      category: 'Reserva',
      goals: 3,
    },
    // Tercera División
    {
      id: 'g7',
      pos: 1,
      name: 'Tomás Graff',
      category: 'Tercera División',
      goals: 5,
    },
    {
      id: 'g8',
      pos: 2,
      name: 'Mateo Rohwein',
      category: 'Tercera División',
      goals: 3,
    },
    // Cuarta División
    {
      id: 'g9',
      pos: 1,
      name: 'Ignacio Weimann',
      category: 'Cuarta División',
      goals: 4,
    },
    {
      id: 'g10',
      pos: 2,
      name: 'Bautista Graff',
      category: 'Cuarta División',
      goals: 3,
    },
    // Quinta División
    {
      id: 'g11',
      pos: 1,
      name: 'Thiago Meier',
      category: 'Quinta División',
      goals: 5,
    },
    {
      id: 'g12',
      pos: 2,
      name: 'Valentín Schmidt',
      category: 'Quinta División',
      goals: 4,
    },
  ],
};

// Generar todas las fechas del torneo Apertura (fixture completo de 9 fechas) desde el inicio
rawDefaultStandings.zones = rawDefaultStandings.zones.map((z) => ({
  ...z,
  fixtures: generateFullRoundRobinFixture(z, z.fixtures),
}));

export const defaultAperturaStandings: TournamentStandings = syncPlayoffQuarterfinals(rawDefaultStandings);

// Estructura oficial limpia para el Torneo Clausura con fixture oficial LDDS de 11 fechas e interzonales
const rawClausuraStandings: TournamentStandings = {
  ...JSON.parse(JSON.stringify(rawDefaultStandings)),
  torneo: 'clausura',
  zones: [
    {
      id: 'zona-a',
      name: 'Zona A',
      teams: CLAUSURA_TEAMS_ZONA_A as TeamStandingsRow[],
      fixtures: officialClausuraFixturesZonaA as FixtureMatch[],
    },
    {
      id: 'zona-b',
      name: 'Zona B',
      teams: CLAUSURA_TEAMS_ZONA_B as TeamStandingsRow[],
      fixtures: officialClausuraFixturesZonaB as FixtureMatch[],
    },
  ],
};

rawClausuraStandings.playoffs = rawClausuraStandings.playoffs.map((p) => ({
  ...p,
  score1: null,
  score2: null,
  penalties1: null,
  penalties2: null,
  winner: undefined,
  status: 'programado',
}));

export const defaultClausuraStandings: TournamentStandings = syncPlayoffQuarterfinals(rawClausuraStandings);
export const defaultStandings: TournamentStandings = defaultAperturaStandings;

// Almacén en memoria global para el servidor Next.js con soporte multi-deporte y categorías
declare global {
  // eslint-disable-next-line no-var
  var globalTournamentsStore: Record<string, TournamentStandings> | undefined;
}

export function createDefaultStandings(
  deporte: DeporteType = 'futbol',
  categoria: CategoriaType = 'mayor',
  torneo: TorneoType = 'apertura'
): TournamentStandings {
  const normTorneo: TorneoType = torneo === 'clausura' || torneo === 'segundo' ? 'clausura' : 'apertura';

  // Fútbol Mayor
  if (deporte === 'futbol' && (categoria === 'mayor' || !categoria)) {
    return normTorneo === 'clausura' ? defaultClausuraStandings : defaultAperturaStandings;
  }

  // Fútbol Formativas (Reserva, Tercera, Cuarta, Quinta)
  if (deporte === 'futbol') {
    const base = JSON.parse(JSON.stringify(normTorneo === 'clausura' ? defaultClausuraStandings : defaultAperturaStandings));
    base.deporte = 'futbol';
    base.categoria = categoria;
    base.torneo = normTorneo;
    base.goleadores = [];
    return syncPlayoffMatches(base);
  }

  // Hockey (Primera División, Reserva, Sub-18, Sub-16, Sub-14, Sub-12)
  const hockeyTeamsA: TeamStandingsRow[] = [
    { id: 'h-byn', pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['W', 'W', 'W'], qualified: true, logoUrl: '/teams/Blanco y Negro.png' },
    { id: 'h-san-martin', pos: 2, name: 'San Martín', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['W'], qualified: true, logoUrl: '/teams/San Martin.png' },
    { id: 'h-argentino-firmat', pos: 3, name: 'Argentino de Firmat', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['D'], qualified: true, logoUrl: '/teams/Argentino de Firmat.png' },
    { id: 'h-los-andes', pos: 4, name: 'Los Andes', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['D'], qualified: true, logoUrl: '/teams/Los Andes.png' },
    { id: 'h-sportivo-bombal', pos: 5, name: 'Sportivo Bombal', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['D'], qualified: false, logoUrl: '/teams/Sportivo Bombal.png' },
  ];

  const hockeyTeamsB: TeamStandingsRow[] = [
    { id: 'h-firmat-fbc', pos: 1, name: 'Firmat FBC', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['W'], qualified: true, logoUrl: '/teams/Firmat FBC.png' },
    { id: 'h-hughes', pos: 2, name: 'Hughes', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['D'], qualified: true, logoUrl: '/teams/Hughes.png' },
    { id: 'h-sporting-bigand', pos: 3, name: 'Sporting de Bigand', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['D'], qualified: true, logoUrl: '/teams/Sporting de Bigan.png' },
    { id: 'h-atletico-acebal', pos: 4, name: 'Atlético Acebal', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['D'], qualified: true, logoUrl: '/teams/Atletico Acebal.png' },
    { id: 'h-carreras', pos: 5, name: 'Carreras', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: ['D'], qualified: false, logoUrl: '/teams/Carreras.png' },
  ];

  const zoneA: ZoneData = {
    id: 'hockey-zona-a',
    name: 'Zona A',
    teams: hockeyTeamsA,
  };
  zoneA.fixtures = generateFullRoundRobinFixture(zoneA);

  const zoneB: ZoneData = {
    id: 'hockey-zona-b',
    name: 'Zona B',
    teams: hockeyTeamsB,
  };
  zoneB.fixtures = generateFullRoundRobinFixture(zoneB);

  const hockeyStandings: TournamentStandings = {
    year: '2026',
    torneo: normTorneo,
    deporte: 'hockey',
    categoria: categoria || 'primera_hockey',
    playoffModality: 'cuartos',
    zones: [zoneA, zoneB],
    playoffs: [],
    goleadores: [
      { id: 'hg1', pos: 1, name: 'Delfina Meier', category: 'Hockey Femenino', goals: 6 },
      { id: 'hg2', pos: 2, name: 'Micaela Schmidt', category: 'Hockey Femenino', goals: 4 },
    ],
  };

  return generatePlayoffsByModality(hockeyStandings, 'cuartos');
}

export const defaultHockeyStandings: TournamentStandings = createDefaultStandings('hockey', 'primera_hockey', 'apertura');




