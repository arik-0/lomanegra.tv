// Datos y Fixtures Oficiales - Fútbol Senior y Reserva +30 (Reserva Especial)
// Liga Deportiva del Sur - 2° Torneo (Clausura) 2026
// Boletines Oficiales Nº 22 / 2026 y Nº 21 / 2026

import {
  TournamentStandings,
  TeamStandingsRow,
  ZoneData,
  FixtureMatch,
  GoleadorRow,
  syncPlayoffMatches,
  generateFullRoundRobinFixture,
  generatePlayoffsByModality,
} from './standingsStore';

// ==============================================================================
// 1. FÚTBOL SENIOR - ZONA A (Boletín Oficial Nº 22 / 2026 - Fecha 8)
// ==============================================================================
export const SENIOR_TEAMS_ZONA_A: TeamStandingsRow[] = [
  { id: 'sen-a-spfc', pos: 1, name: 'Sportivo FC', pj: 8, pg: 6, pe: 2, pp: 0, gf: 20, gc: 2, dif: 18, pts: 20, form: ['W', 'W', 'W', 'D', 'W'], qualified: true },
  { id: 'sen-a-ifc', pos: 2, name: 'Independiente FC', pj: 8, pg: 5, pe: 2, pp: 1, gf: 16, gc: 10, dif: 6, pts: 17, form: ['W', 'W', 'W', 'D', 'D'], qualified: true, logoUrl: '/teams/ifc.png' },
  { id: 'sen-a-mb', pos: 3, name: 'Mundo Balón', pj: 8, pg: 5, pe: 2, pp: 1, gf: 12, gc: 7, dif: 5, pts: 17, form: ['W', 'D', 'W', 'W', 'W'], qualified: true },
  { id: 'sen-a-ufbc', pos: 4, name: 'Uranga FBC', pj: 8, pg: 4, pe: 3, pp: 1, gf: 16, gc: 8, dif: 8, pts: 15, form: ['W', 'W', 'D', 'W', 'D'], qualified: true },
  { id: 'sen-a-ceh', pos: 5, name: 'Eduardo Hertz', pj: 8, pg: 4, pe: 2, pp: 2, gf: 21, gc: 9, dif: 12, pts: 14, form: ['W', 'L', 'W', 'W', 'D'], qualified: false, logoUrl: '/teams/Eduardo Hertz.png' },
  { id: 'sen-a-oli', pos: 6, name: 'Olimpia', pj: 8, pg: 3, pe: 3, pp: 2, gf: 23, gc: 10, dif: 13, pts: 12, form: ['W', 'W', 'L', 'L', 'D'], qualified: false, logoUrl: '/teams/Olimpia de Santa Teresa.png' },
  { id: 'sen-a-caa', pos: 7, name: 'Atlético Acebal', pj: 8, pg: 2, pe: 3, pp: 3, gf: 12, gc: 12, dif: 0, pts: 9, form: ['L', 'D', 'D', 'W', 'D'], qualified: false, logoUrl: '/teams/Atletico Acebal.png' },
  { id: 'sen-a-eds', pos: 8, name: 'Estrella del Sur', pj: 8, pg: 2, pe: 1, pp: 5, gf: 3, gc: 12, dif: -9, pts: 7, form: ['L', 'L', 'W', 'D', 'L'], qualified: false },
  { id: 'sen-a-cau', pos: 9, name: 'Atlético Unión', pj: 8, pg: 1, pe: 3, pp: 4, gf: 6, gc: 12, dif: -6, pts: 6, form: ['L', 'D', 'L', 'L', 'D'], qualified: false },
  { id: 'sen-a-ist', pos: 10, name: 'Independiente ST', pj: 8, pg: 1, pe: 1, pp: 6, gf: 7, gc: 32, dif: -25, pts: 4, form: ['L', 'L', 'L', 'L', 'W'], qualified: false },
  { id: 'sen-a-cap', pos: 11, name: 'Atlético Piñero', pj: 8, pg: 1, pe: 0, pp: 7, gf: 10, gc: 20, dif: -10, pts: 3, form: ['L', 'L', 'L', 'L', 'L'], qualified: false },
];

export const SENIOR_FIXTURES_ZONA_A: FixtureMatch[] = [
  { id: 'sen-f8-1', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-a-cap', homeTeamName: 'Atlético Piñero', awayTeamId: 'sen-a-mb', awayTeamName: 'Mundo Balón', homeGoals: 0, awayGoals: 1 },
  { id: 'sen-f8-2', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-a-caa', homeTeamName: 'Atlético Acebal', awayTeamId: 'sen-a-ceh', awayTeamName: 'Eduardo Hertz', homeGoals: 1, awayGoals: 1 },
  { id: 'sen-f8-3', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-a-ufbc', homeTeamName: 'Uranga FBC', awayTeamId: 'sen-a-ifc', awayTeamName: 'Independiente FC', homeGoals: 2, awayGoals: 2 },
  { id: 'sen-f8-4', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-a-ist', homeTeamName: 'Independiente ST', awayTeamId: 'sen-a-eds', awayTeamName: 'Estrella del Sur', homeGoals: 1, awayGoals: 0 },
  { id: 'sen-f8-5', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-a-cau', homeTeamName: 'Atlético Unión', awayTeamId: 'sen-a-oli', awayTeamName: 'Olimpia', homeGoals: 1, awayGoals: 1 },
  { id: 'sen-f8-inter', roundName: 'Fecha 8 (Interzonal)', date: '26/09/2026', homeTeamId: 'sen-a-spfc', homeTeamName: 'Sportivo FC', awayTeamId: 'sen-b-arg', awayTeamName: 'C.A. Argentino', homeGoals: 3, awayGoals: 1 },
];

// ==============================================================================
// 2. FÚTBOL SENIOR - ZONA B (Boletín Oficial Nº 22 / 2026 - Fecha 8)
// ==============================================================================
export const SENIOR_TEAMS_ZONA_B: TeamStandingsRow[] = [
  { id: 'sen-b-ach', pos: 1, name: 'Atlético Chabás', pj: 8, pg: 6, pe: 1, pp: 1, gf: 16, gc: 5, dif: 11, pts: 19, form: ['W', 'W', 'W', 'D', 'W'], qualified: true },
  { id: 'sen-b-byn', pos: 2, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 8, pg: 6, pe: 0, pp: 2, gf: 16, gc: 8, dif: 8, pts: 18, form: ['W', 'W', 'W', 'W', 'L'], qualified: true, logoUrl: '/teams/Blanco y Negro.png' },
  { id: 'sen-b-arg', pos: 3, name: 'C.A. Argentino', pj: 8, pg: 4, pe: 3, pp: 1, gf: 13, gc: 8, dif: 5, pts: 15, form: ['W', 'D', 'W', 'D', 'L'], qualified: true, logoUrl: '/teams/Argentino de Firmat.png' },
  { id: 'sen-b-vel', pos: 4, name: 'Vélez Sarsfield', pj: 8, pg: 5, pe: 0, pp: 3, gf: 12, gc: 12, dif: 0, pts: 15, form: ['L', 'W', 'W', 'L', 'W'], qualified: true },
  { id: 'sen-b-bjc', pos: 5, name: 'Bombal Juniors', pj: 8, pg: 4, pe: 2, pp: 2, gf: 13, gc: 10, dif: 3, pts: 14, form: ['W', 'D', 'L', 'W', 'W'], qualified: false, logoUrl: '/teams/Bombal Juniors.png' },
  { id: 'sen-b-cla', pos: 6, name: 'Los Andes', pj: 8, pg: 4, pe: 1, pp: 3, gf: 12, gc: 7, dif: 5, pts: 13, form: ['W', 'L', 'D', 'W', 'W'], qualified: false, logoUrl: '/teams/Los Andes.png' },
  { id: 'sen-b-ffbc', pos: 7, name: 'Firmat FBC', pj: 8, pg: 3, pe: 2, pp: 3, gf: 11, gc: 8, dif: 3, pts: 11, form: ['L', 'D', 'W', 'D', 'W'], qualified: false, logoUrl: '/teams/Firmat FBC.png' },
  { id: 'sen-b-alb', pos: 8, name: 'Nuevo Alberdi', pj: 8, pg: 2, pe: 2, pp: 4, gf: 6, gc: 12, dif: -6, pts: 8, form: ['L', 'D', 'W', 'L', 'L'], qualified: false, logoUrl: '/teams/Nuevo Alberdi.png' },
  { id: 'sen-b-cnm', pos: 9, name: 'Náutico Melincué', pj: 8, pg: 1, pe: 2, pp: 5, gf: 6, gc: 11, dif: -5, pts: 5, form: ['L', 'D', 'L', 'D', 'L'], qualified: false },
  { id: 'sen-b-cln', pos: 10, name: 'Los Leones Norte', pj: 8, pg: 1, pe: 0, pp: 7, gf: 6, gc: 20, dif: -14, pts: 3, form: ['L', 'L', 'L', 'W', 'L'], qualified: false },
  { id: 'sen-b-est', pos: 11, name: 'Atl. Estudiantes', pj: 8, pg: 0, pe: 1, pp: 7, gf: 5, gc: 27, dif: -22, pts: 1, form: ['L', 'L', 'D', 'L', 'L'], qualified: false },
];

export const SENIOR_FIXTURES_ZONA_B: FixtureMatch[] = [
  { id: 'sen-f8-6', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-b-alb', homeTeamName: 'Nuevo Alberdi', awayTeamId: 'sen-b-bjc', awayTeamName: 'Bombal Juniors', homeGoals: 1, awayGoals: 2 },
  { id: 'sen-f8-7', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-b-byn', homeTeamName: 'Blanco y Negro', awayTeamId: 'sen-b-ach', awayTeamName: 'Atlético Chabás', homeGoals: 0, awayGoals: 2 },
  { id: 'sen-f8-8', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-b-cln', homeTeamName: 'Los Leones Norte', awayTeamId: 'sen-b-vel', awayTeamName: 'Vélez Sarsfield', homeGoals: 1, awayGoals: 2 },
  { id: 'sen-f8-9', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-b-cnm', homeTeamName: 'Náutico Melincué', awayTeamId: 'sen-b-cla', awayTeamName: 'Los Andes', homeGoals: 1, awayGoals: 2 },
  { id: 'sen-f8-10', roundName: 'Fecha 8', date: '26/09/2026', homeTeamId: 'sen-b-ffbc', homeTeamName: 'Firmat FBC', awayTeamId: 'sen-b-est', awayTeamName: 'Atl. Estudiantes', homeGoals: 3, awayGoals: 0 },
];

export const SENIOR_GOLEADORES: GoleadorRow[] = [
  { id: 'sen-g-1', pos: 1, name: 'Porfiri Leroy', category: 'Atlético Chabás', goals: 8 },
  { id: 'sen-g-2', pos: 2, name: 'Federico Pablo Ezequiel', category: 'Atlético Chabás', goals: 7 },
  { id: 'sen-g-3', pos: 3, name: 'Fagiani Horacio', category: 'Sportivo FC', goals: 6 },
  { id: 'sen-g-4', pos: 4, name: 'Morosine Sergio', category: 'Firmat FBC', goals: 5 },
  { id: 'sen-g-5', pos: 5, name: 'Bomba Matías', category: 'Los Andes', goals: 5 },
  { id: 'sen-g-6', pos: 6, name: 'Mangani Gonzalo', category: 'Mundo Balón', goals: 4 },
  { id: 'sen-g-7', pos: 7, name: 'Merlo Mariano', category: 'Independiente ST', goals: 4 },
];

export function createSeniorClausuraStandings(): TournamentStandings {
  const zoneA: ZoneData = {
    id: 'senior-zona-a',
    name: 'Zona A',
    teams: SENIOR_TEAMS_ZONA_A,
    fixtures: SENIOR_FIXTURES_ZONA_A,
  };
  zoneA.fixtures = generateFullRoundRobinFixture(zoneA, zoneA.fixtures);

  const zoneB: ZoneData = {
    id: 'senior-zona-b',
    name: 'Zona B',
    teams: SENIOR_TEAMS_ZONA_B,
    fixtures: SENIOR_FIXTURES_ZONA_B,
  };
  zoneB.fixtures = generateFullRoundRobinFixture(zoneB, zoneB.fixtures);

  const standings: TournamentStandings = {
    year: '2026',
    torneo: 'clausura',
    deporte: 'futbol',
    categoria: 'senior',
    playoffModality: 'cuartos',
    zones: [zoneA, zoneB],
    playoffs: [],
    goleadores: SENIOR_GOLEADORES,
  };

  const withPlayoffs = generatePlayoffsByModality(standings, 'cuartos');
  return syncPlayoffMatches(withPlayoffs);
}

// ==============================================================================
// 3. RESERVA +30 (RESERVA ESPECIAL) - ETAPA CLASIFICATORIA (Boletín Nº 21 / 2026 - Fecha 2)
// ==============================================================================
export const RESERVA_30_TEAMS: TeamStandingsRow[] = [
  { id: 'r30-cla', pos: 1, name: 'Los Andes', pj: 2, pg: 2, pe: 0, pp: 0, gf: 6, gc: 0, dif: 6, pts: 6, form: ['W', 'W'], qualified: true, logoUrl: '/teams/Los Andes.png' },
  { id: 'r30-ita', pos: 2, name: 'Ítalo Argentino', pj: 2, pg: 2, pe: 0, pp: 0, gf: 6, gc: 1, dif: 5, pts: 6, form: ['W', 'W'], qualified: true, logoUrl: '/teams/Italo Argentino.png' },
  { id: 'r30-cac', pos: 3, name: 'Carreras AC', pj: 2, pg: 2, pe: 0, pp: 0, gf: 6, gc: 3, dif: 3, pts: 6, form: ['W', 'W'], qualified: true, logoUrl: '/teams/Carreras.png' },
  { id: 'r30-est', pos: 4, name: 'Atl. Estudiantes', pj: 2, pg: 0, pe: 2, pp: 0, gf: 3, gc: 3, dif: 0, pts: 2, form: ['D', 'D'], qualified: true },
  { id: 'r30-st', pos: 5, name: 'Atl. Santa Teresita', pj: 2, pg: 0, pe: 1, pp: 1, gf: 3, gc: 4, dif: -1, pts: 1, form: ['L', 'D'], qualified: false },
  { id: 'r30-paz', pos: 6, name: 'Atlético Paz', pj: 2, pg: 0, pe: 1, pp: 1, gf: 1, gc: 4, dif: -3, pts: 1, form: ['L', 'D'], qualified: false, logoUrl: '/teams/Atletico Paz.png' },
  { id: 'r30-byn', pos: 7, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 2, pg: 0, pe: 0, pp: 2, gf: 2, gc: 6, dif: -4, pts: 0, form: ['L', 'L'], qualified: false, logoUrl: '/teams/Blanco y Negro.png' },
  { id: 'r30-cln', pos: 8, name: 'Los Leones Norte', pj: 2, pg: 0, pe: 0, pp: 2, gf: 1, gc: 7, dif: -6, pts: 0, form: ['L', 'L'], qualified: false },
];

export const RESERVA_30_FIXTURES: FixtureMatch[] = [
  { id: 'r30-f2-1', roundName: 'Fecha 2', date: '26/09/2026', homeTeamId: 'r30-byn', homeTeamName: 'Blanco y Negro', awayTeamId: 'r30-ita', awayTeamName: 'Ítalo Argentino', homeGoals: 0, awayGoals: 2 },
  { id: 'r30-f2-2', roundName: 'Fecha 2', date: '26/09/2026', homeTeamId: 'r30-cln', homeTeamName: 'Los Leones Norte', awayTeamId: 'r30-cla', awayTeamName: 'Los Andes', homeGoals: 0, awayGoals: 3 },
  { id: 'r30-f2-3', roundName: 'Fecha 2', date: '26/09/2026', homeTeamId: 'r30-paz', homeTeamName: 'Atlético Paz', awayTeamId: 'r30-est', awayTeamName: 'Atl. Estudiantes', homeGoals: 1, awayGoals: 1 },
  { id: 'r30-f2-4', roundName: 'Fecha 2', date: '26/09/2026', homeTeamId: 'r30-cac', homeTeamName: 'Carreras AC', awayTeamId: 'r30-st', awayTeamName: 'Atl. Santa Teresita', homeGoals: 2, awayGoals: 1 },
];

export const RESERVA_30_GOLEADORES: GoleadorRow[] = [
  { id: 'r30-g-1', pos: 1, name: 'Bomba Matías', category: 'Los Andes', goals: 3 },
  { id: 'r30-g-2', pos: 2, name: 'Quiroga Nelson Ariel', category: 'Ítalo Argentino', goals: 2 },
  { id: 'r30-g-3', pos: 3, name: 'Hernández Lucio', category: 'Carreras AC', goals: 1 },
  { id: 'r30-g-4', pos: 4, name: 'Ramírez Matías', category: 'Carreras AC', goals: 1 },
  { id: 'r30-g-5', pos: 5, name: 'Lucatti Giuliano', category: 'Atlético Paz', goals: 1 },
  { id: 'r30-g-6', pos: 6, name: 'Ferreyra Joel Gastón', category: 'Atl. Estudiantes', goals: 1 },
  { id: 'r30-g-7', pos: 7, name: 'Barreto Juan José', category: 'Atl. Santa Teresita', goals: 1 },
];

export function createReserva30ClausuraStandings(): TournamentStandings {
  const zoneGeneral: ZoneData = {
    id: 'reserva-30-general',
    name: 'Etapa Clasificatoria',
    teams: RESERVA_30_TEAMS,
    fixtures: RESERVA_30_FIXTURES,
  };
  zoneGeneral.fixtures = generateFullRoundRobinFixture(zoneGeneral, zoneGeneral.fixtures);

  const standings: TournamentStandings = {
    year: '2026',
    torneo: 'clausura',
    deporte: 'futbol',
    categoria: 'reserva_30',
    playoffModality: 'semifinal',
    zones: [zoneGeneral],
    playoffs: [],
    goleadores: RESERVA_30_GOLEADORES,
  };

  const withPlayoffs = generatePlayoffsByModality(standings, 'semifinal');
  return syncPlayoffMatches(withPlayoffs);
}
