// Fixture Oficial Torneo Clausura 2026 - Liga Deportiva del Sur
// División Mayores - Zona A y Zona B (11 Fechas completas con Jornadas de Clásicos Interzonales)

export interface FixtureItem {
  id: string;
  roundName?: string;
  date?: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  homeGoals: number | null;
  awayGoals: number | null;
}

export interface TeamRowItem {
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

export const CLAUSURA_TEAMS_ZONA_A: TeamRowItem[] = [
  { id: 'eduardo-hertz', pos: 1, name: 'Eduardo Hertz', logoUrl: '/teams/Eduardo Hertz.png', pj: 5, pg: 3, pe: 1, pp: 1, gf: 10, gc: 4, dif: 6, pts: 10, form: ['W', 'D', 'W', 'W', 'L'], qualified: true },
  { id: 'ca-argentino', pos: 2, name: 'C.A. Argentino', logoUrl: '/teams/Argentino de Firmat.png', pj: 5, pg: 3, pe: 1, pp: 1, gf: 12, gc: 7, dif: 5, pts: 10, form: ['W', 'L', 'D', 'W', 'W'], qualified: true },
  { id: 'fredriksson-fbc', pos: 3, name: 'Fredriksson FBC', logoUrl: '/teams/Fredriksson.png', pj: 5, pg: 3, pe: 1, pp: 1, gf: 7, gc: 5, dif: 2, pts: 10, form: ['W', 'W', 'L', 'W', 'D'], qualified: true },
  { id: 'olimpia', pos: 4, name: 'Olimpia', logoUrl: '/teams/Olimpia de Santa Teresa.png', pj: 4, pg: 3, pe: 0, pp: 1, gf: 9, gc: 4, dif: 5, pts: 9, form: ['W', 'W', 'W', 'L'], qualified: true },
  { id: 'sp-bombal', pos: 5, name: 'Sp. Bombal', logoUrl: '/teams/Sportivo Bombal.png', pj: 5, pg: 2, pe: 2, pp: 1, gf: 6, gc: 6, dif: 0, pts: 8, form: ['D', 'D', 'L', 'W', 'W'], qualified: false },
  { id: 'los-andes', pos: 6, name: 'Los Andes', logoUrl: '/teams/Los Andes.png', pj: 4, pg: 1, pe: 2, pp: 1, gf: 7, gc: 5, dif: 2, pts: 5, form: ['D', 'D', 'L', 'D'], qualified: false },
  { id: 'italo-argentino', pos: 7, name: 'Ítalo Argentino', logoUrl: '/teams/Italo Argentino.png', pj: 5, pg: 1, pe: 1, pp: 3, gf: 5, gc: 9, dif: -4, pts: 4, form: ['L', 'L', 'W', 'D', 'L'], qualified: false },
  { id: 'dep-miguel-torres', pos: 8, name: 'Dep. Miguel Torres', logoUrl: '/teams/Miguel Torres.png', pj: 5, pg: 1, pe: 1, pp: 3, gf: 2, gc: 6, dif: -4, pts: 4, form: ['L', 'L', 'L', 'D', 'W'], qualified: false },
  { id: 'san-martin', pos: 9, name: 'San Martín', logoUrl: '/teams/San Martin.png', pj: 4, pg: 0, pe: 2, pp: 2, gf: 4, gc: 6, dif: -2, pts: 2, form: ['D', 'L', 'L', 'D'], qualified: false },
  { id: 'sporting-cs', pos: 10, name: 'Sporting CS', logoUrl: '/teams/Sporting de Bigan.png', pj: 4, pg: 0, pe: 1, pp: 3, gf: 3, gc: 10, dif: -7, pts: 1, form: ['L', 'L', 'D', 'L'], qualified: false },
];

export const CLAUSURA_TEAMS_ZONA_B: TeamRowItem[] = [
  { id: 'atletico-paz', pos: 1, name: 'Atlético Paz', logoUrl: '/teams/Atletico Paz.png', pj: 5, pg: 4, pe: 1, pp: 0, gf: 7, gc: 1, dif: 6, pts: 13, form: ['W', 'W', 'D', 'W', 'W'], qualified: true },
  { id: 'blanco-y-negro', pos: 2, name: 'Blanco y Negro', logoUrl: '/teams/Blanco y Negro.png', isBlancoYNegro: true, pj: 5, pg: 2, pe: 3, pp: 0, gf: 9, gc: 4, dif: 5, pts: 9, form: ['D', 'W', 'D', 'D', 'W'], qualified: true },
  { id: 'carreras-ac', pos: 3, name: 'Carreras AC', logoUrl: '/teams/Carreras.png', pj: 5, pg: 2, pe: 2, pp: 1, gf: 7, gc: 3, dif: 4, pts: 8, form: ['D', 'W', 'W', 'D', 'L'], qualified: true },
  { id: 'atl-acebal', pos: 4, name: 'Atl. Acebal', logoUrl: '/teams/Atletico Acebal.png', pj: 5, pg: 2, pe: 2, pp: 1, gf: 4, gc: 2, dif: 2, pts: 8, form: ['W', 'D', 'W', 'L', 'D'], qualified: true },
  { id: 'bombal-jrs', pos: 5, name: 'Bombal Jrs', logoUrl: '/teams/Bombal Juniors.png', pj: 5, pg: 2, pe: 2, pp: 1, gf: 5, gc: 4, dif: 1, pts: 8, form: ['D', 'D', 'W', 'W', 'L'], qualified: false },
  { id: 'firmat-fbc', pos: 6, name: 'Firmat FBC', logoUrl: '/teams/Firmat FBC.png', pj: 5, pg: 2, pe: 1, pp: 2, gf: 8, gc: 7, dif: 1, pts: 7, form: ['W', 'L', 'L', 'D', 'W'], qualified: false },
  { id: 'independiente-fc', pos: 7, name: 'Independiente FC', logoUrl: '/teams/ifc.png', pj: 5, pg: 1, pe: 2, pp: 2, gf: 5, gc: 5, dif: 0, pts: 5, form: ['D', 'L', 'W', 'D', 'L'], qualified: false },
  { id: 'hughes-fbc', pos: 8, name: 'Hughes FBC', logoUrl: '/teams/Hughes.png', pj: 5, pg: 1, pe: 2, pp: 2, gf: 4, gc: 8, dif: -4, pts: 5, form: ['L', 'D', 'L', 'D', 'W'], qualified: false },
  { id: 'b-rivadavia', pos: 9, name: 'B. Rivadavia', logoUrl: '/teams/Bernardino Rivadavia.png', pj: 5, pg: 0, pe: 2, pp: 3, gf: 1, gc: 11, dif: -10, pts: 2, form: ['L', 'D', 'L', 'L', 'D'], qualified: false },
  { id: 'nuevo-alberdi', pos: 10, name: 'Nuevo Alberdi', logoUrl: '/teams/Nuevo Alberdi.png', pj: 5, pg: 0, pe: 1, pp: 4, gf: 3, gc: 11, dif: -8, pts: 1, form: ['L', 'L', 'L', 'D', 'L'], qualified: false },
];

export const officialClausuraFixturesZonaA: FixtureItem[] = [
  {
    "id": "clausura-za-f1-1",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "olimpia",
    "homeTeamName": "Olimpia",
    "awayTeamId": "italo",
    "awayTeamName": "Ítalo Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f1-2",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "los-andes",
    "homeTeamName": "Los Andes",
    "awayTeamId": "miguel-torres",
    "awayTeamName": "Dep. Miguel Torres",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f1-3",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "sp-bombal",
    "homeTeamName": "Sp. Bombal",
    "awayTeamId": "sporting",
    "awayTeamName": "Sporting CS",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f1-4",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "fredriksson",
    "homeTeamName": "Fredriksson FBC",
    "awayTeamId": "san-martin",
    "awayTeamName": "San Martín",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f1-5",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "hertz",
    "homeTeamName": "Eduardo Hertz",
    "awayTeamId": "argentino",
    "awayTeamName": "C.A. Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f2-6",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "san-martin",
    "homeTeamName": "San Martín",
    "awayTeamId": "sp-bombal",
    "awayTeamName": "Sp. Bombal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f2-7",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "sporting",
    "homeTeamName": "Sporting CS",
    "awayTeamId": "los-andes",
    "awayTeamName": "Los Andes",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f2-8",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "miguel-torres",
    "homeTeamName": "Dep. Miguel Torres",
    "awayTeamId": "olimpia",
    "awayTeamName": "Olimpia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f2-9",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "italo",
    "homeTeamName": "Ítalo Argentino",
    "awayTeamId": "argentino",
    "awayTeamName": "C.A. Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f2-10",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "fredriksson",
    "homeTeamName": "Fredriksson FBC",
    "awayTeamId": "hertz",
    "awayTeamName": "Eduardo Hertz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f3-11",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "argentino",
    "homeTeamName": "C.A. Argentino",
    "awayTeamId": "miguel-torres",
    "awayTeamName": "Dep. Miguel Torres",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f3-12",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "olimpia",
    "homeTeamName": "Olimpia",
    "awayTeamId": "sporting",
    "awayTeamName": "Sporting CS",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f3-13",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "los-andes",
    "homeTeamName": "Los Andes",
    "awayTeamId": "san-martin",
    "awayTeamName": "San Martín",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f3-14",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "sp-bombal",
    "homeTeamName": "Sp. Bombal",
    "awayTeamId": "fredriksson",
    "awayTeamName": "Fredriksson FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f3-15",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "hertz",
    "homeTeamName": "Eduardo Hertz",
    "awayTeamId": "italo",
    "awayTeamName": "Ítalo Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-1",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "bombal-jrs",
    "homeTeamName": "Bombal Jrs",
    "awayTeamId": "sp-bombal",
    "awayTeamName": "Sp. Bombal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-2",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "carreras",
    "homeTeamName": "Carreras AC",
    "awayTeamId": "miguel-torres",
    "awayTeamName": "Dep. Miguel Torres",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-3",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "olimpia",
    "homeTeamName": "Olimpia",
    "awayTeamId": "rivadavia",
    "awayTeamName": "B. Rivadavia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-4",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "blanco-y-negro",
    "homeTeamName": "Blanco y Negro",
    "awayTeamId": "los-andes",
    "awayTeamName": "Los Andes",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-5",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "argentino",
    "homeTeamName": "C.A. Argentino",
    "awayTeamId": "firmat",
    "awayTeamName": "Firmat FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-6",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "independiente",
    "homeTeamName": "Independiente FC",
    "awayTeamId": "sporting",
    "awayTeamName": "Sporting CS",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-7",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "alberdi",
    "homeTeamName": "Nuevo Alberdi",
    "awayTeamId": "fredriksson",
    "awayTeamName": "Fredriksson FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-8",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "san-martin",
    "homeTeamName": "San Martín",
    "awayTeamId": "acebal",
    "awayTeamName": "Atl. Acebal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-9",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "italo",
    "homeTeamName": "Ítalo Argentino",
    "awayTeamId": "hughes",
    "awayTeamName": "Hughes FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-10",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "paz",
    "homeTeamName": "Atlético Paz",
    "awayTeamId": "hertz",
    "awayTeamName": "Eduardo Hertz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f5-26",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "fredriksson",
    "homeTeamName": "Fredriksson FBC",
    "awayTeamId": "los-andes",
    "awayTeamName": "Los Andes",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f5-27",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "san-martin",
    "homeTeamName": "San Martín",
    "awayTeamId": "olimpia",
    "awayTeamName": "Olimpia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f5-28",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "sporting",
    "homeTeamName": "Sporting CS",
    "awayTeamId": "argentino",
    "awayTeamName": "C.A. Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f5-29",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "miguel-torres",
    "homeTeamName": "Dep. Miguel Torres",
    "awayTeamId": "italo",
    "awayTeamName": "Ítalo Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f5-30",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "sp-bombal",
    "homeTeamName": "Sp. Bombal",
    "awayTeamId": "hertz",
    "awayTeamName": "Eduardo Hertz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f6-31",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "italo",
    "homeTeamName": "Ítalo Argentino",
    "awayTeamId": "sporting",
    "awayTeamName": "Sporting CS",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f6-32",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "argentino",
    "homeTeamName": "C.A. Argentino",
    "awayTeamId": "san-martin",
    "awayTeamName": "San Martín",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f6-33",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "olimpia",
    "homeTeamName": "Olimpia",
    "awayTeamId": "fredriksson",
    "awayTeamName": "Fredriksson FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f6-34",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "los-andes",
    "homeTeamName": "Los Andes",
    "awayTeamId": "sp-bombal",
    "awayTeamName": "Sp. Bombal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f6-35",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "hertz",
    "homeTeamName": "Eduardo Hertz",
    "awayTeamId": "miguel-torres",
    "awayTeamName": "Dep. Miguel Torres",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f7-36",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "sp-bombal",
    "homeTeamName": "Sp. Bombal",
    "awayTeamId": "olimpia",
    "awayTeamName": "Olimpia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f7-37",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "fredriksson",
    "homeTeamName": "Fredriksson FBC",
    "awayTeamId": "argentino",
    "awayTeamName": "C.A. Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f7-38",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "san-martin",
    "homeTeamName": "San Martín",
    "awayTeamId": "italo",
    "awayTeamName": "Ítalo Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f7-39",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "sporting",
    "homeTeamName": "Sporting CS",
    "awayTeamId": "miguel-torres",
    "awayTeamName": "Dep. Miguel Torres",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f7-40",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "los-andes",
    "homeTeamName": "Los Andes",
    "awayTeamId": "hertz",
    "awayTeamName": "Eduardo Hertz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f8-41",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "miguel-torres",
    "homeTeamName": "Dep. Miguel Torres",
    "awayTeamId": "san-martin",
    "awayTeamName": "San Martín",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f8-42",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "italo",
    "homeTeamName": "Ítalo Argentino",
    "awayTeamId": "fredriksson",
    "awayTeamName": "Fredriksson FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f8-43",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "argentino",
    "homeTeamName": "C.A. Argentino",
    "awayTeamId": "sp-bombal",
    "awayTeamName": "Sp. Bombal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f8-44",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "olimpia",
    "homeTeamName": "Olimpia",
    "awayTeamId": "los-andes",
    "awayTeamName": "Los Andes",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f8-45",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "hertz",
    "homeTeamName": "Eduardo Hertz",
    "awayTeamId": "sporting",
    "awayTeamName": "Sporting CS",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-1",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "sp-bombal",
    "homeTeamName": "Sp. Bombal",
    "awayTeamId": "bombal-jrs",
    "awayTeamName": "Bombal Jrs",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-2",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "miguel-torres",
    "homeTeamName": "Dep. Miguel Torres",
    "awayTeamId": "carreras",
    "awayTeamName": "Carreras AC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-3",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "rivadavia",
    "homeTeamName": "B. Rivadavia",
    "awayTeamId": "olimpia",
    "awayTeamName": "Olimpia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-4",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "los-andes",
    "homeTeamName": "Los Andes",
    "awayTeamId": "blanco-y-negro",
    "awayTeamName": "Blanco y Negro",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-5",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "firmat",
    "homeTeamName": "Firmat FBC",
    "awayTeamId": "argentino",
    "awayTeamName": "C.A. Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-6",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "sporting",
    "homeTeamName": "Sporting CS",
    "awayTeamId": "independiente",
    "awayTeamName": "Independiente FC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-7",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "fredriksson",
    "homeTeamName": "Fredriksson FBC",
    "awayTeamId": "alberdi",
    "awayTeamName": "Nuevo Alberdi",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-8",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "acebal",
    "homeTeamName": "Atl. Acebal",
    "awayTeamId": "san-martin",
    "awayTeamName": "San Martín",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-9",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "hughes",
    "homeTeamName": "Hughes FBC",
    "awayTeamId": "italo",
    "awayTeamName": "Ítalo Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-10",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "hertz",
    "homeTeamName": "Eduardo Hertz",
    "awayTeamId": "paz",
    "awayTeamName": "Atlético Paz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f10-56",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "los-andes",
    "homeTeamName": "Los Andes",
    "awayTeamId": "argentino",
    "awayTeamName": "C.A. Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f10-57",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "sp-bombal",
    "homeTeamName": "Sp. Bombal",
    "awayTeamId": "italo",
    "awayTeamName": "Ítalo Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f10-58",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "fredriksson",
    "homeTeamName": "Fredriksson FBC",
    "awayTeamId": "miguel-torres",
    "awayTeamName": "Dep. Miguel Torres",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f10-59",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "san-martin",
    "homeTeamName": "San Martín",
    "awayTeamId": "sporting",
    "awayTeamName": "Sporting CS",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f10-60",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "olimpia",
    "homeTeamName": "Olimpia",
    "awayTeamId": "hertz",
    "awayTeamName": "Eduardo Hertz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f11-61",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "sporting",
    "homeTeamName": "Sporting CS",
    "awayTeamId": "fredriksson",
    "awayTeamName": "Fredriksson FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f11-62",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "miguel-torres",
    "homeTeamName": "Dep. Miguel Torres",
    "awayTeamId": "sp-bombal",
    "awayTeamName": "Sp. Bombal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f11-63",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "italo",
    "homeTeamName": "Ítalo Argentino",
    "awayTeamId": "los-andes",
    "awayTeamName": "Los Andes",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f11-64",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "argentino",
    "homeTeamName": "C.A. Argentino",
    "awayTeamId": "olimpia",
    "awayTeamName": "Olimpia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-za-f11-65",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "hertz",
    "homeTeamName": "Eduardo Hertz",
    "awayTeamId": "san-martin",
    "awayTeamName": "San Martín",
    "homeGoals": null,
    "awayGoals": null
  }
];

export const officialClausuraFixturesZonaB: FixtureItem[] = [
  {
    "id": "clausura-zb-f1-1",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "hughes",
    "homeTeamName": "Hughes FBC",
    "awayTeamId": "rivadavia",
    "awayTeamName": "B. Rivadavia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f1-2",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "carreras",
    "homeTeamName": "Carreras AC",
    "awayTeamId": "blanco-y-negro",
    "awayTeamName": "Blanco y Negro",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f1-3",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "independiente",
    "homeTeamName": "Independiente FC",
    "awayTeamId": "bombal-jrs",
    "awayTeamName": "Bombal Jrs",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f1-4",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "acebal",
    "homeTeamName": "Atl. Acebal",
    "awayTeamId": "alberdi",
    "awayTeamName": "Nuevo Alberdi",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f1-5",
    "roundName": "Fecha 1",
    "date": "6/9/2026",
    "homeTeamId": "firmat",
    "homeTeamName": "Firmat FBC",
    "awayTeamId": "paz",
    "awayTeamName": "Atlético Paz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f2-6",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "bombal-jrs",
    "homeTeamName": "Bombal Jrs",
    "awayTeamId": "acebal",
    "awayTeamName": "Atl. Acebal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f2-7",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "blanco-y-negro",
    "homeTeamName": "Blanco y Negro",
    "awayTeamId": "independiente",
    "awayTeamName": "Independiente FC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f2-8",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "rivadavia",
    "homeTeamName": "B. Rivadavia",
    "awayTeamId": "carreras",
    "awayTeamName": "Carreras AC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f2-9",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "firmat",
    "homeTeamName": "Firmat FBC",
    "awayTeamId": "hughes",
    "awayTeamName": "Hughes FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f2-10",
    "roundName": "Fecha 2",
    "date": "9/9/2026",
    "homeTeamId": "paz",
    "homeTeamName": "Atlético Paz",
    "awayTeamId": "alberdi",
    "awayTeamName": "Nuevo Alberdi",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f3-11",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "carreras",
    "homeTeamName": "Carreras AC",
    "awayTeamId": "firmat",
    "awayTeamName": "Firmat FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f3-12",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "independiente",
    "homeTeamName": "Independiente FC",
    "awayTeamId": "rivadavia",
    "awayTeamName": "B. Rivadavia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f3-13",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "acebal",
    "homeTeamName": "Atl. Acebal",
    "awayTeamId": "blanco-y-negro",
    "awayTeamName": "Blanco y Negro",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f3-14",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "alberdi",
    "homeTeamName": "Nuevo Alberdi",
    "awayTeamId": "bombal-jrs",
    "awayTeamName": "Bombal Jrs",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f3-15",
    "roundName": "Fecha 3",
    "date": "13/9/2026",
    "homeTeamId": "hughes",
    "homeTeamName": "Hughes FBC",
    "awayTeamId": "paz",
    "awayTeamName": "Atlético Paz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-1",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "bombal-jrs",
    "homeTeamName": "Bombal Jrs",
    "awayTeamId": "sp-bombal",
    "awayTeamName": "Sp. Bombal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-2",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "carreras",
    "homeTeamName": "Carreras AC",
    "awayTeamId": "miguel-torres",
    "awayTeamName": "Dep. Miguel Torres",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-3",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "olimpia",
    "homeTeamName": "Olimpia",
    "awayTeamId": "rivadavia",
    "awayTeamName": "B. Rivadavia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-4",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "blanco-y-negro",
    "homeTeamName": "Blanco y Negro",
    "awayTeamId": "los-andes",
    "awayTeamName": "Los Andes",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-5",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "argentino",
    "homeTeamName": "C.A. Argentino",
    "awayTeamId": "firmat",
    "awayTeamName": "Firmat FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-6",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "independiente",
    "homeTeamName": "Independiente FC",
    "awayTeamId": "sporting",
    "awayTeamName": "Sporting CS",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-7",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "alberdi",
    "homeTeamName": "Nuevo Alberdi",
    "awayTeamId": "fredriksson",
    "awayTeamName": "Fredriksson FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-8",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "san-martin",
    "homeTeamName": "San Martín",
    "awayTeamId": "acebal",
    "awayTeamName": "Atl. Acebal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-9",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "italo",
    "homeTeamName": "Ítalo Argentino",
    "awayTeamId": "hughes",
    "awayTeamName": "Hughes FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f4-10",
    "roundName": "Fecha 4",
    "date": "20/9/2026",
    "homeTeamId": "paz",
    "homeTeamName": "Atlético Paz",
    "awayTeamId": "hertz",
    "awayTeamName": "Eduardo Hertz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f5-26",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "blanco-y-negro",
    "homeTeamName": "Blanco y Negro",
    "awayTeamId": "alberdi",
    "awayTeamName": "Nuevo Alberdi",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f5-27",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "rivadavia",
    "homeTeamName": "B. Rivadavia",
    "awayTeamId": "acebal",
    "awayTeamName": "Atl. Acebal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f5-28",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "firmat",
    "homeTeamName": "Firmat FBC",
    "awayTeamId": "independiente",
    "awayTeamName": "Independiente FC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f5-29",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "hughes",
    "homeTeamName": "Hughes FBC",
    "awayTeamId": "carreras",
    "awayTeamName": "Carreras AC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f5-30",
    "roundName": "Fecha 5",
    "date": "27/9/2026",
    "homeTeamId": "paz",
    "homeTeamName": "Atlético Paz",
    "awayTeamId": "bombal-jrs",
    "awayTeamName": "Bombal Jrs",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f6-31",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "independiente",
    "homeTeamName": "Independiente FC",
    "awayTeamId": "hughes",
    "awayTeamName": "Hughes FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f6-32",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "acebal",
    "homeTeamName": "Atl. Acebal",
    "awayTeamId": "firmat",
    "awayTeamName": "Firmat FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f6-33",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "alberdi",
    "homeTeamName": "Nuevo Alberdi",
    "awayTeamId": "rivadavia",
    "awayTeamName": "B. Rivadavia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f6-34",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "bombal-jrs",
    "homeTeamName": "Bombal Jrs",
    "awayTeamId": "blanco-y-negro",
    "awayTeamName": "Blanco y Negro",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f6-35",
    "roundName": "Fecha 6",
    "date": "30/9/2026",
    "homeTeamId": "carreras",
    "homeTeamName": "Carreras AC",
    "awayTeamId": "paz",
    "awayTeamName": "Atlético Paz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f7-36",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "rivadavia",
    "homeTeamName": "B. Rivadavia",
    "awayTeamId": "bombal-jrs",
    "awayTeamName": "Bombal Jrs",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f7-37",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "firmat",
    "homeTeamName": "Firmat FBC",
    "awayTeamId": "alberdi",
    "awayTeamName": "Nuevo Alberdi",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f7-38",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "hughes",
    "homeTeamName": "Hughes FBC",
    "awayTeamId": "acebal",
    "awayTeamName": "Atl. Acebal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f7-39",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "carreras",
    "homeTeamName": "Carreras AC",
    "awayTeamId": "independiente",
    "awayTeamName": "Independiente FC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f7-40",
    "roundName": "Fecha 7",
    "date": "4/10/2026",
    "homeTeamId": "paz",
    "homeTeamName": "Atlético Paz",
    "awayTeamId": "blanco-y-negro",
    "awayTeamName": "Blanco y Negro",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f8-41",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "acebal",
    "homeTeamName": "Atl. Acebal",
    "awayTeamId": "carreras",
    "awayTeamName": "Carreras AC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f8-42",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "alberdi",
    "homeTeamName": "Nuevo Alberdi",
    "awayTeamId": "hughes",
    "awayTeamName": "Hughes FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f8-43",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "bombal-jrs",
    "homeTeamName": "Bombal Jrs",
    "awayTeamId": "firmat",
    "awayTeamName": "Firmat FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f8-44",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "blanco-y-negro",
    "homeTeamName": "Blanco y Negro",
    "awayTeamId": "rivadavia",
    "awayTeamName": "B. Rivadavia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f8-45",
    "roundName": "Fecha 8",
    "date": "11/10/2026",
    "homeTeamId": "independiente",
    "homeTeamName": "Independiente FC",
    "awayTeamId": "paz",
    "awayTeamName": "Atlético Paz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-1",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "sp-bombal",
    "homeTeamName": "Sp. Bombal",
    "awayTeamId": "bombal-jrs",
    "awayTeamName": "Bombal Jrs",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-2",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "miguel-torres",
    "homeTeamName": "Dep. Miguel Torres",
    "awayTeamId": "carreras",
    "awayTeamName": "Carreras AC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-3",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "rivadavia",
    "homeTeamName": "B. Rivadavia",
    "awayTeamId": "olimpia",
    "awayTeamName": "Olimpia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-4",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "los-andes",
    "homeTeamName": "Los Andes",
    "awayTeamId": "blanco-y-negro",
    "awayTeamName": "Blanco y Negro",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-5",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "firmat",
    "homeTeamName": "Firmat FBC",
    "awayTeamId": "argentino",
    "awayTeamName": "C.A. Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-6",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "sporting",
    "homeTeamName": "Sporting CS",
    "awayTeamId": "independiente",
    "awayTeamName": "Independiente FC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-7",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "fredriksson",
    "homeTeamName": "Fredriksson FBC",
    "awayTeamId": "alberdi",
    "awayTeamName": "Nuevo Alberdi",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-8",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "acebal",
    "homeTeamName": "Atl. Acebal",
    "awayTeamId": "san-martin",
    "awayTeamName": "San Martín",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-9",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "hughes",
    "homeTeamName": "Hughes FBC",
    "awayTeamId": "italo",
    "awayTeamName": "Ítalo Argentino",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-inter-f9-10",
    "roundName": "Fecha 9",
    "date": "18/10/2026",
    "homeTeamId": "hertz",
    "homeTeamName": "Eduardo Hertz",
    "awayTeamId": "paz",
    "awayTeamName": "Atlético Paz",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f10-56",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "firmat",
    "homeTeamName": "Firmat FBC",
    "awayTeamId": "blanco-y-negro",
    "awayTeamName": "Blanco y Negro",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f10-57",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "hughes",
    "homeTeamName": "Hughes FBC",
    "awayTeamId": "bombal-jrs",
    "awayTeamName": "Bombal Jrs",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f10-58",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "carreras",
    "homeTeamName": "Carreras AC",
    "awayTeamId": "alberdi",
    "awayTeamName": "Nuevo Alberdi",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f10-59",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "independiente",
    "homeTeamName": "Independiente FC",
    "awayTeamId": "acebal",
    "awayTeamName": "Atl. Acebal",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f10-60",
    "roundName": "Fecha 10",
    "date": "25/10/2026",
    "homeTeamId": "paz",
    "homeTeamName": "Atlético Paz",
    "awayTeamId": "rivadavia",
    "awayTeamName": "B. Rivadavia",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f11-61",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "alberdi",
    "homeTeamName": "Nuevo Alberdi",
    "awayTeamId": "independiente",
    "awayTeamName": "Independiente FC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f11-62",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "bombal-jrs",
    "homeTeamName": "Bombal Jrs",
    "awayTeamId": "carreras",
    "awayTeamName": "Carreras AC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f11-63",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "blanco-y-negro",
    "homeTeamName": "Blanco y Negro",
    "awayTeamId": "hughes",
    "awayTeamName": "Hughes FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f11-64",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "rivadavia",
    "homeTeamName": "B. Rivadavia",
    "awayTeamId": "firmat",
    "awayTeamName": "Firmat FBC",
    "homeGoals": null,
    "awayGoals": null
  },
  {
    "id": "clausura-zb-f11-65",
    "roundName": "Fecha 11",
    "date": "1/11/2026",
    "homeTeamId": "acebal",
    "homeTeamName": "Atl. Acebal",
    "awayTeamId": "paz",
    "awayTeamName": "Atlético Paz",
    "homeGoals": null,
    "awayGoals": null
  }
];
