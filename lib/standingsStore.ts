// Almacén central de datos deportivos estilo Promiedos.com.ar
// Soporta División en 2 o más Zonas, Llaves de Play-offs y Goleadores de Blanco y Negro

export type TorneoType = 'primer' | 'segundo';
export type CategoriaType = 'mayor' | 'reserva' | 'tercera' | 'cuarta' | 'quinta';

export interface TeamStandingsRow {
  id: string;
  pos: number;
  name: string;
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

export interface ZoneData {
  id: string;
  name: string; // ej: "Zona A", "Zona B"
  teams: TeamStandingsRow[];
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
  matchesPlayed?: number;
}

export interface TournamentStandings {
  year: string;
  torneo: TorneoType;
  categoria: CategoriaType;
  zones: ZoneData[];
  playoffs: PlayoffMatch[];
  goleadores: GoleadorRow[];
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
          id: 'sarmiento',
          pos: 2,
          name: 'Deportivo Sarmiento',
          pj: 10,
          pg: 7,
          pe: 2,
          pp: 1,
          gf: 19,
          gc: 9,
          dif: 10,
          pts: 23,
          form: ['W', 'D', 'W', 'W', 'W'],
          qualified: true,
        },
        {
          id: 'boca-suarez',
          pos: 3,
          name: 'Boca Juniors (Suárez)',
          pj: 10,
          pg: 5,
          pe: 3,
          pp: 2,
          gf: 16,
          gc: 11,
          dif: 5,
          pts: 18,
          form: ['D', 'W', 'W', 'L', 'W'],
          qualified: true,
        },
        {
          id: 'san-martin',
          pos: 4,
          name: 'San Martín (Santa Trinidad)',
          pj: 10,
          pg: 4,
          pe: 4,
          pp: 2,
          gf: 15,
          gc: 12,
          dif: 3,
          pts: 16,
          form: ['W', 'D', 'D', 'W', 'L'],
          qualified: true,
        },
        {
          id: 'tiro-puan',
          pos: 5,
          name: 'Tiro Federal (Puan)',
          pj: 10,
          pg: 3,
          pe: 3,
          pp: 4,
          gf: 11,
          gc: 14,
          dif: -3,
          pts: 12,
          form: ['L', 'D', 'L', 'W', 'D'],
          qualified: false,
        },
        {
          id: 'penarol-pigue',
          pos: 6,
          name: 'Peñarol (Pigüé)',
          pj: 10,
          pg: 2,
          pe: 2,
          pp: 6,
          gf: 9,
          gc: 17,
          dif: -8,
          pts: 8,
          form: ['L', 'W', 'L', 'L', 'D'],
          qualified: false,
        },
      ],
    },
    {
      id: 'zona-b',
      name: 'Zona B',
      teams: [
        {
          id: 'ifc',
          pos: 1,
          name: 'I. F. C.',
          pj: 10,
          pg: 7,
          pe: 2,
          pp: 1,
          gf: 20,
          gc: 8,
          dif: 12,
          pts: 23,
          form: ['W', 'W', 'D', 'W', 'W'],
          qualified: true,
        },
        {
          id: 'racing-carhue',
          pos: 2,
          name: 'Racing Club (Carhué)',
          pj: 10,
          pg: 6,
          pe: 2,
          pp: 2,
          gf: 17,
          gc: 10,
          dif: 7,
          pts: 20,
          form: ['W', 'L', 'W', 'W', 'D'],
          qualified: true,
        },
        {
          id: 'el-progreso',
          pos: 3,
          name: 'El Progreso (Santa María)',
          pj: 10,
          pg: 5,
          pe: 3,
          pp: 2,
          gf: 14,
          gc: 11,
          dif: 3,
          pts: 18,
          form: ['D', 'W', 'W', 'D', 'L'],
          qualified: true,
        },
        {
          id: 'independiente-sj',
          pos: 4,
          name: 'Independiente (San José)',
          pj: 10,
          pg: 4,
          pe: 3,
          pp: 3,
          gf: 15,
          gc: 13,
          dif: 2,
          pts: 15,
          form: ['L', 'W', 'D', 'W', 'W'],
          qualified: true,
        },
        {
          id: 'club-sarmiento',
          pos: 5,
          name: 'Club Sarmiento (Pigüé)',
          pj: 10,
          pg: 3,
          pe: 2,
          pp: 5,
          gf: 12,
          gc: 16,
          dif: -4,
          pts: 11,
          form: ['W', 'L', 'L', 'D', 'W'],
          qualified: false,
        },
        {
          id: 'huanguelen',
          pos: 6,
          name: 'Atlético Huanguelén',
          pj: 10,
          pg: 1,
          pe: 2,
          pp: 7,
          gf: 8,
          gc: 21,
          dif: -13,
          pts: 5,
          form: ['L', 'L', 'D', 'L', 'L'],
          qualified: false,
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
      team2: 'Independiente (San José)',
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
      team1: 'Racing Club (Carhué)',
      team2: 'Boca Juniors (Suárez)',
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
      team1: 'I. F. C.',
      team2: 'San Martín (Santa Trinidad)',
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
      team1: 'Deportivo Sarmiento',
      team2: 'El Progreso (Santa María)',
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
      team2: 'Racing Club (Carhué)',
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
      team1: 'San Martín (Santa Trinidad)',
      team2: 'Deportivo Sarmiento',
      score1: 1,
      score2: 2,
      winner: 2,
      status: 'finalizado',
      dateInfo: 'Global 2-3',
    },
    {
      id: 'f1',
      round: 'final',
      title: 'Gran Final del Torneo',
      team1: 'Blanco y Negro',
      team2: 'Deportivo Sarmiento',
      score1: null,
      score2: null,
      status: 'programado',
      dateInfo: 'Próximo Domingo 16:30 hs • En vivo en Pasión Lomonegra',
    },
  ],
  // Goleadores EXCLUSIVOS del Club Atlético Blanco y Negro
  goleadores: [
    {
      id: 'g1',
      pos: 1,
      name: 'Gonzalo Cendra',
      category: 'Fútbol Mayor',
      goals: 9,
      matchesPlayed: 10,
    },
    {
      id: 'g2',
      pos: 2,
      name: 'Facundo Sánchez',
      category: 'Fútbol Mayor',
      goals: 7,
      matchesPlayed: 9,
    },
    {
      id: 'g3',
      pos: 3,
      name: 'Lucas Balvidares',
      category: 'Reserva',
      goals: 6,
      matchesPlayed: 8,
    },
    {
      id: 'g4',
      pos: 4,
      name: 'Joaquín Kraft',
      category: 'Fútbol Mayor',
      goals: 5,
      matchesPlayed: 10,
    },
    {
      id: 'g5',
      pos: 5,
      name: 'Tomás Graff',
      category: 'Tercera División',
      goals: 4,
      matchesPlayed: 7,
    },
    {
      id: 'g6',
      pos: 6,
      name: 'Ignacio Weimann',
      category: 'Cuarta División',
      goals: 4,
      matchesPlayed: 6,
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
