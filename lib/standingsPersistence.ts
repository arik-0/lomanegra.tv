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
} from './standingsStore';

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

const DATA_DIR = path.join(process.cwd(), 'data');
const PERSISTENCE_FILE = path.join(DATA_DIR, 'standings_persistence.json');

export const SYSTEM_MATCH_ID_APERTURA = '00000000-0000-0000-0000-0000000000a1';
export const SYSTEM_MATCH_ID_CLAUSURA = '00000000-0000-0000-0000-0000000000c1';

// Cargar desde Supabase: prioritario tabla 'standings', o registros del sistema en 'matches'
async function loadFromSupabase(): Promise<{ apertura: TournamentStandings; clausura: TournamentStandings } | null> {
  try {
    // 1. Intentar leer de la tabla dedicada 'public.standings'
    const { data: standingsRows, error: sErr } = await supabaseAdmin
      .from('standings')
      .select('*');

    if (!sErr && standingsRows && standingsRows.length > 0) {
      let apertura: TournamentStandings | null = null;
      let clausura: TournamentStandings | null = null;
      for (const row of standingsRows) {
        if (row.id === 'apertura') apertura = row.data;
        if (row.id === 'clausura') clausura = row.data;
      }
      if (apertura && clausura) {
        console.log('[StandingsPersistence] Cargado exitosamente desde tabla Supabase `standings`');
        return { apertura, clausura };
      }
    }

    // 2. Si aún no existe la tabla dedicada, leer de los registros del sistema en 'public.matches'
    const { data: matchRows, error: mErr } = await supabaseAdmin
      .from('matches')
      .select('id, title, description')
      .in('id', [SYSTEM_MATCH_ID_APERTURA, SYSTEM_MATCH_ID_CLAUSURA]);

    if (!mErr && matchRows && matchRows.length > 0) {
      let apertura: TournamentStandings | null = null;
      let clausura: TournamentStandings | null = null;
      for (const row of matchRows) {
        try {
          if (row.id === SYSTEM_MATCH_ID_APERTURA && row.description) {
            apertura = JSON.parse(row.description);
          } else if (row.id === SYSTEM_MATCH_ID_CLAUSURA && row.description) {
            clausura = JSON.parse(row.description);
          }
        } catch (e) {
          console.error('[StandingsPersistence] Error parseando JSON de match row:', e);
        }
      }
      if (apertura || clausura) {
        console.log('[StandingsPersistence] Cargado exitosamente desde registros Supabase en `matches`');
        return {
          apertura: apertura || JSON.parse(JSON.stringify(defaultAperturaStandings)),
          clausura: clausura || JSON.parse(JSON.stringify(defaultClausuraStandings)),
        };
      }
    }
  } catch (err) {
    console.error('[StandingsPersistence] Excepción conectando a Supabase:', err);
  }
  return null;
}

// Guardar en Supabase: tabla dedicada y registros del sistema en matches
async function saveToSupabase(key: 'apertura' | 'clausura', standings: TournamentStandings) {
  try {
    // 1. Intentar upsert en tabla dedicada 'public.standings'
    try {
      await supabaseAdmin
        .from('standings')
        .upsert({
          id: key,
          data: standings,
          updated_at: new Date().toISOString(),
        });
    } catch {
      // Ignorar si la tabla no fue creada aún
    }

    // 2. Guardar también en registro del sistema en 'public.matches' (garantiza persistencia inmediata 100%)
    const matchId = key === 'clausura' ? SYSTEM_MATCH_ID_CLAUSURA : SYSTEM_MATCH_ID_APERTURA;
    const title = key === 'clausura' ? '__SYSTEM_STANDINGS_CLAUSURA__' : '__SYSTEM_STANDINGS_APERTURA__';
    const { error: mErr } = await supabaseAdmin
      .from('matches')
      .upsert({
        id: matchId,
        title: title,
        description: JSON.stringify(standings),
        date: '2099-12-31T23:59:59.000Z',
        price: 0,
        cloudflare_live_input_uid: 'system',
        is_active: false,
      }, { onConflict: 'id' });

    if (mErr) {
      console.error(`[StandingsPersistence] Error guardando registro sistema en Supabase matches:`, mErr);
    } else {
      console.log(`[StandingsPersistence] Persistido exitosamente en Supabase matches (${key})`);
    }
  } catch (err) {
    console.error('[StandingsPersistence] Excepción guardando en Supabase:', err);
  }
}

// Copia de seguridad en disco
function saveToPersistenceFile(store: { apertura: TournamentStandings; clausura: TournamentStandings }) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PERSISTENCE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('[StandingsPersistence] Error al guardar persistencia en disco:', err);
  }
}

function loadFromPersistenceFile(): { apertura: TournamentStandings; clausura: TournamentStandings } | null {
  try {
    if (fs.existsSync(PERSISTENCE_FILE)) {
      const content = fs.readFileSync(PERSISTENCE_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.apertura && parsed.clausura) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[StandingsPersistence] Error al leer archivo de persistencia:', err);
  }
  return null;
}

let initPromise: Promise<void> | null = null;

export async function ensureGlobalStore(): Promise<{ apertura: TournamentStandings; clausura: TournamentStandings }> {
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

      // 2. Cargar desde archivo local si Supabase aún no tiene registros
      const fromDisk = loadFromPersistenceFile();
      if (fromDisk) {
        globalThis.globalTournamentsStore = fromDisk;
        saveToSupabase('apertura', fromDisk.apertura).catch(() => {});
        saveToSupabase('clausura', fromDisk.clausura).catch(() => {});
        return;
      }

      // 3. Fallback con estructuras iniciales
      globalThis.globalTournamentsStore = {
        apertura: JSON.parse(JSON.stringify(defaultAperturaStandings)),
        clausura: JSON.parse(JSON.stringify(defaultClausuraStandings)),
      };
      saveToPersistenceFile(globalThis.globalTournamentsStore);
      saveToSupabase('apertura', globalThis.globalTournamentsStore.apertura).catch(() => {});
      saveToSupabase('clausura', globalThis.globalTournamentsStore.clausura).catch(() => {});
    })();
  }

  await initPromise;
  return globalThis.globalTournamentsStore!;
}

// Inicialización asincrónica inmediata al importar el módulo
ensureGlobalStore().catch((err) => {
  console.error('[StandingsPersistence] Error en inicialización temprana:', err);
});

export async function getStandings(torneo?: TorneoType | string): Promise<TournamentStandings> {
  const store = await ensureGlobalStore();
  const key = normalizeTorneoKey(torneo);
  return store[key] || store.apertura;
}

export function getStandingsSync(torneo?: TorneoType | string): TournamentStandings {
  const key = normalizeTorneoKey(torneo);
  if (globalThis.globalTournamentsStore) {
    return globalThis.globalTournamentsStore[key] || globalThis.globalTournamentsStore.apertura;
  }
  const fromDisk = loadFromPersistenceFile();
  if (fromDisk) {
    globalThis.globalTournamentsStore = fromDisk;
    return fromDisk[key] || fromDisk.apertura;
  }
  return key === 'clausura' ? defaultClausuraStandings : defaultAperturaStandings;
}

export async function updateStandings(
  newStandings: Partial<TournamentStandings>,
  torneoOverride?: TorneoType | string
): Promise<TournamentStandings> {
  const store = await ensureGlobalStore();
  const key = normalizeTorneoKey(torneoOverride || newStandings.torneo);
  const current = store[key];

  const merged: TournamentStandings = {
    ...current,
    ...newStandings,
    torneo: key,
  };

  const synced = syncPlayoffMatches(merged);
  store[key] = synced;

  // Guardar copia local en disco
  saveToPersistenceFile(store);

  // Persistir en Supabase
  await saveToSupabase(key, synced);

  return synced;
}

export async function resetStandings(torneo?: TorneoType | string): Promise<TournamentStandings> {
  const store = await ensureGlobalStore();
  const key = normalizeTorneoKey(torneo);
  const defaultData = key === 'clausura' ? defaultClausuraStandings : defaultAperturaStandings;

  store[key] = JSON.parse(JSON.stringify(defaultData));
  saveToPersistenceFile(store);

  await saveToSupabase(key, store[key]);
  return store[key];
}
