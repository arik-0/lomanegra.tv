process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fs = require('fs');
const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// 1. Obtener la versión anterior con los 42 partidos cargados por el socio
console.log('Recuperando partidos cargados desde el historial de git...');
const oldJsonStr = execSync('git show fc34786~1:data/standings_persistence.json', { maxBuffer: 50 * 1024 * 1024 }).toString();
const oldData = JSON.parse(oldJsonStr);

const currentData = JSON.parse(fs.readFileSync('./data/standings_persistence.json', 'utf8'));

// 2. Extraer futbol_mayor_clausura y futbol_reserva_clausura del histórico
const restoredMayor = oldData['futbol_mayor_clausura'];
const restoredReserva = oldData['futbol_reserva_clausura'];

// Resultados de Fecha 5 Oficial (Boletín Nº 34 - 27/09/2026)
const fecha5MayorResults = [
  // Zona A
  { home: 'Sporting CS', away: 'C.A. Argentino', hg: 0, ag: 4 },
  { home: 'Fredriksson FBC', away: 'Los Andes', hg: 2, ag: 2 },
  { home: 'Dep. Miguel Torres', away: 'Ítalo Argentino', hg: 1, ag: 0 },
  { home: 'Sp. Bombal', away: 'Eduardo Hertz', hg: 2, ag: 1 },
  // Zona B
  { home: 'Blanco y Negro', away: 'Nuevo Alberdi', hg: 5, ag: 1 },
  { home: 'Firmat FBC', away: 'Independiente FC', hg: 2, ag: 1 },
  { home: 'Atlético Paz', away: 'Bombal Jrs', hg: 1, ag: 0 },
  { home: 'Hughes FBC', away: 'Carreras AC', hg: 2, ag: 1 },
  { home: 'B. Rivadavia', away: 'Atl. Acebal', hg: 0, ag: 0 },
];

const fecha5ReservaResults = [
  // Zona A
  { home: 'Sporting CS', away: 'C.A. Argentino', hg: 2, ag: 2 },
  { home: 'Fredriksson FBC', away: 'Los Andes', hg: 1, ag: 3 },
  { home: 'Dep. Miguel Torres', away: 'Ítalo Argentino', hg: 1, ag: 1 },
  { home: 'Sp. Bombal', away: 'Eduardo Hertz', hg: 1, ag: 1 },
  // Zona B
  { home: 'Blanco y Negro', away: 'Nuevo Alberdi', hg: 3, ag: 0 },
  { home: 'Firmat FBC', away: 'Independiente FC', hg: 0, ag: 3 },
  { home: 'Atlético Paz', away: 'Bombal Jrs', hg: 0, ag: 0 },
  { home: 'Hughes FBC', away: 'Carreras AC', hg: 1, ag: 0 },
  { home: 'B. Rivadavia', away: 'Atl. Acebal', hg: 4, ag: 2 },
];

function applyResultsToTournament(tournament, resultsList) {
  tournament.zones.forEach((zone) => {
    zone.fixtures.forEach((fix) => {
      if (fix.roundName === 'Fecha 5') {
        const found = resultsList.find((r) => {
          const matchHome = fix.homeTeamName.toLowerCase().includes(r.home.toLowerCase()) || r.home.toLowerCase().includes(fix.homeTeamName.toLowerCase());
          const matchAway = fix.awayTeamName.toLowerCase().includes(r.away.toLowerCase()) || r.away.toLowerCase().includes(fix.awayTeamName.toLowerCase());
          return matchHome && matchAway;
        });
        if (found) {
          fix.homeGoals = found.hg;
          fix.awayGoals = found.ag;
          fix.date = '27/09/2026';
        }
      }
    });
  });
}

applyResultsToTournament(restoredMayor, fecha5MayorResults);
applyResultsToTournament(restoredReserva, fecha5ReservaResults);

// Tablas oficiales de Posiciones Fecha 5 (Boletín Oficial Nº 34)
const officialTeamsMayorZonaA = [
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

const officialTeamsMayorZonaB = [
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

const officialTeamsReservaZonaA = [
  { id: 'los-andes', pos: 1, name: 'Los Andes', logoUrl: '/teams/Los Andes.png', pj: 4, pg: 3, pe: 0, pp: 1, gf: 8, gc: 2, dif: 6, pts: 9, form: ['W', 'W', 'L', 'W'], qualified: true },
  { id: 'sp-bombal', pos: 2, name: 'Sportivo Bombal', logoUrl: '/teams/Sportivo Bombal.png', pj: 5, pg: 2, pe: 2, pp: 1, gf: 7, gc: 4, dif: 3, pts: 8, form: ['W', 'L', 'D', 'W', 'D'], qualified: true },
  { id: 'eduardo-hertz', pos: 3, name: 'Eduardo Hertz', logoUrl: '/teams/Eduardo Hertz.png', pj: 5, pg: 2, pe: 1, pp: 2, gf: 3, gc: 6, dif: -3, pts: 7, form: ['W', 'W', 'L', 'L', 'D'], qualified: true },
  { id: 'ca-argentino', pos: 4, name: 'C.A. Argentino', logoUrl: '/teams/Argentino de Firmat.png', pj: 5, pg: 1, pe: 3, pp: 1, gf: 4, gc: 4, dif: 0, pts: 6, form: ['L', 'D', 'W', 'D', 'D'], qualified: true },
  { id: 'fredriksson-fbc', pos: 5, name: 'Fredriksson FBC', logoUrl: '/teams/Fredriksson.png', pj: 5, pg: 1, pe: 2, pp: 2, gf: 9, gc: 7, dif: 2, pts: 5, form: ['D', 'L', 'D', 'W', 'L'], qualified: false },
  { id: 'san-martin', pos: 6, name: 'San Martín', logoUrl: '/teams/San Martin.png', pj: 4, pg: 1, pe: 2, pp: 1, gf: 3, gc: 4, dif: -1, pts: 5, form: ['D', 'W', 'L', 'D'], qualified: false },
  { id: 'dep-miguel-torres', pos: 7, name: 'Dep. Miguel Torres', logoUrl: '/teams/Miguel Torres.png', pj: 5, pg: 1, pe: 2, pp: 2, gf: 5, gc: 7, dif: -2, pts: 5, form: ['L', 'W', 'L', 'D', 'D'], qualified: false },
  { id: 'italo-argentino', pos: 8, name: 'Ítalo Argentino', logoUrl: '/teams/Italo Argentino.png', pj: 5, pg: 1, pe: 2, pp: 2, gf: 3, gc: 5, dif: -2, pts: 5, form: ['L', 'D', 'W', 'L', 'D'], qualified: false },
  { id: 'olimpia', pos: 9, name: 'Olimpia', logoUrl: '/teams/Olimpia de Santa Teresa.png', pj: 4, pg: 1, pe: 1, pp: 2, gf: 8, gc: 9, dif: -1, pts: 4, form: ['W', 'L', 'D', 'L'], qualified: false },
  { id: 'sporting-cs', pos: 10, name: 'Sporting CS', logoUrl: '/teams/Sporting de Bigan.png', pj: 4, pg: 0, pe: 2, pp: 2, gf: 4, gc: 7, dif: -3, pts: 2, form: ['L', 'L', 'D', 'D'], qualified: false },
];

const officialTeamsReservaZonaB = [
  { id: 'blanco-y-negro', pos: 1, name: 'Blanco y Negro', logoUrl: '/teams/Blanco y Negro.png', isBlancoYNegro: true, pj: 5, pg: 5, pe: 0, pp: 0, gf: 11, gc: 2, dif: 9, pts: 15, form: ['W', 'W', 'W', 'W', 'W'], qualified: true },
  { id: 'independiente-fc', pos: 2, name: 'Independiente FC', logoUrl: '/teams/ifc.png', pj: 5, pg: 4, pe: 0, pp: 1, gf: 13, gc: 4, dif: 9, pts: 12, form: ['W', 'L', 'W', 'W', 'W'], qualified: true },
  { id: 'b-rivadavia', pos: 3, name: 'B. Rivadavia', logoUrl: '/teams/Bernardino Rivadavia.png', pj: 5, pg: 3, pe: 1, pp: 1, gf: 11, gc: 7, dif: 4, pts: 10, form: ['D', 'W', 'L', 'W', 'W'], qualified: true },
  { id: 'atletico-paz', pos: 4, name: 'Atlético Paz', logoUrl: '/teams/Atletico Paz.png', pj: 5, pg: 2, pe: 3, pp: 0, gf: 9, gc: 3, dif: 6, pts: 9, form: ['D', 'W', 'D', 'W', 'D'], qualified: true },
  { id: 'hughes-fbc', pos: 5, name: 'Hughes FBC', logoUrl: '/teams/Hughes.png', pj: 5, pg: 2, pe: 3, pp: 0, gf: 5, gc: 3, dif: 2, pts: 9, form: ['D', 'D', 'D', 'W', 'W'], qualified: false },
  { id: 'bombal-jrs', pos: 6, name: 'Bombal Juniors', logoUrl: '/teams/Bombal Juniors.png', pj: 5, pg: 1, pe: 2, pp: 2, gf: 4, gc: 9, dif: -5, pts: 5, form: ['L', 'W', 'D', 'L', 'D'], qualified: false },
  { id: 'atl-acebal', pos: 7, name: 'Atlético Acebal', logoUrl: '/teams/Atletico Acebal.png', pj: 5, pg: 1, pe: 1, pp: 3, gf: 9, gc: 9, dif: 0, pts: 4, form: ['W', 'L', 'L', 'L', 'L'], qualified: false },
  { id: 'firmat-fbc', pos: 8, name: 'Firmat FBC', logoUrl: '/teams/Firmat FBC.png', pj: 5, pg: 0, pe: 4, pp: 1, gf: 4, gc: 7, dif: -3, pts: 4, form: ['D', 'D', 'D', 'D', 'L'], qualified: false },
  { id: 'carreras-ac', pos: 9, name: 'Carreras AC', logoUrl: '/teams/Carreras.png', pj: 5, pg: 0, pe: 2, pp: 3, gf: 2, gc: 7, dif: -5, pts: 2, form: ['D', 'L', 'D', 'L', 'L'], qualified: false },
  { id: 'nuevo-alberdi', pos: 10, name: 'Nuevo Alberdi', logoUrl: '/teams/Nuevo Alberdi.png', pj: 5, pg: 0, pe: 1, pp: 4, gf: 3, gc: 19, dif: -16, pts: 1, form: ['L', 'L', 'D', 'L', 'L'], qualified: false },
];

restoredMayor.zones[0].teams = officialTeamsMayorZonaA;
restoredMayor.zones[1].teams = officialTeamsMayorZonaB;

restoredReserva.zones[0].teams = officialTeamsReservaZonaA;
restoredReserva.zones[1].teams = officialTeamsReservaZonaB;

// Contar partidos con resultados en mayor y reserva
let countMayor = 0;
restoredMayor.zones.forEach((z) => {
  countMayor += z.fixtures.filter((f) => f.homeGoals !== null).length;
});
let countReserva = 0;
restoredReserva.zones.forEach((z) => {
  countReserva += z.fixtures.filter((f) => f.homeGoals !== null).length;
});

console.log(`Partidos restaurados con resultado: Mayor = ${countMayor}, Reserva = ${countReserva}`);

// Actualizar en el almacén persistente
currentData['futbol_mayor_clausura'] = restoredMayor;
currentData['clausura'] = restoredMayor;
currentData['futbol_reserva_clausura'] = restoredReserva;

fs.writeFileSync('./data/standings_persistence.json', JSON.stringify(currentData, null, 2), 'utf8');
console.log('✔ Archivo ./data/standings_persistence.json actualizado con éxito.');

// Sincronizar en Supabase
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
  async function syncDB() {
    console.log('Sincronizando con Supabase...');
    // Guardar copia mayor clausura
    await supabase.from('matches').upsert({
      id: '00000000-0000-0000-0000-0000000000c1',
      title: '__SYSTEM_STANDINGS_CLAUSURA__',
      description: JSON.stringify(restoredMayor),
      date: '2099-12-31T23:59:59.000Z',
      price: 0,
      cloudflare_live_input_uid: 'system',
      is_active: false,
    }, { onConflict: 'id' });

    // Guardar copia reserva clausura
    await supabase.from('matches').upsert({
      id: '77c0a673-4f5c-5bb1-d536-20d9798730dc',
      title: '__SYSTEM_STANDINGS_FUTBOL_RESERVA_CLAUSURA__',
      description: JSON.stringify(restoredReserva),
      date: '2099-12-31T23:59:59.000Z',
      price: 0,
      cloudflare_live_input_uid: 'system',
      is_active: false,
    }, { onConflict: 'id' });

    // Guardar copia maestra
    await supabase.from('matches').upsert({
      id: '00000000-0000-0000-0000-000000000000',
      title: '__SYSTEM_STANDINGS_STORE_ALL__',
      description: JSON.stringify(currentData),
      date: '2099-12-31T23:59:59.000Z',
      price: 0,
      cloudflare_live_input_uid: 'system',
      is_active: false,
    }, { onConflict: 'id' });

    console.log('✔ Supabase actualizado exitosamente.');
  }
  syncDB();
}
