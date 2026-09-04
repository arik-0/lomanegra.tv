'use client';

import { useEffect, useState } from 'react';
import StreamPlayer from '@/components/StreamPlayer';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface StreamPlayerWrapperProps {
  matchId: string;
  guestEmail?: string;
}

export default function StreamPlayerWrapper({
  matchId,
  guestEmail,
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
        <p className="text-sm font-bold text-white tracking-wide">
          Estableciendo conexión encriptada...
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Verificando pase y firmando token RSA-256 de Cloudflare Stream
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-zinc-900/90 flex flex-col items-center justify-center rounded-2xl border border-red-800/80 p-8 text-center shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-black text-white mb-2">
          No se pudo iniciar la transmisión
        </h3>
        <p className="text-xs text-zinc-400 max-w-md mb-6">{error}</p>
        <button
          onClick={fetchToken}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar Conexión</span>
        </button>
      </div>
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
