'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Shield,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { ClubItem } from '@/lib/clubsPersistence';
import { registerCustomClubLogo } from '@/lib/standingsStore';

export default function AdminClubsManager() {
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estados para subir nuevo escudo de un club específico
  const [uploadingForClubId, setUploadingForClubId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetClubId, setTargetClubId] = useState<string | null>(null);

  // Estados para agregar nuevo club
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubShort, setNewClubShort] = useState('');
  const [newClubLogo, setNewClubLogo] = useState('');
  const [newClubLeague, setNewClubLeague] = useState('Liga Deportiva del Sur');
  const [uploadingNewLogo, setUploadingNewLogo] = useState(false);
  const newClubFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clubs');
      const data = await res.json();
      if (data.clubs && Array.isArray(data.clubs)) {
        setClubs(data.clubs);
        // Registrar escudos en la memoria del cliente
        data.clubs.forEach((c: ClubItem) => {
          registerCustomClubLogo(c.name, c.logoUrl);
          registerCustomClubLogo(c.id, c.logoUrl);
        });
      }
    } catch {
      setErrorMsg('Error cargando la lista de clubes.');
    } finally {
      setLoading(false);
    }
  };

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleUpdateClubField = (clubId: string, field: keyof ClubItem, value: string) => {
    setClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, [field]: value } : c))
    );
  };

  const triggerUploadForClub = (clubId: string) => {
    setTargetClubId(clubId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleClubLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetClubId) return;

    setUploadingForClubId(targetClubId);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        handleUpdateClubField(targetClubId, 'logoUrl', data.url);
        registerCustomClubLogo(targetClubId, data.url);
        notifySuccess('Escudo subido. Recuerda guardar los cambios.');
      } else {
        setErrorMsg(data.error || 'Error al subir la imagen.');
      }
    } catch {
      setErrorMsg('Error de red al subir la imagen.');
    } finally {
      setUploadingForClubId(null);
      setTargetClubId(null);
    }
  };

  const handleSaveAllClubs = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubs }),
      });
      const data = await res.json();
      if (res.ok && data.clubs) {
        setClubs(data.clubs);
        data.clubs.forEach((c: ClubItem) => {
          registerCustomClubLogo(c.name, c.logoUrl);
          registerCustomClubLogo(c.id, c.logoUrl);
        });
        notifySuccess('¡Clubes y escudos guardados exitosamente!');
      } else {
        setErrorMsg(data.error || 'Error al guardar los clubes.');
      }
    } catch {
      setErrorMsg('Error de red al guardar los clubes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClub = (clubId: string) => {
    const club = clubs.find((c) => c.id === clubId);
    if (!confirm(`¿Estás seguro de eliminar el club "${club?.name || 'seleccionado'}"?`)) return;
    setClubs((prev) => prev.filter((c) => c.id !== clubId));
  };

  const handleUploadNewClubLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNewLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setNewClubLogo(data.url);
        notifySuccess('Escudo subido correctamente.');
      }
    } catch {
      setErrorMsg('Error al subir el escudo del nuevo club.');
    } finally {
      setUploadingNewLogo(false);
    }
  };

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName.trim()) {
      setErrorMsg('El nombre del club es obligatorio.');
      return;
    }
    const cleanId = newClubName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    const newClub: ClubItem = {
      id: cleanId || `club_${Date.now()}`,
      name: newClubName.trim(),
      shortName: newClubShort.trim() || undefined,
      logoUrl: newClubLogo.trim() || '/teams/blanco-y-negro-shield.png',
      league: newClubLeague.trim(),
    };

    const updated = [...clubs, newClub];
    setClubs(updated);
    registerCustomClubLogo(newClub.name, newClub.logoUrl);
    registerCustomClubLogo(newClub.id, newClub.logoUrl);
    setShowAddModal(false);
    setNewClubName('');
    setNewClubShort('');
    setNewClubLogo('');
    notifySuccess(`Club "${newClub.name}" agregado. Haz clic en "Guardar Todos los Clubes".`);
  };

  const filteredClubs = clubs.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.shortName && c.shortName.toLowerCase().includes(q)) ||
      (c.league && c.league.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Hidden file input para subir escudo de cualquier fila */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleClubLogoUpload}
        className="hidden"
      />

      {/* Cabecera Principal */}
      <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Gestión de Clubes, Nombres & Escudos</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded">
                  LDDS // HOCKEY
                </span>
              </h2>
              <div className="text-[10px] text-zinc-400">
                Modifica nombres oficiales, sube fotos y escudos en alta resolución para que se reflejen en toda la app.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181922] hover:bg-[#20222a] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4 text-red-400" />
              <span>Nuevo Club</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAllClubs}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-950"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>

        {/* Buscador de clubes */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar club por nombre, abreviatura o liga..."
              className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>
          <span className="text-xs text-zinc-400 font-mono shrink-0">
            {filteredClubs.length} de {clubs.length} clubes
          </span>
        </div>

        {/* Notificaciones */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Lista de Clubes */}
      <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="bg-[#181922] border border-zinc-800/90 hover:border-zinc-700 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Escudo actual */}
                <div className="w-14 h-14 rounded-xl bg-black/60 border border-zinc-800 p-1 relative shrink-0 flex items-center justify-center overflow-hidden">
                  {club.logoUrl ? (
                    <Image
                      src={club.logoUrl}
                      alt={club.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  ) : (
                    <Shield className="w-6 h-6 text-zinc-600" />
                  )}
                </div>

                {/* Campos editables */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase truncate">
                      {club.id}
                    </span>
                    {club.league && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                        {club.league.includes('Hockey') ? 'Hockey' : 'Fútbol'}
                      </span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={club.name}
                    onChange={(e) => handleUpdateClubField(club.id, 'name', e.target.value)}
                    placeholder="Nombre del Club"
                    className="w-full bg-[#12131a] border border-zinc-800 focus:border-red-500 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none"
                    title="Editar nombre del club"
                  />

                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={club.shortName || ''}
                      onChange={(e) => handleUpdateClubField(club.id, 'shortName', e.target.value)}
                      placeholder="Abreviatura"
                      className="w-full bg-[#12131a] border border-zinc-800 focus:border-red-500 rounded-lg px-2 py-0.5 text-[10px] text-zinc-300 font-mono focus:outline-none"
                      title="Sigla / Abreviatura (ej: ByN, CLA)"
                    />
                    <input
                      type="text"
                      value={club.league || ''}
                      onChange={(e) => handleUpdateClubField(club.id, 'league', e.target.value)}
                      placeholder="Liga"
                      className="w-full bg-[#12131a] border border-zinc-800 focus:border-red-500 rounded-lg px-2 py-0.5 text-[10px] text-zinc-400 focus:outline-none"
                      title="Liga a la que pertenece"
                    />
                  </div>
                </div>
              </div>

              {/* URL del Escudo y Botón de Subida */}
              <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-2">
                <input
                  type="text"
                  value={club.logoUrl}
                  onChange={(e) => handleUpdateClubField(club.id, 'logoUrl', e.target.value)}
                  placeholder="URL del escudo..."
                  className="flex-1 bg-[#12131a] border border-zinc-800 rounded-lg px-2 py-1 text-[10px] text-zinc-400 font-mono focus:outline-none focus:border-red-500 truncate"
                  title="Enlace o ruta del escudo"
                />

                <button
                  type="button"
                  onClick={() => triggerUploadForClub(club.id)}
                  disabled={uploadingForClubId === club.id}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold flex items-center gap-1 transition border border-zinc-700 shrink-0"
                  title="Subir nueva foto o escudo desde tu dispositivo"
                >
                  <Upload className="w-3 h-3 text-red-400" />
                  <span>{uploadingForClubId === club.id ? 'Subiendo...' : 'Subir'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteClub(club.id)}
                  className="p-1 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-950/40 transition shrink-0"
                  title="Eliminar club"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nuevo Club */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#12131a] border border-zinc-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" />
                <span>Agregar Nuevo Club</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                  Nombre Completo del Club *
                </label>
                <input
                  type="text"
                  required
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  placeholder="ej: Club Atlético Central"
                  className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Abreviatura (ej: CAC)
                  </label>
                  <input
                    type="text"
                    value={newClubShort}
                    onChange={(e) => setNewClubShort(e.target.value)}
                    placeholder="CAC"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Liga o Torneo
                  </label>
                  <input
                    type="text"
                    value={newClubLeague}
                    onChange={(e) => setNewClubLeague(e.target.value)}
                    placeholder="Liga Deportiva del Sur"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Subir escudo */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                  Escudo del Club (Archivo o URL)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    ref={newClubFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadNewClubLogo}
                    className="hidden"
                    id="new-club-logo-file"
                  />
                  <label
                    htmlFor="new-club-logo-file"
                    className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition border border-zinc-700"
                  >
                    <Upload className="w-3.5 h-3.5 text-red-400" />
                    <span>{uploadingNewLogo ? 'Subiendo...' : 'Seleccionar Archivo'}</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={newClubLogo}
                  onChange={(e) => setNewClubLogo(e.target.value)}
                  placeholder="https://... o /teams/escudo.png"
                  className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-red-950"
                >
                  Crear Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
