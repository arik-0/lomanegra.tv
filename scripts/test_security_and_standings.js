const assert = require('assert');
const fs = require('fs');

console.log('--- TEST 1: Verificación de Tablas de Posiciones Persistidas ---');
const data = JSON.parse(fs.readFileSync('./data/standings_persistence.json', 'utf8'));

// Test Senior
assert(data['futbol_senior_clausura'], 'Debe existir futbol_senior_clausura');
const senior = data['futbol_senior_clausura'];
assert.strictEqual(senior.categoria, 'senior');
assert.strictEqual(senior.zones.length, 2, 'Senior debe tener 2 zonas');
assert.strictEqual(senior.zones[0].teams.length, 11, 'Zona A debe tener 11 equipos');
assert.strictEqual(senior.zones[1].teams.length, 11, 'Zona B debe tener 11 equipos');
assert.strictEqual(senior.zones[0].teams[0].name, 'Sportivo FC');
assert.strictEqual(senior.zones[0].teams[0].pts, 20);
assert.strictEqual(senior.zones[1].teams[0].name, 'Atlético Chabás');
assert.strictEqual(senior.zones[1].teams[0].pts, 19);
console.log('✔ Fútbol Senior verificado con éxito (Zona A 11 equipos, Zona B 11 equipos)');

// Test Reserva +30
assert(data['futbol_reserva_30_clausura'], 'Debe existir futbol_reserva_30_clausura');
const r30 = data['futbol_reserva_30_clausura'];
assert.strictEqual(r30.categoria, 'reserva_30');
assert.strictEqual(r30.zones[0].teams.length, 8, 'Reserva +30 debe tener 8 equipos');
assert.strictEqual(r30.zones[0].teams[0].name, 'Los Andes');
assert.strictEqual(r30.zones[0].teams[0].pts, 6);
console.log('✔ Reserva +30 verificado con éxito (8 equipos)');

// Test Hockey Fecha 18
const hk1 = data['hockey_primera_hockey_clausura'];
assert.strictEqual(hk1.zones[0].teams[0].name, 'Atletico Empalme');
assert.strictEqual(hk1.zones[0].teams[0].pts, 40);
assert.strictEqual(hk1.zones[0].teams[1].name, 'Eduardo Hertz');
assert.strictEqual(hk1.zones[0].teams[1].pts, 35);

const hk13 = data['hockey_sub13_hockey_clausura'];
assert.strictEqual(hk13.zones[0].teams[0].name, 'Alianza Dep. Fuentes');
assert.strictEqual(hk13.zones[0].teams[0].pts, 42);

const hk16 = data['hockey_sub16_hockey_clausura'];
assert.strictEqual(hk16.zones[0].teams[0].name, 'Eduardo Hertz');
assert.strictEqual(hk16.zones[0].teams[0].pts, 26);

const hk19 = data['hockey_sub19_hockey_clausura'];
assert.strictEqual(hk19.zones[0].teams[0].name, 'Blanco y Negro');
assert.strictEqual(hk19.zones[0].teams[0].pts, 31);

const hkm30 = data['hockey_mas30_hockey_clausura'];
assert.strictEqual(hkm30.zones[0].teams[0].name, 'Independiente de Bigand');
assert.strictEqual(hkm30.zones[0].teams[0].pts, 20);

console.log('✔ Hockey LCUH Fecha 18 verificado para todas las categorías (Primera, Sub-19, Sub-16, Sub-13, +30)');

console.log('--- TEST 2: Verificación de Código de Blindaje de Seguridad PPV ---');
const partidoPageCode = fs.readFileSync('./app/partido/[id]/page.tsx', 'utf8');
assert(partidoPageCode.includes(".eq('status', 'approved')"), 'Debe exigir status approved');
assert(partidoPageCode.includes("q = q.eq('match_id', match.id);"), 'Debe exigir match_id estricto');
assert(partidoPageCode.includes('if (!isValidUUID(match.id))'), 'Debe validar UUID del match');
console.log('✔ app/partido/[id]/page.tsx blindado contra acceso cruzado');

const verifyRouteCode = fs.readFileSync('./app/api/purchases/verify/route.ts', 'utf8');
assert(verifyRouteCode.includes(".eq('match_id', matchId)"), 'Debe verificar match_id');
assert(verifyRouteCode.includes("mpMatchId !== matchId"), 'Debe rechazar comprobantes de otro partido');
console.log('✔ app/api/purchases/verify/route.ts blindado contra reutilización de pagos');

const tokenRouteCode = fs.readFileSync('./app/api/stream/token/route.ts', 'utf8');
assert(tokenRouteCode.includes(".eq('match_id', targetId)"), 'Debe exigir match_id para emitir token de video');
assert(tokenRouteCode.includes("!isValidUUID(targetId)"), 'Debe rechazar UUID inválido');
console.log('✔ app/api/stream/token/route.ts blindado para reproducción de video');

console.log('TODO PASÓ CON ÉXITO.');
