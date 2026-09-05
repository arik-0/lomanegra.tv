import { ArrowLeft, Loader2 } from 'lucide-react';

export default function MatchLoading() {
  return (
    <main className="min-h-screen bg-[#08080a] text-white px-4 py-6 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Barra superior de navegación */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 bg-[#0c0c10] border border-white/[0.05] px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4 text-zinc-600" />
            <span>Cargando partido...</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Cargando Pase</span>
          </div>
        </div>

        {/* Layout en columnas: izquierda detalles, derecha checkout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna izquierda */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visualizador 16:9 */}
            <div className="relative aspect-video rounded-3xl bg-[#0c0c10] border border-white/[0.07] overflow-hidden flex items-center justify-center">
              <span className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-red-500/30" />
              <span className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-red-500/30" />
              <span className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-red-500/30" />
              <span className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-red-500/30" />
              <Loader2 className="w-8 h-8 animate-spin text-zinc-700" />
            </div>

            {/* Ficha técnica esqueleto */}
            <div className="bg-[#0c0c10] border border-white/[0.07] rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="w-32 h-6 bg-white/[0.05] rounded-lg" />
              <div className="w-3/4 h-8 bg-white/[0.08] rounded-xl" />
              <div className="w-full h-12 bg-white/[0.03] rounded-lg" />
            </div>
          </div>

          {/* Columna derecha: Checkout card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#0c0c10] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.07]">
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-white/[0.05] rounded" />
                  <div className="w-32 h-8 bg-white/[0.08] rounded-lg" />
                </div>
                <div className="w-11 h-11 rounded-2xl bg-red-950/40 border border-red-900/40" />
              </div>

              <div className="w-full h-12 bg-white/[0.06] rounded-2xl" />
              <div className="w-full h-14 bg-white/90 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
