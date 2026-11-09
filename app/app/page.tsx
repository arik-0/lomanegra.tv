'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Smartphone,
  Tv,
  Download,
  CheckCircle2,
  ShieldCheck,
  Apple,
  Share,
  PlusSquare,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Wifi,
  Lock,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function AppDownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalledPwa, setIsInstalledPwa] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'tv'>('android');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        setActivePlatform('ios');
      } else if (/android.*tv|googletv|smarttv|bravia|aftm|aftb/.test(ua)) {
        setActivePlatform('tv');
      }

      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalledPwa(true);
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalledPwa(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            Volver al Inicio
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Apps Oficiales Verificadas • Sin Publicidad Externa
          </span>
        </div>

        {/* Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-red-950/40 via-[#12131a] to-[#0d0e13] border border-zinc-800/90 p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-zinc-950 border-2 border-red-600/50 p-3 relative shrink-0 shadow-[0_0_40px_rgba(220,38,38,0.25)]">
              <Image
                src="/logo-pasion-lomonegra.png"
                alt="Pasión Lomonegra App"
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                <Sparkles className="w-3 h-3" /> Ecosistema Multi-Dispositivo 2026
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                App Oficial <span className="text-red-500">Pasión Lomonegra</span>
              </h1>
              <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                Llevá las transmisiones en vivo de la Liga Deportiva del Sur, las tablas de posiciones,
                los play-offs y la tabla de goleadores directamente en tu celular Android, iPhone o Smart TV.
              </p>
            </div>
          </div>

          {/* Selector de plataforma */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-8 pt-6 border-t border-zinc-800/80">
            <button
              onClick={() => setActivePlatform('android')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition border ${
                activePlatform === 'android'
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android Móvil</span>
            </button>

            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition border ${
                activePlatform === 'ios'
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>iPhone / iPad</span>
            </button>

            <button
              onClick={() => setActivePlatform('tv')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition border ${
                activePlatform === 'tv'
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Android TV</span>
            </button>
          </div>
        </div>

        {/* Contenido según plataforma */}
        {activePlatform === 'android' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Opción 1: APK Nativa Android */}
            <div className="rounded-3xl bg-[#12131a] border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                    APK Nativa Android • v1.0.0
                  </span>
                  <Smartphone className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">
                  Descargar APK Oficial para Celulares Android
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  Aplicación nativa compilada para teléfonos y tablets Android (Android 6.0 o superior).
                  Incluye reproductor con pantalla completa automática al girar el teléfono e integración
                  directa con la app de Mercado Pago.
                </p>

                <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Rotación horizontal automática en partidos en vivo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Envío a Chromecast y vinculación rápida con Smart TV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Peso liviano (~5 MB) sin consumo de batería en segundo plano</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <a
                  href="/downloads/PasionLomonegraMobile.apk"
                  download="PasionLomonegraMobile.apk"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-lg shadow-red-950/50"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar APK Móvil (.APK)</span>
                </a>
                <p className="text-[11px] text-zinc-500 text-center">
                  Si tu navegador consulta al abrirlo, seleccioná «Permitir instalar de esta fuente».
                </p>
              </div>
            </div>

            {/* Opción 2: Instalación Instantánea PWA */}
            <div className="rounded-3xl bg-[#12131a] border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-700/60 text-blue-300 text-[10px] font-mono font-bold uppercase">
                    Instalación Instantánea (Web App)
                  </span>
                  <Wifi className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">
                  Instalar sin descargar archivos (1 Clic)
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  También podés instalar la Web App Oficial directamente desde Google Chrome. Crea el
                  ícono oficial de Pasión Lomonegra en tu pantalla de inicio y abre a pantalla completa.
                </p>

                <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 space-y-2.5 text-xs text-zinc-300 mb-6">
                  <div className="font-bold text-white">Pasos manuales en Chrome Android:</div>
                  <p>1. Tocá el botón de menú <strong className="text-white">(⋮)</strong> arriba a la derecha en Chrome.</p>
                  <p>2. Elegí <strong className="text-white">«Instalar aplicación»</strong> o <strong className="text-white">«Agregar a la pantalla principal»</strong>.</p>
                  <p>3. Confirmá y el escudo aparecerá junto a tus demás aplicaciones.</p>
                </div>
              </div>

              {isInstalledPwa ? (
                <div className="py-3.5 px-4 rounded-xl bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Ya tenés la Web App instalada en este dispositivo!</span>
                </div>
              ) : deferredPrompt ? (
                <button
                  onClick={handleInstallPwa}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition"
                >
                  <PlusSquare className="w-4 h-4" />
                  <span>Instalar Web App Ahora</span>
                </button>
              ) : (
                <div className="py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs text-center">
                  Usá el menú <strong className="text-white">⋮ &rarr; Instalar aplicación</strong> de tu navegador o descargá el archivo APK del panel izquierdo.
                </div>
              )}
            </div>
          </div>
        )}

        {activePlatform === 'ios' && (
          <div className="rounded-3xl bg-[#12131a] border border-zinc-800 p-6 sm:p-8 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Apple className="w-5 h-5 text-white" />
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                Guía Oficial para iPhone y iPad (iOS / iPadOS)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
              Instalá Pasión Lomonegra en tu iPhone en 15 segundos
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-2xl">
              En dispositivos Apple, la aplicación funciona mediante el estándar Web App Nativa de Safari,
              con soporte completo para <strong className="text-white">Apple AirPlay</strong> hacia tu Apple TV o Smart TV compatible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-black flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                  <Share className="w-4 h-4 text-blue-400" /> Tocá «Compartir» en Safari
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Abrí <strong className="text-zinc-200">pasionlomonegra.com</strong> desde el navegador Safari y pulsá el ícono de Compartir en la barra inferior.
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-black flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                  <PlusSquare className="w-4 h-4 text-emerald-400" /> «Agregar a Inicio»
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Deslizá las opciones hacia abajo y seleccioná <strong className="text-zinc-200">«Agregar a Inicio»</strong> (Add to Home Screen).
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5">
                <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 font-black flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Abrí desde tu Inicio
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tocá <strong className="text-zinc-200">«Agregar»</strong> arriba a la derecha. La app quedará instalada con su escudo oficial a pantalla completa.
                </p>
              </div>
            </div>
          </div>
        )}

        {activePlatform === 'tv' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-3xl bg-[#12131a] border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-mono font-bold uppercase">
                    Android TV / Google TV • Leanback
                  </span>
                  <Tv className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">
                  App Nativa para Televisores y TV Box
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  Diseñada específicamente para manejarse con el control remoto del televisor (D-Pad).
                  Compatible con Chromecast con Google TV, Xiaomi Mi Box, Noblex, TCL, Sony Bravia,
                  Philips y decodificadores Flow Box.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="/downloads/PasionLomonegraTV.apk"
                  download="PasionLomonegraTV.apk"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-lg shadow-red-950/50"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar APK para Android TV</span>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/tv"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 transition"
                  >
                    <Tv className="w-3.5 h-3.5 text-red-400" />
                    <span>Abrir Modo TV Web</span>
                  </Link>
                  <Link
                    href="/vincular"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Vincular Código TV</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#12131a] border border-zinc-800 p-6 sm:p-8">
              <h3 className="text-base font-black text-white mb-3">
                ¿Cómo activar el partido en tu Televisor?
              </h3>
              <ol className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <li className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <strong className="text-white">1. Abrí la App en tu TV:</strong> Al seleccionar el partido en vivo aparecerá un código de 6 dígitos y un código QR en la pantalla del televisor.
                </li>
                <li className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <strong className="text-white">2. Escaneá con tu celular:</strong> O entrá desde tu teléfono a{' '}
                  <Link href="/vincular" className="text-red-400 underline font-bold">
                    pasionlomonegra.com/vincular
                  </Link>.
                </li>
                <li className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <strong className="text-white">3. Ingresá tu email de compra:</strong> El televisor se desbloquea automáticamente en menos de 3 segundos sin escribir contraseñas con el control remoto.
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Nota de Seguridad e Integridad Legal */}
        <div className="rounded-2xl bg-[#101117] border border-zinc-800/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-zinc-200">
                Seguridad e Integridad Verificada (SHA-256 & HTTPS/TLS)
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Los paquetes APK oficiales de Pasión Lomonegra no solicitan permisos sobre tu agenda, cámara, micrófono ni ubicación. Cumplen íntegramente con la Ley 25.326 de Protección de Datos Personales.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
            <Link href="/privacidad" className="text-red-400 hover:underline">
              Privacidad
            </Link>
            <span>·</span>
            <Link href="/terminos" className="text-red-400 hover:underline">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
