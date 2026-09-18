'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Camera,
  Youtube,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Layers,
  Sparkles,
  Calendar,
  Eye,
} from 'lucide-react';
import type { GalleryPhoto, PlaylistCard, GalleryData } from '@/lib/galleryPersistence';

export default function AdminGalleryManager() {
  const [subTab, setSubTab] = useState<'fotos' | 'playlists'>('fotos');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistCard[]>([]);

  // Estado formulario nueva foto
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<string>('mayor');
  const [newPhotoCategoryLabel, setNewPhotoCategoryLabel] = useState('Primera');
  const [newPhotoImageUrl, setNewPhotoImageUrl] = useState('');
  const [newPhotoDate, setNewPhotoDate] = useState('Torneo Clausura 2026');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [newPhotoBadge, setNewPhotoBadge] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Estado formulario nueva playlist
  const [newPlTitle, setNewPlTitle] = useState('');
  const [newPlCategory, setNewPlCategory] = useState<'mayor' | 'juveniles' | 'programas' | 'hockey'>('mayor');
  const [newPlCategoryLabel, setNewPlCategoryLabel] = useState('Primera');
  const [newPlBadge, setNewPlBadge] = useState('');
  const [newPlImageUrl, setNewPlImageUrl] = useState('');
  const [newPlUrl, setNewPlUrl] = useState('');
  const [newPlDesc, setNewPlDesc] = useState('');
  const [newPlCountText, setNewPlCountText] = useState('Playlist Oficial');
  const [uploadingPlCover, setUploadingPlCover] = useState(false);
  const plFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const data: GalleryData = await res.json();
      if (data.photos) setPhotos(data.photos);
      if (data.playlists) setPlaylists(data.playlists);
    } catch {
      setErrorMsg('Error cargando galería.');
    } finally {
      setLoading(false);
    }
  };

  const notifySuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleUploadPhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
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
        setNewPhotoImageUrl(data.url);
        notifySuccess('Foto subida exitosamente.');
      } else {
        setErrorMsg(data.error || 'Error al subir la foto.');
      }
    } catch {
      setErrorMsg('Error de red al subir la foto.');
    } finally {
      setUploadingPhoto(false);
      if (photoFileInputRef.current) photoFileInputRef.current.value = '';
    }
  };

  const handleUploadPlCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPlCover(true);
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
        setNewPlImageUrl(data.url);
        notifySuccess('Portada de playlist subida exitosamente.');
      } else {
        setErrorMsg(data.error || 'Error al subir la portada.');
      }
    } catch {
      setErrorMsg('Error de red al subir la portada.');
    } finally {
      setUploadingPlCover(false);
      if (plFileInputRef.current) plFileInputRef.current.value = '';
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim() || !newPhotoImageUrl.trim()) {
      setErrorMsg('El título y la imagen son obligatorios.');
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      title: newPhotoTitle.trim(),
      category: newPhotoCategory,
      categoryLabel: newPhotoCategoryLabel.trim() || 'General',
      imageUrl: newPhotoImageUrl.trim(),
      date: newPhotoDate.trim() || 'Oficial 2026',
      description: newPhotoDesc.trim() || 'Cobertura gráfica Pasión Lomonegra',
      badge: newPhotoBadge.trim() || undefined,
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: updated }),
      });
      if (res.ok) {
        notifySuccess('¡Foto agregada a la galería con éxito!');
        setNewPhotoTitle('');
        setNewPhotoImageUrl('');
        setNewPhotoDesc('');
        setNewPhotoBadge('');
      } else {
        setErrorMsg('Error guardando en la base de datos.');
      }
    } catch {
      setErrorMsg('Error de red al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta foto de la galería?')) return;
    const updated = photos.filter((p) => p.id !== photoId);
    setPhotos(updated);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: updated }),
      });
      if (res.ok) {
        notifySuccess('Foto eliminada correctamente.');
      }
    } catch {
      setErrorMsg('Error al eliminar la foto.');
    } finally {
      setSaving(false);
    }
  };

  const extractPlaylistId = (url: string): string => {
    const clean = url.trim();
    if (clean.includes('list=')) {
      const match = clean.match(/list=([a-zA-Z0-9_-]+)/);
      if (match) return match[1];
    }
    return clean;
  };

  const handleAddPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlTitle.trim() || !newPlUrl.trim()) {
      setErrorMsg('El título y el enlace o ID de la playlist son obligatorios.');
      return;
    }

    const plId = extractPlaylistId(newPlUrl);
    const plUrl = newPlUrl.startsWith('http')
      ? newPlUrl.trim()
      : `https://www.youtube.com/playlist?list=${plId}`;

    const newCard: PlaylistCard = {
      id: `pl-${Date.now()}`,
      title: newPlTitle.trim().toUpperCase(),
      category: newPlCategory,
      categoryLabel: newPlCategoryLabel.trim() || 'Oficial',
      badge: newPlBadge.trim() || `#${newPlTitle.trim().toUpperCase()}`,
      imageUrl:
        newPlImageUrl.trim() ||
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      playlistId: plId,
      playlistUrl: plUrl,
      description: newPlDesc.trim() || 'Transmisiones y coberturas oficiales.',
      videoCountText: newPlCountText.trim() || 'Playlist Oficial',
    };

    const updated = [...playlists, newCard];
    setPlaylists(updated);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlists: updated }),
      });
      if (res.ok) {
        notifySuccess('¡Playlist agregada con éxito!');
        setNewPlTitle('');
        setNewPlUrl('');
        setNewPlDesc('');
        setNewPlBadge('');
        setNewPlImageUrl('');
      } else {
        setErrorMsg('Error guardando playlist.');
      }
    } catch {
      setErrorMsg('Error de red al guardar playlist.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlaylist = async (plId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta lista de reproducción?')) return;
    const updated = playlists.filter((p) => p.id !== plId);
    setPlaylists(updated);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlists: updated }),
      });
      if (res.ok) {
        notifySuccess('Playlist eliminada correctamente.');
      }
    } catch {
      setErrorMsg('Error al eliminar playlist.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header y Notificaciones */}
      <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>Administración de Galería & Playlists</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded">
                  HD OFICIAL
                </span>
              </h2>
              <div className="text-[10px] text-zinc-400">
                Sube fotos de hinchada, festejos y partidos, y administra las listas de reproducción de YouTube.
              </div>
            </div>
          </div>

          {/* Selector de Sub-pestaña */}
          <div className="flex items-center p-1 rounded-2xl bg-[#181922] border border-zinc-800">
            <button
              type="button"
              onClick={() => setSubTab('fotos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                subTab === 'fotos'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Fotos ({photos.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('playlists')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                subTab === 'playlists'
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>Playlists ({playlists.length})</span>
            </button>
          </div>
        </div>

        {/* Mensajes de Alerta */}
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

      {/* SUB-PESTAÑA 1: FOTOS DE GALERÍA */}
      {subTab === 'fotos' && (
        <div className="space-y-6">
          {/* Formulario para agregar / subir foto */}
          <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-300 border-b border-zinc-800/80 pb-3">
              <Plus className="w-4 h-4 text-red-500" />
              <span>Subir Nueva Foto a la Galería</span>
            </div>

            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Título de la Foto *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="ej: Recibimiento en el clásico con humo blanco y negro"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Categoría
                  </label>
                  <select
                    value={newPhotoCategory}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setNewPhotoCategory(cat);
                      const labels: Record<string, string> = {
                        mayor: 'Primera',
                        reserva: 'Reserva',
                        tercera: 'Tercera',
                        cuarta: 'Cuarta',
                        quinta: 'Quinta',
                        hockey: 'Hockey',
                        hinchada: 'La Hinchada',
                      };
                      setNewPhotoCategoryLabel(labels[cat] || 'Primera');
                    }}
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="mayor">Primera</option>
                    <option value="reserva">Reserva</option>
                    <option value="tercera">Tercera</option>
                    <option value="cuarta">Cuarta</option>
                    <option value="quinta">Quinta</option>
                    <option value="hockey">Hockey</option>
                    <option value="hinchada">La Hinchada</option>
                  </select>
                </div>
              </div>

              {/* Subida de Imagen / URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Subir Archivo de Imagen desde tu Dispositivo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={photoFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPhotoFile}
                      className="hidden"
                      id="photo-file-input"
                    />
                    <label
                      htmlFor="photo-file-input"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition border border-zinc-700"
                    >
                      <Upload className="w-4 h-4 text-red-400" />
                      <span>{uploadingPhoto ? 'Subiendo...' : 'Seleccionar Foto'}</span>
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">JPG, PNG o WEBP</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    O Enlace / URL de la Imagen *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhotoImageUrl}
                    onChange={(e) => setNewPhotoImageUrl(e.target.value)}
                    placeholder="https://... o /uploads/nombre.jpg"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Vista previa miniatura si hay URL */}
              {newPhotoImageUrl && (
                <div className="p-3 bg-[#181922] rounded-2xl border border-zinc-800 flex items-center gap-4">
                  <div className="w-20 h-14 relative rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-700">
                    <Image
                      src={newPhotoImageUrl}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="text-xs text-zinc-300">
                    <div className="font-bold">Vista previa de imagen seleccionada</div>
                    <div className="text-[10px] text-zinc-500 font-mono truncate max-w-md">
                      {newPhotoImageUrl}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Fecha o Torneo
                  </label>
                  <input
                    type="text"
                    value={newPhotoDate}
                    onChange={(e) => setNewPhotoDate(e.target.value)}
                    placeholder="ej: Fecha 14 • Clásico Regional"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Badge / Etiqueta Destacada (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newPhotoBadge}
                    onChange={(e) => setNewPhotoBadge(e.target.value)}
                    placeholder="ej: MÁS VISTA, GOLAZO, CLÁSICO"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                  Descripción o Epígrafe
                </label>
                <textarea
                  rows={2}
                  value={newPhotoDesc}
                  onChange={(e) => setNewPhotoDesc(e.target.value)}
                  placeholder="Detalles sobre el momento, jugadores presentes o contexto del partido..."
                  className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving || uploadingPhoto}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-red-950"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Agregar Foto a Galería</span>
                </button>
              </div>
            </form>
          </div>

          {/* Grilla de Fotos Actuales */}
          <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Fotos Publicadas ({photos.length})
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Visible para todos en /galeria</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#181922] border border-zinc-800/90 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-red-900/60 transition shadow-sm"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {p.badge && (
                      <span className="absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/40">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] uppercase font-bold text-red-400">
                        {p.categoryLabel} • {p.date}
                      </div>
                      <div className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                        {p.title}
                      </div>
                      {p.description && (
                        <div className="text-[10px] text-zinc-400 line-clamp-2 mt-1">
                          {p.description}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                      <a
                        href={p.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(p.id)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/50 transition"
                        title="Eliminar foto"
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

      {/* SUB-PESTAÑA 2: PLAYLISTS DE YOUTUBE */}
      {subTab === 'playlists' && (
        <div className="space-y-6">
          {/* Formulario para agregar playlist */}
          <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-zinc-300 border-b border-zinc-800/80 pb-3">
              <Plus className="w-4 h-4 text-red-500" />
              <span>Agregar Lista de Reproducción de YouTube</span>
            </div>

            <form onSubmit={handleAddPlaylist} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Título de la Playlist *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlTitle}
                    onChange={(e) => setNewPlTitle(e.target.value)}
                    placeholder="ej: HOCKEY FEMENINO 2026 o PRIMERA DIVISIÓN"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Categoría
                  </label>
                  <select
                    value={newPlCategory}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setNewPlCategory(cat);
                      const labels: Record<string, string> = {
                        mayor: 'Primera',
                        juveniles: 'Divisiones Juveniles',
                        programas: 'Programas & Notas',
                        hockey: 'Hockey',
                      };
                      setNewPlCategoryLabel(labels[cat] || 'Oficial');
                    }}
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="mayor">Fútbol Mayor / Primera</option>
                    <option value="juveniles">Divisiones Juveniles</option>
                    <option value="programas">Programas Semanales & Notas</option>
                    <option value="hockey">Hockey (LCUH)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Enlace de la Playlist de YouTube o ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlUrl}
                    onChange={(e) => setNewPlUrl(e.target.value)}
                    placeholder="https://www.youtube.com/playlist?list=PLjWo... o PLjWo..."
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Badge / Tag (ej: #HOCKEY, #PRIMERA)
                  </label>
                  <input
                    type="text"
                    value={newPlBadge}
                    onChange={(e) => setNewPlBadge(e.target.value)}
                    placeholder="#PRIMERA"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Portada de la Playlist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Subir Portada desde Dispositivo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={plFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPlCover}
                      className="hidden"
                      id="pl-cover-file-input"
                    />
                    <label
                      htmlFor="pl-cover-file-input"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition border border-zinc-700"
                    >
                      <Upload className="w-4 h-4 text-red-400" />
                      <span>{uploadingPlCover ? 'Subiendo...' : 'Seleccionar Portada'}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    O Enlace / URL de Portada
                  </label>
                  <input
                    type="text"
                    value={newPlImageUrl}
                    onChange={(e) => setNewPlImageUrl(e.target.value)}
                    placeholder="https://... o /uploads/portada.jpg"
                    className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={newPlDesc}
                  onChange={(e) => setNewPlDesc(e.target.value)}
                  placeholder="Descripción de los partidos o programas contenidos en esta lista..."
                  className="w-full bg-[#181922] border border-zinc-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving || uploadingPlCover}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-red-950"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Guardar Lista de Reproducción</span>
                </button>
              </div>
            </form>
          </div>

          {/* Grilla de Playlists Actuales */}
          <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Playlists Oficiales Publicadas ({playlists.length})
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Se reproducen directamente en /galeria</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="bg-[#181922] border border-zinc-800/90 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-red-900/60 transition shadow-sm"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <Image
                      src={pl.imageUrl}
                      alt={pl.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute top-2 left-2 text-[9px] font-black px-2 py-0.5 rounded bg-black/80 text-white border border-red-600/60 uppercase">
                      {pl.badge}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase">
                        <span>{pl.categoryLabel}</span>
                        <span className="text-red-400 font-mono">{pl.playlistId.slice(0, 12)}...</span>
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight mt-0.5">
                        {pl.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                        {pl.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                      <a
                        href={pl.playlistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir YouTube</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeletePlaylist(pl.id)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/50 transition"
                        title="Eliminar playlist"
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
    </div>
  );
}
