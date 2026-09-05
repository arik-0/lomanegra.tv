'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trophy,
  ArrowLeft,
  Calendar,
  Shield,
  Medal,
  ChevronRight,
  RefreshCw,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  TournamentStandings,
  TorneoType,
  CategoriaType,
  defaultStandings,
  TeamStandingsRow,
  ZoneData,
  PlayoffMatch,
  GoleadorRow,
  getTeamLogo,
} from '@/lib/standingsStore';

export default function PosicionesPage() {
  const [standings, setStandings] = useState<TournamentStandings>(defaultStandings);
  const [loading, setLoading] = useState(false);

  // Selector general: 'liga-regional' vs 'primera-afa' (Bonus Promiedos)
  const [mainTab, setMainTab] = useState<'liga-regional' | 'primera-afa'>('liga-regional');

  // Estado para la API de Promiedos
  const [promiedosData, setPromiedosData] = useState<any>(null);
  const [promiedosLoading, setPromiedosLoading] = useState(false);
  const [promiedosGroup, setPromiedosGroup] = useState<string>('Grupo A');

  // Estado para filtro de Goleadores por categoría
  const [selectedGoleadorCategory, setSelectedGoleadorCategory] = useState<string>('Todas');

  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedTorneo, setSelectedTorneo] = useState<TorneoType>('primer');
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaType>('mayor');

  const fetchPromiedos = async () => {
    setPromiedosLoading(true);
    try {
      const res = await fetch('/api/promiedos/primera');
      if (res.ok) {
        const data = await res.json();
        setPromiedosData(data);
      }
    } catch (err) {
      console.error('Error cargando Promiedos:', err);
    } finally {
      setPromiedosLoading(false);
    }
  };

  useEffect(() => {
    if (mainTab === 'primera-afa' && !promiedosData) {
      fetchPromiedos();
    }
  }, [mainTab, promiedosData]);

  useEffect(() => {
    async function loadStandings() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/standings');
        if (res.ok) {
          const data = await res.json();
          if (data.standings) {
            setStandings(data.standings);
          }
        }
      } catch (err) {
        console.error('Error cargando tablas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStandings();
  }, []);

  const categoryLabels: Record<CategoriaType, string> = {
    mayor: 'Fútbol Mayor',
    reserva: 'Reserva',
    tercera: 'Tercera División',
    cuarta: 'Cuarta División',
    quinta: 'Quinta División',
  };

  // Cuartos, Semis y Final de los Play-offs
  const cuartosMatches = standings.playoffs.filter((m) => m.round === 'cuartos');
  const semiMatches = standings.playoffs.filter((m) => m.round === 'semifinal');
  const finalMatch = standings.playoffs.find((m) => m.round === 'final');

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white px-3 py-6 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ============================================================================== */}
        {/* SELECTOR MAESTRO: LIGA REGIONAL (BYN) VS BONUS PRIMERA DIVISIÓN AFA (PROMIEDOS) */}
        {/* ============================================================================== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-[#12131a] border border-zinc-800 shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMainTab('liga-regional')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                mainTab === 'liga-regional'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950/60'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Liga Regional (Blanco y Negro)</span>
            </button>

            <button
              onClick={() => setMainTab('primera-afa')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                mainTab === 'primera-afa'
                  ? 'bg-emerald-500 text-black font-black shadow-lg shadow-emerald-950/60'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-950/30'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>★ Bonus: Primera División AFA (Promiedos Oficial)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 text-[11px] text-zinc-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Actualizaciones en directo</span>
          </div>
        </div>

        {mainTab === 'liga-regional' && (
          <>
            {/* ============================================================================== */}
            {/* 1. CABECERA Y SELECTORES PRINCIPALES (AÑO, TORNEO, CATEGORÍA)                */}
            {/* ============================================================================== */}
            <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
                <span>Volver a la transmisión en vivo</span>
              </Link>
              <div className="text-[10px] uppercase tracking-[0.25em] text-red-500 font-bold">
                ESTADÍSTICAS OFICIALES // LIGA REGIONAL
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span>Tablas & Play-Offs</span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-red-950/70 border border-red-800 text-red-400 rounded-md">
                  PROMIEDOS STYLE
                </span>
              </h1>
            </div>

            {/* Selectores Superiores: AÑO + PRIMERO / SEGUNDO (Según boceto) */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Selector de Año */}
              <div className="flex items-center gap-1 bg-[#181922] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                <span className="text-zinc-500 text-[10px] uppercase font-bold">Año:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Seleccionar año de torneo"
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="2026" className="bg-zinc-900 text-white">2026</option>
                  <option value="2025" className="bg-zinc-900 text-white">2025</option>
                </select>
              </div>

              {/* Selector Primer Torneo vs Segundo Torneo */}
              <div className="flex items-center p-1 rounded-xl bg-[#181922] border border-zinc-800">
                <button
                  onClick={() => setSelectedTorneo('primer')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition ${
                    selectedTorneo === 'primer'
                      ? 'bg-red-600 text-white shadow-md shadow-red-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Primero
                </button>
                <button
                  onClick={() => setSelectedTorneo('segundo')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition ${
                    selectedTorneo === 'segundo'
                      ? 'bg-red-600 text-white shadow-md shadow-red-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Segundo
                </button>
              </div>
            </div>
          </div>

          {/* Selector Horizontal de Categorías (Mayor, Reserva, 3ª, 4ª, 5ª) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(['mayor', 'reserva', 'tercera', 'cuarta', 'quinta'] as CategoriaType[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoria(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition uppercase tracking-wider border ${
                  selectedCategoria === cat
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-[#181922] text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================================== */}
        {/* 2. SECCIÓN 1 DEL BOCETO: TABLAS (PUEDEN SER POR ZONAS)                       */}
        {/* ============================================================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/70 flex items-center justify-center text-red-500">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  Tablas de Posiciones {standings.zones.length > 1 ? '(Por Zonas)' : ''}
                </h2>
                <div className="text-[10px] text-zinc-400">
                  {categoryLabels[selectedCategoria]} &bull; {selectedTorneo === 'primer' ? 'Primer Torneo (Apertura)' : 'Segundo Torneo (Clausura)'} {selectedYear}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span>Clasifican a Play-Offs</span>
            </div>
          </div>

          {/* Grid de Tablas por Zonas (Zona A, Zona B, etc.) */}
          <div className={`grid grid-cols-1 ${standings.zones.length > 1 ? 'lg:grid-cols-2' : ''} gap-6`}>
            {standings.zones.map((zone) => (
              <div
                key={zone.id}
                className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-4 sm:p-5 shadow-xl overflow-hidden"
              >
                {/* Título de Zona */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-base font-black text-white uppercase tracking-wider">
                      {zone.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">
                    {zone.teams.length} Equipos
                  </span>
                </div>

                {/* Tabla Estilo Promiedos.com.ar */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800/90 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-2 w-10 text-center">#</th>
                        <th className="py-2.5 px-2 min-w-[150px]">Equipo</th>
                        <th className="py-2.5 px-1.5 text-center w-11 text-white font-black">PTS</th>
                        <th className="py-2.5 px-1.5 text-center w-9">PJ</th>
                        <th className="py-2.5 px-1.5 text-center w-9">PG</th>
                        <th className="py-2.5 px-1.5 text-center w-9">PE</th>
                        <th className="py-2.5 px-1.5 text-center w-9">PP</th>
                        <th className="py-2.5 px-1.5 text-center w-9 hidden sm:table-cell">GF</th>
                        <th className="py-2.5 px-1.5 text-center w-9 hidden sm:table-cell">GC</th>
                        <th className="py-2.5 px-1.5 text-center w-10">DIF</th>
                        <th className="py-2.5 px-2 text-center w-24 hidden md:table-cell">Forma</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {zone.teams.map((team, idx) => (
                        <tr
                          key={team.id || idx}
                          className={`transition-colors ${
                            team.isBlancoYNegro
                              ? 'bg-red-950/20 font-bold hover:bg-red-950/35 border-l-4 border-l-red-500'
                              : 'hover:bg-zinc-800/30'
                          }`}
                        >
                          {/* Posición con barra de clasificación estilo Promiedos */}
                          <td className="py-2.5 px-2 text-center font-bold relative">
                            {team.qualified && !team.isBlancoYNegro && (
                              <span className="absolute left-0 top-1 bottom-1 w-1 bg-emerald-500 rounded-r" />
                            )}
                            <span className={team.qualified ? 'text-emerald-400 font-black' : 'text-zinc-500'}>
                              {team.pos}
                            </span>
                          </td>

                          {/* Escudo y Nombre */}
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              {(team.logoUrl || getTeamLogo(team.name)) ? (
                                <div className="w-5 h-5 relative shrink-0">
                                  <Image
                                    src={team.logoUrl || getTeamLogo(team.name)}
                                    alt={team.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] text-zinc-400 shrink-0">
                                  <Shield className="w-2.5 h-2.5" />
                                </div>
                              )}
                              <span
                                className={`truncate ${
                                  team.isBlancoYNegro
                                    ? 'text-white font-black text-xs sm:text-sm'
                                    : 'text-zinc-300 text-xs'
                                }`}
                              >
                                {team.name}
                              </span>
                            </div>
                          </td>

                          {/* PTS (Destacado Promiedos) */}
                          <td className="py-2.5 px-1.5 text-center font-mono font-black text-sm text-white bg-white/[0.02]">
                            {team.pts}
                          </td>

                          {/* PJ, PG, PE, PP */}
                          <td className="py-2.5 px-1.5 text-center text-zinc-400">{team.pj}</td>
                          <td className="py-2.5 px-1.5 text-center text-zinc-400">{team.pg}</td>
                          <td className="py-2.5 px-1.5 text-center text-zinc-400">{team.pe}</td>
                          <td className="py-2.5 px-1.5 text-center text-zinc-400">{team.pp}</td>

                          {/* GF, GC */}
                          <td className="py-2.5 px-1.5 text-center text-zinc-500 hidden sm:table-cell">{team.gf}</td>
                          <td className="py-2.5 px-1.5 text-center text-zinc-500 hidden sm:table-cell">{team.gc}</td>

                          {/* DIF */}
                          <td className="py-2.5 px-1.5 text-center font-bold">
                            <span className={team.dif > 0 ? 'text-emerald-400' : team.dif < 0 ? 'text-red-400' : 'text-zinc-500'}>
                              {team.dif > 0 ? `+${team.dif}` : team.dif}
                            </span>
                          </td>

                          {/* Forma (Últimos 5) */}
                          <td className="py-2.5 px-2 text-center hidden md:table-cell">
                            <div className="flex items-center justify-center gap-1">
                              {(team.form || []).map((f, fIdx) => (
                                <span
                                  key={fIdx}
                                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-black uppercase text-white ${
                                    f === 'W'
                                      ? 'bg-emerald-600'
                                      : f === 'D'
                                      ? 'bg-amber-600'
                                      : 'bg-red-600'
                                  }`}
                                  title={f === 'W' ? 'Victoria' : f === 'D' ? 'Empate' : 'Derrota'}
                                >
                                  {f === 'W' ? 'G' : f === 'D' ? 'E' : 'P'}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Leyenda al pie */}
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm bg-emerald-500" />
                    <span>Puestos 1 al 4 clasifican a Play-Offs</span>
                  </div>
                  <span>PJ: Partidos Jugados &bull; DIF: Diferencia de Gol</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================================== */}
        {/* 3. SECCIÓN 2 DEL BOCETO: PLAY OFFS (SISTEMA DE LLAVES / BRACKETS)             */}
        {/* ============================================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-800/70 flex items-center justify-center text-amber-500">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  Play-Offs // Llaves Eliminatorias
                </h2>
                <div className="text-[10px] text-zinc-400">
                  Cuartos de final, Semifinales y Gran Final del Torneo
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                Eliminación Directa
              </span>
            </div>
          </div>

          <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 sm:p-7 shadow-xl overflow-x-auto">
            {/* Diagrama de Llaves Interactivo */}
            <div className="min-w-[760px] grid grid-cols-3 gap-6 relative">
              {/* COLUMNA 1: CUARTOS DE FINAL */}
              <div className="space-y-4">
                <div className="text-xs font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2 flex items-center justify-between">
                  <span>Cuartos de Final</span>
                  <span className="text-[9px] text-zinc-500">4 Cruces</span>
                </div>

                <div className="space-y-3">
                  {cuartosMatches.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#161722] border border-zinc-800 rounded-xl p-3 shadow-md hover:border-zinc-700 transition"
                    >
                      <div className="flex items-center justify-between text-[9px] text-zinc-500 font-bold mb-1.5 uppercase">
                        <span>{m.title}</span>
                        <span>{m.dateInfo || 'Finalizado'}</span>
                      </div>

                      {/* Equipo 1 */}
                      <div className={`flex items-center justify-between py-1 px-1.5 rounded ${m.winner === 1 ? 'bg-zinc-800/70 font-black text-white' : 'text-zinc-400'}`}>
                        <div className="flex items-center gap-1.5 truncate">
                          {getTeamLogo(m.team1) && (
                            <div className="w-4 h-4 relative shrink-0">
                              <Image src={getTeamLogo(m.team1)} alt={m.team1} fill className="object-contain" />
                            </div>
                          )}
                          <span className="text-xs truncate">{m.team1}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${m.winner === 1 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {m.score1 !== null ? m.score1 : '-'}
                        </span>
                      </div>

                      {/* Equipo 2 */}
                      <div className={`flex items-center justify-between py-1 px-1.5 rounded mt-0.5 ${m.winner === 2 ? 'bg-zinc-800/70 font-black text-white' : 'text-zinc-400'}`}>
                        <div className="flex items-center gap-1.5 truncate">
                          {getTeamLogo(m.team2) && (
                            <div className="w-4 h-4 relative shrink-0">
                              <Image src={getTeamLogo(m.team2)} alt={m.team2} fill className="object-contain" />
                            </div>
                          )}
                          <span className="text-xs truncate">{m.team2}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${m.winner === 2 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {m.score2 !== null ? m.score2 : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMNA 2: SEMIFINALES */}
              <div className="space-y-4 flex flex-col justify-center">
                <div className="text-xs font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2 flex items-center justify-between">
                  <span>Semifinales</span>
                  <span className="text-[9px] text-zinc-500">2 Cruces</span>
                </div>

                <div className="space-y-8 my-auto">
                  {semiMatches.map((m) => (
                    <div
                      key={m.id}
                      className="bg-[#161722] border border-zinc-800 rounded-xl p-3.5 shadow-lg hover:border-amber-500/40 transition"
                    >
                      <div className="flex items-center justify-between text-[9px] text-zinc-500 font-bold mb-1.5 uppercase">
                        <span>{m.title}</span>
                        <span>{m.dateInfo || 'En juego'}</span>
                      </div>

                      {/* Equipo 1 */}
                      <div className={`flex items-center justify-between py-1 px-1.5 rounded ${m.winner === 1 ? 'bg-zinc-800/70 font-black text-white' : 'text-zinc-400'}`}>
                        <div className="flex items-center gap-1.5 truncate">
                          {getTeamLogo(m.team1) && (
                            <div className="w-4 h-4 relative shrink-0">
                              <Image src={getTeamLogo(m.team1)} alt={m.team1} fill className="object-contain" />
                            </div>
                          )}
                          <span className="text-xs truncate">{m.team1}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${m.winner === 1 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {m.score1 !== null ? m.score1 : '-'}
                        </span>
                      </div>

                      {/* Equipo 2 */}
                      <div className={`flex items-center justify-between py-1 px-1.5 rounded mt-0.5 ${m.winner === 2 ? 'bg-zinc-800/70 font-black text-white' : 'text-zinc-400'}`}>
                        <div className="flex items-center gap-1.5 truncate">
                          {getTeamLogo(m.team2) && (
                            <div className="w-4 h-4 relative shrink-0">
                              <Image src={getTeamLogo(m.team2)} alt={m.team2} fill className="object-contain" />
                            </div>
                          )}
                          <span className="text-xs truncate">{m.team2}</span>
                        </div>
                        <span className={`text-xs font-mono font-bold ${m.winner === 2 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {m.score2 !== null ? m.score2 : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMNA 3: GRAN FINAL */}
              <div className="space-y-4 flex flex-col justify-center">
                <div className="text-xs font-black uppercase tracking-wider text-amber-400 border-b border-zinc-800 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    Gran Final
                  </span>
                  <span className="text-[9px] text-red-500 animate-pulse font-black">EN DIRECTO</span>
                </div>

                <div className="my-auto">
                  {finalMatch ? (
                    <div className="bg-gradient-to-br from-amber-950/30 via-[#181924] to-[#12131a] border-2 border-amber-500/60 rounded-2xl p-4 shadow-[0_8px_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
                      <div className="text-center mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-700 px-2 py-0.5 rounded-full">
                          POR EL TÍTULO DE CAMPEÓN
                        </span>
                      </div>

                      {/* Equipo 1 */}
                      <div className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-black/40 border border-white/[0.06] mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 relative shrink-0">
                            <Image src={getTeamLogo(finalMatch.team1) || '/teams/blanco-y-negro.png'} alt={finalMatch.team1} fill className="object-contain" />
                          </div>
                          <span className="text-xs font-black text-white">{finalMatch.team1}</span>
                        </div>
                        <span className="text-base font-mono font-black text-amber-400">
                          {finalMatch.score1 !== null ? finalMatch.score1 : '-'}
                        </span>
                      </div>

                      <div className="text-center text-[10px] font-bold text-zinc-500 my-1">
                        VS
                      </div>

                      {/* Equipo 2 */}
                      <div className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-black/40 border border-white/[0.06] mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 relative shrink-0">
                            <Image src={getTeamLogo(finalMatch.team2) || '/teams/San Martin.png'} alt={finalMatch.team2} fill className="object-contain" />
                          </div>
                          <span className="text-xs font-black text-white">{finalMatch.team2}</span>
                        </div>
                        <span className="text-base font-mono font-black text-amber-400">
                          {finalMatch.score2 !== null ? finalMatch.score2 : '-'}
                        </span>
                      </div>

                      <div className="text-[10px] text-center text-zinc-400 font-mono bg-zinc-900/80 rounded-lg py-1.5 px-2 border border-zinc-800">
                        {finalMatch.dateInfo || 'Horario a confirmar'}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl">
                      Cruces por disputarse
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* ============================================================================== */}
        {/* 4. SECCIÓN 3 DEL BOCETO: GOLEADORES DE BLANCO Y NEGRO (POR CATEGORÍA)         */}
        {/* ============================================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/70 flex items-center justify-center text-red-500">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                  <span>Goleadores de Blanco y Negro</span>
                  <div className="w-5 h-5 relative shrink-0 inline-block">
                    <Image src="/teams/blanco-y-negro.png" alt="Blanco y Negro" fill className="object-contain" />
                  </div>
                </h2>
                <div className="text-[10px] text-zinc-400">
                  Ranking oficial de artilleros albinegros por categoría
                </div>
              </div>
            </div>

            {/* Píldoras de Categoría para Goleadores */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['Todas', 'Fútbol Mayor', 'Reserva', 'Tercera División', 'Cuarta División', 'Quinta División'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedGoleadorCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition uppercase tracking-wider border ${
                    selectedGoleadorCategory === cat
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/60'
                      : 'bg-[#181922] text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {cat.replace(' División', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 sm:p-7 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800/90 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Jugador</th>
                    <th className="py-2.5 px-3 text-zinc-400">División</th>
                    <th className="py-2.5 px-4 text-center w-28 text-white font-black bg-zinc-800/30">Goles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {standings.goleadores
                    .filter((g) => {
                      if (selectedGoleadorCategory === 'Todas') return true;
                      return g.category.toLowerCase().includes(selectedGoleadorCategory.toLowerCase());
                    })
                    .map((g, idx) => (
                      <tr
                        key={g.id || idx}
                        className={`hover:bg-zinc-800/30 transition-colors ${
                          idx === 0
                            ? 'bg-amber-950/15 border-l-4 border-l-amber-500'
                            : idx === 1
                            ? 'bg-zinc-900/40'
                            : ''
                        }`}
                      >
                        {/* Puesto */}
                        <td className="py-3 px-3 text-center font-black">
                          {idx === 0 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/50 text-xs">
                              🥇
                            </span>
                          ) : idx === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700/30 text-zinc-300 border border-zinc-600 text-xs">
                              🥈
                            </span>
                          ) : idx === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-900/30 text-amber-600 border border-amber-800 text-xs">
                              🥉
                            </span>
                          ) : (
                            <span className="text-zinc-500">{idx + 1}</span>
                          )}
                        </td>

                        {/* Jugador con insignia albinegra */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-white border border-black inline-block shrink-0" />
                            <span className="font-bold text-white text-xs sm:text-sm">
                              {g.name}
                            </span>
                          </div>
                        </td>

                        {/* División */}
                        <td className="py-3 px-3 text-zinc-400 text-xs">
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px]">
                            {g.category}
                          </span>
                        </td>

                        {/* Goles (Destacado sin Partidos Jugados) */}
                        <td className="py-3 px-4 text-center font-mono font-black text-base text-red-400 bg-red-950/20">
                          {g.goals}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </>
    )}

    {/* ============================================================================== */}
    {/* VISTA 2: BONUS PRIMERA DIVISIÓN AFA (PROMIEDOS.COM.AR OFICIAL)                 */}
    {/* ============================================================================== */}
    {mainTab === 'primera-afa' && (
      <div className="space-y-6">
        {/* Cabecera Promiedos */}
        <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
                <span>Volver a la transmisión en vivo</span>
              </Link>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIGA PROFESIONAL DE FÚTBOL // AFA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <span>{promiedosData?.tournament || 'Torneo Clausura'} 2026</span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-emerald-950/80 border border-emerald-600 text-emerald-300 rounded-md">
                  PROMIEDOS EN DIRECTO
                </span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={fetchPromiedos}
                disabled={promiedosLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181922] border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-bold transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${promiedosLoading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>

              <div className="flex items-center p-1 rounded-xl bg-[#181922] border border-zinc-800">
                {['Grupo A', 'Grupo B'].map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setPromiedosGroup(grp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition ${
                      promiedosGroup === grp
                        ? 'bg-emerald-500 text-black font-black shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              <span className="text-[11px]">Puestos 1° al 8°: Clasifican a Octavos de Final</span>
            </div>

            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
              Fuente: Promiedos.com.ar • AFA Oficial
            </span>
          </div>
        </div>

        {/* Tablas de Grupo A y Grupo B */}
        {promiedosLoading && !promiedosData ? (
          <div className="p-12 text-center bg-[#12131a] border border-zinc-800 rounded-3xl">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="text-zinc-400 text-xs">Cargando datos en vivo desde Promiedos.com.ar...</p>
          </div>
        ) : (
          (promiedosData?.tables || [])
            .filter((tbl: any) => !promiedosGroup || tbl.name === promiedosGroup)
            .map((tbl: any) => (
              <div key={tbl.name} className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">
                      {tbl.name} • {promiedosData?.league || 'Primera División'}
                    </h2>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">15 Equipos</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-zinc-800/90 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-2.5 px-2 w-10 text-center">#</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Equipo</th>
                        <th className="py-2.5 px-2 text-center w-12 text-white font-black bg-zinc-800/40">PTS</th>
                        <th className="py-2.5 px-2 text-center w-10">J</th>
                        <th className="py-2.5 px-2 text-center w-10">G</th>
                        <th className="py-2.5 px-2 text-center w-10">E</th>
                        <th className="py-2.5 px-2 text-center w-10">P</th>
                        <th className="py-2.5 px-2 text-center w-12">GF</th>
                        <th className="py-2.5 px-2 text-center w-12">GC</th>
                        <th className="py-2.5 px-2 text-center w-12 font-bold">+/-</th>
                        <th className="py-2.5 px-3 text-center min-w-[110px]">Últimas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40">
                      {(tbl.rows || []).map((row: any) => (
                        <tr
                          key={row.teamId || row.teamName}
                          className={`hover:bg-zinc-800/40 transition-colors ${
                            row.pos <= 8 ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'
                          }`}
                        >
                          <td className="py-2.5 px-2 text-center font-bold text-zinc-400">
                            {row.pos}
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              {row.logoUrl ? (
                                <div className="w-5 h-5 relative shrink-0">
                                  <Image
                                    src={row.logoUrl}
                                    alt={row.teamName}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-400">
                                  {row.teamName.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <span className="font-bold text-white text-xs sm:text-sm truncate">
                                {row.teamName}
                              </span>
                            </div>
                          </td>

                          <td className="py-2.5 px-2 text-center font-mono font-black text-sm text-yellow-400 bg-yellow-950/20">
                            {row.pts}
                          </td>
                          <td className="py-2.5 px-2 text-center text-zinc-300">{row.pj}</td>
                          <td className="py-2.5 px-2 text-center text-zinc-300">{row.pg}</td>
                          <td className="py-2.5 px-2 text-center text-zinc-400">{row.pe}</td>
                          <td className="py-2.5 px-2 text-center text-zinc-500">{row.pp}</td>
                          <td className="py-2.5 px-2 text-center text-zinc-400">{row.gf}</td>
                          <td className="py-2.5 px-2 text-center text-zinc-400">{row.gc}</td>
                          <td
                            className={`py-2.5 px-2 text-center font-bold ${
                              row.dif > 0 ? 'text-emerald-400' : row.dif < 0 ? 'text-red-400' : 'text-zinc-400'
                            }`}
                          >
                            {row.dif > 0 ? `+${row.dif}` : row.dif}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {(row.trend || []).map((t: number, i: number) => (
                                <span
                                  key={i}
                                  className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                                    t === 1
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/60'
                                      : t === 2
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/60'
                                      : 'bg-red-500/20 text-red-400 border border-red-500/60'
                                  }`}
                                  title={t === 1 ? 'Victoria' : t === 2 ? 'Empate' : 'Derrota'}
                                >
                                  {t === 1 ? 'G' : t === 2 ? 'E' : 'P'}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
        )}
      </div>
    )}
      </div>
    </main>
  );
}
