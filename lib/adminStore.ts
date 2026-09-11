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
    id: '0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
    title: 'Blanco y Negro vs Atlético Acebal',
    description: 'Primera • Liga Deportiva del Sur',
    date: '2026-09-13T18:45:00.000Z',
    is_date_confirmed: true,
    price: 12000,
    cloudflare_live_input_uid: 'live_input_byn_vs_acebal',
    image_url: null,
    is_active: true,
    league: 'Liga Deportiva del Sur',
    category: 'Primera',
  },
  {
    id: 'b1a9c001-0000-4000-8000-000000000004',
    title: 'Blanco y Negro vs Los Andes',
    description: 'Torneo Clausura • Fecha 4 • Transmisión oficial en vivo',
    date: null,
    is_date_confirmed: false,
    price: 12000,
    cloudflare_live_input_uid: 'live_input_byn_vs_los_andes',
    image_url: null,
    is_active: true,
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
  if (idx === -1) return null;
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

