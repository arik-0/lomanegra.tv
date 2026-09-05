'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Trophy,
  Award,
  Tv,
  Play,
  Sparkles,
  LogOut,
  Shield,
  Clock,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSignOut: () => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  userEmail,
  onSignOut,
}: UserProfileModalProps) {
  const [mounted, setMounted] = useState(false);
  const [points, setPoints] = useState(1450);
  const targetPoints = 2000;
  const progressPercent = Math.min(100, Math.round((points / targetPoints) * 100));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Partidos pagos disponibles para el usuario
  const paidMatches = [
    {
      id: '0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
      title: 'Blanco y Negro vs San Martín',
      category: 'Fútbol Mayor • Clásico Regional',
      status: 'Acceso Habilitado',
      statusColor: 'emerald',
      date: 'En vivo / Transmisión Oficial',
      logo1: '/teams/Blanco y Negro.png',
      logo2: '/teams/San Martin.png',
      link: '/partido/0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
      isLiveNow: true,
    },
    {
      id: 'b1a9c001-0000-4000-8000-000000000002',
      title: 'Blanco y Negro vs Firmat FBC',
      category: 'Fútbol Mayor • Torneo Apertura',
      status: 'Pase Anticipado',
      statusColor: 'blue',
      date: 'Próxima Fecha • Estadio Albinegro',
      logo1: '/teams/Blanco y Negro.png',
      logo2: '/teams/Firmat FBC.png',
      link: '/partido/b1a9c001-0000-4000-8000-000000000002',
      isLiveNow: false,
    },
  ];

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] pointer-events-auto">
      {/* Backdrop transparente / semioscuro para cerrar al hacer clic afuera */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Pestaña temporal desplegable flotante directamente anclada bajo el Navbar */}
      <div className="fixed top-14 sm:top-16 right-2 sm:right-6 md:right-8 w-[94vw] sm:w-[440px] max-h-[85vh] overflow-y-auto bg-[#111218] border border-zinc-700/80 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-5 sm:p-6 space-y-5 text-white font-mono z-[100000]">
        {/* Puntero hacia el nombre de usuario arriba a la derecha */}
        <div className="hidden sm:block absolute -top-2 right-12 w-4 h-4 bg-[#111218] border-t border-l border-zinc-700/80 rotate-45" />

        {/* Cabecera del Usuario */}
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 border border-red-500/50 flex items-center justify-center shadow-lg shadow-red-950/50 relative overflow-hidden">
              <div className="w-8 h-8 relative">
                <Image
                  src="/teams/Blanco y Negro.png"
                  alt="Escudo Blanco y Negro"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-white truncate max-w-[200px] sm:max-w-xs">
                  {userEmail}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                  Activo
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-red-500" />
                <span>Socio Hincha Lomonegro • Nivel Oro</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. SECCIÓN DE PUNTOS DE VISUALIZACIÓN */}
        <div className="bg-gradient-to-br from-[#181924] to-[#12131a] border border-zinc-800 rounded-2xl p-4 space-y-3 relative overflow-hidden">
          <div className="absolute right-3 top-3 text-amber-500/10 pointer-events-none">
            <Trophy className="w-24 h-24" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-white tracking-wider">
                  Puntos de Visualización
                </h3>
                <span className="text-[10px] text-zinc-400">Programa Oficial de Recompensas</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black text-amber-400 leading-none">
                {points.toLocaleString('es-AR')} <span className="text-xs text-amber-500/80">PTS</span>
              </div>
              <span className="text-[9px] text-zinc-400">Lomonegro Stars</span>
            </div>
          </div>

          {/* Barra de Progreso a la Próxima Recompensa */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1 text-zinc-300">
                <Award className="w-3 h-3 text-amber-400" />
                Próximo canje: Entrada libre Cuartos
              </span>
              <span className="font-bold text-amber-400">
                {points} / {targetPoints} pts ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Historial rápido de puntos ganados */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04] text-[10px]">
              <span className="text-zinc-400 block">+500 pts</span>
              <span className="text-white font-bold truncate block">Transmisiones en vivo</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-white/[0.04] text-[10px]">
              <span className="text-zinc-400 block">+450 pts</span>
              <span className="text-white font-bold truncate block">Pases adquiridos</span>
            </div>
          </div>
        </div>

        {/* 2. SECCIÓN DE PARTIDOS PAGOS / PASES ADQUIRIDOS */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Partidos Pagos / Pases Adquiridos
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {paidMatches.length} Habilitados
            </span>
          </div>

          <div className="space-y-2">
            {paidMatches.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-[#161722] border border-zinc-800 hover:border-zinc-700 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-1.5">
                      <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 p-0.5 relative shrink-0">
                        <Image src={m.logo1} alt="Equipo 1" fill className="object-contain" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 p-0.5 relative shrink-0">
                        <Image src={m.logo2} alt="Equipo 2" fill className="object-contain" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">{m.title}</h4>
                      <p className="text-[10px] text-zinc-400">{m.category}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      m.statusColor === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px]">
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {m.date}
                  </span>

                  <Link
                    href={m.link}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-wider transition shadow-md shadow-red-950/60"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Ver Transmisión</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1b1c26] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
