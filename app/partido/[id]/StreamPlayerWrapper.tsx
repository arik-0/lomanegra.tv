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

export default function StreamPlayerWrapper({
  matchId,
  guestEmail,
  matchTitle,
  matchDate,
}: StreamPlayerWrapperProps) {
  const [streamData, setStreamData] = useState<{
    token: string;
    sessionId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/stream/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, guestEmail }),
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
  }, [matchId, guestEmail]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-black flex flex-col items-center justify-center rounded-2xl border border-zinc-800 shadow-2xl">
        <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
        <p className="text-sm font-bold text-white tracking-wide font-mono">
          Estableciendo conexión encriptada...
        </p>
        <p className="text-xs text-zinc-500 mt-1 font-mono">
          Verificando pase y firmando token RSA-256 de Cloudflare Stream
        </p>
      </div>
    );
  }

  if (error || !streamData) {
    return (
      <StreamPlaceholder
        matchTitle={matchTitle}
        matchDate={matchDate}
        onRetry={fetchToken}
        isRetrying={loading}
      />
    );
  }

  return streamData ? (
    <StreamPlayer 
      token={streamData.token} 
      sessionId={streamData.sessionId} 
      guestEmail={guestEmail}
    />
  ) : null;
}
