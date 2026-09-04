'use client';

import { useEffect, useState, useRef } from 'react';
import { Stream } from '@cloudflare/stream-react';
import { Lock, RefreshCw, ShieldAlert } from 'lucide-react';

interface StreamPlayerProps {
  token: string;
  sessionId: string;
  guestEmail?: string;
}

export default function StreamPlayer({ token, sessionId, guestEmail }: StreamPlayerProps) {
  const [concurrencyError, setConcurrencyError] = useState<string | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Iniciar latido (Heartbeat) cada 20 segundos
    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/stream/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, guestEmail }),
        });

        if (res.status === 409) {
          const data = await res.json();
          setConcurrencyError(
            data.error ||
              'Se ha iniciado la transmisión en otro dispositivo o ventana con tu cuenta.'
          );
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
        }
      } catch (err) {
        console.error('Error enviando heartbeat:', err);
      }
    }, 20000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [sessionId]);

  // Pantalla de bloqueo por sesión concurrente (Paleta Negro / Blanco / Rojo)
  if (concurrencyError) {
    return (
      <div className="w-full aspect-video bg-black flex flex-col items-center justify-center p-6 text-center rounded-2xl border-2 border-red-600/70 shadow-2xl shadow-red-950/50 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-950/60 border border-red-600/50 flex items-center justify-center mb-5">
          <Lock className="w-10 h-10 text-red-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-red-500 text-xs uppercase tracking-widest font-black mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Control de Concurrencia</span>
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Transmisión Pausada</h3>
        <p className="text-zinc-400 max-w-lg text-sm mb-6 leading-relaxed">
          {concurrencyError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-950 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reanudar en este dispositivo</span>
        </button>
      </div>
    );
  }

  const isDemo = token.startsWith('http');

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 relative group">
      {isDemo ? (
        <>
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-red-600/90 backdrop-blur-md rounded-xl text-[11px] font-black uppercase text-white flex items-center gap-2 shadow-lg shadow-red-950/60">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>MODO DE PRUEBA (SIN CLOUDFLARE)</span>
          </div>
          <video
            controls
            autoPlay
            playsInline
            src={token}
            className="w-full h-full object-contain"
          />
        </>
      ) : (
        <Stream
          controls
          src={token}
          autoplay
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}
