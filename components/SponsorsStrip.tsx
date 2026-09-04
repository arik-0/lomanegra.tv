'use client';

import { Megaphone, Star, Award, Shield, Sparkles, ExternalLink } from 'lucide-react';

export default function SponsorsStrip() {
  const sponsorSlots = [
    { title: 'Sponsor Principal', tier: 'PLATINO // TITULAR', icon: Star, brand: 'Tu Marca Aquí' },
    { title: 'Indumentaria Oficial', tier: 'ORO // EQUIPACIÓN', icon: Award, brand: 'Tu Marca Aquí' },
    { title: 'Bebida Oficial', tier: 'ORO // HIDRATACIÓN', icon: Shield, brand: 'Tu Marca Aquí' },
    { title: 'Conectividad & Fibra', tier: 'PLATA // TECNOLOGÍA', icon: Sparkles, brand: 'Tu Marca Aquí' },
    { title: 'Auspiciante Local 1', tier: 'BRONCE // COMERCIO', icon: Award, brand: 'Tu Marca Aquí' },
    { title: 'Auspiciante Local 2', tier: 'BRONCE // COMERCIO', icon: Shield, brand: 'Tu Marca Aquí' },
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
          <span>Espacios disponibles para empresas y marcas</span>
        </div>
      </div>

      {/* Grid de Sponsors Estilo Forg1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sponsorSlots.map((slot, index) => {
          const Icon = slot.icon;
          return (
            <div
              key={index}
              className="group relative h-[68px] flex items-center gap-3 px-3.5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(12,12,16,0.95)_100%)] hover:border-red-500/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_4px_20px_rgba(220,38,38,0.1)]"
            >
              {/* Icono / Logo Box */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-[#14141c] border border-white/[0.08] flex items-center justify-center text-zinc-500 group-hover:text-red-500 group-hover:scale-105 transition-all">
                <Icon className="w-5 h-5" />
              </div>

              {/* Información */}
              <div className="min-w-0 flex-1">
                <div className="text-[8px] font-mono tracking-[0.2em] uppercase text-zinc-500 leading-tight">
                  {slot.tier}
                </div>
                <div className="text-sm font-black text-white tracking-tight font-mono truncate mt-0.5 group-hover:text-red-400 transition-colors">
                  {slot.title}
                </div>
              </div>

              {/* Botón CTA Disponible */}
              <div className="shrink-0 text-right">
                <span className="inline-block text-[9px] font-mono uppercase tracking-wider text-red-400/90 bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded-md group-hover:bg-red-600 group-hover:text-white transition-colors">
                  Disponible
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer de Sponsors */}
      <div className="text-center sm:text-left text-xs font-mono text-zinc-500 pt-1 flex flex-wrap items-center gap-2">
        <span>¿Deseas sumar tu marca a las transmisiones oficiales de Lomanegratv?</span>
        <span className="text-red-400 hover:text-white transition-colors cursor-pointer underline underline-offset-2">
          Contactar a Producción Comercial &rarr;
        </span>
      </div>
    </section>
  );
}
