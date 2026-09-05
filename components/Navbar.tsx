'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogOut, User as UserIcon, Radio, Trophy, Youtube, Instagram } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#08080a]/90 backdrop-blur-xl border-b border-white/[0.07] h-14 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logotipo Oficial en móviles */}
        <Link href="/" className="flex items-center gap-2 group lg:hidden">
          <div className="w-8 h-8 relative flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/logo-pasion-lomonegra.png"
              alt="Pasión Lomonegra"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-baseline font-black tracking-tight text-sm">
            <span className="text-white">PASIÓN</span>
            <span className="text-red-500 ml-1">LOMONEGRA</span>
          </div>
        </Link>

        {/* Enlaces de Cabecera en Desktop */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/50 border border-red-800/60 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold">SEÑAL EN VIVO</span>
          </div>

          <Link
            href="/posiciones"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Tablas de Posiciones</span>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
            <a
              href="https://www.youtube.com/@PasionlomonegraByN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-red-500 transition"
              title="Canal Oficial de YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/pasion_lomonegra?igsi=ejZkcWJlejZ1NXU0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-pink-500 transition"
              title="Instagram Oficial"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Acciones de Usuario */}
        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2.5">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-300 bg-[#0c0c10] border border-white/[0.08] px-3 py-1.5 rounded-lg">
                    <UserIcon className="w-3.5 h-3.5 text-red-500" />
                    <span className="truncate max-w-[150px]">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0c0c10] hover:bg-[#14141c] text-zinc-300 hover:text-white border border-white/[0.08] transition"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span className="hidden sm:inline">Salir</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black shadow-[0_2px_12px_rgba(255,255,255,0.12)] transition"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
