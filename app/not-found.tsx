import Link from 'next/link';
import Image from 'next/image';
import { Home, Trophy, Video, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Glow effect */}
        <div className="relative mb-8 inline-block">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-zinc-700/20 rounded-full blur-xl opacity-75" />
          <div className="relative w-24 h-24 mx-auto rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center p-4 shadow-2xl">
            <Image
              src="/logo-pasion-lomonegra.png"
              alt="Pasión Lomonegra"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-wider mb-4">
          <AlertCircle className="w-3.5 h-3.5" />
          404 · Fuera de Juego
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mb-3">
          Página No Encontrada
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
          La jugada o transmisión que estás buscando no existe, ha finalizado o la dirección ingresada no es válida.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/25 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            Volver al Inicio
          </Link>
          <Link
            href="/posiciones"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 font-medium text-sm transition-all active:scale-95"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            Ver Posiciones
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Video className="w-3.5 h-3.5 text-zinc-400" />
            Explorar Galería de Videos y Fotos
          </Link>
        </div>
      </div>
    </div>
  );
}
