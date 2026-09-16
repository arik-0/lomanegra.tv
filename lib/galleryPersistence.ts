import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabase/admin';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'mayor' | 'hinchada' | 'festejos' | 'estadio' | 'cabina' | string;
  categoryLabel: string;
  imageUrl: string;
  date: string;
  description: string;
  badge?: string;
}

export interface PlaylistCard {
  id: string;
  title: string;
  category: 'mayor' | 'juveniles' | 'programas' | 'hockey' | string;
  categoryLabel: string;
  badge: string;
  imageUrl: string;
  playlistId: string;
  playlistUrl: string;
  description: string;
  videoCountText: string;
}

export interface GalleryData {
  photos: GalleryPhoto[];
  playlists: PlaylistCard[];
}

export const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'La Hinchada Lomonegra Copando la Tribuna',
    category: 'hinchada',
    categoryLabel: 'La Hinchada',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    date: 'Torneo Clausura 2026',
    description: 'El aliento incondicional de los lomonegros durante los 90 minutos del clásico.',
    badge: 'MÁS VISTA',
  },
  {
    id: 'photo-2',
    title: 'Festejo Eufórico tras el Gol del Triunfo',
    category: 'festejos',
    categoryLabel: 'Festejos & Goles',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    date: 'Fecha 12 • Clásico Regional',
    description: 'Abrazo de gol sobre la hora que selló la clasificación a los play-offs.',
    badge: 'MOMENTO CLAVE',
  },
  {
    id: 'photo-3',
    title: 'El 11 Titular de Primera en la Cancha',
    category: 'mayor',
    categoryLabel: 'Primera',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    date: 'Apertura 2026',
    description: 'Formación inicial lista para disputar una nueva fecha del campeonato.',
  },
  {
    id: 'photo-4',
    title: 'El Estadio Parque Bajo los Reflectores',
    category: 'estadio',
    categoryLabel: 'Estadio & Mística',
    imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
    date: 'Noche de Liga',
    description: 'Postal nocturna del campo de juego en óptimas condiciones para la transmisión HD.',
    badge: 'ESTADIO',
  },
  {
    id: 'photo-5',
    title: 'Concentración y Humo Lomonegro en el Ingreso',
    category: 'hinchada',
    categoryLabel: 'La Hinchada',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
    date: 'Fecha 9',
    description: 'La salida del equipo a la cancha con el recibimiento más emocionante de la región.',
  },
  {
    id: 'photo-6',
    title: 'Remate Inatajable al Ángulo Superior',
    category: 'festejos',
    categoryLabel: 'Festejos & Goles',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
    date: 'Semifinal de Ida',
    description: 'Momento exacto en que la pelota impacta en la red desatando el delirio de la tribuna.',
    badge: 'GOLAZO',
  },
  {
    id: 'photo-7',
    title: 'Cabina de Transmisión Oficial Pasión Lomonegra',
    category: 'cabina',
    categoryLabel: 'Transmisión & Cabina',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    date: 'Operativo en Directo',
    description: 'El equipo periodístico y técnico llevando la transmisión en alta definición a todo el país.',
  },
  {
    id: 'photo-8',
    title: 'Primera: Disputa Aérea en el Área Rival',
    category: 'mayor',
    categoryLabel: 'Primera',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80',
    date: 'Torneo 2026',
    description: 'Duelo físico en una pelota parada definitoria sobre el final del primer tiempo.',
  },
  {
    id: 'photo-9',
    title: 'Banderas, Bombos y Pasión en el Alambrado',
    category: 'hinchada',
    categoryLabel: 'La Hinchada',
    imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
    date: 'Fecha 14',
    description: 'Los colores blanco y negro flameando alto con el orgullo lomonegro.',
  },
];

export const DEFAULT_PLAYLISTS: PlaylistCard[] = [
  {
    id: 'primera',
    title: 'PRIMERA',
    category: 'mayor',
    categoryLabel: 'Primera',
    badge: '#PRIMERA',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    playlistId: 'PLjWoT0tVI1KO_atc9KlH1L32jdv3KusVB',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLjWoT0tVI1KO_atc9KlH1L32jdv3KusVB',
    description: 'Transmisiones completas y partidos de la Primera División de Blanco y Negro en la Liga Deportiva del Sur.',
    videoCountText: 'Playlist Oficial • Primera',
  },
  {
    id: 'reserva',
    title: 'RESERVA',
    category: 'mayor',
    categoryLabel: 'División Reserva',
    badge: '#RESERVA',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    playlistId: 'PLjWoT0tVI1KPP4sveIYMqqdkScY85zqf4',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLjWoT0tVI1KPP4sveIYMqqdkScY85zqf4',
    description: 'Encuentros completos, resúmenes y jugadas destacadas de la División Reserva de Blanco y Negro.',
    videoCountText: 'Playlist Oficial • Reserva',
  },
  {
    id: 'tercera',
    title: 'TERCERA',
    category: 'juveniles',
    categoryLabel: 'Tercera División',
    badge: '#TERCERA',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80',
    playlistId: 'PLjWoT0tVI1KMO9GIq8B7brFZF2BOAwFcH',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLjWoT0tVI1KMO9GIq8B7brFZF2BOAwFcH',
    description: 'La campaña oficial de Tercera División en cada fecha del campeonato regional.',
    videoCountText: 'Playlist Oficial • Tercera',
  },
  {
    id: 'cuarta',
    title: 'CUARTA',
    category: 'juveniles',
    categoryLabel: 'Cuarta División',
    badge: '#CUARTA',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
    playlistId: 'PLjWoT0tVI1KOj9TYKaqRLMqewRmDVAm1S',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLjWoT0tVI1KOj9TYKaqRLMqewRmDVAm1S',
    description: 'Partidos y momentos claves de las divisiones inferiores formativas lomonegras.',
    videoCountText: 'Playlist Oficial • Cuarta',
  },
  {
    id: 'quinta',
    title: 'QUINTA',
    category: 'juveniles',
    categoryLabel: 'Quinta División',
    badge: '#QUINTA',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
    playlistId: 'PLjWoT0tVI1KO0Gt-3yBexb4WW3s_JR5u0',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLjWoT0tVI1KO0Gt-3yBexb4WW3s_JR5u0',
    description: 'El futuro de Blanco y Negro: partidos completos y goles de la脱 Quinta División.',
    videoCountText: 'Playlist Oficial •脱 Quinta',
  },
  {
    id: 'entrevistas',
    title: 'ENTREVISTAS',
    category: 'programas',
    categoryLabel: 'Entrevistas & Notas',
    badge: '#NOTAS EXCLUSIVAS',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    playlistId: 'PLjWoT0tVI1KNKfPVb6o9Es08ru3O9YUOr',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLjWoT0tVI1KNKfPVb6o9Es08ru3O9YUOr',
    description: 'Mano a mano con los protagonistas: jugadores, cuerpo técnico y figuras de Blanco y Negro.',
    videoCountText: 'Playlist Oficial • Notas',
  },
  {
    id: 'programas',
    title: 'PROGRAMAS SEMANALES',
    category: 'programas',
    categoryLabel: 'Programas de Estudio',
    badge: '#ESTUDIO & ANÁLISIS',
    imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
    playlistId: 'PLjWoT0tVI1KNjDzN6J3t3AhlB9jY_WZRr',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLjWoT0tVI1KNjDzN6J3t3AhlB9jY_WZRr',
    description: 'El programa semanal de Pasión Lomonegra con debate, resúmenes y toda la actualidad del club.',
    videoCountText: 'Playlist Oficial • Programas',
  },
];

const DATA_DIR = path.join(process.cwd(), 'data');
const GALLERY_PERSISTENCE_FILE = path.join(DATA_DIR, 'gallery_persistence.json');
const SYSTEM_GALLERY_MATCH_ID = '00000000-0000-0000-0000-0000000000g1';

let cachedGalleryData: GalleryData | null = null;

function loadFromFile(): GalleryData | null {
  try {
    if (fs.existsSync(GALLERY_PERSISTENCE_FILE)) {
      const raw = fs.readFileSync(GALLERY_PERSISTENCE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          photos: Array.isArray(parsed.photos) ? parsed.photos : DEFAULT_GALLERY_PHOTOS,
          playlists: Array.isArray(parsed.playlists) ? parsed.playlists : DEFAULT_PLAYLISTS,
        };
      }
    }
  } catch (e) {
    console.error('[GalleryPersistence] Error reading file:', e);
  }
  return null;
}

function saveToFile(data: GalleryData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(GALLERY_PERSISTENCE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('[GalleryPersistence] Error writing file:', e);
  }
}

async function loadFromSupabase(): Promise<GalleryData | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('matches')
      .select('description')
      .eq('id', SYSTEM_GALLERY_MATCH_ID)
      .maybeSingle();

    if (!error && data?.description) {
      const parsed = JSON.parse(data.description);
      if (parsed && typeof parsed === 'object') {
        return {
          photos: Array.isArray(parsed.photos) ? parsed.photos : DEFAULT_GALLERY_PHOTOS,
          playlists: Array.isArray(parsed.playlists) ? parsed.playlists : DEFAULT_PLAYLISTS,
        };
      }
    }
  } catch (e) {
    console.warn('[GalleryPersistence] Supabase load warning:', e);
  }
  return null;
}

async function saveToSupabase(data: GalleryData) {
  try {
    await supabaseAdmin.from('matches').upsert(
      {
        id: SYSTEM_GALLERY_MATCH_ID,
        title: '__SYSTEM_GALLERY_STORE__',
        description: JSON.stringify(data),
        date: '2099-12-31T23:59:59.000Z',
        price: 0,
        cloudflare_live_input_uid: 'system',
        is_active: false,
      },
      { onConflict: 'id' }
    );
  } catch (e) {
    console.warn('[GalleryPersistence] Supabase save warning:', e);
  }
}

export async function getGalleryData(): Promise<GalleryData> {
  if (cachedGalleryData) return cachedGalleryData;

  const fromDisk = loadFromFile();
  if (fromDisk) {
    cachedGalleryData = fromDisk;
    return cachedGalleryData;
  }

  const fromSb = await loadFromSupabase();
  if (fromSb) {
    cachedGalleryData = fromSb;
    saveToFile(cachedGalleryData);
    return cachedGalleryData;
  }

  cachedGalleryData = {
    photos: DEFAULT_GALLERY_PHOTOS,
    playlists: DEFAULT_PLAYLISTS,
  };
  saveToFile(cachedGalleryData);
  saveToSupabase(cachedGalleryData).catch(() => {});
  return cachedGalleryData;
}

export async function saveGalleryData(data: Partial<GalleryData>): Promise<GalleryData> {
  const current = await getGalleryData();
  const updated: GalleryData = {
    photos: data.photos !== undefined ? data.photos : current.photos,
    playlists: data.playlists !== undefined ? data.playlists : current.playlists,
  };
  cachedGalleryData = updated;
  saveToFile(updated);
  await saveToSupabase(updated);
  return updated;
}
