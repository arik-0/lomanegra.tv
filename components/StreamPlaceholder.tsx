'use client';

import Image from 'next/image';
import { RefreshCw, Volume2, ShieldCheck, Tv, Wifi, PlayCircle } from 'lucide-react';

interface StreamPlaceholderProps {
  matchTitle?: string;
  matchDate?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  onTogglePreview?: () => void;
}

export default function StreamPlaceholder({
  matchTitle = 'Club Atlético Blanco y Negro • Partido Oficial',
  matchDate,
  onRetry,
  isRetrying = false,
  onTogglePreview,
}: StreamPlaceholderProps) {
  return (
    <div className="w-full aspect-video bg-gradient-to-br from-[#06070a] via-[#0d0e14] to-[#08090f] relative overflow-hidden rounded-2xl border border-zinc-800 shadow-[0_12px_48px_rgba(0,0,0,0.85)] flex flex-col justify-between p-4 sm:p-6 font-mono select-none">
      {/* Fondo de scanlines y cuadrícula deportiva estilo HUD */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] [background-size:100%_4px] opacity-30 pointer-events-none" />

      {/* Escuadras HUD decorativas en las 4 esquinas */}
      <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-l-2 border-t-2 border-red-500/70 z-20 pointer-events-none" />
      <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-r-2 border-t-2 border-red-500/70 z-20 pointer-events-none" />
      <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-l-2 border-b-2 border-red-500/70 z-20 pointer-events-none" />
      <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-r-2 border-b-2 border-red-500/70 z-20 pointer-events-none" />

      {/* Barra superior de estado */}
      <div className="relative z-10 flex items-center justify-between gap-3 text-[10px]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-red-950/80 border border-red-700/80 text-red-400 font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
            <span>EN ESPERA DE TRANSMISIÓN</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-2 py-1 rounded-md">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>Señal preparada</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <span className="hidden md:inline text-zinc-500">PASIÓN LOMONEGRA TV</span>
          <span className="text-[9px] font-black uppercase text-white bg-zinc-800/90 border border-zinc-700 px-2 py-0.5 rounded">
            FULL HD 1080p
          </span>
        </div>
      </div>

      {/* Núcleo Central: Radar de señal y Escudo de Pasión Lomonegra */}
      <div className="relative z-10 my-auto text-center py-2 sm:py-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 flex items-center justify-center">
          {/* Ondas concéntricas de emisión */}
          <div className="absolute inset-0 rounded-full border border-red-500/20 animate-ping duration-1000" />
          <div className="absolute -inset-3 rounded-full border border-red-500/30 animate-pulse duration-700" />
          <div className="absolute -inset-6 rounded-full border border-white/[0.05] pointer-events-none" />

          {/* Escudo oficial */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#181922] to-black border-2 border-red-600/60 p-2 relative flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.35)]">
            <Image
              src="/logo-pasion-lomonegra.png"
              alt="Pasión Lomonegra"
              fill
              className="object-contain p-2"
              priority
            />
          </div>
        </div>

        <h3 className="text-base sm:text-xl font-black text-white uppercase tracking-tight mb-1">
          {matchTitle}
        </h3>

        <p className="text-xs sm:text-sm text-zinc-300 font-bold max-w-md mx-auto mb-1">
          La transmisión en directo comenzará minutos antes del inicio del encuentro.
        </p>

        {matchDate && (
          <p className="text-[11px] text-amber-400 font-bold capitalize">
            {matchDate}
          </p>
        )}

        <div className="mt-4 flex items-center justify-center gap-2.5 flex-wrap">
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-red-950 transition active:scale-95 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Comprobando señal...' : 'Comprobar Emisión en Vivo'}</span>
            </button>
          )}

          {onTogglePreview && (
            <button
              onClick={onTogglePreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 hover:text-white text-xs font-bold transition active:scale-95 cursor-pointer"
              title="Previsualizar reproductor de video de prueba"
            >
              <PlayCircle className="w-3.5 h-3.5 text-zinc-400" />
              <span>Modo Prueba</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra inferior técnica */}
      <div className="relative z-10 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[9px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-red-400" />
            <span className="text-zinc-300">Cabina Oficial ByN</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Tv className="w-3 h-3 text-zinc-400" />
            <span>Liga Deportiva del Sur</span>
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[9px] text-zinc-500">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Acceso Protegido &bull; PPV Oficial</span>
        </div>
      </div>
    </div>
  );
}
