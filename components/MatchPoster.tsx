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
  category = 'Primera',
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
          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
      </div>
    );
  }

  // Renderizar afiche broadcast oficial dinámico con escudos limpios
  const isHero = size === 'hero';

  return (
    <div
      className={`relative w-full ${
        isHero ? 'aspect-video sm:aspect-[16/9]' : 'h-full min-h-[140px]'
      } overflow-hidden bg-[#0a0a0e] flex flex-col justify-center items-center p-3 sm:p-5 select-none`}
    >
      {/* Fondo sutil de atmósfera sin palabras ni marcas de agua superpuestas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(220,38,38,0.15),transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(220,38,38,0.06),transparent_50%)] pointer-events-none" />

      {/* Escuadras HUD sutiles */}
      <span className="absolute top-2 left-2 w-2.5 h-2.5 border-l-2 border-t-2 border-red-500/40 z-10 pointer-events-none" />
      <span className="absolute top-2 right-2 w-2.5 h-2.5 border-r-2 border-t-2 border-red-500/40 z-10 pointer-events-none" />
      <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-l-2 border-b-2 border-red-500/40 z-10 pointer-events-none" />
      <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-r-2 border-b-2 border-red-500/40 z-10 pointer-events-none" />

      {/* Centro: Duelo de Escudos Oficiales Limpio */}
      <div className="relative z-10 flex items-center justify-around w-full px-2 sm:px-6 my-auto">
        {/* Local */}
        <div className="flex flex-col items-center gap-1.5 text-center max-w-[42%] group-hover:scale-105 transition-transform duration-300">
          <div
            className={`relative ${
              isHero ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-14 h-14 sm:w-16 sm:h-16'
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
          {isHero && (
            <span className="font-black uppercase tracking-tight text-white line-clamp-1 text-xs sm:text-sm md:text-base">
              {homeName}
            </span>
          )}
        </div>

        {/* Separador VS Central */}
        <div className="flex flex-col items-center justify-center shrink-0 px-2">
          <div className="relative">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-red-600 to-red-900 border border-white/20 flex items-center justify-center shadow-[0_0_16px_rgba(220,38,38,0.5)]">
              <span className="font-mono font-black text-xs sm:text-sm text-white tracking-wider">
                VS
              </span>
            </div>
          </div>
        </div>

        {/* Visitante */}
        <div className="flex flex-col items-center gap-1.5 text-center max-w-[42%] group-hover:scale-105 transition-transform duration-300">
          <div
            className={`relative ${
              isHero ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-14 h-14 sm:w-16 sm:h-16'
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
          {isHero && (
            <span className="font-black uppercase tracking-tight text-white line-clamp-1 text-xs sm:text-sm md:text-base">
              {awayName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
