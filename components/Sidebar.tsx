'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Radio,
  Trophy,
  Youtube,
  ExternalLink,
  ChevronRight,
  X,
  Play,
  Film,
  Sparkles,
  ShieldAlert,
  Instagram,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'matches' | 'events' | 'youtube'>('matches');

  // Listas de YouTube con grabaciones oficiales de @PasionlomonegraByN
  const youtubePlaylists = [
    {
      id: 'pl-1',
      title: 'Transmisiones de Fútbol Mayor',
      description: 'Partidos completos transmitidos en vivo con relatos oficiales de Pasión Lomonegra.',
      videoCount: '24 partidos',
      badge: '#MAYOR',
      url: 'https://www.youtube.com/@PasionlomonegraByN/playlists',
    },
    {
      id: 'pl-2',
      title: 'Resúmenes y Goles de Blanco y Negro',
      description: 'Los compactos de jugadas, goles y mejores momentos de cada fecha.',
      videoCount: '48 videos',
      badge: '#GOLES',
      url: 'https://www.youtube.com/@PasionlomonegraByN/videos',
    },
    {
      id: 'pl-3',
      title: 'Reserva e Inferiores',
      description: 'Cobertura de los semilleros y categorías formativas del club.',
      videoCount: '19 emisiones',
      badge: '#JUVENILES',
      url: 'https://www.youtube.com/@PasionlomonegraByN/playlists',
    },
  ];

  // Eventos y Torneos
  const tournaments = [
    {
      name: 'Liga Regional 2026',
      category: 'Transmisión de Fútbol Mayor',
      status: 'EN DISPUTA',
      teams: '16 clubes',
    },
    {
      name: 'Copa Ciudad Pasión Lomonegra',
      category: 'Torneo Eliminatorio',
      status: 'PRÓXIMAMENTE',
      teams: '8 clubes',
    },
    {
      name: 'Torneo Nocturno',
      category: 'Senior & Reserva',
      status: 'FASE GRUPOS',
      teams: '12 clubes',
    },
  ];

  // Partidos en agenda
  const upcomingMatches = [
    {
      id: 'blanco-y-negro-vs-ifc',
      teams: 'Blanco y Negro vs I. F. C.',
      time: 'HOY 17:00',
      isLive: true,
      price: '$3.500 ARS',
    },
    {
      id: 'boca-vs-river',
      teams: 'Boca vs River',
      time: 'MAÑANA 20:30',
      isLive: false,
      price: '$4.999 ARS',
    },
    {
      id: 'madrid-vs-barca',
      teams: 'Real Madrid vs Barcelona',
      time: 'DOMINGO 16:00',
      isLive: false,
      price: '$6.500 ARS',
    },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Lateral Estilo Forg1 */}
      <aside
        className={`fixed top-0 left-0 z-50 h-[100dvh] w-[270px] bg-[#08080a] border-r border-white/[0.07] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header de Marca */}
        <div className="p-4 border-b border-white/[0.07] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo-pasion-lomonegra.png"
                alt="Pasión Lomonegra"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-baseline font-black tracking-tight leading-none text-base">
                <span className="text-white">PASIÓN</span>
                <span className="text-red-500 ml-1">LOMONEGRA</span>
              </div>
              <div className="text-[8px] font-mono uppercase tracking-[0.2em] text-zinc-500 mt-1">
                SEÑAL // TRANSMISIÓN OFICIAL
              </div>
            </div>
          </Link>

          <button
            onClick={onToggle}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
            aria-label="Cerrar menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Pestañas Tipo Pill Conectado */}
        <div className="p-3 border-b border-white/[0.07]">
          <div className="grid grid-cols-3 p-1 rounded-xl bg-[#0c0c10] border border-white/[0.06] text-[10px] font-mono uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('matches')}
              className={`py-1.5 rounded-lg transition-all text-center ${
                activeTab === 'matches'
                  ? 'bg-red-600 text-white font-bold shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Agenda
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-1.5 rounded-lg transition-all text-center ${
                activeTab === 'events'
                  ? 'bg-red-600 text-white font-bold shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tablas
            </button>
            <button
              onClick={() => setActiveTab('youtube')}
              className={`py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                activeTab === 'youtube'
                  ? 'bg-red-600 text-white font-bold shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3 h-3" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {/* TAB 1: AGENDA DE TRANSMISIONES */}
          {activeTab === 'matches' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  Próximas Emisiones
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              </div>

              <div className="space-y-2">
                {upcomingMatches.map((m, idx) => (
                  <Link
                    key={idx}
                    href={`/partido/${m.id}`}
                    className="block p-3 rounded-xl bg-[#0c0c10] hover:bg-[#121218] border border-white/[0.06] hover:border-red-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-red-500" />
                        <span>{m.time}</span>
                      </span>
                      {m.isLive ? (
                        <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-700/80 text-red-400 text-[8px] font-mono font-black uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          EN VIVO
                        </span>
                      ) : (
                        <span className="text-zinc-500 font-bold">{m.price}</span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {m.teams}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TABLAS DE POSICIONES */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  Tablas de Posiciones
                </span>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
              </div>

              <Link
                href="/posiciones"
                className="group block p-3.5 rounded-xl bg-gradient-to-br from-red-950/50 to-[#0c0c10] border border-red-700/60 hover:border-red-500 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-mono font-black uppercase text-red-400 bg-red-900/60 px-1.5 py-0.5 rounded">
                    LIGA REGIONAL
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-black text-white group-hover:text-red-400 transition-colors mb-1">
                  Ver Tablas Completas &rarr;
                </div>
                <div className="text-[10px] text-zinc-400 leading-tight">
                  Fútbol Mayor, Reserva, 3ª, 4ª y 5ª división (Apertura y Clausura).
                </div>
              </Link>

              <div className="space-y-2">
                {tournaments.map((t, idx) => (
                  <Link
                    key={idx}
                    href="/posiciones"
                    className="block p-3 rounded-xl bg-[#0c0c10] hover:bg-[#121218] border border-white/[0.06] hover:border-red-500/40 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-mono font-bold uppercase text-red-400 bg-red-950/60 border border-red-800/50 px-1.5 py-0.5 rounded">
                        {t.status}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {t.teams}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span>{t.category}</span>
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VIDEOS YOUTUBE */}
          {activeTab === 'youtube' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  Listas en YouTube
                </span>
                <Youtube className="w-3.5 h-3.5 text-red-500" />
              </div>

              <div className="space-y-2">
                {youtubePlaylists.map((pl) => (
                  <a
                    key={pl.id}
                    href={pl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-3 rounded-xl bg-[#0c0c10] hover:bg-[#121218] border border-white/[0.06] hover:border-red-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-mono font-black uppercase text-red-400 bg-red-950/70 border border-red-800/60 px-1.5 py-0.5 rounded">
                        {pl.badge}
                      </span>
                      <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-red-400 transition-colors" />
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors leading-snug mb-1">
                      {pl.title}
                    </h4>

                    <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2 mb-2">
                      {pl.description}
                    </p>

                    <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>{pl.videoCount}</span>
                      <span className="text-red-500 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                        Abrir <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* SPONSOR OFICIAL ESTILO FORG1 (Integrado en barra lateral) */}
          <div className="pt-2">
            <div className="group relative h-14 flex items-center gap-2.5 px-3 overflow-hidden rounded-xl border border-white/[0.07] bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(12,12,16,1)_100%)] transition-[border-color] duration-200 hover:border-red-500/40">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 font-mono text-xs font-black">
                VIVO
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[8px] text-zinc-500 tracking-[0.2em] uppercase font-mono leading-tight">
                  Sponsor oficial
                </div>
                <div className="text-xs font-black tracking-tight text-white font-mono leading-tight truncate mt-0.5 group-hover:text-red-400 transition-colors">
                  Quilmes Oficial
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Sidebar con CTA Rápido */}
        <div className="p-3 border-t border-white/[0.07] bg-[#060608]">
          <Link
            href="/partido/blanco-y-negro-vs-ifc"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white text-black hover:bg-zinc-200 text-xs font-black tracking-wider uppercase rounded-xl no-underline transition-colors shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Pase En Vivo</span>
          </Link>
          {/* Redes Sociales Oficiales */}
          <div className="flex items-center justify-center gap-3 pt-2.5 pb-1 border-b border-white/[0.05]">
            <a
              href="https://www.youtube.com/@PasionlomonegraByN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 hover:text-white hover:bg-red-900/60 transition text-[10px]"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </a>
            <a
              href="https://www.instagram.com/pasion_lomonegra?igsi=ejZkcWJlejZ1NXU0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-950/40 border border-pink-800/40 text-pink-400 hover:text-white hover:bg-pink-900/60 transition text-[10px]"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600 mt-2 px-1">
            <Link href="/posiciones" className="text-zinc-500 hover:text-white transition-colors">
              Tablas
            </Link>
            <Link href="/admin" className="text-zinc-600 hover:text-red-400 transition-colors">
              Operaciones
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
