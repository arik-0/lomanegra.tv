'use client';

import { useEffect, useState } from 'react';
import StreamPlayer from '@/components/StreamPlayer';
import StreamPlaceholder from '@/components/StreamPlaceholder';
import { Loader2 } from 'lucide-react';

interface StreamPlayerWrapperProps {
  matchId: string;
  guestEmail?: string;
  matchTitle?: string;
  matchDate?: string;
}

interface StreamResponse {
  token: string | null;
  sessionId: string;
  isLive?: boolean;
  status?: 'live' | 'waiting';
  matchTitle?: string;
  matchDate?: string;
}

export default function StreamPlayerWrapper({
  matchId,
  guestEmail,
  matchTitle,
  matchDate,
}: StreamPlayerWrapperProps) {
  const [streamData, setStreamData] = useState<StreamResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const fetchToken = async (overridePreview?: boolean) => {
    try {
      setLoading(true);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
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

  // Si no hay transmisión activa o está en espera, mostrar el StreamPlaceholder interactivo
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
        onTogglePreview={() => {
          setPreviewMode(true);
          fetchToken(true);
        }}
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
