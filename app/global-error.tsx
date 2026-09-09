'use client';

import { useEffect } from 'react';

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root critical error:', error);
  }, [error]);

  return (
    <html lang="es" className="dark">
      <body className="bg-[#08080a] text-zinc-100 min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center p-6 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-bold text-2xl">
            !
          </div>
          <h1 className="text-xl font-black uppercase text-white mb-2">
            Error Crítico de Aplicación
          </h1>
          <p className="text-zinc-400 text-sm mb-6">
            Ocurrió un problema irrecuperable en el inicio de la plataforma.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all"
          >
            Recargar Plataforma
          </button>
        </div>
      </body>
    </html>
  );
}
