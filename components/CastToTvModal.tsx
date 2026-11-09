'use client';

import { useState, useEffect } from 'react';
import {
  Tv,
  Cast,
  Airplay,
  Smartphone,
  Wifi,
  Copy,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';

interface CastToTvModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamUrl: string;
  matchTitle?: string;
  guestEmail?: string;
  onTriggerChromecast?: () => Promise<void> | void;
  onTriggerAirPlay?: () => void;
  isAirPlaySupported?: boolean;
  isCastSupported?: boolean;
}

export default function CastToTvModal({
  isOpen,
  onClose,
  streamUrl,
  matchTitle,
  guestEmail,
  onTriggerChromecast,
  onTriggerAirPlay,
  isAirPlaySupported = false,
  isCastSupported = false,
}: CastToTvModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'chromecast' | 'airplay' | 'smarttv' | 'smartview'>('chromecast');
  const [tvUrl, setTvUrl] = useState('');

  // Detectar plataforma al montar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Construir enlace directo optimizado para el navegador de Smart TV (con pase de invitado incluido)
    try {
      const url = new URL(window.location.href);
      if (guestEmail) {
        url.searchParams.set('guest_email', guestEmail);
      }
      setTvUrl(url.toString());
    } catch {
      setTvUrl(window.location.href);
    }

    // Detectar iOS / Mac para priorizar AirPlay por defecto
    const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
    if (isApple) {
      setActiveTab('airplay');
    } else {
      setActiveTab('chromecast');
    }
  }, [guestEmail, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!tvUrl) return;
    navigator.clipboard.writeText(tvUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div
        className="relative w-full max-w-xl bg-[#0f1015] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-zinc-800/80 flex items-center justify-between bg-[#14151e]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-wide">
                  Transmitir a Televisor
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full uppercase">
                  Cast & AirPlay
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Mirá el partido en pantalla grande sin cables
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de opciones */}
        <div className="grid grid-cols-4 p-2 bg-[#12131b] border-b border-zinc-800/80 gap-1 text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('chromecast')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition ${
              activeTab === 'chromecast'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Cast className="w-4 h-4" />
            <span className="truncate">Chromecast</span>
          </button>

          <button
            onClick={() => setActiveTab('airplay')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition ${
              activeTab === 'airplay'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Airplay className="w-4 h-4" />
            <span className="truncate">AirPlay</span>
          </button>

          <button
            onClick={() => setActiveTab('smarttv')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition ${
              activeTab === 'smarttv'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span className="truncate">Smart TV Web</span>
          </button>

          <button
            onClick={() => setActiveTab('smartview')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition ${
              activeTab === 'smartview'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="truncate">Smart View</span>
          </button>
        </div>

        {/* Contenido de la pestaña */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: CHROMECAST / GOOGLE TV / ANDROID TV */}
          {activeTab === 'chromecast' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-950/20 border border-amber-800/40 rounded-2xl">
                <Cast className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-amber-200">
                    Google Cast / Chromecast / Android TV / Google TV
                  </p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Compatible con Chromecast, televisores con Android TV o Google TV (Philips, TCL, Noblex, BGH, Xiaomi Box).
                  </p>
                </div>
              </div>

              {onTriggerChromecast && (
                <button
                  type="button"
                  onClick={() => {
                    onTriggerChromecast();
                  }}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition"
                >
                  <Cast className="w-4 h-4" />
                  <span>Buscar Dispositivos Chromecast</span>
                </button>
              )}

              <div className="bg-[#14151e] border border-zinc-800 rounded-2xl p-4 text-xs space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Pasos sencillos desde Google Chrome:
                </span>
                <ol className="space-y-2 text-zinc-300 text-[11px] list-decimal list-inside">
                  <li>
                    Abre el menú de Chrome tocando los <strong>3 puntos verticales (⋮)</strong> en la esquina superior derecha.
                  </li>
                  <li>
                    Selecciona <strong>"Transmitir..."</strong> o <strong>"Cast..."</strong>.
                  </li>
                  <li>
                    Elige tu televisor en la lista para proyectar el partido en pantalla completa.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: APPLE AIRPLAY */}
          {activeTab === 'airplay' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-950/20 border border-blue-800/40 rounded-2xl">
                <Airplay className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-blue-200">
                    Apple AirPlay (iPhone, iPad, Mac)
                  </p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Transmite a televisores Samsung, LG, Sony, Roku y Apple TV compatibles con AirPlay 2.
                  </p>
                </div>
              </div>

              {onTriggerAirPlay && isAirPlaySupported && (
                <button
                  type="button"
                  onClick={onTriggerAirPlay}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 transition"
                >
                  <Airplay className="w-4 h-4" />
                  <span>Abrir Selector de AirPlay</span>
                </button>
              )}

              <div className="bg-[#14151e] border border-zinc-800 rounded-2xl p-4 text-xs space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Desde tu iPhone o iPad:
                </span>
                <ol className="space-y-2 text-zinc-300 text-[11px] list-decimal list-inside">
                  <li>
                    Toca el botón de <strong>pantalla completa</strong> dentro del reproductor de video.
                  </li>
                  <li>
                    Toca el ícono de <strong>AirPlay</strong> (un triángulo con aros) o desliza el <strong>Centro de Control</strong> de tu iPhone.
                  </li>
                  <li>
                    Selecciona <strong>"Duplicar Pantalla"</strong> y elige tu televisor (Samsung, LG, Roku o Apple TV).
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: SMART TV NAVEGADOR (SAMSUNG TIZEN / LG WEBOS) */}
          {activeTab === 'smarttv' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl">
                <Tv className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-200">
                    Navegador Web en Smart TV (Samsung, LG, etc.)
                  </p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Si tu televisor no tiene Chromecast ni AirPlay, puedes abrir la transmisión directamente desde su navegador integrado.
                  </p>
                </div>
              </div>

              <div className="bg-[#14151e] border border-zinc-800 rounded-2xl p-4 text-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Enlace directo con tu pase de acceso activado:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={tvUrl}
                    className="w-full bg-black border border-zinc-700/80 rounded-xl px-3 py-2 text-[11px] text-zinc-300 font-mono truncate focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 active:scale-95 shadow-md shadow-emerald-950"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Tip: Puedes enviarte este enlace por WhatsApp Web o abrirlo en la app "Internet" o "Navegador" de tu Smart TV.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SMART VIEW / MIRACAST / DUPLICAR PANTALLA */}
          {activeTab === 'smartview' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-purple-950/20 border border-purple-800/40 rounded-2xl">
                <Smartphone className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-purple-200">
                    Smart View / Transmitir Pantalla (Android)
                  </p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    Disponible en la mayoría de celulares Samsung, Motorola, Xiaomi y Realme hacia Smart TVs de cualquier marca.
                  </p>
                </div>
              </div>

              <div className="bg-[#14151e] border border-zinc-800 rounded-2xl p-4 text-xs space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Cómo activarlo en tu celular:
                </span>
                <ol className="space-y-2 text-zinc-300 text-[11px] list-decimal list-inside">
                  <li>
                    Desliza el dedo desde el borde superior de tu celular para abrir el panel de accesos rápidos.
                  </li>
                  <li>
                    Busca el botón <strong>"Smart View"</strong>, <strong>"Transmitir pantalla"</strong> o <strong>"Emitir"</strong>.
                  </li>
                  <li>
                    Selecciona tu Smart TV. Tu pantalla se reflejará instantáneamente en la tele.
                  </li>
                  <li>
                    Pon el video en horizontal y pantalla completa.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Banner de Wi-Fi */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-[11px] text-zinc-400">
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Requisito clave:</strong> Tu celular/computadora y el televisor deben estar conectados a la <strong>misma red Wi-Fi</strong>.
            </span>
          </div>
        </div>

        {/* Pie */}
        <div className="px-6 py-4 border-t border-zinc-800/80 bg-[#12131b] flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 truncate max-w-[300px]">
            {matchTitle || 'Pasión Lomonegra'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
