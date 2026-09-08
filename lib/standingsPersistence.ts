if (typeof process !== 'undefined') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabase/admin';
import {
  TournamentStandings,
  defaultAperturaStandings,
  defaultClausuraStandings,
  syncPlayoffMatches,
  TorneoType,
  DeporteType,
  CategoriaType,
  createDefaultStandings,
} from './standingsStore';

declare global {
  // eslint-disable-next-line no-var
  var globalTournamentsStore: Record<string, TournamentStandings> | undefined;
}

export function normalizeTournamentKey(
  deporte?: string,
  categoria?: string,
  torneo?: string
): string {
  if (deporte === 'apertura' || deporte === 'clausura') {
    return deporte === 'clausura' ? 'futbol_mayor_clausura' : 'futbol_mayor_apertura';
  }

  const d = (deporte || 'futbol').toLowerCase().trim();
  const isHockey = d.includes('hockey');
  const dep = isHockey ? 'hockey' : 'futbol';

  const t = (torneo || 'apertura').toLowerCase().trim();
  const tor = t === 'clausura' || t === 'segundo' ? 'clausura' : 'apertura';

  let cat = (categoria || (isHockey ? 'primera_hockey' : 'mayor')).toLowerCase().trim();
  if (cat === 'primera' || cat === 'futbol mayor') cat = 'mayor';
  if (cat === 'primera hockey' || cat === 'hockey primera') cat = 'primera_hockey';

  return `${dep}_${cat}_${tor}`;
}

export function normalizeTorneoKey(torneo?: string): 'apertura' | 'clausura' {
  if (!torneo) return 'apertura';
  const clean = torneo.toLowerCase().trim();
  if (clean === 'clausura' || clean === 'segundo') return 'clausura';
  return 'apertura';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const PERSISTENCE_FILE = path.join(DATA_DIR, 'standings_persistence.json');

export const SYSTEM_MATCH_ID_APERTURA = '00000000-0000-0000-0000-0000000000a1';
export const SYSTEM_MATCH_ID_CLAUSURA = '00000000-0000-0000-0000-0000000000c1';

// Cargar desde Supabase
async function loadFromSupabase(): Promise<Record<string, TournamentStandings> | null> {
  try {
    // 1. Intentar leer de la tabla dedicada 'public.standings'
    const { data: standingsRows, error: sErr } = await supabaseAdmin
      .from('standings')
      .select('*');

    if (!sErr && standingsRows && standingsRows.length > 0) {
      const storeMap: Record<string, TournamentStandings> = {};
      for (const row of standingsRows) {
        if (row.id && row.data) {
          storeMap[row.id] = row.data;
        }
      }
      if (Object.keys(storeMap).length > 0) {
        return storeMap;
      }
    }

    // 2. Si no hay tabla dedicada, leer de los registros del sistema en 'public.matches'
    const { data: matchRows, error: mErr } = await supabaseAdmin
      .from('matches')
      .select('id, title, description')
      .in('id', [SYSTEM_MATCH_ID_APERTURA, SYSTEM_MATCH_ID_CLAUSURA]);

    if (!mErr && matchRows && matchRows.length > 0) {
      const storeMap: Record<string, TournamentStandings> = {};
      for (const row of matchRows) {
        try {
          if (row.id === SYSTEM_MATCH_ID_APERTURA && row.description) {
            const ap = JSON.parse(row.description);
            storeMap['futbol_mayor_apertura'] = ap;
            storeMap['apertura'] = ap;
          } else if (row.id === SYSTEM_MATCH_ID_CLAUSURA && row.description) {
            const cl = JSON.parse(row.description);
            storeMap['futbol_mayor_clausura'] = cl;
            storeMap['clausura'] = cl;
          }
        } catch (e) {
          console.error('[StandingsPersistence] Error parseando JSON de match row:', e);
        }
      }
      if (Object.keys(storeMap).length > 0) {
        return storeMap;
      }
    }
  } catch (err) {
    console.error('[StandingsPersistence] Excepción conectando a Supabase:', err);
  }
  return null;
}

// Guardar en Supabase
async function saveToSupabase(key: string, standings: TournamentStandings) {
  try {
    // 1. Intentar upsert en tabla dedicada 'public.standings'
    try {
      await supabaseAdmin.from('standings').upsert({
        id: key,
        data: standings,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    // 2. Si es fútbol mayor apertura/clausura, guardar en match row del sistema
    if (key === 'futbol_mayor_apertura' || key === 'apertura') {
      await supabaseAdmin.from('matches').upsert({
        id: SYSTEM_MATCH_ID_APERTURA,
        title: '__SYSTEM_STANDINGS_APERTURA__',
        description: JSON.stringify(standings),
        date: '2099-12-31T23:59:59.000Z',
        price: 0,
        cloudflare_live_input_uid: 'system',
        is_active: false,
      }, { onConflict: 'id' });
    } else if (key === 'futbol_mayor_clausura' || key === 'clausura') {
      await supabaseAdmin.from('matches').upsert({
        id: SYSTEM_MATCH_ID_CLAUSURA,
        title: '__SYSTEM_STANDINGS_CLAUSURA__',
        description: JSON.stringify(standings),
        date: '2099-12-31T23:59:59.000Z',
        price: 0,
        cloudflare_live_input_uid: 'system',
        is_active: false,
      }, { onConflict: 'id' });
    }
  } catch (err) {
    console.error('[StandingsPersistence] Excepción guardando en Supabase:', err);
  }
}

// Copia de seguridad en disco
function saveToPersistenceFile(store: Record<string, TournamentStandings>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('[StandingsPersistence] Error al guardar persistencia en disco:', err);
  }
}

function loadFromPersistenceFile(): Record<string, TournamentStandings> | null {
  try {
    if (fs.existsSync(PERSISTENCE_FILE)) {
      const content = fs.readFileSync(PERSISTENCE_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[StandingsPersistence] Error al leer archivo de persistencia:', err);
  }
  return null;
}

let initPromise: Promise<void> | null = null;

export async function ensureGlobalStore(): Promise<Record<string, TournamentStandings>> {
  if (globalThis.globalTournamentsStore) {
    return globalThis.globalTournamentsStore;
  }

  if (!initPromise) {
    initPromise = (async () => {
      // 1. Cargar desde Supabase como fuente primaria
      const fromSupabase = await loadFromSupabase();
      if (fromSupabase) {
        globalThis.globalTournamentsStore = fromSupabase;
        saveToPersistenceFile(fromSupabase);
        return;
      }

      // 2. Cargar desde archivo local
      const fromDisk = loadFromPersistenceFile();
      if (fromDisk) {
        globalThis.globalTournamentsStore = fromDisk;
        return;
      }

      // 3. Fallback con estructuras iniciales
      const initialStore: Record<string, TournamentStandings> = {
        apertura: JSON.parse(JSON.stringify(defaultAperturaStandings)),
        clausura: JSON.parse(JSON.stringify(defaultClausuraStandings)),
        futbol_mayor_apertura: JSON.parse(JSON.stringify(defaultAperturaStandings)),
        futbol_mayor_clausura: JSON.parse(JSON.stringify(defaultClausuraStandings)),
      };
      globalThis.globalTournamentsStore = initialStore;
      saveToPersistenceFile(initialStore);
      saveToSupabase('apertura', initialStore.apertura).catch(() => {});
      saveToSupabase('clausura', initialStore.clausura).catch(() => {});
    })();
  }

  await initPromise;
  return globalThis.globalTournamentsStore!;
}

// Inicialización asincrónica inmediata al importar el módulo
ensureGlobalStore().catch((err) => {
  console.error('[StandingsPersistence] Error en inicialización temprana:', err);
});

export async function getStandings(
  query?:
    | string
    | { deporte?: DeporteType | string; categoria?: CategoriaType | string; torneo?: TorneoType | string }
): Promise<TournamentStandings> {
  const store = await ensureGlobalStore();

  let deporte: string | undefined;
  let categoria: string | undefined;
  let torneo: string | undefined;

  if (typeof query === 'string') {
    torneo = query;
  } else if (query) {
    deporte = query.deporte;
    categoria = query.categoria;
    torneo = query.torneo;
  }

  const key = normalizeTournamentKey(deporte, categoria, torneo);

  if (store[key]) {
    return store[key];
  }

  // Compatibilidad hacia atrás
  if ((key === 'futbol_mayor_apertura' || !deporte) && store['apertura']) {
    return store['apertura'];
  }
  if ((key === 'futbol_mayor_clausura' || !deporte) && store['clausura']) {
    return store['clausura'];
  }

  // Si no existe para este deporte y categoría, generar plantilla limpia y guardarla
  const generated = createDefaultStandings(
    (deporte as DeporteType) || 'futbol',
    (categoria as CategoriaType) || 'mayor',
    (torneo as TorneoType) || 'apertura'
  );

  store[key] = generated;
  saveToPersistenceFile(store);
  saveToSupabase(key, generated).catch(() => {});

  return generated;
}

export function getStandingsSync(
  query?:
    | string
    | { deporte?: DeporteType | string; categoria?: CategoriaType | string; torneo?: TorneoType | string }
): TournamentStandings {
  let deporte: string | undefined;
  let categoria: string | undefined;
  let torneo: string | undefined;

  if (typeof query === 'string') {
    torneo = query;
  } else if (query) {
    deporte = query.deporte;
    categoria = query.categoria;
    torneo = query.torneo;
  }

  const key = normalizeTournamentKey(deporte, categoria, torneo);

  if (globalThis.globalTournamentsStore && globalThis.globalTournamentsStore[key]) {
    return globalThis.globalTournamentsStore[key];
  }
  const fromDisk = loadFromPersistenceFile();
  if (fromDisk && fromDisk[key]) {
    if (!globalThis.globalTournamentsStore) globalThis.globalTournamentsStore = fromDisk;
    return fromDisk[key];
  }

  return createDefaultStandings(
    (deporte as DeporteType) || 'futbol',
    (categoria as CategoriaType) || 'mayor',
    (torneo as TorneoType) || 'apertura'
  );
}

export async function updateStandings(
  newStandings: Partial<TournamentStandings>,
  queryOverride?:
    | string
    | { deporte?: DeporteType | string; categoria?: CategoriaType | string; torneo?: TorneoType | string }
): Promise<TournamentStandings> {
  const store = await ensureGlobalStore();

  let deporte = newStandings.deporte;
  let categoria = newStandings.categoria;
  let torneo = newStandings.torneo;

  if (typeof queryOverride === 'string') {
    torneo = queryOverride as any;
  } else if (queryOverride) {
    if (queryOverride.deporte) deporte = queryOverride.deporte as any;
    if (queryOverride.categoria) categoria = queryOverride.categoria as any;
    if (queryOverride.torneo) torneo = queryOverride.torneo as any;
  }

  const key = normalizeTournamentKey(deporte, categoria, torneo);
  const current = store[key] || createDefaultStandings(deporte, categoria, torneo);

  const merged: TournamentStandings = {
    ...current,
    ...newStandings,
    deporte: deporte || current.deporte || 'futbol',
    categoria: categoria || current.categoria || 'mayor',
    torneo: (torneo as TorneoType) || current.torneo || 'apertura',
  };

  const synced = syncPlayoffMatches(merged);
  store[key] = synced;

  // Retrocompatibilidad
  if (key === 'futbol_mayor_apertura') {
    store['apertura'] = synced;
  } else if (key === 'futbol_mayor_clausura') {
    store['clausura'] = synced;
  }

  // Guardar copia local en disco
  saveToPersistenceFile(store);

  // Persistir en Supabase
  await saveToSupabase(key, synced);

  return synced;
}

export async function resetStandings(
  query?:
    | string
    | { deporte?: DeporteType | string; categoria?: CategoriaType | string; torneo?: TorneoType | string }
): Promise<TournamentStandings> {
  const store = await ensureGlobalStore();

  let deporte: string | undefined;
  let categoria: string | undefined;
  let torneo: string | undefined;

  if (typeof query === 'string') {
    torneo = query;
  } else if (query) {
    deporte = query.deporte;
    categoria = query.categoria;
    torneo = query.torneo;
  }

  const key = normalizeTournamentKey(deporte, categoria, torneo);
  const defaultData = createDefaultStandings(
    (deporte as DeporteType) || 'futbol',
    (categoria as CategoriaType) || 'mayor',
    (torneo as TorneoType) || 'apertura'
  );

  store[key] = JSON.parse(JSON.stringify(defaultData));
  if (key === 'futbol_mayor_apertura') store['apertura'] = store[key];
  if (key === 'futbol_mayor_clausura') store['clausura'] = store[key];

  saveToPersistenceFile(store);

  await saveToSupabase(key, store[key]);
  return store[key];
}

