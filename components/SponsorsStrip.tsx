'use client';

import Image from 'next/image';
import { SPONSORS } from '@/lib/sponsorsData';
import { Megaphone, CheckCircle2, Instagram, ExternalLink } from 'lucide-react';

export default function SponsorsStrip() {
  return (
    <section className="space-y-4">
      {/* Encabezado Técnico de Sponsors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-red-500 mb-1">
            PARTNERS // ALIANZAS COMERCIALES
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            Patrocinadores Oficiales
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-[#0c0c10] border border-white/[0.07] px-3.5 py-1.5 rounded-xl w-fit">
          <Megaphone className="w-3.5 h-3.5 text-red-500" />
          <span>Marcas que impulsan la transmisión de Pasión Lomonegra</span>
        </div>
      </div>

      {/* Grid de Sponsors Oficiales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SPONSORS.map((brand) => {
          const content = (
            <div
              className={`group relative h-20 flex items-center justify-between p-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0f15] hover:border-red-500/50 hover:bg-[#14151f] transition-all duration-200 shadow-sm hover:shadow-[0_4px_24px_rgba(220,38,38,0.15)] ${
                brand.instagramUrl ? 'cursor-pointer' : ''
              }`}
            >
              {/* Información y Categoría */}
              <div className="min-w-0 pr-3 flex-1">
                <div className="text-[8px] font-mono tracking-[0.2em] uppercase text-zinc-500 leading-tight">
                  {brand.tier}
                </div>
                <div className="text-xs font-black text-white tracking-tight font-mono truncate mt-0.5 group-hover:text-red-400 transition-colors">
                  {brand.name}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {brand.category}
                </div>
                {brand.instagramUrl ? (
                  <div className="flex items-center gap-1 text-[9px] font-mono text-pink-400 mt-1">
                    <Instagram className="w-2.5 h-2.5" />
                    <span>Ver en Instagram</span>
                    <ExternalLink className="w-2 h-2 opacity-70" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 mt-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Auspiciante Oficial</span>
                  </div>
                )}
              </div>

              {/* Foto / Banner del Sponsor */}
              <div className="shrink-0 w-28 h-14 relative rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
              </div>
            </div>
          );

          if (brand.instagramUrl) {
            return (
              <a
                key={brand.id}
                href={brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                title={`Abrir Instagram de ${brand.name}`}
              >
                {content}
              </a>
            );
          }

          return <div key={brand.id}>{content}</div>;
        })}
      </div>

      {/* Footer de Sponsors */}
      <div className="text-center sm:text-left text-xs font-mono text-zinc-500 pt-1 flex flex-wrap items-center gap-2">
        <span>¿Deseas sumar tu marca a las transmisiones oficiales de Pasión Lomonegra?</span>
        <span className="text-red-400 hover:text-white transition-colors cursor-pointer underline underline-offset-2">
          Contactar a Producción Comercial &rarr;
        </span>
      </div>
    </section>
  );
}
