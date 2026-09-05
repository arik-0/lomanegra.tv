'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    title: 'El 11 Titular de Fútbol Mayor en la Cancha',
    category: 'mayor',
    categoryLabel: 'Fútbol Mayor',
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
    description: 'El equipo periodístico y técnico llevando la señal en alta definición a todo el país.',
  },
  {
    id: 'photo-8',
    title: 'Fútbol Mayor: Disputa Aérea en el Área Rival',
    category: 'mayor',
    categoryLabel: 'Fútbol Mayor',
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

export default function GaleriaPage() {
  const [activeCategory, setActiveCategory] = useState<string>('todas');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'todas', label: 'Todas las Fotos' },
    { id: 'mayor', label: 'Fútbol Mayor' },
    { id: 'hinchada', label: 'La Hinchada' },
    { id: 'festejos', label: 'Festejos & Goles' },
    { id: 'estadio', label: 'Estadio & Mística' },
    { id: 'cabina', label: 'Cabina de Transmisión' },
  ];

  const filteredPhotos =
    activeCategory === 'todas'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  // Navegación con teclado en Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev! + 1) % filteredPhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white px-3 py-6 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera y Navegación de Regreso */}
        <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
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
                <span>COBERTURA FOTOGRÁFICA // CLUB ATLÉTICO BLANCO Y NEGRO</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3 mt-1">
                <span>Galería Oficial Albinegra</span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-red-950/80 border border-red-700 text-red-400 rounded-md">
                  HD ARCHIVO
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold">
                <Camera className="w-4 h-4 text-red-500" />
                <span>{filteredPhotos.length} Fotografías</span>
              </div>
            </div>
          </div>

          {/* Filtros de Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setLightboxIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition uppercase tracking-wider border ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/60'
                    : 'bg-[#181922] text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Fotografías Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative bg-[#12131a] border border-zinc-800 rounded-3xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Contenedor de Imagen con Efecto Hover */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Badge flotante */}
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

                {/* Ícono de Zoom al pasar el cursor */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Información de la Fotografía */}
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
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-red-500" />
                    {photo.date}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400 group-hover:text-white transition">
                    <Eye className="w-3 h-3" />
                    <span>Ampliar</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Interactivo de Lightbox */}
        {activePhoto && lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
            {/* Fondo de clic para cerrar */}
            <div className="fixed inset-0" onClick={() => setLightboxIndex(null)} />

            {/* Contenedor del Modal */}
            <div className="relative w-full max-w-5xl bg-[#12131a] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[95vh]">
              {/* Barra Superior */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#161722]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-600 text-white">
                    {activePhoto.categoryLabel}
                  </span>
                  <span className="text-xs font-bold text-zinc-300 truncate max-w-xs sm:max-w-md">
                    {activePhoto.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
                    title="Cerrar (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Imagen en Grande con Botones de Navegación */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
                <Image
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  fill
                  className="object-contain"
                  priority
                />

                {/* Botón Anterior */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev! - 1 + filteredPhotos.length) % filteredPhotos.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white transition"
                  title="Foto anterior (←)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Botón Siguiente */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev! + 1) % filteredPhotos.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:bg-black/80 flex items-center justify-center text-white transition"
                  title="Foto siguiente (→)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Pie de foto con descripción */}
              <div className="p-4 bg-[#14151f] border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="text-zinc-200 font-bold">{activePhoto.title}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{activePhoto.description}</p>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                    {activePhoto.date} • Archivo Fotográfico Pasión Lomonegra
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {lightboxIndex + 1} de {filteredPhotos.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
