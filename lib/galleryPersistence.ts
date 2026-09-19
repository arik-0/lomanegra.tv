import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from './supabase/admin';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'plantel_mayor' | 'inferiores' | 'hockey' | 'eventos' | 'predio' | string;
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
    category: 'eventos',
    categoryLabel: 'Eventos',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    date: 'Torneo Clausura 2026',
    description: 'El aliento incondicional de los lomonegros durante los 90 minutos del clásico.',
    badge: 'MÁS VISTA',
  },
  {
    id: 'photo-2',
    title: 'Festejo Eufórico tras el Gol del Triunfo en Reserva',
    category: 'plantel_mayor',
    categoryLabel: 'Plantel Mayor',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    date: 'Fecha 12 • Plantel Mayor',
    description: 'Abrazo de gol sobre la hora que selló la clasificación a los play-offs.',
    badge: 'MOMENTO CLAVE',
  },
  {
    id: 'photo-3',
    title: 'El 11 Titular de Primera en la Cancha',
    category: 'plantel_mayor',
    categoryLabel: 'Plantel Mayor',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    date: 'Apertura 2026',
    description: 'Formación inicial lista para disputar una nueva fecha del campeonato.',
  },
  {
    id: 'photo-4',
    title: 'El Estadio Parque Bajo los Reflectores',
    category: 'predio',
    categoryLabel: 'Predio',
    imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
    date: 'Predio Oficial',
    description: 'Postal nocturna del campo de juego y las instalaciones del club.',
    badge: 'PREDIO',
  },
  {
    id: 'photo-5',
    title: 'Concentración y Humo Lomonegro en el Ingreso',
    category: 'eventos',
    categoryLabel: 'Eventos',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
    date: 'Fecha 9',
    description: 'La salida del equipo a la cancha con el recibimiento más emocionante de la región.',
  },
  {
    id: 'photo-6',
    title: 'Cuarta División: Remate al Ángulo Superior',
    category: 'inferiores',
    categoryLabel: 'Inferiores',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
    date: 'Inferiores',
    description: 'Momento exacto de la definición de divisiones formativas en la fecha regional.',
    badge: 'GOLAZO',
  },
  {
    id: 'photo-7',
    title: 'Jornada Oficial de Hockey Lomonegro',
    category: 'hockey',
    categoryLabel: 'Hockey',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    date: 'Liga Hockey',
    description: 'Excelente despliegue y compromiso en la fecha oficial de hockey sobre césped.',
    badge: 'HOCKEY',
  },
  {
    id: 'photo-8',
    title: 'Divisiones Formativas: Disputa y Entrega Total',
    category: 'inferiores',
    categoryLabel: 'Inferiores',
    imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=1200&q=80',
    date: 'Inferiores',
    description: 'Duelo y garra de las divisiones formativas en una fecha vibrante.',
  },
  {
    id: 'photo-9',
    title: 'Banderas, Bombos y Pasión en el Alambrado',
    category: 'eventos',
    categoryLabel: 'Eventos',
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
// Debe ser un UUID válido (hexadecimal 0-9, a-f) para la columna UUID de PostgreSQL en Supabase
const SYSTEM_GALLERY_MATCH_ID = '00000000-0000-0000-0000-0000000000e1';

let cachedGalleryData: GalleryData | null = null;

export function deleteLocalFileIfUploaded(imageUrl: string) {
  try {
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
      const fileName = path.basename(imageUrl);
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('[GalleryPersistence] Archivo local eliminado:', filePath);
      }
    }
  } catch (err) {
    console.warn('[GalleryPersistence] No se pudo eliminar archivo local:', err);
  }
}

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
    console.warn('[GalleryPersistence] Warning writing file (read-only filesystem on serverless):', e);
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
    } else if (error) {
      console.warn('[GalleryPersistence] Supabase select error:', error.message);
    }
  } catch (e) {
    console.warn('[GalleryPersistence] Supabase load warning:', e);
  }
  return null;
}

async function saveToSupabase(data: GalleryData) {
  try {
    const { error } = await supabaseAdmin.from('matches').upsert(
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
    if (error) {
      console.error('[GalleryPersistence] Supabase upsert error:', error.message);
    }
  } catch (e) {
    console.warn('[GalleryPersistence] Supabase save warning:', e);
  }
}

export async function getGalleryData(): Promise<GalleryData> {
  if (cachedGalleryData) return cachedGalleryData;

  const fromSb = await loadFromSupabase();
  if (fromSb) {
    cachedGalleryData = fromSb;
    saveToFile(cachedGalleryData);
    return cachedGalleryData;
  }

  const fromDisk = loadFromFile();
  if (fromDisk) {
    cachedGalleryData = fromDisk;
    saveToSupabase(cachedGalleryData).catch(() => {});
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

export async function deleteGalleryPhoto(photoId: string): Promise<GalleryData> {
  const current = await getGalleryData();
  const target = current.photos.find((p) => p.id === photoId);
  if (target && target.imageUrl) {
    deleteLocalFileIfUploaded(target.imageUrl);
  }
  const updatedPhotos = current.photos.filter((p) => p.id !== photoId);
  return await saveGalleryData({ photos: updatedPhotos });
}

export async function deleteGalleryPlaylist(playlistId: string): Promise<GalleryData> {
  const current = await getGalleryData();
  const target = current.playlists.find((p) => p.id === playlistId);
  if (target && target.imageUrl) {
    deleteLocalFileIfUploaded(target.imageUrl);
  }
  const updatedPlaylists = current.playlists.filter((p) => p.id !== playlistId);
  return await saveGalleryData({ playlists: updatedPlaylists });
}
