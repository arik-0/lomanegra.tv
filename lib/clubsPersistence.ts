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
  // 1. Liga Deportiva del Sur (Primera División & Reserva)
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

  // 2. Fútbol Senior (+35) (Boletín Oficial Nº 22)
  { id: 'sportivo_fc', name: 'Sportivo FC', shortName: 'SFC', logoUrl: '/teams/Blanco y Negro.png', league: 'Fútbol Senior (+35)' },
  { id: 'mundo_balon', name: 'Mundo Balón', shortName: 'MB', logoUrl: '/teams/ifc.png', league: 'Fútbol Senior (+35)' },
  { id: 'uranga_fbc', name: 'Uranga FBC', shortName: 'UFBC', logoUrl: '/teams/San Martin.png', league: 'Fútbol Senior (+35)' },
  { id: 'estrella_del_sur', name: 'Estrella del Sur', shortName: 'EDS', logoUrl: '/teams/Los Andes.png', league: 'Fútbol Senior (+35)' },
  { id: 'atletico_union', name: 'Atlético Unión', shortName: 'CAU', logoUrl: '/teams/Atletico Acebal.png', league: 'Fútbol Senior (+35)' },
  { id: 'independiente_st', name: 'Independiente ST', shortName: 'IST', logoUrl: '/teams/ifc.png', league: 'Fútbol Senior (+35)' },
  { id: 'atletico_pinero', name: 'Atlético Piñero', shortName: 'CAP', logoUrl: '/teams/Carreras.png', league: 'Fútbol Senior (+35)' },
  { id: 'atletico_chabas', name: 'Atlético Chabás', shortName: 'ACH', logoUrl: '/teams/Eduardo Hertz.png', league: 'Fútbol Senior (+35)' },
  { id: 'velez_sarsfield', name: 'Vélez Sarsfield', shortName: 'CVS', logoUrl: '/teams/Bombal Juniors.png', league: 'Fútbol Senior (+35)' },
  { id: 'nautico_melincue', name: 'Náutico Melincué', shortName: 'CNM', logoUrl: '/teams/Miguel Torres.png', league: 'Fútbol Senior (+35)' },
  { id: 'los_leones_norte', name: 'Los Leones Norte', shortName: 'CLN', logoUrl: '/teams/Hughes.png', league: 'Fútbol Senior (+35)' },
  { id: 'atl_estudiantes', name: 'Atl. Estudiantes', shortName: 'CAE', logoUrl: '/teams/Nuevo Alberdi.png', league: 'Fútbol Senior (+35)' },

  // 3. Reserva +30 (Reserva Especial) (Boletín Oficial Nº 21)
  { id: 'santa_teresita', name: 'Atl. Santa Teresita', shortName: 'AST', logoUrl: '/teams/San Martin.png', league: 'Reserva +30 (Especial)' },

  // 4. Liga de Clubes Unidos por el Hockey (LCUH - Oficial Fecha 18)
  { id: 'atletico_empalme', name: 'Atlético Empalme', shortName: 'CAE', logoUrl: '/teams/Atletico Acebal.png', league: 'Liga de Hockey (LCUH)' },
  { id: 'alianza_fuentes', name: 'Alianza Dep. Fuentes', shortName: 'ADF', logoUrl: '/teams/San Martin.png', league: 'Liga de Hockey (LCUH)' },
  { id: 'atletico_soldini', name: 'Atlético Soldini', shortName: 'CAS', logoUrl: '/teams/Carreras.png', league: 'Liga de Hockey (LCUH)' },
  { id: 'independiente_ricardone', name: 'Independiente (Ricardone)', shortName: 'CAI', logoUrl: '/teams/ifc.png', league: 'Liga de Hockey (LCUH)' },
  { id: 'unidos_zavalla', name: 'Unidos (Zavalla)', shortName: 'UAC', logoUrl: '/teams/Sporting de Bigan.png', league: 'Liga de Hockey (LCUH)' },
  { id: 'union_alvear', name: 'Atlético Unión (Alvear)', shortName: 'CAUA', logoUrl: '/teams/Atletico Acebal.png', league: 'Liga de Hockey (LCUH)' },
];

const DATA_DIR = path.join(process.cwd(), 'data');
const CLUBS_PERSISTENCE_FILE = path.join(DATA_DIR, 'clubs_persistence.json');
const SYSTEM_CLUBS_MATCH_ID = '00000000-0000-0000-0000-0000000000c0';

let cachedClubs: ClubItem[] | null = null;

function mergeClubsWithDefaults(existingClubs: ClubItem[]): { merged: ClubItem[]; addedAny: boolean } {
  const existingMap = new Map<string, ClubItem>();
  existingClubs.forEach((c) => existingMap.set(c.id, c));

  let addedAny = false;
  const merged = [...existingClubs];

  for (const defClub of DEFAULT_CLUBS) {
    if (!existingMap.has(defClub.id)) {
      merged.push(defClub);
      existingMap.set(defClub.id, defClub);
      addedAny = true;
    }
  }

  return { merged, addedAny };
}

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
  let sourceClubs: ClubItem[] | null = null;

  if (cachedClubs && cachedClubs.length > 0) {
    sourceClubs = cachedClubs;
  } else {
    const fromDisk = loadFromFile();
    if (fromDisk && fromDisk.length > 0) {
      sourceClubs = fromDisk;
    } else {
      const fromSb = await loadFromSupabase();
      if (fromSb && fromSb.length > 0) {
        sourceClubs = fromSb;
      }
    }
  }

  const baseList = sourceClubs || DEFAULT_CLUBS;
  const { merged, addedAny } = mergeClubsWithDefaults(baseList);

  if (!cachedClubs || addedAny || merged.length !== cachedClubs.length) {
    cachedClubs = merged;
    saveToFile(merged);
    saveToSupabase(merged).catch(() => {});
  }

  return cachedClubs;
}

export async function resetClubsToDefault(): Promise<ClubItem[]> {
  cachedClubs = [...DEFAULT_CLUBS];
  saveToFile(cachedClubs);
  await saveToSupabase(cachedClubs);
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
