'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Camera,
  Flame,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Sparkles,
  Shield,
  Calendar,
  Eye,
  Youtube,
  Play,
  ExternalLink,
  Tv,
  Layers,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'mayor' | 'hinchada' | 'festejos' | 'estadio' | 'cabina';
  categoryLabel: string;
  imageUrl: string;
  date: string;
  description: string;
  badge?: string;
}

const GALLERY_PHOTOS: GalleryItem[] = [
  {
    id: 'photo-1',
    title: 'La Hinchada Albinegra Copando la Tribuna',
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
    title: 'Concentración y Humo Albinegro en el Ingreso',
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

interface PlaylistCard {
  id: string;
  title: string;
  category: 'mayor' | 'juveniles' | 'programas';
  categoryLabel: string;
  badge: string;
  imageUrl: string;
  playlistId: string;
  playlistUrl: string;
  description: string;
  videoCountText: string;
}

const PLAYLISTS: PlaylistCard[] = [
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
    description: 'Partidos y momentos claves de las divisiones inferiores formativas albinegras.',
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
    description: 'El futuro de Blanco y Negro: partidos completos y goles de la Quinta División.',
    videoCountText: 'Playlist Oficial • Quinta',
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

function GaleriaContent() {
  const searchParams = useSearchParams();
  const initialSection = searchParams.get('tab') === 'videos' ? 'videos' : 'fotos';

  // Sección principal: Fotos vs Playlists/Videos
  const [section, setSection] = useState<'fotos' | 'videos'>(initialSection);

  // Estados sección Fotos
  const [activeCategory, setActiveCategory] = useState<string>('todas');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Estados sección Videos
  const [activeVideoFilter, setActiveVideoFilter] = useState<'todas' | 'mayor' | 'juveniles' | 'programas'>('todas');
  const [activeModalPlaylist, setActiveModalPlaylist] = useState<PlaylistCard | null>(null);

  const categories = [
    { id: 'todas', label: 'Todas las Fotos' },
    { id: 'mayor', label: 'Primera' },
    { id: 'hinchada', label: 'La Hinchada' },
    { id: 'festejos', label: 'Festejos & Goles' },
    { id: 'estadio', label: 'Estadio & Mística' },
    { id: 'cabina', label: 'Cabina de Transmisión' },
  ];

  const filteredPhotos =
    activeCategory === 'todas'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  const filteredPlaylists =
    activeVideoFilter === 'todas'
      ? PLAYLISTS
      : PLAYLISTS.filter((p) => p.category === activeVideoFilter);

  // Navegación con teclado en Lightbox de Fotos y Modal de Videos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev! + 1) % filteredPhotos.length);
        }
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
        }
      }
      if (activeModalPlaylist !== null && e.key === 'Escape') {
        setActiveModalPlaylist(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length, activeModalPlaylist]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white px-3 py-6 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera Principal y Navegación de Regreso */}
        <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
                <span>Volver a la transmisión en vivo</span>
              </Link>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-red-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>COBERTURA AUDIOVISUAL // CLUB ATLÉTICO BLANCO Y NEGRO</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3 mt-1">
                <span>Galería de Pasión Lomonegra</span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-red-950/80 border border-red-700 text-red-400 rounded-md">
                  HD OFICIAL
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.youtube.com/@PasionlomonegraByN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-950 transition"
              >
                <Youtube className="w-4 h-4 fill-white" />
                <span>YouTube Oficial</span>
                <ExternalLink className="w-3.5 h-3.5 text-red-200" />
              </a>
            </div>
          </div>

          {/* ============================================================================== */}
          {/* SELECTOR UNIFICADO: FOTOS VS VIDEOS (GALERÍA ENGLOBA TODO)                    */}
          {/* ============================================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center p-1.5 rounded-2xl bg-[#181922] border border-zinc-800">
              <button
                onClick={() => setSection('fotos')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                  section === 'fotos'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Fotos & Postales ({GALLERY_PHOTOS.length})</span>
              </button>

              <button
                onClick={() => setSection('videos')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                  section === 'videos'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Youtube className="w-4 h-4" />
                <span>Transmisiones & Videos ({PLAYLISTS.length})</span>
              </button>
            </div>

            {/* Sub-filtros dinámicos según la sección activa */}
            {section === 'fotos' ? (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setLightboxIndex(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition uppercase tracking-wider border ${
                      activeCategory === cat.id
                        ? 'bg-zinc-800 text-white border-zinc-600 shadow-md'
                        : 'bg-[#181922] text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setActiveVideoFilter('todas')}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 ${
                    activeVideoFilter === 'todas'
                      ? 'bg-zinc-800 text-white border border-zinc-600'
                      : 'bg-[#181922] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Todas ({PLAYLISTS.length})
                </button>
                <button
                  onClick={() => setActiveVideoFilter('mayor')}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 ${
                    activeVideoFilter === 'mayor'
                      ? 'bg-zinc-800 text-white border border-zinc-600'
                      : 'bg-[#181922] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Primera & Reserva
                </button>
                <button
                  onClick={() => setActiveVideoFilter('juveniles')}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 ${
                    activeVideoFilter === 'juveniles'
                      ? 'bg-zinc-800 text-white border border-zinc-600'
                      : 'bg-[#181922] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Inferiores (3°, 4°, 5°)
                </button>
                <button
                  onClick={() => setActiveVideoFilter('programas')}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 ${
                    activeVideoFilter === 'programas'
                      ? 'bg-zinc-800 text-white border border-zinc-600'
                      : 'bg-[#181922] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  Notas & Programas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================================== */}
        {/* SECCIÓN 1: FOTOS & POSTALES                                                    */}
        {/* ============================================================================== */}
        {section === 'fotos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative bg-[#12131a] border border-zinc-800 rounded-3xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300">
                      {photo.categoryLabel}
                    </span>
                    {photo.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                        {photo.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-red-400 transition-colors line-clamp-2">
                      {photo.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                      {photo.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1 text-zinc-400">
                      <Calendar className="w-3 h-3 text-red-500" />
                      <span>{photo.date}</span>
                    </span>
                    <span className="text-red-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Ver foto <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================================== */}
        {/* SECCIÓN 2: TRANSMISIONES & VIDEOS (7 PLAYLISTS OFICIALES)                      */}
        {/* ============================================================================== */}
        {section === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map((item) => (
              <div
                key={item.id}
                className="group bg-[#12131a] border border-zinc-800/90 hover:border-red-600/70 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col hover:shadow-[0_8px_30px_rgba(220,38,38,0.2)]"
              >
                {/* Caja de Imagen vinculada a la Playlist */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-[#12131a]/30 to-black/50" />

                  {/* Escuadras HUD en las 4 esquinas de la caja */}
                  <span className="absolute top-2.5 left-2.5 w-3 h-3 border-l-2 border-t-2 border-red-500/60 pointer-events-none" />
                  <span className="absolute top-2.5 right-2.5 w-3 h-3 border-r-2 border-t-2 border-red-500/60 pointer-events-none" />
                  <span className="absolute bottom-2.5 left-2.5 w-3 h-3 border-l-2 border-b-2 border-red-500/60 pointer-events-none" />
                  <span className="absolute bottom-2.5 right-2.5 w-3 h-3 border-r-2 border-b-2 border-red-500/60 pointer-events-none" />

                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-red-950/80 border border-red-700/80 text-red-400 shadow-sm">
                      {item.badge}
                    </span>
                  </div>

                  {/* Botón Central de Play para abrir Modal */}
                  <button
                    onClick={() => setActiveModalPlaylist(item)}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 active:scale-95 border border-red-400/50 backdrop-blur-sm z-20"
                    title={`Reproducir ${item.title}`}
                    aria-label={`Reproducir ${item.title}`}
                  >
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-zinc-300 z-10 font-mono">
                    <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 backdrop-blur-sm">
                      {item.videoCountText}
                    </span>
                    <span className="text-red-400 font-bold uppercase flex items-center gap-1">
                      <span>YouTube</span>
                    </span>
                  </div>
                </div>

                {/* Información y Acciones de la Playlist */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <h2 className="text-lg font-black text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">
                      {item.title}
                    </h2>

                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2">
                    <button
                      onClick={() => setActiveModalPlaylist(item)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-md shadow-red-950/40"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Ver Playlist</span>
                    </button>

                    <a
                      href={item.playlistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition"
                      title="Abrir directamente en YouTube"
                      aria-label="Abrir en YouTube"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================================== */}
        {/* LIGHTBOX FOTOGRÁFICO A PANTALLA COMPLETA                                      */}
        {/* ============================================================================== */}
        {activePhoto && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
            {/* Barra Superior del Lightbox */}
            <div className="w-full max-w-6xl flex items-center justify-between py-2 border-b border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold uppercase">
                  {activePhoto.categoryLabel}
                </span>
                <span className="text-zinc-400">
                  {lightboxIndex! + 1} de {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition border border-zinc-800"
                  aria-label="Cerrar visor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenedor Central de Imagen con Flechas de Navegación */}
            <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
                }}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/70 hover:bg-red-600 text-white border border-white/20 transition backdrop-blur-md"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="relative w-full h-[65vh] sm:h-[75vh]">
                <Image
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev! + 1) % filteredPhotos.length);
                }}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/70 hover:bg-red-600 text-white border border-white/20 transition backdrop-blur-md"
                aria-label="Siguiente foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Barra Inferior con Descripción */}
            <div className="w-full max-w-4xl text-center space-y-1 py-2">
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                {activePhoto.title}
              </h2>
              <p className="text-xs text-zinc-400 max-w-2xl mx-auto">
                {activePhoto.description}
              </p>
              <div className="text-[10px] text-zinc-500 font-mono pt-1">
                {activePhoto.date} • Pasión Lomonegra Archivo Oficial
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* MODAL REPRODUCTOR DE PLAYLIST YOUTUBE                                         */}
        {/* ============================================================================== */}
        {activeModalPlaylist && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-[#12131a] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#161722]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-700/80 flex items-center justify-center text-red-500">
                    <Youtube className="w-4 h-4 fill-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                      {activeModalPlaylist.title}
                    </h3>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {activeModalPlaylist.videoCountText}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeModalPlaylist.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
                  >
                    <span>Abrir en YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setActiveModalPlaylist(null)}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
                    aria-label="Cerrar reproductor"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Iframe oficial con la Playlist embed de YouTube */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/videoseries?list=${activeModalPlaylist.playlistId}&autoplay=1`}
                  title={activeModalPlaylist.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="p-4 bg-[#14151e] border-t border-zinc-800 text-xs text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>{activeModalPlaylist.description}</span>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                  Pasión Lomonegra • Canal Oficial
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function GaleriaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center font-mono">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>Cargando Galería de Pasión Lomonegra...</span>
          </div>
        </div>
      }
    >
      <GaleriaContent />
    </Suspense>
  );
}

