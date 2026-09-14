'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import StreamPlayer from '@/components/StreamPlayer';
import StreamPlaceholder from '@/components/StreamPlaceholder';
import { Loader2 } from 'lucide-react';

interface StreamPlayerWrapperProps {
  matchId: string;
  guestEmail?: string;
  matchTitle?: string;
  matchDate?: string;
  isAdmin?: boolean;
}

interface StreamResponse {
  token: string | null;
  sessionId: string;
  isLive?: boolean;
  status?: 'live' | 'waiting';
  matchTitle?: string;
  matchDate?: string;
}

// Intervalo de sondeo cuando está en espera: 12 segundos
const POLL_WAITING_MS = 12000;
// Intervalo de sondeo cuando está en vivo (detección de caída): 30 segundos
const POLL_LIVE_MS = 30000;

export default function StreamPlayerWrapper({
  matchId,
  guestEmail,
  matchTitle,
  matchDate,
  isAdmin = false,
}: StreamPlayerWrapperProps) {
  const [streamData, setStreamData] = useState<StreamResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const isLiveRef = useRef(false);

  const fetchToken = useCallback(async (overridePreview?: boolean, silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      const activePreview = overridePreview !== undefined ? overridePreview : previewMode;

      const res = await fetch('/api/stream/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, guestEmail, previewMode: activePreview }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Error al obtener las credenciales de transmisión'
        );
      }

      setStreamData(data);
      return data as StreamResponse;
    } catch (err: any) {
      if (!silent) setError(err.message);
      return null;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [matchId, guestEmail, previewMode]);

  // Sondeo dinámico: ajusta el intervalo según si está en vivo o en espera
  const startPolling = useCallback((currentlyLive: boolean) => {
    if (pollRef.current) clearInterval(pollRef.current);
    isLiveRef.current = currentlyLive;
    const interval = currentlyLive ? POLL_LIVE_MS : POLL_WAITING_MS;

    pollRef.current = setInterval(async () => {
      const result = await fetchToken(undefined, true);
      if (!result) return;
      const nowLive = Boolean(result.isLive && result.token);
      // Si cambió de estado, reiniciar con nuevo intervalo
      if (nowLive !== isLiveRef.current) {
        startPolling(nowLive);
      }
    }, interval);
  }, [fetchToken]);

  useEffect(() => {
    // Carga inicial
    fetchToken(undefined, false).then((result) => {
      const nowLive = Boolean(result?.isLive && result?.token);
      startPolling(nowLive);
    });

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [matchId, guestEmail, previewMode]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-black flex flex-col items-center justify-center rounded-2xl border border-zinc-800 shadow-2xl font-mono">
        <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-3" />
        <p className="text-sm font-bold text-white tracking-wide">
          Estableciendo conexión encriptada...
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Comprobando señal de transmisión oficial de Pasión Lomonegra TV
        </p>
      </div>
    );
  }

  // Mostrar placeholder si no hay señal activa
  const shouldShowPlaceholder =
    error ||
    !streamData ||
    streamData.status === 'waiting' ||
    !streamData.isLive ||
    !streamData.token;

  if (shouldShowPlaceholder) {
    return (
      <StreamPlaceholder
        matchTitle={matchTitle || streamData?.matchTitle}
        matchDate={matchDate || streamData?.matchDate}
        onRetry={() => fetchToken(false)}
        isRetrying={loading}
        showPreviewButton={isAdmin}
        onTogglePreview={
          isAdmin
            ? () => {
                setPreviewMode(true);
                fetchToken(true);
              }
            : undefined
        }
      />
    );
  }

  return (
    <StreamPlayer
      token={streamData.token!}
      sessionId={streamData.sessionId}
      guestEmail={guestEmail}
      matchTitle={matchTitle || streamData.matchTitle}
      matchDate={matchDate || streamData.matchDate}
      onBackToPlaceholder={() => {
        setPreviewMode(false);
        fetchToken(false);
      }}
    />
  );
}


