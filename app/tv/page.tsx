'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Tv,
  Radio,
  Play,
  QrCode,
  ShieldCheck,
  RefreshCw,
  Lock,
  Sparkles,
  Wifi,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import TvStreamPlayer from '@/components/tv/TvStreamPlayer';
import { getTeamLogo } from '@/lib/standingsStore';
import { sanitizeRegionalText } from '@/lib/sanitize';

interface MatchItem {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  price: number;
  image_url: string | null;
  cloudflare_live_input_uid: string;
  is_active: boolean;
}

export default function TvPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [pairingCode, setPairingCode] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [guestEmail, setGuestEmail] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [operatorModal, setOperatorModal] = useState<boolean>(false);
  const [operatorPass, setOperatorPass] = useState<string>('');
  const [operatorError, setOperatorError] = useState<string>('');

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const deviceIdRef = useRef<string>('');

  // 1. Reloj en tiempo real para Android TV
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Inicializar DeviceId y cargar partidos
  useEffect(() => {
    let savedId = localStorage.getItem('pasion_tv_device_id');
    if (!savedId) {
      savedId = `tv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('pasion_tv_device_id', savedId);
    }
    deviceIdRef.current = savedId;

    // Cargar partidos disponibles
    const loadMatches = async () => {
      try {
        const res = await fetch('/api/admin/matches');
        if (res.ok) {
          const data = await res.json();
          if (data.matches && data.matches.length > 0) {
            setMatches(data.matches);
            setSelectedMatch(data.matches[0]);
          }
        }
      } catch (err) {
        console.error('Error cargando partidos para TV:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // 3. Generar Código de Emparejamiento TV
  const requestPairingCode = useCallback(async (matchId?: string) => {
    try {
      const res = await fetch('/api/tv/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: deviceIdRef.current,
          matchId: matchId || selectedMatch?.id,
          matchTitle: selectedMatch?.title,
        }),
      });

      const data = await res.json();
      if (data.code) {
        setPairingCode(data.code);
        if (data.status === 'authorized' && data.guestEmail) {
          setIsAuthorized(true);
          setGuestEmail(data.guestEmail);
        }
      }
    } catch (err) {
      console.error('Error generando código TV:', err);
    }
  }, [selectedMatch]);

  useEffect(() => {
    if (!pairingCode) {
      requestPairingCode();
    }
  }, [pairingCode, requestPairingCode]);

  // 4. Polling continuo: Detectar cuando el usuario autorice el código desde su celular
  useEffect(() => {
    if (isAuthorized || !pairingCode) return;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/tv/pair?code=${pairingCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'authorized' && data.guestEmail) {
            setIsAuthorized(true);
            setGuestEmail(data.guestEmail);
            // Iniciar transmisión automáticamente al detectar autorización
            setIsPlaying(true);
          } else if (data.status === 'expired') {
            requestPairingCode();
          }
        }
      } catch (err) {
        // Silenciar errores temporales de red en la TV
      }
    }, 2500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [pairingCode, isAuthorized, requestPairingCode]);

  // 5. Control de Navegación por Control Remoto (D-Pad)
  useEffect(() => {
    if (isPlaying || operatorModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % (isAuthorized ? 2 : 2));
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + 2) % 2);
          break;
        case 'Enter':
        case 'Select':
          e.preventDefault();
          if (isAuthorized) {
            if (focusedIndex === 0) setIsPlaying(true);
            else if (focusedIndex === 1) {
              setIsAuthorized(false);
              setGuestEmail(null);
              requestPairingCode();
            }
          } else {
            if (focusedIndex === 0) requestPairingCode();
            else if (focusedIndex === 1) setOperatorModal(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, operatorModal, isAuthorized, focusedIndex, requestPairingCode]);

  // Acceso de Operador
  const handleOperatorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOperatorError('');
    try {
      const res = await fetch('/api/tv/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: pairingCode,
          adminPassword: operatorPass,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthorized(true);
        setGuestEmail('operador@pasionlomonegra.com');
        setOperatorModal(false);
        setIsPlaying(true);
      } else {
        setOperatorError(data.error || 'Clave de operador no válida.');
      }
    } catch {
      setOperatorError('Error de conexión.');
    }
  };

  // 6. Si está en modo reproducción a pantalla completa
  if (isPlaying && selectedMatch) {
    return (
      <TvStreamPlayer
        matchId={selectedMatch.id}
        guestEmail={guestEmail || 'operador@pasionlomonegra.com'}
        token={selectedMatch.cloudflare_live_input_uid}
        matchTitle={selectedMatch.title}
        onExit={() => setIsPlaying(false)}
      />
    );
  }

  // URL para el código QR
  const qrUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/vincular?code=${pairingCode}`
    : `https://pasionlomonegra.com/vincular?code=${pairingCode}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=ffffff&bgcolor=0f1015&margin=1&data=${encodeURIComponent(qrUrl)}`;

  // Parsear equipos
  const rawTitle = selectedMatch?.title || 'Blanco y Negro vs Rival';
  const cleanTitle = sanitizeRegionalText(rawTitle);
  const parts = cleanTitle.split(/\s+vs\.?\s+/i);
  const t1 = parts[0]?.trim() || 'Blanco y Negro';
  const t2 = parts[1]?.trim() || 'Rival';

  return (
    <div className="w-screen h-screen flex flex-col justify-between p-10 bg-[#07080b] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-[#07080b] to-[#040507]">
      {/* 1. Barra Superior HUD de Android TV */}
      <header className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-600/50 flex items-center justify-center text-red-500 shadow-lg shadow-red-950/50">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight uppercase">
                Pasión Lomonegra TV
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-700/60 uppercase">
                Google TV Official
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Canal Oficial de Transmisión HD
            </p>
          </div>
        </div>

        {/* Indicadores de Estado y Reloj */}
        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2 bg-[#12131b] border border-zinc-800 px-3.5 py-1.5 rounded-xl">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-zinc-300">Conectado a Internet</span>
          </div>

          <div className="flex items-center gap-2 text-white font-bold bg-[#12131b] border border-zinc-800 px-4 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-mono">{currentTime || '20:00'}</span>
          </div>
        </div>
      </header>

      {/* 2. Cuerpo Principal (Split Screen Cinematográfico) */}
      <main className="flex-1 grid grid-cols-12 gap-10 items-center py-6">
        {/* Columna Izquierda: Información del Partido y Botones de Acción D-Pad (7 columnas) */}
        <div className="col-span-7 space-y-6">
          {/* Badge En Vivo */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-950/80 border border-red-600 text-red-400 text-xs font-black uppercase rounded-xl tracking-wider shadow-lg shadow-red-950/50">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span>SEÑAL EN DIRECTO // FULL HD 60FPS</span>
          </div>

          {/* Duelo de Clubes con Escudos */}
          <div className="bg-[#0f1015] border border-zinc-800 rounded-3xl p-6 shadow-2xl flex items-center justify-between max-w-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative drop-shadow-md">
                <Image
                  src={getTeamLogo(t1) || '/teams/Blanco y Negro.png'}
                  alt={t1}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-lg font-black text-white">{t1}</span>
            </div>

            <span className="px-3 py-1 bg-red-600 text-white rounded-lg font-black text-xs uppercase shadow">
              VS
            </span>

            <div className="flex items-center gap-4">
              <span className="text-lg font-black text-white">{t2}</span>
              <div className="w-14 h-14 relative drop-shadow-md">
                <Image
                  src={getTeamLogo(t2) || '/logo-pasion-lomonegra.png'}
                  alt={t2}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              {cleanTitle}
            </h1>
            <p className="text-xs text-zinc-400 mt-2 max-w-xl leading-relaxed">
              {selectedMatch?.description
                ? sanitizeRegionalText(selectedMatch.description)
                : 'Transmisión multicámara oficial en alta definición con relatos en vivo.'}
            </p>
          </div>

          {/* Estado de Autorización y Botones con Foco D-Pad */}
          {isAuthorized ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl max-w-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-sm font-black text-emerald-300 block">
                    Pase de Transmisión Autorizado
                  </span>
                  <span className="text-xs text-zinc-400">
                    Conectado con: <strong className="text-zinc-200">{guestEmail}</strong>
                  </span>
                </div>
              </div>

              {/* Botones D-Pad */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-3 transition-all ${
                    focusedIndex === 0
                      ? 'bg-red-600 text-white ring-4 ring-red-500/80 scale-105 shadow-2xl shadow-red-950'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Ver Transmisión en Pantalla Completa</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAuthorized(false);
                    setGuestEmail(null);
                    requestPairingCode();
                  }}
                  className={`px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
                    focusedIndex === 1
                      ? 'bg-zinc-700 text-white ring-4 ring-zinc-500 scale-105'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                  }`}
                >
                  Desvincular
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => requestPairingCode()}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all ${
                    focusedIndex === 0
                      ? 'bg-amber-500 text-black ring-4 ring-amber-400/80 scale-105 shadow-xl shadow-amber-950/60'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Generar Nuevo Código</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOperatorModal(true)}
                  className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                    focusedIndex === 1
                      ? 'bg-zinc-700 text-white ring-4 ring-red-500/80 scale-105'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Lock className="w-4 h-4 text-red-500" />
                  <span>Acceso Operador</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Tarjeta de Vinculación con Código QR y 6 Dígitos (5 columnas) */}
        <div className="col-span-5 flex justify-end">
          <div className="w-full max-w-sm bg-[#0f1015] border-2 border-zinc-800 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Vincular desde tu Celular
            </span>
            <p className="text-xs text-zinc-400 mb-4">
              Escanea el código QR con tu cámara o ingresa desde tu navegador a:
            </p>

            <div className="bg-black/60 border border-zinc-800 rounded-xl py-1.5 px-3 mb-4">
              <span className="text-xs font-black text-zinc-200">
                pasionlomonegra.com/vincular
              </span>
            </div>

            {/* Código QR */}
            <div className="w-48 h-48 mx-auto bg-[#07080b] p-3 rounded-2xl border border-zinc-800 flex items-center justify-center shadow-inner relative group mb-4">
              {pairingCode ? (
                <img
                  src={qrImageUrl}
                  alt="QR para Vincular Android TV"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
              )}
            </div>

            {/* Código de 6 Caracteres en Grande */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">
                O escribe este código en tu teléfono:
              </span>
              <div className="text-3xl font-black text-amber-300 font-mono tracking-widest py-1 bg-amber-950/30 border border-amber-600/40 rounded-xl shadow-inner">
                {pairingCode || '...'}
              </div>
            </div>

            {/* Radar de Sincronización en Tiempo Real */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[10px] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Esperando confirmación en tu teléfono...</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Barra Inferior HUD con Instrucciones para Control Remoto */}
      <footer className="border-t border-zinc-800/80 pt-4 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>Pasión Lomonegra • Transmisión Protegida para Android TV</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>
            Navegar: <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-bold">▲ ▼ ◄ ►</kbd>
          </span>
          <span>
            Seleccionar: <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300 font-bold">OK / Enter</kbd>
          </span>
        </div>
      </footer>

      {/* Modal para Operador */}
      {operatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[#12131a] border border-red-600/50 rounded-3xl p-8 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white">Acceso de Operador</h3>
            <p className="text-xs text-zinc-400">
              Ingresa la clave de administración para desbloquear esta pantalla.
            </p>
            <form onSubmit={handleOperatorLogin} className="space-y-4">
              <input
                type="password"
                required
                autoFocus
                value={operatorPass}
                onChange={(e) => setOperatorPass(e.target.value)}
                placeholder="Clave de Operador"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
              {operatorError && (
                <span className="text-xs text-red-400 block">{operatorError}</span>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOperatorModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
