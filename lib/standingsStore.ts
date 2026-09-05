// Almacén central de datos deportivos estilo Promiedos.com.ar
// Soporta División en 2 o más Zonas, Llaves de Play-offs y Goleadores de Blanco y Negro

export type TorneoType = 'primer' | 'segundo';
export type CategoriaType = 'mayor' | 'reserva' | 'tercera' | 'cuarta' | 'quinta';

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
  qualified?: boolean; // Clasificado a Play-Offs (barra verde Promiedos)
}

// Mapeo exhaustivo de escudos y equipos reales presentes en la carpeta public/teams/
export const TEAM_LOGOS: Record<string, string> = {
  'blanco y negro': '/teams/Blanco y Negro.png',
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
  'independiente de bigand': '/teams/Independiente de Bigan.png',
  'independiente de bigan': '/teams/Independiente de Bigan.png',
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
  round: 'cuartos' | 'semifinal' | 'final';
  title: string; // ej: "Cuartos 1", "Semifinal A", "Gran Final"
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

// Datos iniciales auténticos para la Liga Regional y Blanco y Negro
export const defaultStandings: TournamentStandings = {
  year: '2026',
  torneo: 'primer',
  categoria: 'mayor',
  zones: [
    {
      id: 'zona-a',
      name: 'Zona A',
      teams: [
        {
          id: 'byn',
          pos: 1,
          name: 'Blanco y Negro',
          logoUrl: '/teams/Blanco y Negro.png',
          isBlancoYNegro: true,
          pj: 10,
          pg: 8,
          pe: 1,
          pp: 1,
          gf: 23,
          gc: 7,
          dif: 16,
          pts: 25,
          form: ['W', 'W', 'W', 'D', 'W'],
          qualified: true,
        },
        {
          id: 'san-martin',
          pos: 2,
          name: 'San Martín',
          logoUrl: '/teams/San Martin.png',
          pj: 10,
          pg: 7,
          pe: 2,
          pp: 1,
          gf: 20,
          gc: 9,
          dif: 11,
          pts: 23,
          form: ['W', 'D', 'W', 'W', 'W'],
          qualified: true,
        },
        {
          id: 'firmat-fbc',
          pos: 3,
          name: 'Firmat FBC',
          logoUrl: '/teams/Firmat FBC.png',
          pj: 10,
          pg: 6,
          pe: 2,
          pp: 2,
          gf: 17,
          gc: 10,
          dif: 7,
          pts: 20,
          form: ['D', 'W', 'W', 'L', 'W'],
          qualified: true,
        },
        {
          id: 'argentino-firmat',
          pos: 4,
          name: 'Argentino de Firmat',
          logoUrl: '/teams/Argentino de Firmat.png',
          pj: 10,
          pg: 5,
          pe: 2,
          pp: 3,
          gf: 15,
          gc: 11,
          dif: 4,
          pts: 17,
          form: ['W', 'D', 'D', 'W', 'L'],
          qualified: true,
        },
        {
          id: 'atletico-acebal',
          pos: 5,
          name: 'Atlético Acebal',
          logoUrl: '/teams/Atletico Acebal.png',
          pj: 10,
          pg: 4,
          pe: 3,
          pp: 3,
          gf: 13,
          gc: 12,
          dif: 1,
          pts: 15,
          form: ['L', 'D', 'W', 'W', 'D'],
          qualified: false,
        },
        {
          id: 'atletico-paz',
          pos: 6,
          name: 'Atlético Paz',
          logoUrl: '/teams/Atletico Paz.png',
          pj: 10,
          pg: 3,
          pe: 3,
          pp: 4,
          gf: 12,
          gc: 14,
          dif: -2,
          pts: 12,
          form: ['L', 'W', 'L', 'D', 'D'],
          qualified: false,
        },
        {
          id: 'bernardino-rivadavia',
          pos: 7,
          name: 'Bernardino Rivadavia',
          logoUrl: '/teams/Bernardino Rivadavia.png',
          pj: 10,
          pg: 3,
          pe: 2,
          pp: 5,
          gf: 11,
          gc: 15,
          dif: -4,
          pts: 11,
          form: ['W', 'L', 'L', 'D', 'L'],
          qualified: false,
        },
        {
          id: 'bombal-juniors',
          pos: 8,
          name: 'Bombal Juniors',
          logoUrl: '/teams/Bombal Juniors.png',
          pj: 10,
          pg: 2,
          pe: 3,
          pp: 5,
          gf: 9,
          gc: 16,
          dif: -7,
          pts: 9,
          form: ['L', 'D', 'L', 'L', 'W'],
          qualified: false,
        },
        {
          id: 'carreras',
          pos: 9,
          name: 'Carreras',
          logoUrl: '/teams/Carreras.png',
          pj: 10,
          pg: 2,
          pe: 1,
          pp: 7,
          gf: 8,
          gc: 19,
          dif: -11,
          pts: 7,
          form: ['L', 'L', 'W', 'L', 'L'],
          qualified: false,
        },
        {
          id: 'eduardo-hertz',
          pos: 10,
          name: 'Eduardo Hertz',
          logoUrl: '/teams/Eduardo Hertz.png',
          pj: 10,
          pg: 1,
          pe: 2,
          pp: 7,
          gf: 6,
          gc: 21,
          dif: -15,
          pts: 5,
          form: ['L', 'L', 'D', 'L', 'L'],
          qualified: false,
        },
      ],
      fixtures: [
        {
          id: 'fix-a-1',
          roundName: 'Fecha 1',
          homeTeamId: 'byn',
          homeTeamName: 'Blanco y Negro',
          awayTeamId: 'san-martin',
          awayTeamName: 'San Martín',
          homeGoals: 3,
          awayGoals: 1,
        },
        {
          id: 'fix-a-2',
          roundName: 'Fecha 1',
          homeTeamId: 'firmat-fbc',
          homeTeamName: 'Firmat FBC',
          awayTeamId: 'argentino-firmat',
          awayTeamName: 'Argentino de Firmat',
          homeGoals: 2,
          awayGoals: 0,
        },
        {
          id: 'fix-a-3',
          roundName: 'Fecha 1',
          homeTeamId: 'atletico-acebal',
          homeTeamName: 'Atlético Acebal',
          awayTeamId: 'atletico-paz',
          awayTeamName: 'Atlético Paz',
          homeGoals: 1,
          awayGoals: 1,
        },
        {
          id: 'fix-a-4',
          roundName: 'Fecha 2',
          homeTeamId: 'bernardino-rivadavia',
          homeTeamName: 'Bernardino Rivadavia',
          awayTeamId: 'byn',
          awayTeamName: 'Blanco y Negro',
          homeGoals: 0,
          awayGoals: 2,
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
          pj: 10,
          pg: 7,
          pe: 2,
          pp: 1,
          gf: 21,
          gc: 8,
          dif: 13,
          pts: 23,
          form: ['W', 'W', 'D', 'W', 'W'],
          qualified: true,
        },
        {
          id: 'independiente-bigand',
          pos: 2,
          name: 'Independiente de Bigand',
          logoUrl: '/teams/Independiente de Bigan.png',
          pj: 10,
          pg: 6,
          pe: 2,
          pp: 2,
          gf: 18,
          gc: 10,
          dif: 8,
          pts: 20,
          form: ['W', 'L', 'W', 'W', 'D'],
          qualified: true,
        },
        {
          id: 'italo-argentino',
          pos: 3,
          name: 'Ítalo Argentino',
          logoUrl: '/teams/Italo Argentino.png',
          pj: 10,
          pg: 5,
          pe: 3,
          pp: 2,
          gf: 15,
          gc: 11,
          dif: 4,
          pts: 18,
          form: ['D', 'W', 'W', 'D', 'L'],
          qualified: true,
        },
        {
          id: 'los-andes',
          pos: 4,
          name: 'Los Andes',
          logoUrl: '/teams/Los Andes.png',
          pj: 10,
          pg: 4,
          pe: 3,
          pp: 3,
          gf: 14,
          gc: 12,
          dif: 2,
          pts: 15,
          form: ['L', 'W', 'D', 'W', 'W'],
          qualified: true,
        },
        {
          id: 'miguel-torres',
          pos: 5,
          name: 'Miguel Torres',
          logoUrl: '/teams/Miguel Torres.png',
          pj: 10,
          pg: 4,
          pe: 2,
          pp: 4,
          gf: 13,
          gc: 14,
          dif: -1,
          pts: 14,
          form: ['W', 'L', 'W', 'D', 'L'],
          qualified: false,
        },
        {
          id: 'nuevo-alberdi',
          pos: 6,
          name: 'Nuevo Alberdi',
          logoUrl: '/teams/Nuevo Alberdi.png',
          pj: 10,
          pg: 3,
          pe: 3,
          pp: 4,
          gf: 12,
          gc: 15,
          dif: -3,
          pts: 12,
          form: ['D', 'W', 'L', 'L', 'D'],
          qualified: false,
        },
        {
          id: 'olimpia-st',
          pos: 7,
          name: 'Olimpia de Santa Teresa',
          logoUrl: '/teams/Olimpia de Santa Teresa.png',
          pj: 10,
          pg: 3,
          pe: 2,
          pp: 5,
          gf: 11,
          gc: 16,
          dif: -5,
          pts: 11,
          form: ['W', 'L', 'L', 'D', 'W'],
          qualified: false,
        },
        {
          id: 'sporting-bigand',
          pos: 8,
          name: 'Sporting de Bigand',
          logoUrl: '/teams/Sporting de Bigan.png',
          pj: 10,
          pg: 2,
          pe: 3,
          pp: 5,
          gf: 10,
          gc: 16,
          dif: -6,
          pts: 9,
          form: ['L', 'D', 'W', 'L', 'L'],
          qualified: false,
        },
        {
          id: 'sportivo-bombal',
          pos: 9,
          name: 'Sportivo Bombal',
          logoUrl: '/teams/Sportivo Bombal.png',
          pj: 10,
          pg: 2,
          pe: 2,
          pp: 6,
          gf: 9,
          gc: 18,
          dif: -9,
          pts: 8,
          form: ['L', 'L', 'D', 'W', 'L'],
          qualified: false,
        },
        {
          id: 'fredriksson',
          pos: 10,
          name: 'Fredriksson',
          logoUrl: '/teams/Fredriksson.png',
          pj: 10,
          pg: 1,
          pe: 2,
          pp: 7,
          gf: 7,
          gc: 21,
          dif: -14,
          pts: 5,
          form: ['L', 'L', 'D', 'L', 'L'],
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
        {
          id: 'fix-b-2',
          roundName: 'Fecha 1',
          homeTeamId: 'italo-argentino',
          homeTeamName: 'Ítalo Argentino',
          awayTeamId: 'los-andes',
          awayTeamName: 'Los Andes',
          homeGoals: 1,
          awayGoals: 1,
        },
        {
          id: 'fix-b-3',
          roundName: 'Fecha 1',
          homeTeamId: 'miguel-torres',
          homeTeamName: 'Miguel Torres',
          awayTeamId: 'nuevo-alberdi',
          awayTeamName: 'Nuevo Alberdi',
          homeGoals: 2,
          awayGoals: 0,
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

// Almacén en memoria global para el servidor Next.js
declare global {
  // eslint-disable-next-line no-var
  var globalStandingsStore: TournamentStandings | undefined;
}

if (!globalThis.globalStandingsStore) {
  globalThis.globalStandingsStore = { ...defaultStandings };
}

export function getStandings(): TournamentStandings {
  return globalThis.globalStandingsStore || defaultStandings;
}

export function updateStandings(newStandings: Partial<TournamentStandings>): TournamentStandings {
  if (!globalThis.globalStandingsStore) {
    globalThis.globalStandingsStore = { ...defaultStandings };
  }
  globalThis.globalStandingsStore = {
    ...globalThis.globalStandingsStore,
    ...newStandings,
  };
  return globalThis.globalStandingsStore;
}

export function resetStandings(): TournamentStandings {
  globalThis.globalStandingsStore = JSON.parse(JSON.stringify(defaultStandings));
  return globalThis.globalStandingsStore!;
}
