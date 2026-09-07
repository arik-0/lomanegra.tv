// Almacén central de datos deportivos de la Liga Deportiva del Sur
// Soporta División en Zonas, Llaves de Play-offs (16avos, 8vos, Cuartos, Semis, Final) y Goleadores

export type TorneoType = 'apertura' | 'clausura' | 'primer' | 'segundo';
export type CategoriaType = 'mayor' | 'reserva' | 'tercera' | 'cuarta' | 'quinta';
export type PlayoffRound = '16avos' | '8vos' | 'cuartos' | 'semifinal' | 'final';

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

// Mapeo exhaustivo de escudos y equipos reales presentes en la carpeta public/teams/
export const TEAM_LOGOS: Record<string, string> = {
  'blanco y negro': '/teams/Blanco y Negro.png',
  'byd': '/teams/Blanco y Negro.png',
  'byn': '/teams/Blanco y Negro.png',
  'san martín': '/teams/San Martin.png',
  'san martin': '/teams/San Martin.png',
  'firmat fbc': '/teams/Firmat FBC.png',
  'firmat': '/teams/Firmat FBC.png',
  'argentino de firmat': '/teams/Argentino de Firmat.png',
  'atlético acebal': '/teams/Atletico Acebal.png',
  'atletico acebal': '/teams/Atletico Acebal.png',
  'atlético paz': '/teams/Atletico Paz.png',
  'atletico paz': '/teams/Atletico Paz.png',
  'bernardino rivadavia': '/teams/Bernardino Rivadavia.png',
  'bombal juniors': '/teams/Bombal Juniors.png',
  'carreras': '/teams/Carreras.png',
  'eduardo hertz': '/teams/Eduardo Hertz.png',
  'fredriksson': '/teams/Fredriksson.png',
  'hughes': '/teams/Hughes.png',
  'independiente de bigand': '/teams/ifc.png',
  'independiente de bigan': '/teams/ifc.png',
  'independiente fútbol club': '/teams/ifc.png',
  'independiente futbol club': '/teams/ifc.png',
  'independiente': '/teams/ifc.png',
  'i. f. c.': '/teams/ifc.png',
  'i.f.c.': '/teams/ifc.png',
  'ifc': '/teams/ifc.png',
  'i f c': '/teams/ifc.png',
  'ítalo argentino': '/teams/Italo Argentino.png',
  'italo argentino': '/teams/Italo Argentino.png',
  'los andes': '/teams/Los Andes.png',
  'miguel torres': '/teams/Miguel Torres.png',
  'nuevo alberdi': '/teams/Nuevo Alberdi.png',
  'olimpia de santa teresa': '/teams/Olimpia de Santa Teresa.png',
  'sporting de bigand': '/teams/Sporting de Bigan.png',
  'sporting de bigan': '/teams/Sporting de Bigan.png',
  'sportivo bombal': '/teams/Sportivo Bombal.png',
};

export function getTeamLogo(teamName: string): string {
  if (!teamName) return '/teams/Blanco y Negro.png';
  const clean = teamName.toLowerCase().trim();
  const normalized = clean.replace(/\./g, '').replace(/\s+/g, ' ').trim();

  // Mapeo directo para I. F. C. (Independiente)
  if (
    normalized === 'ifc' ||
    normalized === 'i f c' ||
    clean.includes('ifc') ||
    clean.includes('i. f. c') ||
    clean.includes('i.f.c') ||
    clean.includes('independiente')
  ) {
    return '/teams/ifc.png';
  }

  // Mapeo directo para Blanco y Negro / ByD
  if (clean.includes('blanco y negro') || clean === 'byd' || clean === 'byn') {
    return '/teams/Blanco y Negro.png';
  }

  for (const [key, path] of Object.entries(TEAM_LOGOS)) {
    if (clean === key || clean.includes(key) || key.includes(clean)) {
      return path;
    }
  }
  return '/teams/Blanco y Negro.png';
}

export interface FixtureMatch {
  id: string;
  roundName?: string; // ej: "Fecha 1", "Fecha 2", etc.
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
  categoria: CategoriaType;
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
    statsMap[t.name.trim().toLowerCase()] = {
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
    const homeKey = fix.homeTeamName.trim().toLowerCase();
    const awayKey = fix.awayTeamName.trim().toLowerCase();
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

// Sincroniza dinámicamente los cruces de PLAY-OFFS (16avos, 8vos, Cuartos, Semifinal, Final)
// a partir de los casilleros de semillas (seed1 / seed2) y las tablas de posiciones de las zonas.
export function syncPlayoffMatches(standings: TournamentStandings): TournamentStandings {
  if (!standings || !standings.zones || standings.zones.length === 0) return standings;

  const currentPlayoffs = standings.playoffs || [];

  // Si no hay cuartos definidos por defecto, proveer los cruces reglamentarios estándar
  const defaultCuartosSeeds: Record<string, { seed1: string; seed2: string; title: string }> = {
    c1: { seed1: '1ero A', seed2: '4to B', title: 'Cuartos 1 (1°A vs 4°B)' },
    c2: { seed1: '2do A', seed2: '3ro B', title: 'Cuartos 2 (2°A vs 3°B)' },
    c3: { seed1: '1ero B', seed2: '4to A', title: 'Cuartos 3 (1°B vs 4°A)' },
    c4: { seed1: '2do B', seed2: '3ro A', title: 'Cuartos 4 (2°B vs 3°A)' },
  };

  const updatedPlayoffs = currentPlayoffs.map((m) => {
    // Si no tiene semillas asignadas y es un cuarto estándar, asignarlas
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

    if (seed1) {
      const resolved = resolvePlayoffSeed(seed1, standings.zones);
      if (resolved) team1 = resolved;
    }

    if (seed2) {
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

  return {
    ...standings,
    playoffs: updatedPlayoffs,
  };
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

// Estructura oficial limpia para el Torneo Clausura (equipos invertidos en localía para la segunda mitad del año)
const rawClausuraStandings: TournamentStandings = {
  ...JSON.parse(JSON.stringify(rawDefaultStandings)),
  torneo: 'clausura',
};

rawClausuraStandings.zones = rawClausuraStandings.zones.map((z) => ({
  ...z,
  teams: z.teams.map((t, idx) => ({
    ...t,
    pj: 0,
    pg: 0,
    pe: 0,
    pp: 0,
    gf: 0,
    gc: 0,
    dif: 0,
    pts: 0,
    pos: idx + 1,
    form: [],
    qualified: idx < 4,
  })),
  fixtures: (z.fixtures || []).map((f) => ({
    ...f,
    homeTeamId: f.awayTeamId,
    homeTeamName: f.awayTeamName,
    awayTeamId: f.homeTeamId,
    awayTeamName: f.homeTeamName,
    homeGoals: null,
    awayGoals: null,
  })),
}));

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

// Almacén en memoria global para el servidor Next.js con soporte Apertura / Clausura
declare global {
  // eslint-disable-next-line no-var
  var globalTournamentsStore: {
    apertura: TournamentStandings;
    clausura: TournamentStandings;
  } | undefined;
}

export function normalizeTorneoKey(torneo?: string): 'apertura' | 'clausura' {
  if (!torneo) return 'apertura';
  const clean = torneo.toLowerCase().trim();
  if (clean === 'clausura' || clean === 'segundo') return 'clausura';
  return 'apertura';
}



