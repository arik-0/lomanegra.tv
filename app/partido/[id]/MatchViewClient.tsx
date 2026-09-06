'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import StreamPlayerWrapper from './StreamPlayerWrapper';
import CheckoutButton from './CheckoutButton';
import SimulatePurchaseButton from './SimulatePurchaseButton';
import CountdownTimer from '@/components/CountdownTimer';
import SponsorsStrip from '@/components/SponsorsStrip';
import {
  Calendar,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  KeyRound,
  Tv,
  ArrowRight,
  Info,
  Clock,
} from 'lucide-react';

interface MatchViewClientProps {
  match: {
    id: string;
    title: string;
    description: string | null;
    date: string | null;
    price: number;
    image_url: string | null;
    cloudflare_live_input_uid: string;
    is_date_confirmed?: boolean;
  };
  serverHasPaid: boolean;
  currentUserEmail: string | null;
  paymentStatus?: string;
  queryGuestEmail?: string;
}

export default function MatchViewClient({
  match,
  serverHasPaid,
  currentUserEmail,
  paymentStatus,
  queryGuestEmail,
}: MatchViewClientProps) {
  const [hasPaid, setHasPaid] = useState(serverHasPaid);
  const [activeGuestEmail, setActiveGuestEmail] = useState<string | null>(
    queryGuestEmail || null
  );
  const [showRestoreInput, setShowRestoreInput] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState('');
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  // Al cargar, verificar si hay aprobación local previa o retorno exitoso de pasarela
  useEffect(() => {
    const isLocallyApproved =
      localStorage.getItem(`lomonegrotv_approved_${match.id}`) === 'true';

    if (isLocallyApproved || paymentStatus === 'success') {
      setHasPaid(true);
      localStorage.setItem(`lomonegrotv_approved_${match.id}`, 'true');
      const email =
        queryGuestEmail ||
        localStorage.getItem('lomonegrotv_guest_email') ||
        'invitado@pasionlomonegra.com';
      setActiveGuestEmail(email);
      return;
    }

    if (!serverHasPaid && !currentUserEmail) {
      const emailToCheck =
        queryGuestEmail ||
        localStorage.getItem('lomonegrotv_guest_email') ||
        localStorage.getItem('lomanegratv_guest_email');
      if (emailToCheck) {
        verifyGuestEmail(emailToCheck);
      }
    }
  }, [match.id, serverHasPaid, currentUserEmail, queryGuestEmail, paymentStatus]);

  const verifyGuestEmail = async (email: string) => {
    try {
      setRestoreLoading(true);
      setRestoreMessage(null);
      const res = await fetch('/api/auth/guest-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.id, email }),
      });

      const data = await res.json();
      if (res.ok && data.hasAccess) {
        setHasPaid(true);
        setActiveGuestEmail(email);
        localStorage.setItem('lomonegrotv_guest_email', email);
        setRestoreMessage({
          type: 'success',
          text: `¡Pase encontrado para ${email}! Acceso habilitado.`,
        });
      } else {
        if (showRestoreInput) {
          setRestoreMessage({
            type: 'error',
            text: 'No encontramos un pase activo con este correo para este partido.',
          });
        }
      }
    } catch {
      if (showRestoreInput) {
        setRestoreMessage({
          type: 'error',
          text: 'Error de conexión al consultar el pase.',
        });
      }
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleManualRestore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreEmail || !restoreEmail.includes('@')) {
      setRestoreMessage({
        type: 'error',
        text: 'Por favor ingresa un correo válido.',
      });
      return;
    }
    verifyGuestEmail(restoreEmail.toLowerCase().trim());
  };

  const isDateConfirmed = match.is_date_confirmed !== false && !!match.date;
  const matchDate = isDateConfirmed && match.date
    ? new Date(match.date).toLocaleString('es-AR', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : 'Fecha y horario a confirmar';

  return (
    <div className="space-y-8">
      {/* Alertas de Retorno de Pago Mercado Pago */}
      {paymentStatus === 'success' && !hasPaid && (
        <div className="p-4 rounded-2xl bg-[#0c0c10] border border-red-600/70 flex items-start gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-white font-mono">¡Pago recibido en Mercado Pago!</p>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Activando tu señal en vivo. Si no inicia en unos segundos, recarga la página.
            </p>
          </div>
        </div>
      )}

      {/* ENCABEZADO Y REPRODUCTOR O CHECKOUT */}
      {hasPaid ? (
        /* VISTA: REPRODUCTOR ACTIVO ESTILO FORG1 CON ESQUINAS HUD */
        <div className="space-y-6 animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0c10] shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
            {/* Escuadras HUD sobre el visor */}
            <span className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-red-500/60 z-30 pointer-events-none" />
            <span className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-red-500/60 z-30 pointer-events-none" />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-red-500/60 z-30 pointer-events-none" />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-red-500/60 z-30 pointer-events-none" />

            <StreamPlayerWrapper
              matchId={match.id}
              guestEmail={activeGuestEmail || undefined}
              matchTitle={match.title}
              matchDate={matchDate}
            />
          </div>

          <div className="bg-[#0c0c10] border border-white/[0.07] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-950/70 border border-red-600 text-red-400 text-xs font-mono font-black uppercase tracking-wider">
                  <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>EN VIVO // SEÑAL OFICIAL</span>
                </span>
                <span className="text-xs font-mono text-zinc-400 capitalize">{matchDate}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{match.title}</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed font-mono">
                {match.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0 font-mono">
              <div className="flex items-center gap-2 text-xs text-zinc-300 bg-[#121218] border border-white/[0.08] px-4 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span className="truncate max-w-[200px]">
                  {currentUserEmail
                    ? `Pase: ${currentUserEmail}`
                    : `Invitado: ${activeGuestEmail}`}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">Sesión simultánea única protegida</span>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA: INFORMACIÓN DEL PARTIDO Y CHECKOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Gráfica del Partido, Cuenta Regresiva e Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Banner de Encuadre del Partido con HUD Corners */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0c0c10] border border-white/[0.08] shadow-2xl group">
              {/* Escuadras HUD */}
              <span className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-red-500/50 z-20 pointer-events-none" />
              <span className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-red-500/50 z-20 pointer-events-none" />
              <span className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-red-500/50 z-20 pointer-events-none" />
              <span className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-red-500/50 z-20 pointer-events-none" />

              {match.image_url ? (
                <div className="relative w-full aspect-video sm:aspect-[16/9] overflow-hidden bg-black flex items-center justify-center">
                  <Image
                    src={match.image_url}
                    alt={match.title}
                    fill
                    priority
                    className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-[#0c0c10] flex items-center justify-center p-8">
                  <Tv className="w-16 h-16 text-zinc-700" />
                </div>
              )}

              {/* Superposición con badge técnico */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-red-600/90 backdrop-blur-md text-white text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-950">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>TRANSMISIÓN EN DIRECTO</span>
                </span>
              </div>
            </div>

            {/* Ficha Técnica del Partido */}
            <div className="bg-[#0c0c10] border border-white/[0.07] rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-3.5 py-1.5 rounded-lg w-fit mb-4">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                <span className="capitalize">{matchDate}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                {match.title}
              </h1>

              {match.title.toLowerCase().includes('blanco y negro') && (
                <div className="flex items-center gap-4 sm:gap-6 bg-[#121218] border border-white/[0.08] px-4 py-2.5 rounded-2xl w-fit mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 relative drop-shadow">
                      <Image
                        src="/teams/blanco-y-negro.png"
                        alt="Blanco y Negro"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white">
                      Blanco y Negro
                    </span>
                  </div>

                  <span className="px-2 py-0.5 bg-red-600/90 text-white rounded-md font-mono font-black text-[10px] uppercase shadow">
                    VS
                  </span>

                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 relative drop-shadow">
                      <Image
                        src="/teams/ifc.png"
                        alt="I. F. C."
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white">
                      I. F. C.
                    </span>
                  </div>
                </div>
              )}

              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-mono">
                {match.description ||
                  'No te pierdas cada detalle de este gran partido. Transmisión multicámara en alta definición con relatos oficiales.'}
              </p>

              {/* Cuenta Regresiva o Estado de Programación */}
              <div className="pt-5 border-t border-white/[0.06]">
                {isDateConfirmed && match.date ? (
                  <>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-3">
                      Tiempo Restante para el Kickoff:
                    </span>
                    <CountdownTimer targetDate={match.date} />
                  </>
                ) : (
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block mb-2">
                      ESTADO DE PROGRAMACIÓN:
                    </span>
                    <div className="bg-[#121218] border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-600/50 flex items-center justify-center text-amber-400 shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-mono font-black text-sm text-white">FECHA Y HORARIO A DEFINIR</div>
                        <div className="text-xs text-zinc-400 font-mono mt-0.5">
                          La programación oficial aún no fue fijada por los clubes.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Compra Estilo Forg1 */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#0c0c10] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-5 border-b border-white/[0.07] mb-5">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">
                    Pase de Acceso Directo
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                    ${Number(match.price).toLocaleString('es-AR')}{' '}
                    <span className="text-xs font-bold text-red-500">ARS</span>
                  </div>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-red-950/50 border border-red-800/60 flex items-center justify-center text-red-500">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              {isDateConfirmed ? (
                <>
                  <p className="text-xs font-mono text-zinc-400 mb-6 leading-relaxed">
                    Adquiere tu pase al instante con <strong>Mercado Pago</strong> sin necesidad de crear cuenta, o ingresando con tu usuario si ya estás registrado.
                  </p>

                  {/* Botón de Checkout con soporte de invitado */}
                  <CheckoutButton
                    matchId={match.id}
                    isUserLoggedIn={!!currentUserEmail}
                    userEmail={currentUserEmail || undefined}
                    onGuestEmailConfirmed={(email) => setActiveGuestEmail(email)}
                  />
                </>
              ) : (
                <div className="space-y-4 mb-2">
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-600/30 text-xs font-mono text-amber-300 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <span className="font-bold block text-white mb-0.5">Venta no habilitada</span>
                      Las entradas para este encuentro se pondrán a la venta inmediatamente al confirmarse la fecha y horario oficial.
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 border border-amber-800/40 text-amber-400/80 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Fecha a Confirmar — Compra Inhabilitada</span>
                  </button>
                </div>
              )}

              {/* Opción de Restaurar Pase para Invitados */}
              {!currentUserEmail && (
                <div className="mt-5 pt-5 border-t border-white/[0.07]">
                  {!showRestoreInput ? (
                    <button
                      onClick={() => setShowRestoreInput(true)}
                      className="w-full flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition py-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-red-500" />
                      <span>¿Ya compraste como invitado? Recuperar pase</span>
                    </button>
                  ) : (
                    <form onSubmit={handleManualRestore} className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-300 font-bold flex items-center gap-1.5 text-[11px]">
                          <Mail className="w-3.5 h-3.5 text-red-500" />
                          <span>Ingresa el email de compra:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowRestoreInput(false)}
                          className="text-[10px] text-zinc-500 hover:text-white"
                        >
                          Cerrar
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="email"
                          required
                          value={restoreEmail}
                          onChange={(e) => setRestoreEmail(e.target.value)}
                          placeholder="tu@email.com"
                          className="flex-1 bg-black/60 border border-white/[0.1] focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder-zinc-600 outline-none"
                        />
                        <button
                          type="submit"
                          disabled={restoreLoading}
                          className="px-4 py-2 bg-white text-black hover:bg-zinc-200 active:scale-95 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1"
                        >
                          {restoreLoading ? (
                            'Buscando...'
                          ) : (
                            <>
                              <span>Ver</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>

                      {restoreMessage && (
                        <p
                          className={`text-[11px] font-mono ${
                            restoreMessage.type === 'error'
                              ? 'text-red-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {restoreMessage.text}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              )}

              {/* Botón de Desarrollo para simular pase */}
              <SimulatePurchaseButton
                matchId={match.id}
                onSimulated={(email) => {
                  setHasPaid(true);
                  setActiveGuestEmail(email);
                }}
              />
            </div>

            {/* Garantías de Seguridad */}
            <div className="bg-[#0c0c10] border border-white/[0.07] rounded-2xl p-4 flex items-start gap-3 text-xs font-mono text-zinc-400">
              <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>
                Acceso exclusivo a la transmisión multicámara en HD. Control de concurrencia de 1 pantalla activa.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Espacio Oficial de Patrocinadores de la Transmisión */}
      <div className="pt-4">
        <SponsorsStrip />
      </div>
    </div>
  );
}
