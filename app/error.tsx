'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Loggear error silenciosamente para observabilidad
    console.error('Captured application error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Glow & Icon */}
        <div className="relative mb-6 inline-block">
          <div className="absolute -inset-3 bg-red-600/20 rounded-full blur-lg" />
          <div className="relative w-20 h-20 mx-auto rounded-2xl bg-zinc-900 border border-red-500/30 flex items-center justify-center shadow-xl">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-wider mb-4">
          Interrupción del Sistema
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mb-3">
          Ocurrió un error inesperado
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          Hubo un problema al procesar los datos de la transmisión o la interfaz. Podés reintentar la conexión de inmediato.
        </p>

        {error.digest && (
          <div className="mb-6 p-2 rounded-lg bg-zinc-900/60 border border-white/5 text-[11px] font-mono text-zinc-500">
            Código de referencia: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs mx-auto">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-medium text-sm transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
