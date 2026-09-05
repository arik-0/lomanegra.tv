'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogOut, User as UserIcon, Radio, Trophy, Youtube, Instagram, Camera, Menu } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import UserProfileModal from '@/components/UserProfileModal';
import { useSidebar } from '@/components/AppLayoutWrapper';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toggleSidebar } = useSidebar();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setLoading(false);
          return;
        }
      } catch {}

      if (typeof window !== 'undefined') {
        const localEmail = localStorage.getItem('lomonegrotv_guest_email');
        if (localEmail) {
          setUser({ id: 'local-user', email: localEmail } as User);
        }
      }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lomonegrotv_guest_email');
      localStorage.removeItem('lomonegrotv_user_authenticated');
    }
    try {
      await fetch('/api/auth/authenticate', { method: 'DELETE' });
      await supabase.auth.signOut();
    } catch {}
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#101116]/95 backdrop-blur-md border-b border-zinc-800/80 h-14 flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logotipo Oficial y Menú Hamburguesa en móviles */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#181920] hover:bg-[#20222a] border border-zinc-800 transition shadow-sm"
            aria-label="Abrir menú"
            title="Abrir menú de navegación"
          >
            <Menu className="w-4 h-4 text-zinc-300" />
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo-pasion-lomonegra.png"
                alt="Pasión Lomonegra"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-baseline font-black tracking-tight text-xs sm:text-sm">
              <span className="text-white">PASIÓN</span>
              <span className="text-red-500 ml-1">LOMONEGRA</span>
            </div>
          </Link>
        </div>

        {/* Enlaces de Cabecera en Desktop */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#181920] border border-red-900/50 text-red-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold">SEÑAL EN VIVO</span>
          </div>

          <Link
            href="/posiciones"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181920] hover:bg-[#20222a] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Tablas & Play-Offs</span>
          </Link>

          <Link
            href="/galeria"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181920] hover:bg-[#20222a] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            <Camera className="w-3.5 h-3.5 text-red-500" />
            <span>Galería</span>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <a
              href="https://www.youtube.com/@PasionlomonegraByN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 p-1.5 rounded-lg bg-[#181920] hover:bg-[#20222a] border border-zinc-800/80 text-zinc-400 hover:text-red-500 transition shadow-sm"
              title="Canal Oficial de YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/pasion_lomonegra?igsi=ejZkcWJlejZ1NXU0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 p-1.5 rounded-lg bg-[#181920] hover:bg-[#20222a] border border-zinc-800/80 text-zinc-400 hover:text-pink-500 transition shadow-sm"
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white bg-[#181920] hover:bg-[#22242e] border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg shadow-sm transition group cursor-pointer"
                    title="Ver puntos de visualización y pases adquiridos"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <UserIcon className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="truncate max-w-[110px] sm:max-w-[150px] font-bold">{user.email}</span>
                    <span className="hidden sm:inline-flex items-center text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/80 px-1.5 py-0.5 rounded font-black shrink-0">
                      ★ 1.450 pts
                    </span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-[#181920] hover:bg-[#22242e] text-zinc-300 hover:text-white border border-zinc-800 transition shadow-sm"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span className="hidden sm:inline">Salir</span>
                  </button>

                  <UserProfileModal
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    userEmail={user.email || 'socio@pasionlomonegra.com'}
                    onSignOut={handleSignOut}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black shadow-[0_2px_12px_rgba(255,255,255,0.15)] transition"
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
