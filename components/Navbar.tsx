'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogOut, User as UserIcon, Radio } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-[#08080a]/80 backdrop-blur-xl border-b border-white/[0.07] h-14 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logotipo en móviles (en desktop está en el Sidebar lateral) */}
        <Link href="/" className="flex items-center gap-2.5 group lg:hidden">
          <div className="w-7 h-7 relative flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image
              src="/teams/blanco-y-negro.png"
              alt="Logo Blanco y Negro"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-baseline font-black tracking-tight text-sm">
            <span className="text-white">LOMONEGRO</span>
            <span className="text-red-500 font-mono text-[9px] ml-1 font-bold">.TV</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-[8px] font-mono uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>EN VIVO</span>
          </div>
        </Link>

        {/* Consola Técnica de Estado en Desktop (Estilo Forg1) */}
        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-red-950/50 border border-red-800/60 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold">SEÑAL EN VIVO</span>
          </div>
          <span className="text-zinc-700">//</span>
          <span className="text-white font-bold">CANAL 01 PPV</span>
          <span className="text-zinc-700">//</span>
          <span className="text-zinc-400">1080P ULTRA HD 60FPS</span>
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
