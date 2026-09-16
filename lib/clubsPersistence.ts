import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabase/admin';

export interface ClubItem {
  id: string; // canonical key, ej: "blanco_y_negro"
  name: string; // nombre display editable, ej: "Blanco y Negro"
  shortName?: string;
  logoUrl: string; // url del escudo, editable
  league?: string;
}

export const DEFAULT_CLUBS: ClubItem[] = [
  { id: 'blanco_y_negro', name: 'Blanco y Negro', shortName: 'ByN', logoUrl: '/teams/Blanco y Negro.png', league: 'Liga Deportiva del Sur' },
  { id: 'los_andes', name: 'Los Andes', shortName: 'CLA', logoUrl: '/teams/Los Andes.png', league: 'Liga Deportiva del Sur' },
  { id: 'san_martin', name: 'San Martín', shortName: 'CASM', logoUrl: '/teams/San Martin.png', league: 'Liga Deportiva del Sur' },
  { id: 'eduardo_hertz', name: 'Eduardo Hertz', shortName: 'CAEH', logoUrl: '/teams/Eduardo Hertz.png', league: 'Liga Deportiva del Sur' },
  { id: 'atletico_acebal', name: 'Atlético Acebal', shortName: 'CAA', logoUrl: '/teams/Atletico Acebal.png', league: 'Liga Deportiva del Sur' },
  { id: 'atletico_paz', name: 'Atlético Paz', shortName: 'CAP', logoUrl: '/teams/Atletico Paz.png', league: 'Liga Deportiva del Sur' },
  { id: 'argentino_firmat', name: 'Argentino de Firmat', shortName: 'CAF', logoUrl: '/teams/Argentino de Firmat.png', league: 'Liga Deportiva del Sur' },
  { id: 'firmat_fbc', name: 'Firmat FBC', shortName: 'FFBC', logoUrl: '/teams/Firmat FBC.png', league: 'Liga Deportiva del Sur' },
  { id: 'sp_bombal', name: 'Sportivo Bombal', shortName: 'CSB', logoUrl: '/teams/Sportivo Bombal.png', league: 'Liga Deportiva del Sur' },
  { id: 'bombal_jrs', name: 'Bombal Juniors', shortName: 'BJC', logoUrl: '/teams/Bombal Juniors.png', league: 'Liga Deportiva del Sur' },
  { id: 'sporting_bigand', name: 'Sporting de Bigand', shortName: 'SAMCS', logoUrl: '/teams/Sporting de Bigan.png', league: 'Liga Deportiva del Sur' },
  { id: 'independiente_bigand', name: 'Independiente de Bigand', shortName: 'IFC', logoUrl: '/teams/ifc.png', league: 'Liga Deportiva del Sur' },
  { id: 'italo_argentino', name: 'Ítalo Argentino', shortName: 'CIA', logoUrl: '/teams/Italo Argentino.png', league: 'Liga Deportiva del Sur' },
  { id: 'carreras', name: 'Carreras', shortName: 'CAC', logoUrl: '/teams/Carreras.png', league: 'Liga Deportiva del Sur' },
  { id: 'hughes', name: 'Hughes', shortName: 'Hughes', logoUrl: '/teams/Hughes.png', league: 'Liga Deportiva del Sur' },
  { id: 'nuevo_alberdi', name: 'Nuevo Alberdi', shortName: 'NA', logoUrl: '/teams/Nuevo Alberdi.png', league: 'Liga Deportiva del Sur' },
  { id: 'olimpia', name: 'Olimpia de Santa Teresa', shortName: 'Olimpia', logoUrl: '/teams/Olimpia de Santa Teresa.png', league: 'Liga Deportiva del Sur' },
  { id: 'fredriksson', name: 'Fredriksson', shortName: 'FFBC', logoUrl: '/teams/Fredriksson.png', league: 'Liga Deportiva del Sur' },
  { id: 'rivadavia', name: 'Bernardino Rivadavia', shortName: 'CABR', logoUrl: '/teams/Bernardino Rivadavia.png', league: 'Liga Deportiva del Sur' },
  { id: 'miguel_torres', name: 'Deportivo Miguel Torres', shortName: 'DMT', logoUrl: '/teams/Miguel Torres.png', league: 'Liga Deportiva del Sur' },
  { id: 'atletico_empalme', name: 'Atlético Empalme', shortName: 'CAE', logoUrl: '/teams/Atletico Acebal.png', league: 'Liga de Hockey (LCUH)' },
  { id: 'alianza_fuentes', name: 'Alianza Dep. Fuentes', shortName: 'ADF', logoUrl: '/teams/San Martin.png', league: 'Liga de Hockey (LCUH)' },
  { id: 'atletico_soldini', name: 'Atlético Soldini', shortName: 'CAS', logoUrl: '/teams/Carreras.png', league: 'Liga de Hockey (LCUH)' },
  { id: 'independiente_ricardone', name: 'Independiente (Ricardone)', shortName: 'CAI', logoUrl: '/teams/ifc.png', league: 'Liga de Hockey (LCUH)' },
];

const DATA_DIR = path.join(process.cwd(), 'data');
const CLUBS_PERSISTENCE_FILE = path.join(DATA_DIR, 'clubs_persistence.json');
const SYSTEM_CLUBS_MATCH_ID = '00000000-0000-0000-0000-0000000000c0';

let cachedClubs: ClubItem[] | null = null;

function loadFromFile(): ClubItem[] | null {
  try {
    if (fs.existsSync(CLUBS_PERSISTENCE_FILE)) {
      const raw = fs.readFileSync(CLUBS_PERSISTENCE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[ClubsPersistence] Error reading file:', e);
  }
  return null;
}

function saveToFile(clubs: ClubItem[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CLUBS_PERSISTENCE_FILE, JSON.stringify(clubs, null, 2), 'utf8');
  } catch (e) {
    console.error('[ClubsPersistence] Error writing file:', e);
  }
}

async function loadFromSupabase(): Promise<ClubItem[] | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('matches')
      .select('description')
      .eq('id', SYSTEM_CLUBS_MATCH_ID)
      .maybeSingle();

    if (!error && data?.description) {
      const parsed = JSON.parse(data.description);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[ClubsPersistence] Supabase load warning:', e);
  }
  return null;
}

async function saveToSupabase(clubs: ClubItem[]) {
  try {
    await supabaseAdmin.from('matches').upsert(
      {
        id: SYSTEM_CLUBS_MATCH_ID,
        title: '__SYSTEM_CLUBS_CONFIG__',
        description: JSON.stringify(clubs),
        date: '2099-12-31T23:59:59.000Z',
        price: 0,
        cloudflare_live_input_uid: 'system',
        is_active: false,
      },
      { onConflict: 'id' }
    );
  } catch (e) {
    console.warn('[ClubsPersistence] Supabase save warning:', e);
  }
}

export async function getClubsData(): Promise<ClubItem[]> {
  if (cachedClubs && cachedClubs.length > 0) return cachedClubs;

  const fromDisk = loadFromFile();
  if (fromDisk && fromDisk.length > 0) {
    cachedClubs = fromDisk;
    return cachedClubs;
  }

  const fromSb = await loadFromSupabase();
  if (fromSb && fromSb.length > 0) {
    cachedClubs = fromSb;
    saveToFile(cachedClubs);
    return cachedClubs;
  }

  cachedClubs = DEFAULT_CLUBS;
  saveToFile(cachedClubs);
  saveToSupabase(cachedClubs).catch(() => {});
  return cachedClubs;
}

export async function saveClubsData(clubs: ClubItem[]): Promise<ClubItem[]> {
  cachedClubs = clubs;
  saveToFile(clubs);
  await saveToSupabase(clubs);
  return clubs;
}

export function getCustomLogoSync(teamName: string): string | null {
  if (!cachedClubs) {
    const fromDisk = loadFromFile();
    if (fromDisk) cachedClubs = fromDisk;
  }
  if (!cachedClubs || !teamName) return null;

  const norm = teamName.toLowerCase().trim();
  const match = cachedClubs.find((c) => {
    if (c.name.toLowerCase() === norm) return true;
    if (c.id === norm || c.shortName?.toLowerCase() === norm) return true;
    return false;
  });

  return match ? match.logoUrl : null;
}
