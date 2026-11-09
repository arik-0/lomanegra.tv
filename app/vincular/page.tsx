'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Tv, CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

function VincularContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get('code') || '';

  const [code, setCode] = useState(initialCode);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Cargar email guardado si existe
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('lomonegrotv_guest_email') ||
        localStorage.getItem('lomanegratv_guest_email');
      if (saved) setEmail(saved);
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !email.trim()) return;

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await fetch('/api/tv/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus('error');
        setMessage(data.error || 'No pudimos vincular tu televisor. Verifica los datos.');
      } else {
        setStatus('success');
        setMessage(data.message || '¡Televisor vinculado exitosamente! En tu pantalla ya comenzará la transmisión.');
        try {
          localStorage.setItem('lomonegrotv_guest_email', email.trim().toLowerCase());
        } catch {}
      }
    } catch (err: any) {
      setStatus('error');
      setMessage('Error de conexión con el servidor. Reintenta en unos instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col justify-between p-4 sm:p-6 font-mono selection:bg-red-600 selection:text-white">
      {/* Barra Superior */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </Link>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/60 border border-red-700/60 rounded-full text-[10px] text-red-400 font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>Android TV Link</span>
        </div>
      </header>

      {/* Contenedor Central */}
      <main className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-[#0f1015] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Luz de acento superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

          {/* Logo y Encabezado */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-950/40">
              <Tv className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Vincular Android TV
            </h1>
            <p className="text-xs text-zinc-400 mt-1.5">
              Ingresa el código que aparece en tu pantalla para desbloquear la transmisión en tu televisor.
            </p>
          </div>

          {status === 'success' ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">¡Televisor Conectado!</h3>
                <p className="text-xs text-emerald-400 mt-1 font-bold">
                  {message}
                </p>
                <p className="text-[11px] text-zinc-400 mt-2">
                  Ya puedes mirar hacia tu televisor. La pantalla se actualizará sola con el partido en HD.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Ir al Inicio
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Código de la TV */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                  Código en la Tele (6 caracteres)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ej: PL-4829"
                  maxLength={8}
                  className="w-full text-center text-xl font-black tracking-widest uppercase bg-black border border-zinc-700 rounded-2xl py-3 text-amber-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition shadow-inner font-mono"
                />
              </div>

              {/* Email con el que compró */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                  Correo de Mercado Pago
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu-email@gmail.com"
                  className="w-full text-sm bg-black border border-zinc-700 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition font-mono"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  El correo que ingresaste al abonar la entrada.
                </span>
              </div>

              {/* Mensaje de Error */}
              {status === 'error' && (
                <div className="p-3 bg-red-950/70 border border-red-800/80 rounded-2xl flex items-start gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              )}

              {/* Botón de Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 active:scale-[0.99] disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando y Activando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Activar Transmisión en TV</span>
                  </>
                )}
              </button>

              <div className="pt-3 text-center border-t border-zinc-800/80">
                <p className="text-[11px] text-zinc-500">
                  ¿Todavía no compraste tu acceso?{' '}
                  <Link href="/" className="text-red-400 hover:text-red-300 font-bold underline">
                    Comprar entrada aquí
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Pie */}
      <footer className="max-w-md w-full mx-auto text-center py-4 text-[10px] text-zinc-600 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
        <span>Pasión Lomonegra • Android TV Official Companion</span>
      </footer>
    </div>
  );
}

export default function VincularPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080b] flex items-center justify-center text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-red-500" />
        </div>
      }
    >
      <VincularContent />
    </Suspense>
  );
}
