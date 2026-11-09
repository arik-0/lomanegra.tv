'use client';

import { useEffect, useState, useRef } from 'react';
import { Lock, RefreshCw, ShieldAlert, ArrowLeft, Tv, Cast } from 'lucide-react';
import StreamPlaceholder from '@/components/StreamPlaceholder';
import CastToTvModal from '@/components/CastToTvModal';

interface StreamPlayerProps {
  token: string;
  sessionId: string;
  guestEmail?: string;
  matchTitle?: string;
  matchDate?: string;
  onBackToPlaceholder?: () => void;
}

export default function StreamPlayer({
  token,
  sessionId,
  guestEmail,
  matchTitle,
  matchDate,
  onBackToPlaceholder,
}: StreamPlayerProps) {
  const [concurrencyError, setConcurrencyError] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [useAltCdn, setUseAltCdn] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [isAirPlaySupported, setIsAirPlaySupported] = useState(false);
  const [isCastSupported, setIsCastSupported] = useState(false);

  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Iniciar latido (Heartbeat) cada 20 segundos
    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/stream/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, guestEmail }),
        });

        if (res.status === 409) {
          const data = await res.json();
          setConcurrencyError(
            data.error ||
              'Se ha iniciado la transmisión en otro dispositivo o ventana con tu cuenta.'
          );
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
        }
      } catch (err) {
        console.error('Error enviando heartbeat:', err);
      }
    }, 20000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [sessionId, guestEmail]);

  // Inicializar Google Cast SDK y detección de AirPlay
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detectar soporte de AirPlay (iOS / macOS Safari)
    const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
    if (isApple || (window as any).WebKitPlaybackTargetAvailabilityEvent) {
      setIsAirPlaySupported(true);
    }

    // Callback para Google Cast SDK
    (window as any).__onGCastApiAvailable = (isAvailable: boolean) => {
      if (isAvailable && (window as any).cast?.framework) {
        try {
          const context = (window as any).cast.framework.CastContext.getInstance();
          context.setOptions({
            receiverApplicationId:
              (window as any).chrome?.cast?.media?.DEFAULT_MEDIA_RECEIVER_APP_ID ||
              'CC1AD845',
            autoJoinPolicy:
              (window as any).chrome?.cast?.AutoJoinPolicy?.ORIGIN_SCOPED ||
              'origin_scoped',
          });
          setIsCastSupported(true);
        } catch (e) {
          console.log('Error inicializando Google Cast Context:', e);
        }
      }
    };

    // Inyectar script de Google Cast Framework si no está presente
    if (!document.getElementById('google-cast-sdk')) {
      const script = document.createElement('script');
      script.id = 'google-cast-sdk';
      script.src =
        'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Detectar si el token es una URL de Cloudflare Stream (iframe o manifest) y extraer el UID y customerCode
  const ANCHORED_UID = 'dac066a4fb5c97117189392adae3f453';
  let streamSrc = token || ANCHORED_UID;
  let customerCode: string | undefined = undefined;

  const customerMatch = streamSrc.match(/customer-([a-zA-Z0-9]+)\.cloudflarestream\.com/);
  if (customerMatch && customerMatch[1]) {
    customerCode = customerMatch[1];
  }

  const cfMatch = streamSrc.match(/(?:videodelivery\.net|cloudflarestream\.com)\/([a-fA-F0-9]{32})/);
  if (cfMatch && cfMatch[1]) {
    streamSrc = cfMatch[1];
  }

  if (!streamSrc || streamSrc.startsWith('mock') || streamSrc.startsWith('live_input_')) {
    streamSrc = ANCHORED_UID;
  }

  const isDirectVideo = streamSrc.startsWith('http') && !cfMatch;
  const cfCustomer = customerCode || '2p5v30ml6gk9homd';

  // URL del manifest HLS para dispositivos Chromecast y AirPlay
  const manifestUrl = isDirectVideo
    ? streamSrc
    : `https://customer-${cfCustomer}.cloudflarestream.com/${streamSrc}/manifest/video.m3u8`;

  // Construir la URL del iframe oficial de Cloudflare Stream
  const iframeSrc = useAltCdn
    ? `https://iframe.videodelivery.net/${streamSrc}?autoplay=true&preload=auto&controls=true`
    : `https://customer-${cfCustomer}.cloudflarestream.com/${streamSrc}/iframe?autoplay=true&preload=auto&controls=true`;

  // Disparar Google Cast de manera programática
  const handleTriggerChromecast = async () => {
    // 1. Google Cast Framework
    try {
      const cast = (window as any).cast;
      const chrome = (window as any).chrome;
      if (cast?.framework && chrome?.cast) {
        const context = cast.framework.CastContext.getInstance();
        await context.requestSession();
        const session = context.getCurrentSession();
        if (session) {
          const mediaInfo = new chrome.cast.media.MediaInfo(
            manifestUrl,
            'application/x-mpegurl'
          );
          mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
          mediaInfo.metadata.title = matchTitle || 'Pasión Lomonegra // Señal en Directo';
          const request = new chrome.cast.media.LoadRequest(mediaInfo);
          session.loadMedia(request);
          setShowCastModal(false);
          return;
        }
      }
    } catch (e) {
      console.log('CastContext prompt:', e);
    }

    // 2. Remote Playback API
    if (hiddenVideoRef.current && (hiddenVideoRef.current as any).remote) {
      try {
        await (hiddenVideoRef.current as any).remote.prompt();
        setShowCastModal(false);
        return;
      } catch (e) {
        console.log('Remote Playback prompt:', e);
      }
    }

    // 3. Presentation API
    if ((window as any).PresentationRequest) {
      try {
        const pr = new (window as any).PresentationRequest([manifestUrl]);
        await pr.start();
        setShowCastModal(false);
        return;
      } catch (e) {
        console.log('Presentation API prompt:', e);
      }
    }
  };

  // Disparar Apple AirPlay de manera programática
  const handleTriggerAirPlay = () => {
    if (
      hiddenVideoRef.current &&
      (hiddenVideoRef.current as any).webkitShowPlaybackTargetPicker
    ) {
      try {
        (hiddenVideoRef.current as any).webkitShowPlaybackTargetPicker();
        setShowCastModal(false);
      } catch (e) {
        console.log('Airplay picker error:', e);
      }
    }
  };

  // Pantalla de bloqueo por sesión concurrente
  if (concurrencyError) {
    return (
      <div className="w-full aspect-video bg-black flex flex-col items-center justify-center p-6 text-center rounded-2xl border-2 border-red-600/70 shadow-2xl shadow-red-950/50 animate-fade-in font-mono">
        <div className="w-20 h-20 rounded-full bg-red-950/60 border border-red-600/50 flex items-center justify-center mb-5">
          <Lock className="w-10 h-10 text-red-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-red-500 text-xs uppercase tracking-widest font-black mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Control de Concurrencia</span>
        </div>
        <h3 className="text-2xl font-black text-white mb-2">Transmisión Pausada</h3>
        <p className="text-zinc-400 max-w-lg text-sm mb-6 leading-relaxed">
          {concurrencyError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-950 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reanudar en este dispositivo</span>
        </button>
      </div>
    );
  }

  // Si ocurre un error cargando el video, mostrar automáticamente el StreamPlaceholder
  if (playbackError) {
    return (
      <StreamPlaceholder
        matchTitle={matchTitle}
        matchDate={matchDate}
        onRetry={() => setPlaybackError(false)}
      />
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 relative group font-mono">
      {/* Elemento de video auxiliar para disparar Cast / AirPlay en navegadores Safari y Chrome */}
      <video
        ref={hiddenVideoRef}
        src={manifestUrl}
        preload="none"
        playsInline
        // @ts-ignore
        x-webkit-airplay="allow"
        className="hidden"
        aria-hidden="true"
      />

      {/* Barra de Controles y HUD Superior */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none flex-wrap">
        <div className="px-3 py-1.5 bg-red-600/90 backdrop-blur-md rounded-xl text-[11px] font-black uppercase text-white flex items-center gap-2 shadow-lg shadow-red-950/60 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>SEÑAL EN DIRECTO // HD</span>
        </div>

        {/* Botón: Transmitir a TV (Chromecast & AirPlay) */}
        <button
          onClick={() => setShowCastModal(true)}
          className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 backdrop-blur-md rounded-xl text-[11px] font-black uppercase text-amber-300 hover:text-white flex items-center gap-1.5 border border-amber-600/70 hover:border-amber-500 transition pointer-events-auto shadow-md shadow-amber-950/60 active:scale-95"
          title="Transmitir a Smart TV, Chromecast o Apple TV"
        >
          <Tv className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Transmitir a TV</span>
        </button>

        <button
          onClick={() => setReloadKey((prev) => prev + 1)}
          className="px-3 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 backdrop-blur-md rounded-xl text-[11px] font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-700 transition pointer-events-auto shadow-md active:scale-95"
          title="Recargar señal en directo"
        >
          <RefreshCw className="w-3 h-3 text-emerald-400" />
          <span>Recargar Señal</span>
        </button>

        <button
          onClick={() => {
            setUseAltCdn((prev) => !prev);
            setReloadKey((prev) => prev + 1);
          }}
          className="px-3 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 backdrop-blur-md rounded-xl text-[11px] font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-700 transition pointer-events-auto shadow-md active:scale-95"
          title="Alternar entre servidores de Cloudflare si tu proveedor bloquea la señal"
        >
          <span>{useAltCdn ? 'CDN: videodelivery' : 'CDN: stream'}</span>
        </button>

        {onBackToPlaceholder && (
          <button
            onClick={onBackToPlaceholder}
            className="px-3 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 backdrop-blur-md rounded-xl text-[11px] font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-700 transition pointer-events-auto"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Pantalla de Espera</span>
          </button>
        )}
      </div>

      {/* Reproductor de Video */}
      {isDirectVideo ? (
        <video
          controls
          autoPlay
          playsInline
          // @ts-ignore
          x-webkit-airplay="allow"
          src={streamSrc}
          onError={() => setPlaybackError(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <iframe
          key={`${reloadKey}-${useAltCdn}`}
          src={iframeSrc}
          title={matchTitle || "Transmisión en Vivo"}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; remote-playback; presentation"
          allowFullScreen
        />
      )}

      {/* Modal interactivo de transmisión a Smart TV, Chromecast y AirPlay */}
      <CastToTvModal
        isOpen={showCastModal}
        onClose={() => setShowCastModal(false)}
        streamUrl={manifestUrl}
        matchTitle={matchTitle}
        guestEmail={guestEmail}
        onTriggerChromecast={handleTriggerChromecast}
        onTriggerAirPlay={handleTriggerAirPlay}
        isAirPlaySupported={isAirPlaySupported}
        isCastSupported={isCastSupported}
      />
    </div>
  );
}
