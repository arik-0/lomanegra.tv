'use client';

import { useState, useEffect, useRef } from 'react';
import { Radio, RefreshCw, ArrowLeft, Tv, ShieldCheck } from 'lucide-react';

interface TvStreamPlayerProps {
  matchId: string;
  guestEmail: string;
  token?: string;
  matchTitle?: string;
  onExit: () => void;
}

export default function TvStreamPlayer({
  matchId,
  guestEmail,
  token,
  matchTitle,
  onExit,
}: TvStreamPlayerProps) {
  const [showOsd, setShowOsd] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const osdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-ocultar OSD tras 4 segundos
  const resetOsdTimer = () => {
    setShowOsd(true);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = setTimeout(() => {
      setShowOsd(false);
    }, 4500);
  };

  useEffect(() => {
    resetOsdTimer();

    // Capturar teclas de control remoto (D-Pad, OK, Volver)
    const handleKeyDown = (e: KeyboardEvent) => {
      resetOsdTimer();

      switch (e.key) {
        case 'Escape':
        case 'Backspace':
        case 'GoBack':
          e.preventDefault();
          onExit();
          break;
        case 'Enter':
        case 'Select':
        case 'MediaPlayPause':
          // Presionar OK recarga la señal si el OSD está visible
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          // Despertar OSD
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    };
  }, [onExit]);

  // UID por defecto si no viene token
  const ANCHORED_UID = 'dac066a4fb5c97117189392adae3f453';
  let streamSrc = token || ANCHORED_UID;
  let customerCode: string | undefined = undefined;

  const customerMatch = streamSrc.match(/customer-([a-zA-Z0-9]+)\.cloudflarestream\.com/);
  if (customerMatch && customerMatch[1]) {
    customerCode = customerMatch[1];
  }

  const cfMatch = streamSrc.match(/(?:videodelivery\.net|cloudflarestream\.com)\/([a-fA-F0-9]{32})/);
  if (cfMatch && cfMatch[1]) {
    streamSrc = cfMatch[1];
  }

  if (!streamSrc || streamSrc.startsWith('mock') || streamSrc.startsWith('live_input_')) {
    streamSrc = ANCHORED_UID;
  }

  const isDirectVideo = streamSrc.startsWith('http') && !cfMatch;
  const cfCustomer = customerCode || '2p5v30ml6gk9homd';
  const iframeSrc = `https://customer-${cfCustomer}.cloudflarestream.com/${streamSrc}/iframe?autoplay=true&preload=auto&controls=true&primaryColor=%23dc2626`;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-mono">
      {/* Reproductor Fullscreen */}
      {isDirectVideo ? (
        <video
          autoPlay
          controls
          playsInline
          src={streamSrc}
          className="w-full h-full object-contain"
        />
      ) : (
        <iframe
          key={reloadKey}
          src={iframeSrc}
          title={matchTitle || 'Pasión Lomonegra TV'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}

      {/* OSD (On Screen Display) - Se muestra con cualquier tecla del control remoto */}
      <div
        className={`absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-500 pointer-events-none ${
          showOsd ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-red-600 rounded-2xl text-xs font-black uppercase text-white flex items-center gap-2.5 shadow-xl shadow-red-950">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>EN VIVO // ANDROID TV</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide drop-shadow-md">
                {matchTitle || 'Pasión Lomonegra Oficial'}
              </h2>
              <span className="text-xs text-zinc-400">
                Pase activo: <strong className="text-zinc-200">{guestEmail}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="px-4 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-2xl text-xs font-bold text-zinc-300 flex items-center gap-2 pointer-events-auto transition shadow-lg"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Recargar Señal</span>
            </button>
            <button
              onClick={onExit}
              className="px-4 py-2 bg-zinc-900/90 hover:bg-red-950/80 border border-zinc-700 hover:border-red-600 rounded-2xl text-xs font-bold text-zinc-300 hover:text-red-400 flex items-center gap-2 pointer-events-auto transition shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Menú</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de ayuda al pie (solo cuando OSD está activo) */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/80 backdrop-blur-md border border-zinc-800 rounded-full text-[11px] text-zinc-400 flex items-center gap-3 transition-opacity duration-500 pointer-events-none ${
          showOsd ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span>
          Presiona <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-200 font-bold">Atrás</kbd> en el control remoto para salir
        </span>
        <span>•</span>
        <span>
          Presiona <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-200 font-bold">OK</kbd> para controles
        </span>
      </div>
    </div>
  );
}
