'use client';

import Image from 'next/image';
import { Megaphone, CheckCircle2 } from 'lucide-react';

export default function SponsorsStrip() {
  const sponsorBrands = [
    {
      name: 'Quilmes',
      category: 'Sponsor Principal',
      tier: 'PLATINO // TITULAR',
      logo: '/sponsors/quilmes.svg',
      width: 110,
      height: 32,
    },
    {
      name: 'Adidas',
      category: 'Indumentaria Oficial',
      tier: 'ORO // EQUIPACIÓN',
      logo: '/sponsors/adidas.svg',
      width: 90,
      height: 32,
    },
    {
      name: 'YPF',
      category: 'Energía Oficial',
      tier: 'ORO // COMBUSTIBLE',
      logo: '/sponsors/ypf.svg',
      width: 85,
      height: 32,
    },
    {
      name: 'Coca-Cola',
      category: 'Bebida Oficial',
      tier: 'ORO // HIDRATACIÓN',
      logo: '/sponsors/coca-cola.svg',
      width: 105,
      height: 32,
    },
    {
      name: 'BBVA',
      category: 'Banca Oficial',
      tier: 'PLATA // FINANZAS',
      logo: '/sponsors/bbva.svg',
      width: 85,
      height: 32,
    },
    {
      name: 'Flybondi',
      category: 'Transporte Oficial',
      tier: 'PLATA // LOGÍSTICA',
      logo: '/sponsors/flybondi.svg',
      width: 95,
      height: 32,
    },
  ];

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
          <span>Marcas que impulsan la transmisión de los partidos</span>
        </div>
      </div>

      {/* Grid de Sponsors de Marcas Reconocidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sponsorBrands.map((brand, index) => {
          return (
            <div
              key={index}
              className="group relative h-[76px] flex items-center justify-between px-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(12,12,16,0.95)_100%)] hover:border-red-500/50 hover:bg-[#121218] transition-all duration-200 shadow-sm hover:shadow-[0_4px_24px_rgba(220,38,38,0.12)]"
            >
              {/* Información y Categoría */}
              <div className="min-w-0 pr-3">
                <div className="text-[8px] font-mono tracking-[0.2em] uppercase text-zinc-500 leading-tight">
                  {brand.tier}
                </div>
                <div className="text-sm font-black text-white tracking-tight font-mono truncate mt-0.5 group-hover:text-red-400 transition-colors">
                  {brand.category}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Partner Oficial</span>
                </div>
              </div>

              {/* Logo de la Marca con Efecto de Brillo */}
              <div className="shrink-0 flex items-center justify-end h-9 relative transition-transform duration-200 group-hover:scale-105">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={brand.width}
                  height={brand.height}
                  className="object-contain filter brightness-90 group-hover:brightness-110 drop-shadow"
                />
              </div>
            </div>
          );
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
