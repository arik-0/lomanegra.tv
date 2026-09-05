'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Calendar, Youtube, Ticket, Menu } from 'lucide-react';

interface BottomNavProps {
  onOpenSidebar: () => void;
}

export default function BottomNav({ onOpenSidebar }: BottomNavProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isPartido = pathname?.startsWith('/partido/');

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#08080a]/95 backdrop-blur-xl border-t border-white/[0.07] pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.7)]">
      <div className="grid grid-cols-5 h-14">
        {/* 1. Transmisión En Vivo */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
            isHome
              ? 'text-red-500 font-bold'
              : 'text-zinc-500 hover:text-zinc-300'
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
          href="/partido/blanco-y-negro-vs-ifc"
          className={`flex flex-col items-center justify-center gap-1 text-center transition-colors ${
            isPartido
              ? 'text-red-500 font-bold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            Pase Digital
          </span>
        </Link>

        {/* 3. Agenda de Partidos */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center gap-1 text-center text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            Agenda
          </span>
        </button>

        {/* 4. Grabaciones YouTube */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center gap-1 text-center text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Youtube className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            Videos
          </span>
        </button>

        {/* 5. Menú Completo */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center gap-1 text-center text-zinc-500 hover:text-zinc-300 transition-colors"
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
