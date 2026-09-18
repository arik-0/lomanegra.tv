// Fixture Oficial Torneo Clausura 2026 - Liga Deportiva del Sur
// Divisiones Inferiores (Tercera, Cuarta y Quinta División)
// Zonas A, B y C (6 Fechas completas oficiales - Inicio: 26/09/2026)

import { FixtureMatch, TeamStandingsRow, TournamentStandings, ZoneData } from './standingsStore';

export const CLAUSURA_INFERIORES_ZONA_A_TEAMS: TeamStandingsRow[] = [
  { id: 'hughes-fbc', pos: 1, name: 'Hughes FBC', logoUrl: '/teams/Hughes.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'firmat-fbc-rojo', pos: 2, name: 'Firmat FBC (Rojo)', logoUrl: '/teams/Firmat FBC.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'ca-argentino', pos: 3, name: 'C.A. Argentino', logoUrl: '/teams/Argentino de Firmat.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'nuevo-alberdi', pos: 4, name: 'Nuevo Alberdi', logoUrl: '/teams/Nuevo Alberdi.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'firmat-fbc-blanco', pos: 5, name: 'Firmat FBC (Blanco)', logoUrl: '/teams/Firmat FBC.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: false },
  { id: 'italo-argentino', pos: 6, name: 'Ítalo Argentino', logoUrl: '/teams/Italo Argentino.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: false },
];

export const CLAUSURA_INFERIORES_ZONA_B_TEAMS: TeamStandingsRow[] = [
  { id: 'blanco-y-negro', pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, logoUrl: '/teams/Blanco y Negro.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'sp-bombal', pos: 2, name: 'Sp. Bombal', logoUrl: '/teams/Sportivo Bombal.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'independiente-fc', pos: 3, name: 'Independiente FC', logoUrl: '/teams/ifc.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'sporting-cs', pos: 4, name: 'Sporting CS', logoUrl: '/teams/Sporting de Bigan.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'carreras-ac', pos: 5, name: 'Carreras AC', logoUrl: '/teams/Carreras.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: false },
  { id: 'los-andes', pos: 6, name: 'Los Andes', logoUrl: '/teams/Los Andes.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: false },
];

export const CLAUSURA_INFERIORES_ZONA_C_TEAMS: TeamStandingsRow[] = [
  { id: 'atl-acebal', pos: 1, name: 'Atl. Acebal', logoUrl: '/teams/Atletico Acebal.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'b-rivadavia', pos: 2, name: 'B. Rivadavia', logoUrl: '/teams/Bernardino Rivadavia.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'eduardo-hertz', pos: 3, name: 'Eduardo Hertz', logoUrl: '/teams/Eduardo Hertz.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'atletico-paz', pos: 4, name: 'Atlético Paz', logoUrl: '/teams/Atletico Paz.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: true },
  { id: 'olimpia', pos: 5, name: 'Olimpia', logoUrl: '/teams/Olimpia de Santa Teresa.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: false },
  { id: 'san-martin', pos: 6, name: 'San Martín', logoUrl: '/teams/San Martin.png', pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0, form: [], qualified: false },
];

// Fixture Oficial Zona A
export const officialClausuraInferioresFixturesZonaA: FixtureMatch[] = [
  // Fecha 1 (26/9/2026)
  { id: 'inf-za-f1-1', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'hughes-fbc', homeTeamName: 'Hughes FBC', awayTeamId: 'firmat-fbc-rojo', awayTeamName: 'Firmat FBC (Rojo)', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f1-2', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'ca-argentino', homeTeamName: 'C.A. Argentino', awayTeamId: 'nuevo-alberdi', awayTeamName: 'Nuevo Alberdi', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f1-3', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'firmat-fbc-blanco', homeTeamName: 'Firmat FBC (Blanco)', awayTeamId: 'italo-argentino', awayTeamName: 'Ítalo Argentino', homeGoals: null, awayGoals: null },

  // Fecha 2
  { id: 'inf-za-f2-1', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'firmat-fbc-blanco', homeTeamName: 'Firmat FBC (Blanco)', awayTeamId: 'hughes-fbc', awayTeamName: 'Hughes FBC', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f2-2', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'italo-argentino', homeTeamName: 'Ítalo Argentino', awayTeamId: 'ca-argentino', awayTeamName: 'C.A. Argentino', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f2-3', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'nuevo-alberdi', homeTeamName: 'Nuevo Alberdi', awayTeamId: 'firmat-fbc-rojo', awayTeamName: 'Firmat FBC (Rojo)', homeGoals: null, awayGoals: null },

  // Fecha 3
  { id: 'inf-za-f3-1', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'italo-argentino', homeTeamName: 'Ítalo Argentino', awayTeamId: 'hughes-fbc', awayTeamName: 'Hughes FBC', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f3-2', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'firmat-fbc-rojo', homeTeamName: 'Firmat FBC (Rojo)', awayTeamId: 'firmat-fbc-blanco', awayTeamName: 'Firmat FBC (Blanco)', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f3-3', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'nuevo-alberdi', homeTeamName: 'Nuevo Alberdi', awayTeamId: 'ca-argentino', awayTeamName: 'C.A. Argentino', homeGoals: null, awayGoals: null },

  // Fecha 4
  { id: 'inf-za-f4-1', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'hughes-fbc', homeTeamName: 'Hughes FBC', awayTeamId: 'nuevo-alberdi', awayTeamName: 'Nuevo Alberdi', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f4-2', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'firmat-fbc-rojo', homeTeamName: 'Firmat FBC (Rojo)', awayTeamId: 'italo-argentino', awayTeamName: 'Ítalo Argentino', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f4-3', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'ca-argentino', homeTeamName: 'C.A. Argentino', awayTeamId: 'firmat-fbc-blanco', awayTeamName: 'Firmat FBC (Blanco)', homeGoals: null, awayGoals: null },

  // Fecha 5
  { id: 'inf-za-f5-1', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'ca-argentino', homeTeamName: 'C.A. Argentino', awayTeamId: 'hughes-fbc', awayTeamName: 'Hughes FBC', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f5-2', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'firmat-fbc-blanco', homeTeamName: 'Firmat FBC (Blanco)', awayTeamId: 'firmat-fbc-rojo', awayTeamName: 'Firmat FBC (Rojo)', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f5-3', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'italo-argentino', homeTeamName: 'Ítalo Argentino', awayTeamId: 'nuevo-alberdi', awayTeamName: 'Nuevo Alberdi', homeGoals: null, awayGoals: null },

  // Fecha 6
  { id: 'inf-za-f6-1', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'hughes-fbc', homeTeamName: 'Hughes FBC', awayTeamId: 'italo-argentino', awayTeamName: 'Ítalo Argentino', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f6-2', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'nuevo-alberdi', homeTeamName: 'Nuevo Alberdi', awayTeamId: 'firmat-fbc-blanco', awayTeamName: 'Firmat FBC (Blanco)', homeGoals: null, awayGoals: null },
  { id: 'inf-za-f6-3', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'firmat-fbc-rojo', homeTeamName: 'Firmat FBC (Rojo)', awayTeamId: 'ca-argentino', awayTeamName: 'C.A. Argentino', homeGoals: null, awayGoals: null },
];

// Fixture Oficial Zona B
export const officialClausuraInferioresFixturesZonaB: FixtureMatch[] = [
  // Fecha 1 (26/9/2026)
  { id: 'inf-zb-f1-1', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'blanco-y-negro', homeTeamName: 'Blanco y Negro', awayTeamId: 'sp-bombal', awayTeamName: 'Sp. Bombal', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f1-2', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'independiente-fc', homeTeamName: 'Independiente FC', awayTeamId: 'sporting-cs', awayTeamName: 'Sporting CS', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f1-3', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'carreras-ac', homeTeamName: 'Carreras AC', awayTeamId: 'los-andes', awayTeamName: 'Los Andes', homeGoals: null, awayGoals: null },

  // Fecha 2
  { id: 'inf-zb-f2-1', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'carreras-ac', homeTeamName: 'Carreras AC', awayTeamId: 'blanco-y-negro', awayTeamName: 'Blanco y Negro', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f2-2', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'los-andes', homeTeamName: 'Los Andes', awayTeamId: 'independiente-fc', awayTeamName: 'Independiente FC', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f2-3', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'sporting-cs', homeTeamName: 'Sporting CS', awayTeamId: 'sp-bombal', awayTeamName: 'Sp. Bombal', homeGoals: null, awayGoals: null },

  // Fecha 3
  { id: 'inf-zb-f3-1', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'los-andes', homeTeamName: 'Los Andes', awayTeamId: 'blanco-y-negro', awayTeamName: 'Blanco y Negro', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f3-2', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'sp-bombal', homeTeamName: 'Sp. Bombal', awayTeamId: 'carreras-ac', awayTeamName: 'Carreras AC', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f3-3', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'sporting-cs', homeTeamName: 'Sporting CS', awayTeamId: 'independiente-fc', awayTeamName: 'Independiente FC', homeGoals: null, awayGoals: null },

  // Fecha 4
  { id: 'inf-zb-f4-1', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'blanco-y-negro', homeTeamName: 'Blanco y Negro', awayTeamId: 'sporting-cs', awayTeamName: 'Sporting CS', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f4-2', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'sp-bombal', homeTeamName: 'Sp. Bombal', awayTeamId: 'los-andes', awayTeamName: 'Los Andes', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f4-3', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'independiente-fc', homeTeamName: 'Independiente FC', awayTeamId: 'carreras-ac', awayTeamName: 'Carreras AC', homeGoals: null, awayGoals: null },

  // Fecha 5
  { id: 'inf-zb-f5-1', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'independiente-fc', homeTeamName: 'Independiente FC', awayTeamId: 'blanco-y-negro', awayTeamName: 'Blanco y Negro', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f5-2', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'carreras-ac', homeTeamName: 'Carreras AC', awayTeamId: 'sp-bombal', awayTeamName: 'Sp. Bombal', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f5-3', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'los-andes', homeTeamName: 'Los Andes', awayTeamId: 'sporting-cs', awayTeamName: 'Sporting CS', homeGoals: null, awayGoals: null },

  // Fecha 6
  { id: 'inf-zb-f6-1', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'blanco-y-negro', homeTeamName: 'Blanco y Negro', awayTeamId: 'los-andes', awayTeamName: 'Los Andes', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f6-2', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'sporting-cs', homeTeamName: 'Sporting CS', awayTeamId: 'carreras-ac', awayTeamName: 'Carreras AC', homeGoals: null, awayGoals: null },
  { id: 'inf-zb-f6-3', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'sp-bombal', homeTeamName: 'Sp. Bombal', awayTeamId: 'independiente-fc', awayTeamName: 'Independiente FC', homeGoals: null, awayGoals: null },
];

// Fixture Oficial Zona C
export const officialClausuraInferioresFixturesZonaC: FixtureMatch[] = [
  // Fecha 1 (26/9/2026)
  { id: 'inf-zc-f1-1', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'atl-acebal', homeTeamName: 'Atl. Acebal', awayTeamId: 'b-rivadavia', awayTeamName: 'B. Rivadavia', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f1-2', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'eduardo-hertz', homeTeamName: 'Eduardo Hertz', awayTeamId: 'atletico-paz', awayTeamName: 'Atlético Paz', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f1-3', roundName: 'Fecha 1', date: '26/9/2026', homeTeamId: 'olimpia', homeTeamName: 'Olimpia', awayTeamId: 'san-martin', awayTeamName: 'San Martín', homeGoals: null, awayGoals: null },

  // Fecha 2
  { id: 'inf-zc-f2-1', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'olimpia', homeTeamName: 'Olimpia', awayTeamId: 'atl-acebal', awayTeamName: 'Atl. Acebal', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f2-2', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'san-martin', homeTeamName: 'San Martín', awayTeamId: 'eduardo-hertz', awayTeamName: 'Eduardo Hertz', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f2-3', roundName: 'Fecha 2', date: 'Fecha 2', homeTeamId: 'atletico-paz', homeTeamName: 'Atlético Paz', awayTeamId: 'b-rivadavia', awayTeamName: 'B. Rivadavia', homeGoals: null, awayGoals: null },

  // Fecha 3
  { id: 'inf-zc-f3-1', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'san-martin', homeTeamName: 'San Martín', awayTeamId: 'atl-acebal', awayTeamName: 'Atl. Acebal', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f3-2', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'b-rivadavia', homeTeamName: 'B. Rivadavia', awayTeamId: 'olimpia', awayTeamName: 'Olimpia', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f3-3', roundName: 'Fecha 3', date: 'Fecha 3', homeTeamId: 'atletico-paz', homeTeamName: 'Atlético Paz', awayTeamId: 'eduardo-hertz', awayTeamName: 'Eduardo Hertz', homeGoals: null, awayGoals: null },

  // Fecha 4
  { id: 'inf-zc-f4-1', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'atl-acebal', homeTeamName: 'Atl. Acebal', awayTeamId: 'atletico-paz', awayTeamName: 'Atlético Paz', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f4-2', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'b-rivadavia', homeTeamName: 'B. Rivadavia', awayTeamId: 'san-martin', awayTeamName: 'San Martín', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f4-3', roundName: 'Fecha 4', date: 'Fecha 4', homeTeamId: 'eduardo-hertz', homeTeamName: 'Eduardo Hertz', awayTeamId: 'olimpia', awayTeamName: 'Olimpia', homeGoals: null, awayGoals: null },

  // Fecha 5
  { id: 'inf-zc-f5-1', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'eduardo-hertz', homeTeamName: 'Eduardo Hertz', awayTeamId: 'atl-acebal', awayTeamName: 'Atl. Acebal', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f5-2', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'olimpia', homeTeamName: 'Olimpia', awayTeamId: 'b-rivadavia', awayTeamName: 'B. Rivadavia', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f5-3', roundName: 'Fecha 5', date: 'Fecha 5', homeTeamId: 'san-martin', homeTeamName: 'San Martín', awayTeamId: 'atletico-paz', awayTeamName: 'Atlético Paz', homeGoals: null, awayGoals: null },

  // Fecha 6
  { id: 'inf-zc-f6-1', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'atl-acebal', homeTeamName: 'Atl. Acebal', awayTeamId: 'san-martin', awayTeamName: 'San Martín', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f6-2', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'atletico-paz', homeTeamName: 'Atlético Paz', awayTeamId: 'olimpia', awayTeamName: 'Olimpia', homeGoals: null, awayGoals: null },
  { id: 'inf-zc-f6-3', roundName: 'Fecha 6', date: 'Fecha 6', homeTeamId: 'b-rivadavia', homeTeamName: 'B. Rivadavia', awayTeamId: 'eduardo-hertz', awayTeamName: 'Eduardo Hertz', homeGoals: null, awayGoals: null },
];

export function createInferioresClausuraStandings(categoria: 'tercera' | 'cuarta' | 'quinta'): TournamentStandings {
  const catLabel = categoria === 'tercera' ? 'Tercera División' : categoria === 'cuarta' ? 'Cuarta División' : 'Quinta División';
  
  return {
    year: '2026',
    deporte: 'futbol',
    categoria,
    torneo: 'clausura',
    zones: [
      {
        id: 'zona-a',
        name: 'Zona A',
        teams: JSON.parse(JSON.stringify(CLAUSURA_INFERIORES_ZONA_A_TEAMS)),
        fixtures: JSON.parse(JSON.stringify(officialClausuraInferioresFixturesZonaA)),
      },
      {
        id: 'zona-b',
        name: 'Zona B',
        teams: JSON.parse(JSON.stringify(CLAUSURA_INFERIORES_ZONA_B_TEAMS)),
        fixtures: JSON.parse(JSON.stringify(officialClausuraInferioresFixturesZonaB)),
      },
      {
        id: 'zona-c',
        name: 'Zona C',
        teams: JSON.parse(JSON.stringify(CLAUSURA_INFERIORES_ZONA_C_TEAMS)),
        fixtures: JSON.parse(JSON.stringify(officialClausuraInferioresFixturesZonaC)),
      },
    ],
    playoffs: [
      {
        id: 'cuartos-1',
        round: 'cuartos',
        title: 'Cuartos 1',
        team1: '1° Zona A',
        team2: 'Mejor 3°',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A confirmar',
      },
      {
        id: 'cuartos-2',
        round: 'cuartos',
        title: 'Cuartos 2',
        team1: '1° Zona B',
        team2: '2° Zona C',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A confirmar',
      },
      {
        id: 'cuartos-3',
        round: 'cuartos',
        title: 'Cuartos 3',
        team1: '1° Zona C',
        team2: '2° Zona B',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A confirmar',
      },
      {
        id: 'cuartos-4',
        round: 'cuartos',
        title: 'Cuartos 4',
        team1: '2° Zona A',
        team2: 'Segundo Mejor 3°',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A confirmar',
      },
      {
        id: 'semi-1',
        round: 'semifinal',
        title: 'Semifinal 1',
        team1: 'Ganador Cuartos 1',
        team2: 'Ganador Cuartos 2',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A confirmar',
      },
      {
        id: 'semi-2',
        round: 'semifinal',
        title: 'Semifinal 2',
        team1: 'Ganador Cuartos 3',
        team2: 'Ganador Cuartos 4',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A confirmar',
      },
      {
        id: 'final-1',
        round: 'final',
        title: 'Gran Final',
        team1: 'Ganador Semi 1',
        team2: 'Ganador Semi 2',
        score1: null,
        score2: null,
        status: 'programado',
        dateInfo: 'A confirmar',
      },
    ],
    playoffModality: 'cuartos',
    goleadores: [],
  };
}
