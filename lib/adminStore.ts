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
    title: 'Blanco y Negro vs San Martín',
    description: 'El clásico regional en vivo con relatos en directo y campo de juego.',
    date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    is_date_confirmed: true,
    price: 3500,
    cloudflare_live_input_uid: 'live_input_byn_vs_san_martin',
    image_url: '/matches/blanco-y-negro-vs-san-martin.svg',
    is_active: true,
    league: 'Liga Deportiva del Sur',
    category: 'Fútbol Mayor',
  },
  {
    id: 'b1a9c001-0000-4000-8000-000000000002',
    title: 'Blanco y Negro vs Firmat FBC',
    description: 'Fútbol Mayor • Torneo Apertura Oficial',
    date: null,
    is_date_confirmed: false,
    price: 3500,
    cloudflare_live_input_uid: 'live_input_byn_vs_firmat',
    image_url: '/matches/blanco-y-negro-vs-firmat-fbc.svg',
    is_active: true,
    league: 'Liga Deportiva del Sur',
    category: 'Fútbol Mayor',
  },
  {
    id: 'b1a9c001-0000-4000-8000-000000000003',
    title: 'Blanco y Negro vs Argentino de Firmat',
    description: 'Reserva e Inferiores • Próxima Fecha',
    date: null,
    is_date_confirmed: false,
    price: 3500,
    cloudflare_live_input_uid: 'live_input_byn_vs_arg_firmat',
    image_url: '/matches/blanco-y-negro-vs-argentino-de-firmat.svg',
    is_active: true,
    league: 'Liga Deportiva del Sur',
    category: 'Reserva',
  },
  {
    id: 'b1a9c001-0000-4000-8000-000000000004',
    title: 'Blanco y Negro vs Atlético Acebal',
    description: 'Torneo Regional • Clásico Interzonal',
    date: null,
    is_date_confirmed: false,
    price: 3500,
    cloudflare_live_input_uid: 'live_input_byn_vs_acebal',
    image_url: '/matches/blanco-y-negro-vs-atletico-acebal.svg',
    is_active: true,
    league: 'Torneo Regional',
    category: 'Fútbol Mayor',
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
      const raw = fs.readFileSync(MATCHES_FILE, 'utf8');
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

