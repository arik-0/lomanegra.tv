'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Radio,
  Tv,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Lock,
  ArrowRight,
  Shield,
  Eye,
  LogOut,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface Match {
  id: string;
  title: string;
  description: string;
  date: string | null;
  is_date_confirmed: boolean;
  price: number;
  cloudflare_live_input_uid: string;
  image_url: string | null;
  is_active: boolean;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Anclaje de Stream
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [streamInput, setStreamInput] = useState('');
  const [anchorLoading, setAnchorLoading] = useState(false);
  const [anchorMessage, setAnchorMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal Crear/Editar Partido
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formIsDateConfirmed, setFormIsDateConfirmed] = useState(true);
  const [formPrice, setFormPrice] = useState(3500);
  const [formStreamUid, setFormStreamUid] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSaveLoading, setFormSaveLoading] = useState(false);

  // Comprobar autenticación inicial
  useEffect(() => {
    fetchMatches();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        fetchMatches();
      } else {
        setLoginError(data.error || 'Clave no válida');
      }
    } catch {
      setLoginError('Error de conexión');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setIsAuthenticated(false);
  };

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await fetch('/api/admin/matches');
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
        if (data.matches?.length > 0 && !selectedMatchId) {
          setSelectedMatchId(data.matches[0].id);
          setStreamInput(data.matches[0].cloudflare_live_input_uid || '');
        }
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Anclar Stream al partido seleccionado
  const handleAnchorStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || !streamInput) return;

    setAnchorLoading(true);
    setAnchorMessage(null);

    try {
      const res = await fetch('/api/admin/anchor-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: selectedMatchId,
          streamUid: streamInput,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnchorMessage({ type: 'success', text: '¡Señal y Stream anclados con éxito!' });
        fetchMatches();
      } else {
        setAnchorMessage({ type: 'error', text: data.error || 'Error al anclar el stream.' });
      }
    } catch {
      setAnchorMessage({ type: 'error', text: 'Error de red al contactar el servidor.' });
    } finally {
      setAnchorLoading(false);
    }
  };

  // Alternar rápidamente Confirmación de Fecha (1-Click)
  const handleToggleDateConfirmed = async (match: Match) => {
    const newStatus = !match.is_date_confirmed;
    try {
      await fetch('/api/admin/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: match.id,
          is_date_confirmed: newStatus,
          date: newStatus ? (match.date || new Date().toISOString()) : null,
        }),
      });
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  // Abrir Modal de Creación o Edición
  const openModal = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      setFormTitle(match.title);
      setFormDesc(match.description || '');
      setFormDate(match.date ? match.date.slice(0, 16) : '');
      setFormIsDateConfirmed(match.is_date_confirmed);
      setFormPrice(match.price);
      setFormStreamUid(match.cloudflare_live_input_uid);
      setFormImageUrl(match.image_url || '');
    } else {
      setEditingMatch(null);
      setFormTitle('');
      setFormDesc('');
      setFormDate(new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16));
      setFormIsDateConfirmed(false);
      setFormPrice(3500);
      setFormStreamUid('');
      setFormImageUrl('');
    }
    setIsModalOpen(true);
  };

  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaveLoading(true);

    try {
      if (editingMatch) {
        // Actualizar
        await fetch('/api/admin/matches', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingMatch.id,
            title: formTitle,
            description: formDesc,
            date: formIsDateConfirmed ? formDate : null,
            is_date_confirmed: formIsDateConfirmed,
            price: formPrice,
            cloudflare_live_input_uid: formStreamUid,
            image_url: formImageUrl || null,
          }),
        });
      } else {
        // Crear
        await fetch('/api/admin/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle,
            description: formDesc,
            date: formIsDateConfirmed ? formDate : null,
            is_date_confirmed: formIsDateConfirmed,
            price: formPrice,
            cloudflare_live_input_uid: formStreamUid,
            image_url: formImageUrl || null,
          }),
        });
      }

      setIsModalOpen(false);
      fetchMatches();
    } catch (err) {
      console.error(err);
    } finally {
      setFormSaveLoading(false);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este partido?')) return;
    try {
      await fetch(`/api/admin/matches?id=${id}`, { method: 'DELETE' });
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  // PANTALLA DE BLOQUEO / LOGIN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#08080a] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0c0c10] border border-white/[0.08] rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase">
                Panel de Operaciones
              </h1>
              <p className="text-xs text-zinc-500 font-mono">
                Pasión Lomonegra • Acceso Restringido
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-mono">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-2 font-bold">
                Clave de Operador
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.1] focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
              </div>
              <span className="text-[10px] text-zinc-600 mt-1 block">
                Por defecto: lomonegro2026
              </span>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-white hover:bg-zinc-200 active:scale-95 text-black font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                'Verificando...'
              ) : (
                <>
                  <span>Ingresar a Operaciones</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs font-mono text-zinc-500 hover:text-white transition"
            >
              &larr; Volver al sitio principal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const selectedMatch = matches.find((m) => m.id === selectedMatchId);

  return (
    <main className="min-h-screen bg-[#08080a] text-white p-4 sm:p-6 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ============================================================================== */}
        {/* ENCABEZADO DE OPERACIONES */}
        {/* ============================================================================== */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c0c10] border border-white/[0.08] p-6 rounded-3xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-700 flex items-center justify-center text-red-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em]">
                SISTEMA EN VIVO // MESA DE CONTROL
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Centro de Operaciones Pasión Lomonegra
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Web en Vivo</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-800/40 text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </header>

        {/* ============================================================================== */}
        {/* MÉTRICAS RÁPIDAS */}
        {/* ============================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0c0c10] border border-white/[0.07] p-5 rounded-2xl">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
              Partidos Cargados
            </div>
            <div className="text-3xl font-black text-white">{matches.length}</div>
          </div>
          <div className="bg-[#0c0c10] border border-white/[0.07] p-5 rounded-2xl">
            <div className="text-[10px] text-emerald-500 uppercase tracking-widest mb-1">
              Fechas Confirmadas (Con Venta)
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {matches.filter((m) => m.is_date_confirmed).length}
            </div>
          </div>
          <div className="bg-[#0c0c10] border border-white/[0.07] p-5 rounded-2xl">
            <div className="text-[10px] text-amber-500 uppercase tracking-widest mb-1">
              Fechas Vacantes (A Confirmar)
            </div>
            <div className="text-3xl font-black text-amber-400">
              {matches.filter((m) => !m.is_date_confirmed).length}
            </div>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* MÓDULO 1: ANCLAJE DE STREAM EN VIVO (CONTROL ROOM) */}
        {/* ============================================================================== */}
        <section className="bg-[#0c0c10] border border-white/[0.08] p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                Anclaje de Señal en Vivo (Stream Anchor)
              </h2>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">
              Actualización Instantánea
            </span>
          </div>

          <form onSubmit={handleAnchorStream} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
            <div className="lg:col-span-4 space-y-2">
              <label className="text-[10px] uppercase text-zinc-400 font-bold block">
                1. Seleccionar Partido
              </label>
              <select
                value={selectedMatchId}
                onChange={(e) => {
                  setSelectedMatchId(e.target.value);
                  const found = matches.find((m) => m.id === e.target.value);
                  if (found) setStreamInput(found.cloudflare_live_input_uid || '');
                }}
                className="w-full bg-black/70 border border-white/[0.1] focus:border-red-500 rounded-xl px-4 py-3 text-xs text-white outline-none"
              >
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} {m.is_date_confirmed ? '• (Confirmado)' : '• (A Confirmar)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <label className="text-[10px] uppercase text-zinc-400 font-bold block">
                2. UID de Cloudflare Stream / Video ID / URL HLS (.m3u8) / MP4
              </label>
              <input
                type="text"
                required
                placeholder="ej: live_input_byn_vs_ifc o https://.../index.m3u8"
                value={streamInput}
                onChange={(e) => setStreamInput(e.target.value)}
                className="w-full bg-black/70 border border-white/[0.1] focus:border-red-500 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="lg:col-span-3">
              <button
                type="submit"
                disabled={anchorLoading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-950"
              >
                {anchorLoading ? (
                  'Anclando...'
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Anclar Transmisión</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {anchorMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                anchorMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                  : 'bg-red-950/40 border-red-800/60 text-red-400'
              }`}
            >
              {anchorMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{anchorMessage.text}</span>
            </div>
          )}

          {selectedMatch && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <div>
                  <span className="text-zinc-400">Stream anclado actual:</span>{' '}
                  <strong className="text-white font-mono">{selectedMatch.cloudflare_live_input_uid}</strong>
                </div>
              </div>

              <Link
                href={`/partido/${selectedMatch.id}`}
                target="_blank"
                className="text-red-400 hover:text-white flex items-center gap-1 font-bold underline underline-offset-4"
              >
                <span>Abrir Player del Partido</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>

        {/* ============================================================================== */}
        {/* MÓDULO 2: GESTIÓN DE PARTIDOS & FECHAS VACANTES */}
        {/* ============================================================================== */}
        <section className="bg-[#0c0c10] border border-white/[0.08] p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                Gestor de Partidos & Programación
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Haz clic en el switch de confirmación para habilitar o inhabilitar la venta al instante.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchMatches}
                className="p-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white rounded-xl transition"
                title="Refrescar partidos"
              >
                <RefreshCw className={`w-4 h-4 ${loadingMatches ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => openModal()}
                className="px-4 py-2.5 bg-white hover:bg-zinc-200 active:scale-95 text-black font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Partido</span>
              </button>
            </div>
          </div>

          {/* Tabla / Lista de Partidos */}
          <div className="space-y-3">
            {matches.map((match) => {
              const isConfirmed = match.is_date_confirmed;
              const dateText = isConfirmed && match.date
                ? new Date(match.date).toLocaleString('es-AR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'FECHA A CONFIRMAR (VACANTE)';

              return (
                <div
                  key={match.id}
                  className="bg-[#121218] border border-white/[0.07] hover:border-red-500/40 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Miniatura previa */}
                    <div className="w-16 h-10 sm:w-20 sm:h-12 rounded-lg bg-black border border-white/[0.08] overflow-hidden relative shrink-0">
                      {match.image_url ? (
                        <Image
                          src={match.image_url}
                          alt={match.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <Tv className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-black text-sm text-white truncate">
                          {match.title}
                        </span>

                        {isConfirmed ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-600/70 text-[9px] font-bold text-emerald-400">
                            VENTA ACTIVA
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-600/70 text-[9px] font-bold text-amber-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            COMPRA BLOQUEADA (FECHA VACANTE)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-red-500" />
                          <span>{dateText}</span>
                        </span>
                        <span>//</span>
                        <span className="text-white font-bold">
                          ${Number(match.price).toLocaleString('es-AR')} ARS
                        </span>
                        <span>//</span>
                        <span className="text-zinc-500 font-mono text-[10px] truncate max-w-[140px]">
                          UID: {match.cloudflare_live_input_uid}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
                    {/* Botón 1-Click Toggle Fecha Confirmada */}
                    <button
                      onClick={() => handleToggleDateConfirmed(match)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isConfirmed
                          ? 'bg-amber-950/40 hover:bg-amber-950/80 border border-amber-600/50 text-amber-300'
                          : 'bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-600/50 text-emerald-300'
                      }`}
                      title="Cambiar estado de venta y confirmación de fecha"
                    >
                      {isConfirmed ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pasar a Fecha Vacante</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmar Fecha (Habilitar Venta)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => openModal(match)}
                      className="p-2 bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 hover:text-white rounded-xl transition"
                      title="Editar detalles"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteMatch(match.id)}
                      className="p-2 bg-red-950/30 hover:bg-red-950/70 text-red-400 rounded-xl transition"
                      title="Eliminar partido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ============================================================================== */}
      {/* MODAL CREAR / EDITAR PARTIDO */}
      {/* ============================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0c0c10] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-black text-white uppercase">
                {editingMatch ? 'Editar Partido' : 'Crear Nuevo Partido'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Cerrar [ESC]
              </button>
            </div>

            <form onSubmit={handleSaveMatch} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                  Título del Partido
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Blanco y Negro vs Deportivo Sarmiento"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.1] focus:border-red-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                  Subtítulo / Torneo (Minimalista)
                </label>
                <input
                  type="text"
                  placeholder="ej: Clásico Regional • Fecha 10"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.1] focus:border-red-500 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              {/* Control de Fecha Confirmada vs Vacante */}
              <div className="p-3.5 rounded-2xl bg-[#121218] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">
                      ¿Fecha de Juego Confirmada?
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Si está desmarcada, la fecha quedará vacante y se inhabilitará la compra automáticamente.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsDateConfirmed}
                    onChange={(e) => setFormIsDateConfirmed(e.target.checked)}
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                </div>

                {formIsDateConfirmed && (
                  <div>
                    <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1">
                      Fecha y Hora del Partido
                    </label>
                    <input
                      type="datetime-local"
                      required={formIsDateConfirmed}
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-black/60 border border-white/[0.1] focus:border-red-500 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                    Tarifa Pase (ARS)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/[0.1] focus:border-red-500 rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                    Stream UID / URL (.m3u8 / MP4)
                  </label>
                  <input
                    type="text"
                    placeholder="live_input_xxx o https://..."
                    value={formStreamUid}
                    onChange={(e) => setFormStreamUid(e.target.value)}
                    className="w-full bg-black/60 border border-white/[0.1] focus:border-red-500 rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                  URL de Miniatura (16:9 Poster)
                </label>
                <input
                  type="text"
                  placeholder="/matches/superclasico.svg o https://..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.1] focus:border-red-500 rounded-xl px-3 py-2 text-white outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formSaveLoading}
                  className="px-6 py-2 bg-white hover:bg-zinc-200 active:scale-95 text-black font-black uppercase tracking-wider rounded-xl transition"
                >
                  {formSaveLoading ? 'Guardando...' : 'Guardar Partido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
