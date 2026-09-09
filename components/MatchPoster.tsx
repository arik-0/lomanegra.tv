'use client';

import Image from 'next/image';
import { getTeamLogo } from '@/lib/standingsStore';
import { sanitizeRegionalText } from '@/lib/sanitize';
import { Radio, Shield } from 'lucide-react';

interface MatchPosterProps {
  title: string;
  imageUrl?: string | null;
  league?: string | null;
  category?: string | null;
  size?: 'hero' | 'card';
  priority?: boolean;
}

export default function MatchPoster({
  title,
  imageUrl,
  league = 'Liga Deportiva del Sur',
  category = 'Fútbol Mayor',
  size = 'hero',
  priority = false,
}: MatchPosterProps) {
  const cleanTitle = sanitizeRegionalText(title);

  // Extraer equipos del título
  const parts = cleanTitle.split(/vs\.?|\s+-\s+/i);
  const homeName = parts[0]?.trim() || 'Blanco y Negro';
  const awayName = parts[1]?.trim() || 'Rival';

  const homeLogo = getTeamLogo(homeName) || '/teams/Blanco y Negro.png';
  const awayLogo = getTeamLogo(awayName);

  // Validar si la imagen provista es una imagen personalizada legítima
  // Si apunta a blanco-y-negro-vs-ifc pero el rival NO es Independiente/IFC, descartarla para evitar desajuste
  const isIfcMatch =
    awayName.toLowerCase().includes('independiente') ||
    awayName.toLowerCase().includes('ifc') ||
    awayName.toLowerCase().includes('bigand');

  const isMismatchedIfc =
    imageUrl?.includes('blanco-y-negro-vs-ifc') && !isIfcMatch;

  const hasCustomUpload =
    imageUrl &&
    !isMismatchedIfc &&
    !imageUrl.endsWith('.svg') &&
    (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('http'));

  // Si hay una foto personalizada real subida por el usuario, mostrarla
  if (hasCustomUpload) {
    return (
      <div className={`relative w-full ${size === 'hero' ? 'aspect-video sm:aspect-[16/9]' : 'h-full'} overflow-hidden bg-black flex items-center justify-center`}>
        <Image
          src={imageUrl!}
          alt={cleanTitle}
          fill
          priority={priority}
          className="object-contain transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
      </div>
    );
  }

  // Renderizar afiche broadcast oficial dinámico de alta definición
  const isHero = size === 'hero';

  return (
    <div
      className={`relative w-full ${
        isHero ? 'aspect-video sm:aspect-[16/9]' : 'h-full min-h-[140px]'
      } overflow-hidden bg-[#0a0a0e] flex flex-col justify-between p-4 sm:p-6 select-none`}
    >
      {/* Fondo de atmósfera de estadio con iluminación focalizada */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(220,38,38,0.18),transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(220,38,38,0.08),transparent_50%)] pointer-events-none" />

      {/* Trama sutil de líneas de campo táctico */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[1px] bg-white/[0.04] pointer-events-none" />
      <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-[1px] bg-white/[0.04] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 sm:w-40 h-28 sm:h-40 rounded-full border border-white/[0.04] pointer-events-none" />

      {/* Escuadras HUD */}
      <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-l-2 border-t-2 border-red-500/60 z-10 pointer-events-none" />
      <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-r-2 border-t-2 border-red-500/60 z-10 pointer-events-none" />
      <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-l-2 border-b-2 border-red-500/60 z-10 pointer-events-none" />
      <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-r-2 border-b-2 border-red-500/60 z-10 pointer-events-none" />

      {/* Encabezado del Afiche */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider shadow-lg shadow-red-950">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>TRANSMISIÓN OFICIAL</span>
        </div>
        <div className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded border border-white/5">
          {category}
        </div>
      </div>

      {/* Centro: Duelo de Escudos Oficiales */}
      <div className="relative z-10 flex items-center justify-around my-auto px-2 sm:px-6">
        {/* Local */}
        <div className="flex flex-col items-center gap-2 text-center max-w-[42%] group-hover:scale-105 transition-transform duration-300">
          <div
            className={`relative ${
              isHero ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-12 h-12 sm:w-16 sm:h-16'
            } drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] filter transition-all`}
          >
            {homeLogo ? (
              <Image
                src={homeLogo}
                alt={homeName}
                fill
                priority={priority}
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-zinc-500" />
              </div>
            )}
          </div>
          <span
            className={`font-black uppercase tracking-tight text-white line-clamp-1 ${
              isHero ? 'text-xs sm:text-sm md:text-base' : 'text-[11px]'
            }`}
          >
            {homeName}
          </span>
        </div>

        {/* Separador VS Central */}
        <div className="flex flex-col items-center justify-center shrink-0 px-2">
          <div className="relative">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)]">
              <span className="font-mono font-black text-xs sm:text-base text-white tracking-wider">
                VS
              </span>
            </div>
          </div>
          <span className="text-[8px] sm:text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5 hidden sm:block">
            EN VIVO
          </span>
        </div>

        {/* Visitante */}
        <div className="flex flex-col items-center gap-2 text-center max-w-[42%] group-hover:scale-105 transition-transform duration-300">
          <div
            className={`relative ${
              isHero ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-12 h-12 sm:w-16 sm:h-16'
            } drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] filter transition-all`}
          >
            {awayLogo ? (
              <Image
                src={awayLogo}
                alt={awayName}
                fill
                priority={priority}
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-zinc-500" />
              </div>
            )}
          </div>
          <span
            className={`font-black uppercase tracking-tight text-white line-clamp-1 ${
              isHero ? 'text-xs sm:text-sm md:text-base' : 'text-[11px]'
            }`}
          >
            {awayName}
          </span>
        </div>
      </div>

      {/* Pie de Afiche */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/[0.06] pt-2 mt-auto text-[9px] sm:text-[10px] font-mono text-zinc-400">
        <span className="truncate max-w-[70%] font-bold text-zinc-300">
          {league}
        </span>
        <span className="text-red-400 font-bold tracking-wider">
          PASIÓN LOMONEGRA HD
        </span>
      </div>
    </div>
  );
}
