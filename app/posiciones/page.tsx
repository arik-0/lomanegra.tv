'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trophy,
  ArrowLeft,
  Calendar,
  Shield,
  Medal,
  PlayCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

type TorneoType = 'primer' | 'segundo';
type CategoriaType = 'mayor' | 'reserva' | 'tercera' | 'cuarta' | 'quinta';

interface TeamRow {
  pos: number;
  name: string;
  isBlancoYNegro?: boolean;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dif: number;
  pts: number;
  form: ('W' | 'D' | 'L')[];
}

export default function PosicionesPage() {
  const [torneo, setTorneo] = useState<TorneoType>('primer');
  const [categoria, setCategoria] = useState<CategoriaType>('mayor');

  // Datos representativos oficiales de la Liga Regional de Fútbol
  const standingsData: Record<TorneoType, Record<CategoriaType, TeamRow[]>> = {
    primer: {
      mayor: [
        { pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 11, pg: 8, pe: 2, pp: 1, gf: 24, gc: 9, dif: 15, pts: 26, form: ['W', 'W', 'D', 'W', 'W'] },
        { pos: 2, name: 'Deportivo Sarmiento', pj: 11, pg: 7, pe: 3, pp: 1, gf: 21, gc: 10, dif: 11, pts: 24, form: ['W', 'D', 'W', 'W', 'W'] },
        { pos: 3, name: 'Boca Juniors (Suárez)', pj: 11, pg: 6, pe: 3, pp: 2, gf: 18, gc: 12, dif: 6, pts: 21, form: ['D', 'W', 'W', 'L', 'W'] },
        { pos: 4, name: 'San Martín (Santa Trinidad)', pj: 11, pg: 5, pe: 4, pp: 2, gf: 16, gc: 11, dif: 5, pts: 19, form: ['W', 'D', 'D', 'W', 'L'] },
        { pos: 5, name: 'Independiente (San José)', pj: 11, pg: 5, pe: 3, pp: 3, gf: 17, gc: 14, dif: 3, pts: 18, form: ['L', 'W', 'W', 'D', 'W'] },
        { pos: 6, name: 'El Progreso (Santa María)', pj: 11, pg: 4, pe: 4, pp: 3, gf: 15, gc: 13, dif: 2, pts: 16, form: ['D', 'L', 'W', 'D', 'W'] },
        { pos: 7, name: 'Racing Club (Carhué)', pj: 11, pg: 4, pe: 3, pp: 4, gf: 14, gc: 15, dif: -1, pts: 15, form: ['W', 'L', 'D', 'L', 'W'] },
        { pos: 8, name: 'Tiro Federal (Puan)', pj: 11, pg: 3, pe: 4, pp: 4, gf: 12, gc: 15, dif: -3, pts: 13, form: ['L', 'D', 'L', 'W', 'D'] },
        { pos: 9, name: 'Peñarol (Pigüé)', pj: 11, pg: 3, pe: 2, pp: 6, gf: 11, gc: 18, dif: -7, pts: 11, form: ['L', 'W', 'L', 'L', 'D'] },
        { pos: 10, name: 'Atlético Huanguelén', pj: 11, pg: 2, pe: 3, pp: 6, gf: 10, gc: 20, dif: -10, pts: 9, form: ['D', 'L', 'L', 'W', 'L'] },
      ],
      reserva: [
        { pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 11, pg: 9, pe: 1, pp: 1, gf: 26, gc: 8, dif: 18, pts: 28, form: ['W', 'W', 'W', 'D', 'W'] },
        { pos: 2, name: 'Deportivo Sarmiento', pj: 11, pg: 7, pe: 2, pp: 2, gf: 20, gc: 11, dif: 9, pts: 23, form: ['W', 'W', 'L', 'W', 'D'] },
        { pos: 3, name: 'San Martín (Santa Trinidad)', pj: 11, pg: 6, pe: 3, pp: 2, gf: 18, gc: 13, dif: 5, pts: 21, form: ['W', 'D', 'W', 'W', 'L'] },
        { pos: 4, name: 'Boca Juniors (Suárez)', pj: 11, pg: 5, pe: 3, pp: 3, gf: 15, gc: 12, dif: 3, pts: 18, form: ['L', 'W', 'D', 'W', 'W'] },
        { pos: 5, name: 'El Progreso (Santa María)', pj: 11, pg: 4, pe: 2, pp: 5, gf: 13, gc: 16, dif: -3, pts: 14, form: ['W', 'L', 'L', 'D', 'L'] },
      ],
      tercera: [
        { pos: 1, name: 'Deportivo Sarmiento', pj: 9, pg: 7, pe: 1, pp: 1, gf: 19, gc: 7, dif: 12, pts: 22, form: ['W', 'W', 'W', 'D', 'W'] },
        { pos: 2, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 9, pg: 6, pe: 2, pp: 1, gf: 18, gc: 8, dif: 10, pts: 20, form: ['W', 'W', 'D', 'W', 'W'] },
        { pos: 3, name: 'Racing Club (Carhué)', pj: 9, pg: 5, pe: 2, pp: 2, gf: 15, gc: 10, dif: 5, pts: 17, form: ['L', 'W', 'W', 'D', 'W'] },
        { pos: 4, name: 'Boca Juniors (Suárez)', pj: 9, pg: 4, pe: 2, pp: 3, gf: 12, gc: 11, dif: 1, pts: 14, form: ['W', 'L', 'D', 'W', 'L'] },
      ],
      cuarta: [
        { pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 9, pg: 7, pe: 2, pp: 0, gf: 22, gc: 5, dif: 17, pts: 23, form: ['W', 'W', 'W', 'W', 'D'] },
        { pos: 2, name: 'San Martín (Santa Trinidad)', pj: 9, pg: 6, pe: 1, pp: 2, gf: 17, gc: 9, dif: 8, pts: 19, form: ['W', 'L', 'W', 'W', 'W'] },
        { pos: 3, name: 'Deportivo Sarmiento', pj: 9, pg: 5, pe: 2, pp: 2, gf: 16, gc: 10, dif: 6, pts: 17, form: ['D', 'W', 'W', 'L', 'W'] },
        { pos: 4, name: 'Independiente (San José)', pj: 9, pg: 3, pe: 3, pp: 3, gf: 11, gc: 12, dif: -1, pts: 12, form: ['L', 'D', 'W', 'D', 'L'] },
      ],
      quinta: [
        { pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 8, pg: 7, pe: 1, pp: 0, gf: 25, gc: 4, dif: 21, pts: 22, form: ['W', 'W', 'W', 'W', 'W'] },
        { pos: 2, name: 'Boca Juniors (Suárez)', pj: 8, pg: 6, pe: 0, pp: 2, gf: 19, gc: 8, dif: 11, pts: 18, form: ['W', 'W', 'L', 'W', 'W'] },
        { pos: 3, name: 'Deportivo Sarmiento', pj: 8, pg: 4, pe: 2, pp: 2, gf: 14, gc: 9, dif: 5, pts: 14, form: ['D', 'L', 'W', 'W', 'D'] },
        { pos: 4, name: 'El Progreso (Santa María)', pj: 8, pg: 3, pe: 1, pp: 4, gf: 10, gc: 15, dif: -5, pts: 10, form: ['L', 'W', 'L', 'D', 'L'] },
      ],
    },
    segundo: {
      mayor: [
        { pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 6, pg: 5, pe: 1, pp: 0, gf: 15, gc: 4, dif: 11, pts: 16, form: ['W', 'W', 'W', 'D', 'W'] },
        { pos: 2, name: 'San Martín (Santa Trinidad)', pj: 6, pg: 4, pe: 1, pp: 1, gf: 12, gc: 6, dif: 6, pts: 13, form: ['W', 'W', 'D', 'L', 'W'] },
        { pos: 3, name: 'Deportivo Sarmiento', pj: 6, pg: 3, pe: 3, pp: 0, gf: 10, gc: 5, dif: 5, pts: 12, form: ['D', 'W', 'D', 'W', 'D'] },
        { pos: 4, name: 'Independiente (San José)', pj: 6, pg: 3, pe: 2, pp: 1, gf: 9, gc: 7, dif: 2, pts: 11, form: ['W', 'D', 'W', 'L', 'D'] },
        { pos: 5, name: 'Boca Juniors (Suárez)', pj: 6, pg: 2, pe: 2, pp: 2, gf: 8, gc: 8, dif: 0, pts: 8, form: ['L', 'W', 'D', 'D', 'L'] },
      ],
      reserva: [
        { pos: 1, name: 'Deportivo Sarmiento', pj: 6, pg: 4, pe: 2, pp: 0, gf: 13, gc: 5, dif: 8, pts: 14, form: ['W', 'W', 'D', 'W', 'D'] },
        { pos: 2, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 6, pg: 4, pe: 1, pp: 1, gf: 14, gc: 6, dif: 8, pts: 13, form: ['W', 'L', 'W', 'W', 'D'] },
        { pos: 3, name: 'San Martín (Santa Trinidad)', pj: 6, pg: 3, pe: 1, pp: 2, gf: 9, gc: 7, dif: 2, pts: 10, form: ['L', 'W', 'D', 'W', 'L'] },
      ],
      tercera: [
        { pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 5, pg: 4, pe: 1, pp: 0, gf: 11, gc: 3, dif: 8, pts: 13, form: ['W', 'W', 'D', 'W', 'W'] },
        { pos: 2, name: 'Deportivo Sarmiento', pj: 5, pg: 3, pe: 1, pp: 1, gf: 9, gc: 5, dif: 4, pts: 10, form: ['W', 'D', 'L', 'W', 'W'] },
      ],
      cuarta: [
        { pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 5, pg: 4, pe: 1, pp: 0, gf: 13, gc: 2, dif: 11, pts: 13, form: ['W', 'W', 'W', 'D', 'W'] },
        { pos: 2, name: 'San Martín (Santa Trinidad)', pj: 5, pg: 3, pe: 1, pp: 1, gf: 8, gc: 4, dif: 4, pts: 10, form: ['W', 'L', 'W', 'D', 'W'] },
      ],
      quinta: [
        { pos: 1, name: 'Blanco y Negro', isBlancoYNegro: true, pj: 5, pg: 5, pe: 0, pp: 0, gf: 16, gc: 1, dif: 15, pts: 15, form: ['W', 'W', 'W', 'W', 'W'] },
        { pos: 2, name: 'Boca Juniors (Suárez)', pj: 5, pg: 3, pe: 1, pp: 1, gf: 10, gc: 5, dif: 5, pts: 10, form: ['W', 'W', 'D', 'L', 'W'] },
      ],
    },
  };

  const currentRows = standingsData[torneo][categoria] || [];

  const categoryLabels: Record<CategoriaType, string> = {
    mayor: 'Fútbol Mayor',
    reserva: 'Reserva',
    tercera: 'Tercera División',
    cuarta: 'Cuarta División',
    quinta: 'Quinta División',
  };

  return (
    <main className="min-h-screen bg-[#08080a] text-white px-4 py-8 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado y Navegación */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a las transmisiones en vivo</span>
            </Link>
            <div className="text-[10px] uppercase tracking-[0.25em] text-red-500 font-bold">
              ESTADÍSTICAS OFICIALES // LIGA REGIONAL
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Tablas de Posiciones
            </h1>
            <p className="text-xs text-zinc-400">
              Seguimiento completo de Club Atlético Blanco y Negro en todas las divisiones.
            </p>
          </div>

          {/* Selector de Torneo (Primer Torneo vs Segundo Torneo) */}
          <div className="flex items-center p-1 rounded-2xl bg-[#0c0c10] border border-white/[0.08] w-fit">
            <button
              onClick={() => setTorneo('primer')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                torneo === 'primer'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Primer Torneo
            </button>
            <button
              onClick={() => setTorneo('segundo')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                torneo === 'segundo'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Segundo Torneo
            </button>
          </div>
        </div>

        {/* Selector de Categorías (Mayor, Reserva, 3ª, 4ª, 5ª) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(['mayor', 'reserva', 'tercera', 'cuarta', 'quinta'] as CategoriaType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition uppercase tracking-wider border ${
                categoria === cat
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-[#0c0c10] text-zinc-400 border-white/[0.06] hover:border-white/[0.2] hover:text-white'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Tabla de Posiciones Deportiva Estilo Forg1 */}
        <div className="bg-[#0c0c10] border border-white/[0.08] rounded-3xl p-4 sm:p-6 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-red-500" />
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                {categoryLabels[categoria]} &bull; {torneo === 'primer' ? 'Primer Torneo' : 'Segundo Torneo'}
              </h2>
            </div>
            <div className="text-[10px] text-zinc-500 hidden sm:block">
              Actualizado tras la última fecha disputada
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  <th className="py-3 px-3 min-w-[200px]">Club</th>
                  <th className="py-3 px-2 text-center w-12">PJ</th>
                  <th className="py-3 px-2 text-center w-12">PG</th>
                  <th className="py-3 px-2 text-center w-12">PE</th>
                  <th className="py-3 px-2 text-center w-12">PP</th>
                  <th className="py-3 px-2 text-center w-12 hidden md:table-cell">GF</th>
                  <th className="py-3 px-2 text-center w-12 hidden md:table-cell">GC</th>
                  <th className="py-3 px-2 text-center w-12">DIF</th>
                  <th className="py-3 px-3 text-center w-16 text-white font-black">PTS</th>
                  <th className="py-3 px-3 text-center hidden lg:table-cell w-28">Últimos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {currentRows.map((row) => (
                  <tr
                    key={row.pos}
                    className={`transition-colors ${
                      row.isBlancoYNegro
                        ? 'bg-red-950/25 border-l-4 border-l-red-500 font-bold hover:bg-red-950/40'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Posición */}
                    <td className="py-3.5 px-3 text-center font-black">
                      {row.pos <= 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600/30 text-red-400 border border-red-500/50 text-[11px]">
                          {row.pos}
                        </span>
                      ) : (
                        <span className="text-zinc-500">{row.pos}</span>
                      )}
                    </td>

                    {/* Nombre Club */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        {row.isBlancoYNegro ? (
                          <div className="w-6 h-6 relative shrink-0">
                            <Image
                              src="/teams/blanco-y-negro.png"
                              alt="Blanco y Negro"
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[9px] text-zinc-400 shrink-0">
                            <Shield className="w-3 h-3" />
                          </div>
                        )}
                        <span
                          className={`truncate ${
                            row.isBlancoYNegro ? 'text-white font-black text-sm' : 'text-zinc-300'
                          }`}
                        >
                          {row.name}
                        </span>
                        {row.isBlancoYNegro && (
                          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[8px] font-mono uppercase font-black tracking-wider">
                            ByN
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-2 text-center text-zinc-400">{row.pj}</td>
                    <td className="py-3.5 px-2 text-center text-emerald-400">{row.pg}</td>
                    <td className="py-3.5 px-2 text-center text-zinc-400">{row.pe}</td>
                    <td className="py-3.5 px-2 text-center text-red-400">{row.pp}</td>
                    <td className="py-3.5 px-2 text-center text-zinc-500 hidden md:table-cell">{row.gf}</td>
                    <td className="py-3.5 px-2 text-center text-zinc-500 hidden md:table-cell">{row.gc}</td>
                    <td className="py-3.5 px-2 text-center font-mono">
                      <span className={row.dif > 0 ? 'text-emerald-400' : row.dif < 0 ? 'text-red-400' : 'text-zinc-500'}>
                        {row.dif > 0 ? `+${row.dif}` : row.dif}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-base font-black text-white font-mono">
                      {row.pts}
                    </td>

                    {/* Forma últimos partidos */}
                    <td className="py-3.5 px-3 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.map((res, idx) => (
                          <span
                            key={idx}
                            className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                              res === 'W'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                                : res === 'D'
                                ? 'bg-zinc-800 text-zinc-300'
                                : 'bg-red-950 text-red-400 border border-red-700/60'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[10px] text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-600/60 border border-red-500" />
                <span>Puestos de Clasificación Directa</span>
              </span>
            </div>

            <Link
              href="/"
              className="text-red-400 hover:text-white transition flex items-center gap-1 font-bold"
            >
              <span>Ver próximos partidos en vivo</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
