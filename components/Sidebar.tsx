'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Radio,
  Trophy,
  Youtube,
  ExternalLink,
  ChevronRight,
  X,
  Play,
  Camera,
  Shield,
  Clock,
  Instagram,
  Settings,
  Flame,
} from 'lucide-react';
import { getTeamLogo } from '@/lib/standingsStore';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'matches' | 'events' | 'youtube'>('matches');

  // Partidos oficiales de la agenda (sincronizados con los 20 clubes reales)
  const matches = [
    {
      id: '0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
      team1: 'Blanco y Negro',
      team2: 'San Martín',
      time: 'HOY 17:00',
      isLive: true,
      category: 'Fútbol Mayor • Clásico',
      price: '$3.500 ARS',
      logo1: '/teams/Blanco y Negro.png',
      logo2: '/teams/San Martin.png',
    },
    {
      id: 'b1a9c001-0000-4000-8000-000000000002',
      team1: 'Blanco y Negro',
      team2: 'Firmat FBC',
      time: 'DOMINGO 16:30',
      isLive: false,
      category: 'Fútbol Mayor • Apertura',
      price: '$3.500 ARS',
      logo1: '/teams/Blanco y Negro.png',
      logo2: '/teams/Firmat FBC.png',
    },
    {
      id: 'b1a9c001-0000-4000-8000-000000000003',
      team1: 'Blanco y Negro',
      team2: 'Argentino de Firmat',
      time: 'PRÓXIMA FECHA',
      isLive: false,
      category: 'Reserva e Inferiores',
      price: '$3.500 ARS',
      logo1: '/teams/Blanco y Negro.png',
      logo2: '/teams/Argentino de Firmat.png',
    },
    {
      id: 'b1a9c001-0000-4000-8000-000000000004',
      team1: 'Blanco y Negro',
      team2: 'Atlético Acebal',
      time: 'A CONFIRMAR',
      isLive: false,
      category: 'Torneo Regional Interzonal',
      price: '$3.500 ARS',
      logo1: '/teams/Blanco y Negro.png',
      logo2: '/teams/Atletico Acebal.png',
    },
  ];

  // Listas de YouTube oficiales de @PasionlomonegraByN
  const youtubePlaylists = [
    {
      id: 'pl-1',
      title: 'Transmisiones de Fútbol Mayor',
      description: 'Partidos completos transmitidos en vivo con relatos de Pasión Lomonegra.',
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

  // Cerrar al presionar Escape en móviles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* 1. Backdrop overlay para móviles: al tocar fuera, se cierra automáticamente */}
      {isOpen && (
        <div
          onClick={onToggle}
          aria-label="Cerrar menú"
          className="fixed inset-0 z-[65] bg-black/80 backdrop-blur-sm lg:hidden transition-opacity cursor-pointer animate-fadeIn"
        />
      )}

      {/* 2. Sidebar Lateral (Drawer responsive: 88vw en móvil, 270px fijo en desktop) */}
      <aside
        className={`fixed top-0 left-0 z-[70] h-[100dvh] w-[88vw] max-w-[340px] sm:w-[320px] lg:w-[270px] bg-[#0f1015] border-r border-zinc-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header de Marca con botón cerrar en móvil */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#12131a] shrink-0">
          <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2.5 group">
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

          {/* Botón de cierre en móvil */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
            aria-label="Cerrar menú"
            title="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3. Navegación Principal Rápida */}
        <div className="p-3 border-b border-zinc-800/80 bg-[#12131a]/60 space-y-1 shrink-0 text-xs font-mono">
          <Link
            href="/"
            onClick={handleLinkClick}
            className={`flex items-center justify-between px-3 py-2 rounded-xl transition font-bold ${
              pathname === '/'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-red-400" />
              <span>Señal En Vivo</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          </Link>

          <Link
            href="/posiciones"
            onClick={handleLinkClick}
            className={`flex items-center justify-between px-3 py-2 rounded-xl transition font-bold ${
              pathname === '/posiciones'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Tablas & Play-Offs</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          </Link>

          <Link
            href="/galeria"
            onClick={handleLinkClick}
            className={`flex items-center justify-between px-3 py-2 rounded-xl transition font-bold ${
              pathname === '/galeria'
                ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-red-500" />
              <span>Galería de Fotos</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          </Link>
        </div>

        {/* 4. Selector de Pestañas Tipo Pill */}
        <div className="p-3 border-b border-zinc-800/80 bg-[#12131a]/40 shrink-0">
          <div className="grid grid-cols-3 p-1 rounded-xl bg-[#161720] border border-zinc-800 text-[10px] font-mono uppercase tracking-wider">
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
              Zonas
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

        {/* 5. Contenido con Scroll dinámico */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
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
                {matches.map((m) => (
                  <Link
                    key={m.id}
                    href={`/partido/${m.id}`}
                    onClick={handleLinkClick}
                    className="block p-3 rounded-2xl bg-[#14151e] hover:bg-[#1c1e2a] border border-zinc-800/80 hover:border-red-500/40 transition-all group shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-red-500" />
                        <span>{m.time}</span>
                      </span>
                      {m.isLive ? (
                        <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-700/80 text-red-400 text-[8px] font-mono font-black uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          EN DIRECTO
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-bold text-[9px]">{m.price}</span>
                      )}
                    </div>

                    {/* Escudos de los clubes */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 p-0.5 relative shrink-0">
                          <Image src={m.logo1} alt={m.team1} fill className="object-contain" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 p-0.5 relative shrink-0">
                          <Image src={m.logo2} alt={m.team2} fill className="object-contain" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-black text-white group-hover:text-red-400 transition-colors truncate">
                          {m.team1} vs {m.team2}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                          {m.category}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ZONAS Y TABLAS */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  Torneo Regional 2026
                </span>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
              </div>

              <Link
                href="/posiciones"
                onClick={handleLinkClick}
                className="group block p-3.5 rounded-2xl bg-gradient-to-br from-red-950/40 via-[#14151e] to-[#12131a] border border-red-800/60 hover:border-red-500 transition shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-mono font-black uppercase text-red-400 bg-red-900/60 px-2 py-0.5 rounded-md">
                    20 CLUBES OFICIALES
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-xs font-black text-white group-hover:text-red-400 transition-colors mb-1">
                  Zona A & Zona B &rarr;
                </div>
                <div className="text-[10px] text-zinc-400 leading-tight">
                  Clasificación en vivo, cruces de Play-Offs y Goleadores albinegros.
                </div>
              </Link>

              {/* Acceso directo a Primera AFA Bonus */}
              <Link
                href="/posiciones"
                onClick={handleLinkClick}
                className="group block p-3 rounded-2xl bg-[#14151e] hover:bg-[#1a1c28] border border-zinc-800 hover:border-emerald-500/50 transition shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    ★ BONUS OFICIAL
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">AFA</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  Primera División AFA
                </h4>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                  <Trophy className="w-3 h-3 text-emerald-400" />
                  <span>Datos oficiales Promiedos en vivo</span>
                </p>
              </Link>
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
                    className="group block p-3 rounded-2xl bg-[#14151e] hover:bg-[#1c1e2a] border border-zinc-800/80 hover:border-red-500/40 transition-all shadow-sm"
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

                    <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
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

          {/* Sponsor Oficial Quilmes */}
          <div className="pt-1">
            <div className="group relative h-14 flex items-center gap-2.5 px-3 overflow-hidden rounded-2xl border border-zinc-800/80 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(20,21,30,1)_100%)]">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-center text-red-400 font-mono text-xs font-black">
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

        {/* 6. Footer del Sidebar con CTA Rápido y Redes */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#12131a] shrink-0 pb-20 lg:pb-3">
          <Link
            href="/partido/0790eca3-cc28-41bb-a4b8-8e2c0c514cdf"
            onClick={handleLinkClick}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white text-black hover:bg-zinc-200 text-xs font-black tracking-wider uppercase rounded-xl no-underline transition-colors shadow-[0_4px_16px_rgba(255,255,255,0.1)]"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Pase En Vivo</span>
          </Link>

          {/* Redes Sociales Oficiales */}
          <div className="flex items-center justify-center gap-2.5 pt-2.5 pb-1 border-b border-zinc-800/60">
            <a
              href="https://www.youtube.com/@PasionlomonegraByN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/40 border border-red-800/40 text-red-400 hover:text-white hover:bg-red-900/60 transition text-[10px] font-bold"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </a>
            <a
              href="https://www.instagram.com/pasion_lomonegra?igsi=ejZkcWJlejZ1NXU0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-950/40 border border-pink-800/40 text-pink-400 hover:text-white hover:bg-pink-900/60 transition text-[10px] font-bold"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 mt-2 px-1">
            <Link href="/posiciones" onClick={handleLinkClick} className="text-zinc-400 hover:text-white transition-colors">
              Tablas
            </Link>
            <Link href="/galeria" onClick={handleLinkClick} className="text-zinc-400 hover:text-white transition-colors">
              Galería
            </Link>
            <Link href="/admin" onClick={handleLinkClick} className="text-zinc-500 hover:text-red-400 transition-colors">
              Operaciones
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
