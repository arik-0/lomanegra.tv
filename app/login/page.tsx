'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        // Registro de nuevo usuario en Supabase
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              redirectTo
            )}`,
          },
        });

        if (error) throw error;

        localStorage.setItem('lomonegrotv_guest_email', cleanEmail);

        if (data.session) {
          router.push(redirectTo);
          router.refresh();
        } else {
          setSuccessMsg(
            '¡Cuenta creada con éxito! Si requiere verificación, revisa tu casilla. Ya puedes iniciar sesión.'
          );
          setIsSignUp(false);
        }
      } else {
        // Inicio de sesión en Supabase
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;

        localStorage.setItem('lomonegrotv_guest_email', cleanEmail);
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) {
        setErrorMsg('Correo o contraseña incorrectos.');
      } else if (msg.includes('User already registered')) {
        setErrorMsg('Este correo ya está registrado. Por favor, selecciona "Iniciar Sesión".');
      } else if (msg.includes('Password should be at least')) {
        setErrorMsg('La contraseña debe contener al menos 6 caracteres.');
      } else if (msg.toLowerCase().includes('fetch')) {
        setErrorMsg(
          'Error de conexión con el servicio de autenticación. Por favor, reintenta o continúa directamente como invitado.'
        );
      } else {
        setErrorMsg(msg || 'Error al procesar la autenticación.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md bg-[#0c0c10] border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
      {/* Escuadras HUD */}
      <span className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-red-500/50 pointer-events-none" />
      <span className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-red-500/50 pointer-events-none" />
      <span className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-red-500/50 pointer-events-none" />
      <span className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-red-500/50 pointer-events-none" />

      {/* Cabecera */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 relative mx-auto mb-3 drop-shadow-xl">
          <Image
            src="/logo-pasion-lomonegra.png"
            alt="Pasión Lomonegra"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-red-500 mb-1">
          ACCESO // USUARIO
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </h1>
        <p className="text-zinc-500 font-mono text-xs mt-1.5">
          {isSignUp
            ? 'Regístrate para guardar tu historial de pases'
            : 'Ingresa con tu correo y contraseña'}
        </p>
      </div>

      {/* Mensajes de Alerta */}
      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 space-y-2 text-red-300 text-xs font-mono">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>
              {errorMsg.toLowerCase().includes('fetch')
                ? 'Conexión de autenticación no disponible en este momento. Puedes acceder directamente como invitado sin contraseña.'
                : errorMsg}
            </span>
          </div>

          {email && (
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('lomonegrotv_guest_email', email);
                router.push(redirectTo);
              }}
              className="w-full mt-2 py-2 px-3 bg-white text-black font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-zinc-200 transition"
            >
              Continuar como Invitado ({email}) &rarr;
            </button>
          )}
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 flex items-start gap-2.5 text-emerald-300 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full bg-[#14141c] border border-white/[0.08] focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-zinc-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#14141c] border border-white/[0.08] focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-zinc-600 outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-[0_4px_16px_rgba(255,255,255,0.1)] transition"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : isSignUp ? (
            'Crear Cuenta'
          ) : (
            'Ingresar'
          )}
        </button>
      </form>

      {/* Toggle Login / SignUp */}
      <div className="mt-5 pt-5 border-t border-white/[0.07] text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className="text-xs font-mono text-zinc-400 hover:text-white transition"
        >
          {isSignUp ? (
            <>
              ¿Ya tienes cuenta?{' '}
              <span className="text-red-400 font-bold underline underline-offset-4">
                Inicia sesión
              </span>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{' '}
              <span className="text-red-400 font-bold underline underline-offset-4">
                Regístrate
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-[#08080a]">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-80 bg-[#0c0c10] border border-white/[0.08] rounded-3xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-red-500" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
