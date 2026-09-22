// Almacén en memoria y utilidades para el Dashboard de Operaciones

export interface MatchData {
  id: string;
  title: string;
  description: string;
  date: string | null;
  is_date_confirmed: boolean;
  price: number;
  cloudflare_live_input_uid: string;
  image_url: string | null;
  is_active: boolean;
  is_live?: boolean; // false = En Espera (muestra Placeholder), true = Transmitiendo En Vivo
  league?: string;
  category?: string;
}

// Partidos base con estado inicial
export const initialAdminMatches: MatchData[] = [
  {
    id: 'b1343cdc-be37-4e30-9c29-fbb505721566',
    title: 'Carreras vs Blanco y Negro',
    description: 'Primera • Liga Deportiva del Sur',
    date: '2026-09-24T00:45:00.000Z',
    is_date_confirmed: true,
    price: 12000,
    cloudflare_live_input_uid: 'dac066a4fb5c97117189392adae3f453',
    image_url: '/matches/blanco-y-negro-vs-ifc.png',
    is_active: true,
    is_live: false,
    league: 'Liga Deportiva del Sur',
    category: 'Primera',
  },
  {
    id: '11db1ce1-b9c5-4dcb-9fa7-3b788feaeb20',
    title: 'Blanco y Negro vs Nuevo Alberdi',
    description: 'Primera • Liga Deportiva del Sur',
    date: null,
    is_date_confirmed: false,
    price: 12000,
    cloudflare_live_input_uid: 'live_input_byn',
    image_url: '/matches/blanco-y-negro-vs-ifc.png',
    is_active: true,
    is_live: false,
    league: 'Liga Deportiva del Sur',
    category: 'Primera',
  },
  {
    id: '480f1946-bd9b-4503-b1ae-9da69c733301',
    title: 'Bombal Juniors vs Blanco y Negro',
    description: 'Primera • Liga Deportiva del Sur',
    date: null,
    is_date_confirmed: false,
    price: 12000,
    cloudflare_live_input_uid: 'live_input_byn_vs_bombal',
    image_url: null,
    is_active: true,
    is_live: false,
    league: 'Liga Deportiva del Sur',
    category: 'Primera',
  },
];

import fs from 'fs';
import path from 'path';

// Variable global para persistir cambios en el runtime del servidor Node.js
declare global {
  // eslint-disable-next-line no-var
  var globalMatchesStore: MatchData[] | undefined;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const MATCHES_FILE = path.join(DATA_DIR, 'matches_persistence.json');

function saveMatchesToDisk(matches: MatchData[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2), 'utf8');
  } catch (err) {
    console.error('[AdminStore] Error al persistir partidos en disco:', err);
  }
}

function loadMatchesFromDisk(): MatchData[] | null {
  try {
    if (fs.existsSync(MATCHES_FILE)) {
      const raw = fs.readFileSync(MATCHES_FILE, 'utf8').replace(/^\uFEFF/, '');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[AdminStore] Error al cargar partidos desde disco:', err);
  }
  return null;
}

if (!globalThis.globalMatchesStore) {
  const diskMatches = loadMatchesFromDisk();
  if (diskMatches) {
    globalThis.globalMatchesStore = diskMatches;
  } else {
    globalThis.globalMatchesStore = [...initialAdminMatches];
    saveMatchesToDisk(globalThis.globalMatchesStore);
  }
}

export function getStoredMatches(): MatchData[] {
  if (!globalThis.globalMatchesStore) {
    const diskMatches = loadMatchesFromDisk();
    globalThis.globalMatchesStore = diskMatches || [...initialAdminMatches];
  }
  return globalThis.globalMatchesStore;
}

export function updateStoredMatch(id: string, updates: Partial<MatchData>): MatchData | null {
  if (!globalThis.globalMatchesStore) getStoredMatches();
  const idx = globalThis.globalMatchesStore!.findIndex((m) => m.id === id);
  if (idx === -1) {
    const newEntry: MatchData = {
      id,
      title: updates.title || 'Carreras vs Blanco y Negro',
      description: updates.description || 'Primera • Liga Deportiva del Sur',
      date: updates.date !== undefined ? updates.date : new Date().toISOString(),
      is_date_confirmed: updates.is_date_confirmed !== undefined ? updates.is_date_confirmed : true,
      price: updates.price !== undefined ? updates.price : 1,
      cloudflare_live_input_uid: updates.cloudflare_live_input_uid || 'dac066a4fb5c97117189392adae3f453',
      image_url: updates.image_url || null,
      is_active: updates.is_active !== undefined ? updates.is_active : true,
      is_live: updates.is_live !== undefined ? updates.is_live : true,
      league: updates.league || 'Liga Deportiva del Sur',
      category: updates.category || 'Primera',
    };
    globalThis.globalMatchesStore!.unshift(newEntry);
    saveMatchesToDisk(globalThis.globalMatchesStore!);
    return newEntry;
  }
  globalThis.globalMatchesStore![idx] = {
    ...globalThis.globalMatchesStore![idx],
    ...updates,
  };
  saveMatchesToDisk(globalThis.globalMatchesStore!);
  return globalThis.globalMatchesStore![idx];
}

export function addStoredMatch(newMatch: MatchData): MatchData {
  if (!globalThis.globalMatchesStore) getStoredMatches();
  globalThis.globalMatchesStore!.push(newMatch);
  saveMatchesToDisk(globalThis.globalMatchesStore!);
  return newMatch;
}

export function deleteStoredMatch(id: string): boolean {
  if (!globalThis.globalMatchesStore) getStoredMatches();
  const initialLen = globalThis.globalMatchesStore!.length;
  globalThis.globalMatchesStore = globalThis.globalMatchesStore!.filter((m) => m.id !== id);
  saveMatchesToDisk(globalThis.globalMatchesStore!);
  return globalThis.globalMatchesStore!.length < initialLen;
}

