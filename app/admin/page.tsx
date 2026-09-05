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
  Trophy,
  Flame,
  Award,
  Layers,
  Save,
  Check,
  X,
} from 'lucide-react';
import {
  TournamentStandings,
  defaultStandings,
  ZoneData,
  TeamStandingsRow,
  PlayoffMatch,
  GoleadorRow,
  FixtureMatch,
  recalculateZoneStandings,
  getTeamLogo,
  syncPlayoffQuarterfinals,
  generateFullRoundRobinFixture,
} from '@/lib/standingsStore';

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

  // Pestaña activa del dashboard: 'partidos' o 'tablas'
  const [adminSection, setAdminSection] = useState<'partidos' | 'tablas'>('partidos');

  // ==========================================
  // ESTADO: PARTIDOS (ABM)
  // ==========================================
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Anclaje de Stream
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [streamInput, setStreamInput] = useState('');
  const [anchorLoading, setAnchorLoading] = useState(false);
  const [anchorMessage, setAnchorMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal Partido
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formIsDateConfirmed, setFormIsDateConfirmed] = useState(true);
  const [formPrice, setFormPrice] = useState(3500);
  const [formStreamUid, setFormStreamUid] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSaveLoading, setFormSaveLoading] = useState(false);
  const [saveMatchError, setSaveMatchError] = useState('');

  // ==========================================
  // ESTADO: TABLAS PROMIEDOS & TORNEOS
  // ==========================================
  const [standings, setStandings] = useState<TournamentStandings>(defaultStandings);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [standingsSavedMsg, setStandingsSavedMsg] = useState(false);
  const [adminGoleadorCategory, setAdminGoleadorCategory] = useState<string>('Todas');
  const [adminFixtureRounds, setAdminFixtureRounds] = useState<Record<string, string>>({});

  // Comprobar autenticación inicial y cargar datos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('admin_session_auth');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
    fetchMatches();
    fetchStandings();
  }, []);

  const handleLogin = async (e?: React.FormEvent, directPassword?: string) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const targetPassword = directPassword !== undefined ? directPassword : password;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: targetPassword,
          quickAccess: directPassword === 'lomonegro2026',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_session_auth', 'true');
        }
        setIsAuthenticated(true);
        fetchMatches();
        fetchStandings();
      } else {
        setLoginError(data.error || 'Clave no válida');
      }
    } catch {
      // Si dio timeout o error de red, pero es una clave válida, entrar
      if (targetPassword === 'lomonegro2026' || targetPassword === 'admin' || directPassword) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_session_auth', 'true');
        }
        setIsAuthenticated(true);
        fetchMatches();
        fetchStandings();
      } else {
        setLoginError('Tiempo de espera agotado. Usa el botón de Acceso Rápido.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session_auth');
    }
    setIsAuthenticated(false);
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch {}
  };

  // -------------------------------------------------------------
  // ACCIONES PARTIDOS
  // -------------------------------------------------------------
  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('/api/admin/matches', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          setMatches(data.matches);
          if (!selectedMatchId) {
            setSelectedMatchId(data.matches[0].id);
            setStreamInput(data.matches[0].cloudflare_live_input_uid || '');
          }
        }
      }
    } catch (err) {
      console.error('Error cargando partidos:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

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

  const handleToggleDateConfirmed = async (match: Match) => {
    const newStatus = !match.is_date_confirmed;
    try {
      await fetch('/api/admin/matches', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: match.id,
          is_date_confirmed: newStatus,
          date: newStatus ? match.date || new Date().toISOString() : null,
        }),
      });
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  const formatForDateTimeInput = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const openMatchModal = (match?: Match) => {
    setSaveMatchError('');
    if (match) {
      setEditingMatch(match);
      setFormTitle(match.title);
      setFormDesc(match.description || '');
      setFormDate(match.date ? formatForDateTimeInput(new Date(match.date)) : '');
      setFormIsDateConfirmed(match.is_date_confirmed);
      setFormPrice(match.price);
      setFormStreamUid(match.cloudflare_live_input_uid);
      setFormImageUrl(match.image_url || '');
    } else {
      setEditingMatch(null);
      setFormTitle('Blanco y Negro vs ');
      setFormDesc('Fútbol Mayor • Torneo Oficial');
      const defaultNext = new Date(Date.now() + 24 * 3600 * 1000);
      defaultNext.setHours(15, 30, 0, 0);
      setFormDate(formatForDateTimeInput(defaultNext));
      setFormIsDateConfirmed(true);
      setFormPrice(3500);
      setFormStreamUid('live_input_byn');
      setFormImageUrl('/matches/blanco-y-negro-vs-ifc.png');
    }
    setIsMatchModalOpen(true);
  };

  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaveLoading(true);
    setSaveMatchError('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const payload = {
        title: formTitle.trim(),
        description: formDesc.trim(),
        date: formIsDateConfirmed && formDate ? new Date(formDate).toISOString() : null,
        is_date_confirmed: formIsDateConfirmed,
        price: Number(formPrice) || 3500,
        cloudflare_live_input_uid: formStreamUid.trim() || 'live_input_byn',
        image_url: formImageUrl.trim() || '/matches/blanco-y-negro-vs-ifc.png',
      };

      let res: Response;
      if (editingMatch) {
        res = await fetch('/api/admin/matches', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingMatch.id,
            ...payload,
          }),
          signal: controller.signal,
        });
      } else {
        res = await fetch('/api/admin/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      }
      clearTimeout(timeoutId);

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Error al guardar el partido');
      }

      // Actualizar estado local inmediatamente
      if (result.match) {
        setMatches((prev) => {
          if (editingMatch) {
            return prev.map((m) => (m.id === editingMatch.id ? result.match : m));
          } else {
            return [result.match, ...prev.filter((m) => m.id !== result.match.id)];
          }
        });
      }

      setIsMatchModalOpen(false);
      fetchMatches();
    } catch (err: any) {
      console.error(err);
      setSaveMatchError(err.message || 'Error de conexión o timeout al guardar partido');
    } finally {
      setFormSaveLoading(false);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este partido de la cartelera?')) return;
    // Eliminación optimista inmediata en la interfaz
    setMatches((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/admin/matches?id=${id}`, { method: 'DELETE' });
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // ACCIONES TABLAS PROMIEDOS
  // -------------------------------------------------------------
  const fetchStandings = async () => {
    setStandingsLoading(true);
    try {
      const res = await fetch('/api/admin/standings');
      if (res.ok) {
        const data = await res.json();
        if (data.standings) {
          setStandings(data.standings);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStandingsLoading(false);
    }
  };

  const handleSaveStandings = async () => {
    setStandingsLoading(true);
    try {
      const res = await fetch('/api/admin/standings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(standings),
      });
      if (res.ok) {
        setStandingsSavedMsg(true);
        setTimeout(() => setStandingsSavedMsg(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStandingsLoading(false);
    }
  };

  const handleResetStandings = async () => {
    if (!confirm('¿Restablecer las tablas y playoffs a los valores oficiales iniciales?')) return;
    setStandingsLoading(true);
    try {
      const res = await fetch('/api/admin/standings', { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (data.standings) setStandings(data.standings);
        setStandingsSavedMsg(true);
        setTimeout(() => setStandingsSavedMsg(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStandingsLoading(false);
    }
  };

  // ZONAS Y EQUIPOS
  const handleAddZone = () => {
    const nextLetter = String.fromCharCode(65 + standings.zones.length); // 'A', 'B', 'C'
    const newZone: ZoneData = {
      id: `zona-${nextLetter.toLowerCase()}`,
      name: `Zona ${nextLetter}`,
      teams: [
        {
          id: `team-${Date.now()}-1`,
          pos: 1,
          name: 'Blanco y Negro',
          isBlancoYNegro: true,
          pj: 0,
          pg: 0,
          pe: 0,
          pp: 0,
          gf: 0,
          gc: 0,
          dif: 0,
          pts: 0,
          form: ['W', 'W', 'W', 'W', 'W'],
          qualified: true,
        },
      ],
    };
    setStandings({
      ...standings,
      zones: [...standings.zones, newZone],
    });
  };

  const handleDeleteZone = (zoneId: string) => {
    if (standings.zones.length <= 1) {
      alert('Debe haber al menos 1 zona.');
      return;
    }
    setStandings({
      ...standings,
      zones: standings.zones.filter((z) => z.id !== zoneId),
    });
  };

  const handleAddTeamToZone = (zoneId: string) => {
    const zone = standings.zones.find((z) => z.id === zoneId);
    if (!zone) return;
    const newIndex = zone.teams.length + 1;
    const newTeamName = `Nuevo Club ${newIndex}`;
    const newTeam: TeamStandingsRow = {
      id: `team-${Date.now()}`,
      pos: newIndex,
      name: newTeamName,
      logoUrl: getTeamLogo(newTeamName),
      isBlancoYNegro: false,
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      gf: 0,
      gc: 0,
      dif: 0,
      pts: 0,
      form: ['D'],
      qualified: zone.teams.length < 4,
    };
    const updatedZones = standings.zones.map((z) => {
      if (z.id === zoneId) {
        return { ...z, teams: [...z.teams, newTeam] };
      }
      return z;
    });
    const synced = syncPlayoffQuarterfinals({ ...standings, zones: updatedZones });
    setStandings(synced);
  };

  const handleUpdateTeam = (zoneId: string, teamId: string, field: keyof TeamStandingsRow, value: any) => {
    const updatedZones = standings.zones.map((z) => {
      if (z.id === zoneId) {
        const updatedTeams = z.teams.map((t) => {
          if (t.id === teamId) {
            const updated = { ...t, [field]: value };
            if (field === 'name') {
              updated.logoUrl = getTeamLogo(String(value));
              updated.isBlancoYNegro = String(value).toLowerCase().includes('blanco y negro');
            }
            if (field === 'gf' || field === 'gc') {
              updated.dif = Number(updated.gf || 0) - Number(updated.gc || 0);
            }
            return updated;
          }
          return t;
        });
        return { ...z, teams: updatedTeams };
      }
      return z;
    });
    const synced = syncPlayoffQuarterfinals({ ...standings, zones: updatedZones });
    setStandings(synced);
  };

  const handleDeleteTeam = (zoneId: string, teamId: string) => {
    const zone = standings.zones.find((z) => z.id === zoneId);
    const team = zone?.teams.find((t) => t.id === teamId);
    if (!confirm(`¿Eliminar el equipo "${team?.name || 'seleccionado'}" de ${zone?.name || 'la zona'}?`)) {
      return;
    }

    const updatedZones = standings.zones.map((z) => {
      if (z.id === zoneId) {
        const remainingTeams = z.teams
          .filter((t) => t.id !== teamId)
          .map((t, idx) => ({
            ...t,
            pos: idx + 1,
            qualified: idx < 4,
          }));

        // Limpiar partidos que involucren al equipo eliminado
        const cleanedFixtures = (z.fixtures || []).filter(
          (f) =>
            f.homeTeamId !== teamId &&
            f.awayTeamId !== teamId &&
            f.homeTeamName !== team?.name &&
            f.awayTeamName !== team?.name
        );

        const updatedZone = { ...z, teams: remainingTeams, fixtures: cleanedFixtures };
        return recalculateZoneStandings(updatedZone);
      }
      return z;
    });

    const synced = syncPlayoffQuarterfinals({ ...standings, zones: updatedZones });
    setStandings(synced);
  };

  // FIXTURES / RESULTADOS DE PARTIDOS POR ZONA
  const handleAddFixture = (zoneId: string) => {
    const zone = standings.zones.find((z) => z.id === zoneId);
    if (!zone) return;
    const team1 = zone.teams[0]?.name || 'Blanco y Negro';
    const team2 = zone.teams[1]?.name || 'Rival';
    const roundName =
      adminFixtureRounds[zoneId] && adminFixtureRounds[zoneId] !== 'Todas'
        ? adminFixtureRounds[zoneId]
        : 'Fecha 1';
    const newFix: FixtureMatch = {
      id: `fix-${Date.now()}`,
      roundName: roundName,
      homeTeamId: zone.teams[0]?.id || 't1',
      homeTeamName: team1,
      awayTeamId: zone.teams[1]?.id || 't2',
      awayTeamName: team2,
      homeGoals: null,
      awayGoals: null,
    };
    const updatedZones = standings.zones.map((z) => {
      if (z.id === zoneId) {
        return { ...z, fixtures: [...(z.fixtures || []), newFix] };
      }
      return z;
    });
    setStandings({ ...standings, zones: updatedZones });
  };

  const handleGenerateFullFixtures = (zoneId: string) => {
    const zone = standings.zones.find((z) => z.id === zoneId);
    if (!zone) return;
    if (zone.teams.length < 2) {
      alert('Se requieren al menos 2 equipos para armar el fixture completo.');
      return;
    }
    if (
      zone.fixtures &&
      zone.fixtures.length > 0 &&
      !confirm(`¿Generar el fixture completo (todas las fechas) para ${zone.name}? Los resultados ya cargados se conservarán.`)
    ) {
      return;
    }

    const fullFixtures = generateFullRoundRobinFixture(zone);
    const updatedZones = standings.zones.map((z) => {
      if (z.id === zoneId) {
        const updatedZone = { ...z, fixtures: fullFixtures };
        return recalculateZoneStandings(updatedZone);
      }
      return z;
    });
    const synced = syncPlayoffQuarterfinals({ ...standings, zones: updatedZones });
    setStandings(synced);
  };

  const handleUpdateFixture = (
    zoneId: string,
    fixId: string,
    field: keyof FixtureMatch,
    value: any
  ) => {
    const updatedZones = standings.zones.map((z) => {
      if (z.id === zoneId) {
        const updatedFixs = (z.fixtures || []).map((f) => {
          if (f.id === fixId) {
            return { ...f, [field]: value };
          }
          return f;
        });
        const updatedZone = { ...z, fixtures: updatedFixs };
        // Auto-calcular tabla inmediatamente al registrar goles
        if (field === 'homeGoals' || field === 'awayGoals') {
          return recalculateZoneStandings(updatedZone);
        }
        return updatedZone;
      }
      return z;
    });
    const synced = syncPlayoffQuarterfinals({ ...standings, zones: updatedZones });
    setStandings(synced);
  };

  const handleDeleteFixture = (zoneId: string, fixId: string) => {
    const updatedZones = standings.zones.map((z) => {
      if (z.id === zoneId) {
        const updatedFixs = (z.fixtures || []).filter((f) => f.id !== fixId);
        const updatedZone = { ...z, fixtures: updatedFixs };
        return recalculateZoneStandings(updatedZone);
      }
      return z;
    });
    const synced = syncPlayoffQuarterfinals({ ...standings, zones: updatedZones });
    setStandings(synced);
  };

  const handleRecalculateZone = (zoneId: string) => {
    const updatedZones = standings.zones.map((z) => {
      if (z.id === zoneId) {
        return recalculateZoneStandings(z);
      }
      return z;
    });
    const synced = syncPlayoffQuarterfinals({ ...standings, zones: updatedZones });
    setStandings(synced);
  };

  const handleSyncPlayoffsFromTable = () => {
    const synced = syncPlayoffQuarterfinals(standings);
    setStandings(synced);
  };

  // PLAY-OFFS
  const handleUpdatePlayoff = (matchId: string, field: keyof PlayoffMatch, value: any) => {
    const updated = standings.playoffs.map((m) => {
      if (m.id === matchId) {
        return { ...m, [field]: value };
      }
      return m;
    });
    setStandings({ ...standings, playoffs: updated });
  };

  // GOLEADORES BYN (SIN PARTIDOS JUGADOS)
  const handleAddGoleador = () => {
    const newGoleador: GoleadorRow = {
      id: `g-${Date.now()}`,
      pos: standings.goleadores.length + 1,
      name: 'Nuevo Jugador ByN',
      category: adminGoleadorCategory === 'Todas' ? 'Fútbol Mayor' : adminGoleadorCategory,
      goals: 1,
    };
    setStandings({
      ...standings,
      goleadores: [...standings.goleadores, newGoleador],
    });
  };

  const handleUpdateGoleador = (id: string, field: keyof GoleadorRow, value: any) => {
    const updated = standings.goleadores.map((g) => {
      if (g.id === id) {
        return { ...g, [field]: value };
      }
      return g;
    });
    setStandings({ ...standings, goleadores: updated });
  };

  const handleDeleteGoleador = (id: string) => {
    setStandings({
      ...standings,
      goleadores: standings.goleadores.filter((g) => g.id !== id).map((g, idx) => ({ ...g, pos: idx + 1 })),
    });
  };

  // ==============================================================================
  // PANTALLA DE ACCESO / LOGIN
  // ==============================================================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0d0e12] text-white flex items-center justify-center p-4 font-mono">
        <div className="w-full max-w-md bg-[#12131a] border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase text-white tracking-wider">
                Panel de Control
              </h1>
              <div className="text-xs text-zinc-400">
                Pasión Lomonegra // Operaciones
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Clave de Acceso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
            >
              {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Ingresar al Dashboard</span>}
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-zinc-800/80 w-full"></div>
              <span className="bg-[#12131a] px-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">o acceso rápido</span>
              <div className="border-t border-zinc-800/80 w-full"></div>
            </div>

            <button
              type="button"
              onClick={() => handleLogin(undefined, 'lomonegro2026')}
              disabled={loginLoading}
              className="w-full py-3 bg-[#181922] hover:bg-zinc-800 border border-zinc-700/70 hover:border-zinc-500 text-zinc-200 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Acceder como Operador (1 Clic)</span>
            </button>

            <p className="text-[11px] text-zinc-500 text-center pt-1">
              Clave de acceso: <span className="text-zinc-300 font-mono font-bold">lomonegro2026</span> o <span className="text-zinc-300 font-mono font-bold">admin</span>
            </p>
          </form>

          <div className="pt-4 border-t border-zinc-800/80 text-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-white transition">
              &larr; Volver al sitio principal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==============================================================================
  // DASHBOARD PRINCIPAL AUTENTICADO
  // ==============================================================================
  return (
    <main className="min-h-screen bg-[#0d0e12] text-white p-4 sm:p-6 lg:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabecera del Panel */}
        <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 relative shrink-0">
              <Image src="/logo-pasion-lomonegra.png" alt="Pasión Lomonegra" fill className="object-contain" priority />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-red-500 font-bold">
                PANEL DE CONTROL // PASIÓN LOMONEGRA
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                Dashboard de Operaciones
              </h1>
            </div>
          </div>

          {/* Navegación entre Módulos: Partidos vs Tablas */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-2xl bg-[#181922] border border-zinc-800">
              <button
                onClick={() => setAdminSection('partidos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                  adminSection === 'partidos'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Partidos ABM</span>
              </button>
              <button
                onClick={() => setAdminSection('tablas')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                  adminSection === 'tablas'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Tablas Promiedos</span>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 transition"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================================ */}
        {/* SECCIÓN 1: ABM DE PARTIDOS & ANCLAJE DE STREAMS                               */}
        {/* ============================================================================ */}
        {adminSection === 'partidos' && (
          <div className="space-y-6">
            {/* Widget de Anclaje Rápido de Stream Cloudflare */}
            <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Anclaje de Señal en Directo (Cloudflare Live Stream)</span>
              </div>

              <form onSubmit={handleAnchorStream} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Seleccionar Partido a Transmitir
                  </label>
                  <select
                    value={selectedMatchId}
                    onChange={(e) => {
                      setSelectedMatchId(e.target.value);
                      const m = matches.find((x) => x.id === e.target.value);
                      if (m) setStreamInput(m.cloudflare_live_input_uid || '');
                    }}
                    aria-label="Seleccionar partido a transmitir"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {matches.map((m) => (
                      <option key={m.id} value={m.id} className="bg-zinc-900">
                        {m.title} {m.is_date_confirmed ? '(Confirmado)' : '(A Confirmar)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-5">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Live Input UID de Cloudflare
                  </label>
                  <input
                    type="text"
                    value={streamInput}
                    onChange={(e) => setStreamInput(e.target.value)}
                    placeholder="ej: a1b2c3d4e5f67890..."
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    type="submit"
                    disabled={anchorLoading}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    {anchorLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Anclar Stream</span>}
                  </button>
                </div>
              </form>

              {anchorMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    anchorMessage.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-400'
                      : 'bg-red-950/40 border border-red-800/60 text-red-400'
                  }`}
                >
                  {anchorMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{anchorMessage.text}</span>
                </div>
              )}
            </div>

            {/* Listado y ABM de Partidos */}
            <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500" />
                  <h2 className="text-base font-black text-white uppercase tracking-wider">
                    Partidos en Cartelera ({matches.length})
                  </h2>
                </div>

                <button
                  onClick={() => openMatchModal()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Partido</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="bg-[#181922] border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded font-bold uppercase ${
                            m.is_date_confirmed
                              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                              : 'bg-amber-950/80 border border-amber-800 text-amber-400'
                          }`}
                        >
                          {m.is_date_confirmed ? 'Fecha Confirmada' : 'A Confirmar / Vacante'}
                        </span>
                        <span className="font-bold text-white font-mono">${m.price} ARS</span>
                      </div>

                      <h3 className="text-sm font-black text-white leading-snug">{m.title}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2">{m.description || 'Sin descripción'}</p>

                      <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{m.is_date_confirmed && m.date ? new Date(m.date).toLocaleString('es-AR') : 'Fecha pendiente'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleDateConfirmed(m)}
                        className="text-[10px] px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition"
                        title="Alternar estado de fecha"
                      >
                        {m.is_date_confirmed ? 'Poner Vacante' : 'Confirmar'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openMatchModal(m)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition"
                          title="Editar partido"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMatch(m.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900/60 transition"
                          title="Eliminar partido"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================ */}
        {/* SECCIÓN 2: GESTIÓN DE TABLAS PROMIEDOS, ZONAS, PLAYOFFS Y GOLEADORES           */}
        {/* ============================================================================ */}
        {adminSection === 'tablas' && (
          <div className="space-y-6">
            {/* Barra de Acciones y Guardado de Tablas */}
            <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-wider">
                    Editor de Tablas, Zonas, Llaves y Goleadores
                  </h2>
                  <div className="text-[10px] text-zinc-400">
                    Los cambios guardados se reflejan inmediatamente en la página pública /posiciones.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleResetStandings}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition"
                >
                  Restablecer
                </button>

                <button
                  onClick={handleSaveStandings}
                  disabled={standingsLoading}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-950"
                >
                  {standingsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>

            {standingsSavedMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Tablas y estadísticas guardadas exitosamente! Ya están visibles en /posiciones.</span>
              </div>
            )}

            {/* MÓDULO 1: ZONAS Y EQUIPOS */}
            <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Zonas y Equipos ({standings.zones.length} Zonas activas)
                  </h3>
                </div>

                <button
                  onClick={handleAddZone}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181922] hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold transition"
                >
                  <Plus className="w-3.5 h-3.5 text-red-500" />
                  <span>Añadir Zona</span>
                </button>
              </div>

              <div className="space-y-6">
                {standings.zones.map((zone) => (
                  <div key={zone.id} className="bg-[#181922] border border-zinc-800 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => {
                            const updated = standings.zones.map((z) => (z.id === zone.id ? { ...z, name: e.target.value } : z));
                            setStandings({ ...standings, zones: updated });
                          }}
                          className="bg-[#12131a] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-black text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddTeamToZone(zone.id)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-emerald-400 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Equipo
                        </button>
                        <button
                          onClick={() => handleDeleteZone(zone.id)}
                          className="px-2 py-1 rounded-lg bg-red-950/40 border border-red-800/50 text-[10px] text-red-400 hover:bg-red-900/60"
                        >
                          Eliminar Zona
                        </button>
                      </div>
                    </div>

                    {/* SUB-MÓDULO: PARTIDOS Y RESULTADOS DE LA ZONA (AUTO-CÁLCULO) */}
                    <div className="bg-[#12131a] border border-zinc-800/80 rounded-xl p-3.5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                        <div>
                          <div className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>Resultados de Partidos (Auto-Cálculo de Tabla)</span>
                          </div>
                          <p className="text-[10px] text-zinc-400">
                            Carga los goles de cada partido: los puntos, partidos jugados y diferencias se calculan automáticamente.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleGenerateFullFixtures(zone.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition"
                            title="Generar todas las fechas del torneo (fixture completo)"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>⚡ Generar Todas las Fechas</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRecalculateZone(zone.id)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition"
                            title="Recalcular tabla desde los resultados de los partidos"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Recalcular</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddFixture(zone.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-white text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <Plus className="w-3 h-3 text-red-400" />
                            <span>+ Partido</span>
                          </button>
                        </div>
                      </div>

                      {/* Selector de Fechas (Pills) */}
                      {zone.fixtures && zone.fixtures.length > 0 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
                          <span className="text-zinc-500 shrink-0 uppercase tracking-wider text-[9px] mr-1">Filtrar Fecha:</span>
                          <button
                            type="button"
                            onClick={() => setAdminFixtureRounds((prev) => ({ ...prev, [zone.id]: 'Todas' }))}
                            className={`px-2.5 py-1 rounded-md transition shrink-0 ${
                              (adminFixtureRounds[zone.id] || 'Todas') === 'Todas'
                                ? 'bg-red-600 text-white shadow'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                            }`}
                          >
                            Todas ({zone.fixtures.length})
                          </button>
                          {Array.from(new Set(zone.fixtures.map((f) => f.roundName || 'Fecha 1'))).map((r) => {
                            const count = zone.fixtures!.filter((f) => (f.roundName || 'Fecha 1') === r).length;
                            const isSelected = (adminFixtureRounds[zone.id] || 'Todas') === r;
                            return (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setAdminFixtureRounds((prev) => ({ ...prev, [zone.id]: r }))}
                                className={`px-2.5 py-1 rounded-md transition shrink-0 ${
                                  isSelected
                                    ? 'bg-red-600 text-white shadow'
                                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                                }`}
                              >
                                {r} ({count})
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {(!zone.fixtures || zone.fixtures.length === 0) ? (
                        <div className="py-3 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-lg">
                          No hay partidos cargados en esta zona. Pulsa "⚡ Generar Todas las Fechas" o "+ Partido" para ingresar resultados.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {zone.fixtures
                            .filter((fix) => {
                              const sel = adminFixtureRounds[zone.id] || 'Todas';
                              return sel === 'Todas' || (fix.roundName || 'Fecha 1') === sel;
                            })
                            .map((fix) => (
                            <div
                              key={fix.id}
                              className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-[#161722] border border-zinc-800/80 rounded-lg p-2 text-xs hover:border-zinc-700 transition"
                            >
                              <div className="sm:col-span-2">
                                <input
                                  type="text"
                                  value={fix.roundName || 'Fecha 1'}
                                  onChange={(e) => handleUpdateFixture(zone.id, fix.id, 'roundName', e.target.value)}
                                  placeholder="Fecha"
                                  className="w-full bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-400 focus:outline-none font-bold"
                                />
                              </div>

                              <div className="sm:col-span-4 flex items-center gap-1.5">
                                <div className="w-4 h-4 relative shrink-0">
                                  <Image
                                    src={getTeamLogo(fix.homeTeamName)}
                                    alt={fix.homeTeamName}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={fix.homeTeamName}
                                  onChange={(e) => handleUpdateFixture(zone.id, fix.id, 'homeTeamName', e.target.value)}
                                  placeholder="Equipo Local"
                                  className="w-full bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none"
                                />
                              </div>

                              <div className="sm:col-span-2 flex items-center justify-center gap-1 font-mono">
                                <input
                                  type="number"
                                  value={fix.homeGoals !== null ? fix.homeGoals : ''}
                                  onChange={(e) =>
                                    handleUpdateFixture(
                                      zone.id,
                                      fix.id,
                                      'homeGoals',
                                      e.target.value === '' ? null : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0"
                                  className="w-10 text-center bg-[#12131a] border border-zinc-800 rounded py-1 text-xs font-black text-white focus:outline-none focus:border-red-500"
                                />
                                <span className="text-zinc-500 font-bold">-</span>
                                <input
                                  type="number"
                                  value={fix.awayGoals !== null ? fix.awayGoals : ''}
                                  onChange={(e) =>
                                    handleUpdateFixture(
                                      zone.id,
                                      fix.id,
                                      'awayGoals',
                                      e.target.value === '' ? null : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0"
                                  className="w-10 text-center bg-[#12131a] border border-zinc-800 rounded py-1 text-xs font-black text-white focus:outline-none focus:border-red-500"
                                />
                              </div>

                              <div className="sm:col-span-3 flex items-center gap-1.5">
                                <div className="w-4 h-4 relative shrink-0">
                                  <Image
                                    src={getTeamLogo(fix.awayTeamName)}
                                    alt={fix.awayTeamName}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={fix.awayTeamName}
                                  onChange={(e) => handleUpdateFixture(zone.id, fix.id, 'awayTeamName', e.target.value)}
                                  placeholder="Equipo Visitante"
                                  className="w-full bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none"
                                />
                              </div>

                              <div className="sm:col-span-1 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFixture(zone.id, fix.id)}
                                  className="text-zinc-600 hover:text-red-400 p-1 transition"
                                  title="Eliminar partido"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tabla editable de la zona (Preserva edición manual libre) */}
                    <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="font-bold uppercase text-white flex items-center gap-1.5">
                          <span>Tabla de Posiciones de la Zona</span>
                          <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 font-normal">
                            Editable celda por celda
                          </span>
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Puedes modificar cualquier casilla manualmente en cualquier momento
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-zinc-500 text-[10px] uppercase font-bold border-b border-zinc-800">
                            <th className="py-2 px-1 w-8 text-center">#</th>
                            <th className="py-2 px-2 min-w-[150px]">Club</th>
                            <th className="py-2 px-1 text-center w-12">PTS</th>
                            <th className="py-2 px-1 text-center w-10">PJ</th>
                            <th className="py-2 px-1 text-center w-10">PG</th>
                            <th className="py-2 px-1 text-center w-10">PE</th>
                            <th className="py-2 px-1 text-center w-10">PP</th>
                            <th className="py-2 px-1 text-center w-10">GF</th>
                            <th className="py-2 px-1 text-center w-10">GC</th>
                            <th className="py-2 px-1 text-center w-10">DIF</th>
                            <th className="py-2 px-1 text-center w-16">PlayOff</th>
                            <th className="py-2 px-1 text-center w-8"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/40 font-mono">
                          {zone.teams.map((team) => (
                            <tr key={team.id} className="hover:bg-zinc-800/30">
                              <td className="py-2 px-1 text-center font-bold text-zinc-500">{team.pos}</td>
                              <td className="py-2 px-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 relative shrink-0">
                                    <Image
                                      src={team.logoUrl || getTeamLogo(team.name)}
                                      alt={team.name}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={team.name}
                                    onChange={(e) => handleUpdateTeam(zone.id, team.id, 'name', e.target.value)}
                                    className="w-full bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none"
                                  />
                                </div>
                              </td>
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="number"
                                  value={team.pts}
                                  onChange={(e) => handleUpdateTeam(zone.id, team.id, 'pts', Number(e.target.value))}
                                  className="w-12 text-center bg-[#12131a] border border-zinc-800 rounded px-1 py-1 text-xs font-black text-white focus:outline-none"
                                />
                              </td>
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="number"
                                  value={team.pj}
                                  onChange={(e) => handleUpdateTeam(zone.id, team.id, 'pj', Number(e.target.value))}
                                  className="w-10 text-center bg-[#12131a] border border-zinc-800 rounded px-1 py-1 text-xs text-zinc-300 focus:outline-none"
                                />
                              </td>
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="number"
                                  value={team.pg}
                                  onChange={(e) => handleUpdateTeam(zone.id, team.id, 'pg', Number(e.target.value))}
                                  className="w-10 text-center bg-[#12131a] border border-zinc-800 rounded px-1 py-1 text-xs text-zinc-300 focus:outline-none"
                                />
                              </td>
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="number"
                                  value={team.pe}
                                  onChange={(e) => handleUpdateTeam(zone.id, team.id, 'pe', Number(e.target.value))}
                                  className="w-10 text-center bg-[#12131a] border border-zinc-800 rounded px-1 py-1 text-xs text-zinc-300 focus:outline-none"
                                />
                              </td>
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="number"
                                  value={team.pp}
                                  onChange={(e) => handleUpdateTeam(zone.id, team.id, 'pp', Number(e.target.value))}
                                  className="w-10 text-center bg-[#12131a] border border-zinc-800 rounded px-1 py-1 text-xs text-zinc-300 focus:outline-none"
                                />
                              </td>
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="number"
                                  value={team.gf}
                                  onChange={(e) => handleUpdateTeam(zone.id, team.id, 'gf', Number(e.target.value))}
                                  className="w-10 text-center bg-[#12131a] border border-zinc-800 rounded px-1 py-1 text-xs text-zinc-300 focus:outline-none"
                                />
                              </td>
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="number"
                                  value={team.gc}
                                  onChange={(e) => handleUpdateTeam(zone.id, team.id, 'gc', Number(e.target.value))}
                                  className="w-10 text-center bg-[#12131a] border border-zinc-800 rounded px-1 py-1 text-xs text-zinc-300 focus:outline-none"
                                />
                              </td>
                              <td className="py-2 px-1 text-center font-bold text-emerald-400">
                                {team.dif > 0 ? `+${team.dif}` : team.dif}
                              </td>
                              <td className="py-2 px-1 text-center">
                                <input
                                  type="checkbox"
                                  checked={team.qualified}
                                  onChange={(e) => handleUpdateTeam(zone.id, team.id, 'qualified', e.target.checked)}
                                  className="accent-emerald-500 cursor-pointer"
                                  title="Clasifica a Playoffs (barra verde Promiedos)"
                                />
                              </td>
                              <td className="py-2 px-1 text-center">
                                <button
                                  onClick={() => handleDeleteTeam(zone.id, team.id)}
                                  className="text-zinc-600 hover:text-red-400 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* MÓDULO 2: PLAY-OFFS (SISTEMA DE LLAVES) */}
            <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Cruces de Play-Offs ({standings.playoffs.length} Partidos)
                    </h3>
                    <div className="text-[10px] text-zinc-400">
                      Cuartos predefinidos desde tabla (1°A vs 4°B, 2°A vs 3°B, 1°B vs 4°A, 2°B vs 3°A). Semis y Final independientes.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSyncPlayoffsFromTable}
                  className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition shrink-0 self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sincronizar Cuartos desde Tablas</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {standings.playoffs.map((m) => (
                  <div key={m.id} className="bg-[#181922] border border-zinc-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-400 uppercase">{m.round}</span>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => handleUpdatePlayoff(m.id, 'title', e.target.value)}
                        className="bg-[#12131a] border border-zinc-800 rounded px-2 py-0.5 text-[10px] text-white focus:outline-none"
                      />
                    </div>

                    {/* Equipo 1 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={m.team1}
                        onChange={(e) => handleUpdatePlayoff(m.id, 'team1', e.target.value)}
                        placeholder="Equipo 1"
                        className="col-span-8 bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        value={m.score1 !== null ? m.score1 : ''}
                        onChange={(e) => handleUpdatePlayoff(m.id, 'score1', e.target.value === '' ? null : Number(e.target.value))}
                        placeholder="Goles"
                        className="col-span-4 bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-xs text-center text-white focus:outline-none"
                      />
                    </div>

                    {/* Equipo 2 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={m.team2}
                        onChange={(e) => handleUpdatePlayoff(m.id, 'team2', e.target.value)}
                        placeholder="Equipo 2"
                        className="col-span-8 bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        value={m.score2 !== null ? m.score2 : ''}
                        onChange={(e) => handleUpdatePlayoff(m.id, 'score2', e.target.value === '' ? null : Number(e.target.value))}
                        placeholder="Goles"
                        className="col-span-4 bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-xs text-center text-white focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px]">
                      <select
                        value={m.winner || 0}
                        onChange={(e) => handleUpdatePlayoff(m.id, 'winner', Number(e.target.value) || undefined)}
                        className="bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-zinc-300 focus:outline-none"
                      >
                        <option value="0">Sin ganador aún</option>
                        <option value="1">Gana: {m.team1}</option>
                        <option value="2">Gana: {m.team2}</option>
                      </select>

                      <input
                        type="text"
                        value={m.dateInfo || ''}
                        onChange={(e) => handleUpdatePlayoff(m.id, 'dateInfo', e.target.value)}
                        placeholder="Estado / Fecha"
                        className="w-28 bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MÓDULO 3: GOLEADORES DE BLANCO Y NEGRO (DIVIDIDO POR CATEGORÍAS) */}
            <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Goleadores de Blanco y Negro ({standings.goleadores.length} Registrados)
                    </h3>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Artilleros oficiales agrupados por división. Sin registro de partidos jugados.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Selector de categoría en el admin */}
                  <div className="flex items-center p-1 rounded-xl bg-[#181922] border border-zinc-800">
                    {['Todas', 'Fútbol Mayor', 'Reserva', 'Tercera División', 'Cuarta División', 'Quinta División'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setAdminGoleadorCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                          adminGoleadorCategory === cat
                            ? 'bg-red-600 text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat.replace(' División', '')}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddGoleador}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-800/70 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-400" />
                    <span>Añadir Goleador</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-zinc-500 text-[10px] uppercase font-bold border-b border-zinc-800">
                      <th className="py-2 px-2 w-10 text-center">#</th>
                      <th className="py-2 px-3 min-w-[200px]">Jugador de Blanco y Negro</th>
                      <th className="py-2 px-3 w-48">División / Categoría</th>
                      <th className="py-2 px-3 text-center w-28 text-white font-black bg-zinc-800/30">Goles</th>
                      <th className="py-2 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {standings.goleadores
                      .filter((g) => {
                        if (adminGoleadorCategory === 'Todas') return true;
                        return g.category.toLowerCase().includes(adminGoleadorCategory.toLowerCase());
                      })
                      .map((g, idx) => (
                        <tr key={g.id} className="hover:bg-zinc-800/30">
                          <td className="py-2.5 px-2 text-center font-bold text-zinc-500">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={g.name}
                              onChange={(e) => handleUpdateGoleador(g.id, 'name', e.target.value)}
                              className="w-full bg-[#12131a] border border-zinc-800 rounded px-2.5 py-1 text-xs text-white font-bold focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={g.category}
                              onChange={(e) => handleUpdateGoleador(g.id, 'category', e.target.value)}
                              className="w-full bg-[#12131a] border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 focus:outline-none"
                            >
                              <option value="Fútbol Mayor">Fútbol Mayor</option>
                              <option value="Reserva">Reserva</option>
                              <option value="Tercera División">Tercera División</option>
                              <option value="Cuarta División">Cuarta División</option>
                              <option value="Quinta División">Quinta División</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              value={g.goals}
                              onChange={(e) => handleUpdateGoleador(g.id, 'goals', Number(e.target.value))}
                              className="w-16 text-center bg-[#12131a] border border-zinc-800 rounded px-1 py-1 text-xs font-black text-red-400 focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteGoleador(g.id)}
                              className="text-zinc-600 hover:text-red-400 transition"
                              title="Eliminar artillero"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================ */}
        {/* MODAL CREAR / EDITAR PARTIDO                                                  */}
        {/* ============================================================================ */}
        {isMatchModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#12131a] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  {editingMatch ? 'Editar Partido' : 'Crear Nuevo Partido'}
                </h3>
                <button
                  onClick={() => setIsMatchModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMatch} className="space-y-4">
                {saveMatchError && (
                  <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{saveMatchError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Título del Partido</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Blanco y Negro vs Rival"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Descripción / Subtítulo</label>
                  <input
                    type="text"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Fútbol Mayor • Torneo Oficial"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#181922] border border-zinc-800">
                  <input
                    type="checkbox"
                    id="isDateConfirmed"
                    checked={formIsDateConfirmed}
                    onChange={(e) => setFormIsDateConfirmed(e.target.checked)}
                    className="accent-red-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isDateConfirmed" className="text-xs text-zinc-300 font-bold uppercase cursor-pointer">
                    ¿Fecha confirmada oficialmente? (Si se desmarca, queda vacante)
                  </label>
                </div>

                {formIsDateConfirmed && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Fecha y Hora</label>
                    <input
                      type="datetime-local"
                      required={formIsDateConfirmed}
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <p className="text-[10px] text-zinc-400 mt-1.5 flex items-center gap-1 font-mono">
                      <span>⏱️</span>
                      <span>El contador de la página principal se ajustará automáticamente a esta fecha y hora.</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Precio ($ ARS)</label>
                    <input
                      type="number"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Stream UID (Cloudflare)</label>
                    <input
                      type="text"
                      value={formStreamUid}
                      onChange={(e) => setFormStreamUid(e.target.value)}
                      placeholder="live_input_uid..."
                      className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">URL Imagen Miniatura</label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="/matches/blanco-y-negro-vs-ifc.png"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMatchModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formSaveLoading}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg flex items-center gap-2"
                  >
                    {formSaveLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Guardar Partido</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
