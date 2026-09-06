'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Youtube,
  Play,
  ExternalLink,
  X,
  Radio,
  Tv,
  Sparkles,
  ChevronRight,
  Flame,
  Shield,
  Layers,
} from 'lucide-react';

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
    categoryLabel: 'Fútbol Mayor',
    badge: '#FÚTBOL MAYOR',
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

export default function VideosPage() {
  const [activeFilter, setActiveFilter] = useState<'todas' | 'mayor' | 'juveniles' | 'programas'>('todas');
  const [activeModalPlaylist, setActiveModalPlaylist] = useState<PlaylistCard | null>(null);

  const filteredPlaylists =
    activeFilter === 'todas'
      ? PLAYLISTS
      : PLAYLISTS.filter((p) => p.category === activeFilter);

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white px-4 py-8 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera Principal (Según Boceto: VIDEOS) */}
        <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition group mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>Volver a la transmisión en vivo</span>
              </Link>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-red-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>CANAL AUDIOVISUAL // PASIÓN LOMONEGRA</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight flex items-center gap-3 mt-1">
                <span>VIDEOS</span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-red-950/80 border border-red-700 text-red-400 rounded-md">
                  7 PLAYLISTS
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-sans">
                Galería completa de listas oficiales en YouTube: Primera, Reserva, Inferiores, Entrevistas y Programas Semanales.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.youtube.com/@PasionlomonegraByN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-950 transition group"
              >
                <Youtube className="w-4 h-4 fill-white" />
                <span>Suscribirse al Canal</span>
                <ExternalLink className="w-3.5 h-3.5 text-red-200 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Filtros de Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveFilter('todas')}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 ${
                activeFilter === 'todas'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#181922] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Todas ({PLAYLISTS.length})
            </button>
            <button
              onClick={() => setActiveFilter('mayor')}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 ${
                activeFilter === 'mayor'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#181922] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Fútbol Mayor & Reserva
            </button>
            <button
              onClick={() => setActiveFilter('juveniles')}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 ${
                activeFilter === 'juveniles'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#181922] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Divisiones Inferiores (3°, 4°, 5°)
            </button>
            <button
              onClick={() => setActiveFilter('programas')}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 ${
                activeFilter === 'programas'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-[#181922] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Notas & Programas
            </button>
          </div>
        </div>

        {/* Rejilla de Cajas (Boxes) al estilo Galería del boceto */}
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

                {/* Gradiente cinemático oscuro y HUD */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-[#12131a]/30 to-black/50" />

                {/* Escuadras HUD en las 4 esquinas de la caja */}
                <span className="absolute top-2.5 left-2.5 w-3 h-3 border-l-2 border-t-2 border-red-500/60 pointer-events-none" />
                <span className="absolute top-2.5 right-2.5 w-3 h-3 border-r-2 border-t-2 border-red-500/60 pointer-events-none" />
                <span className="absolute bottom-2.5 left-2.5 w-3 h-3 border-l-2 border-b-2 border-red-500/60 pointer-events-none" />
                <span className="absolute bottom-2.5 right-2.5 w-3 h-3 border-r-2 border-b-2 border-red-500/60 pointer-events-none" />

                {/* Insignia de Categoría */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-red-950/80 border border-red-700/80 text-red-400 shadow-sm">
                    {item.badge}
                  </span>
                </div>

                {/* Botón Central de Play */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/90 text-white flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.7)] group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>

                {/* Título en grande superpuesto en la base de la caja (como en el boceto) */}
                <div className="absolute bottom-3 left-4 right-4 z-10">
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-md group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h2>
                </div>
              </div>

              {/* Información y Botones de Acción */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{item.videoCountText}</span>
                    <span className="text-red-400 font-bold uppercase tracking-wider">YouTube</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Botón 1: Vista Previa en Modal */}
                    <button
                      onClick={() => setActiveModalPlaylist(item)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Tv className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Ver Aquí</span>
                    </button>

                    {/* Botón 2: Abrir directo en YouTube */}
                    <a
                      href={item.playlistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-md shadow-red-950 group/btn"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Reproducción Integrada de la Playlist */}
        {activeModalPlaylist && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
            <div className="bg-[#12131a] border border-zinc-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                    Playlist: {activeModalPlaylist.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeModalPlaylist.playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-white font-bold px-3 py-1 rounded-lg bg-red-950/40 border border-red-800/50"
                  >
                    <span>Abrir en YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => setActiveModalPlaylist(null)}
                    className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Reproductor Embebido de la Playlist */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-inner">
                <iframe
                  src={`https://www.youtube.com/embed/videoseries?list=${activeModalPlaylist.playlistId}&autoplay=1`}
                  title={`Playlist ${activeModalPlaylist.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 font-sans pt-1">
                <span>{activeModalPlaylist.description}</span>
                <button
                  onClick={() => setActiveModalPlaylist(null)}
                  className="px-4 py-1.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono font-bold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
