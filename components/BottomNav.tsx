'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Calendar, Trophy, Ticket, Menu } from 'lucide-react';

interface BottomNavProps {
  onOpenSidebar: () => void;
}

export default function BottomNav({ onOpenSidebar }: BottomNavProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isPartido = pathname?.startsWith('/partido/');
  const isPosiciones = pathname === '/posiciones';

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#101116]/95 backdrop-blur-md border-t border-zinc-800/80 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
      <div className="grid grid-cols-5 h-14">
        {/* 1. Transmisión En Vivo */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
            isHome
              ? 'text-red-500 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Radio className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider">
            En Vivo
          </span>
        </Link>

        {/* 2. Partido Actual / Pase */}
        <Link
          href="/partido/0790eca3-cc28-41bb-a4b8-8e2c0c514cdf"
          className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
            isPartido
              ? 'text-red-500 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            Pase
          </span>
        </Link>

        {/* 3. Tablas de Posiciones y Play-offs */}
        <Link
          href="/posiciones"
          className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
            isPosiciones
              ? 'text-red-500 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            Tablas
          </span>
        </Link>

        {/* 4. Agenda */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center gap-1 text-center text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            Agenda
          </span>
        </button>

        {/* 5. Menú Completo (Abre Sidebar Full Width) */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center gap-1 text-center text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            Menú
          </span>
        </button>
      </div>
    </nav>
  );
}
