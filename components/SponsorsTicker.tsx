'use client';

import Image from 'next/image';

interface SponsorItem {
  name: string;
  category: string;
  isPrimary?: boolean;
  logo?: string;
}

export default function SponsorsTicker() {
  const sponsors: SponsorItem[] = [
    { name: 'QUILMES', category: 'Sponsor Titular', isPrimary: true, logo: '/sponsors/quilmes.svg' },
    { name: 'ADIDAS', category: 'Indumentaria Oficial', isPrimary: true, logo: '/sponsors/adidas.svg' },
    { name: 'YPF', category: 'Energía Oficial', isPrimary: true, logo: '/sponsors/ypf.svg' },
    { name: 'COCA-COLA', category: 'Hidratación Oficial', isPrimary: true, logo: '/sponsors/coca-cola.svg' },
    { name: 'BBVA', category: 'Banca Oficial', isPrimary: false, logo: '/sponsors/bbva.svg' },
    { name: 'FLYBONDI', category: 'Conectividad Oficial', isPrimary: false, logo: '/sponsors/flybondi.svg' },
    { name: 'NALDO', category: 'Auspicio Comercial', isPrimary: false },
    { name: 'GOBIERNO REGIONAL', category: 'Apoyo Institucional', isPrimary: false },
    { name: 'COOP. ELÉCTRICA SAN JOSÉ', category: 'Auspicio Regional', isPrimary: false },
  ];

  // Duplicar el array para crear un bucle continuo sin cortes
  const marqueeItems = [...sponsors, ...sponsors];

  return (
    <div className="relative w-full overflow-hidden bg-[#07070a] border-y border-white/[0.08] py-2.5 my-2">
      {/* Sombras de desvanecimiento a los lados */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#08080a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#08080a] to-transparent z-10 pointer-events-none" />

      {/* Contenedor con animación continua */}
      <div className="animate-marquee items-center gap-6 select-none">
        {marqueeItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-3 py-1 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-red-500/40 transition shrink-0"
          >
            {/* Logo o Icono */}
            {item.logo ? (
              <div className="relative h-5 w-14 flex items-center justify-center">
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  className="object-contain filter brightness-90 contrast-125"
                />
              </div>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            )}

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-black text-white tracking-wider">
                {item.name}
              </span>
              <span className="text-[9px] font-mono uppercase text-zinc-500 hidden sm:inline">
                // {item.category}
              </span>
              {item.isPrimary && (
                <span className="px-1.5 py-0.2 rounded bg-red-950/70 border border-red-700/60 text-red-400 text-[8px] font-mono font-bold uppercase">
                  OFICIAL
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
