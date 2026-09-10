'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Loader2, ShieldCheck, Mail, Zap, ExternalLink, CheckCircle2 } from 'lucide-react';

declare global {
  interface Window {
    MercadoPago?: any;
  }
}

interface CheckoutButtonProps {
  matchId: string;
  isUserLoggedIn?: boolean;
  userEmail?: string;
  onGuestEmailConfirmed?: (email: string) => void;
}

// Icono oficial estilizado de Mercado Pago
function MercadoPagoHandshakeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="32" rx="6" fill="#009EE3" />
      <path
        d="M33 13.5c-.7-.7-1.7-.8-2.5-.3l-3.8 2.2-2.4-2.4c-.9-.9-2.3-.9-3.2 0l-5.4 5.4c-.9.9-.9 2.3 0 3.2l1.6 1.6c.9.9 2.3.9 3.2 0l3.8-3.8 2.4 2.4c.9.9 2.3.9 3.2 0l5.4-5.4c.9-.9.9-2.3 0-3.2l-2.3-1.7z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function CheckoutButton({
  matchId,
  isUserLoggedIn = false,
  userEmail,
  onGuestEmailConfirmed,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [sdkReady, setSdkReady] = useState(false);
  const [lastInitPoint, setLastInitPoint] = useState<string | null>(null);

  useEffect(() => {
    // Recuperar correo de invitado previo si existe
    if (!isUserLoggedIn) {
      const savedEmail =
        localStorage.getItem('lomonegrotv_guest_email') ||
        localStorage.getItem('lomanegratv_guest_email');
      if (savedEmail) {
        setGuestEmail(savedEmail);
      }
    }
  }, [isUserLoggedIn]);

  const handleBuy = async (preferRedirect = false) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setLastInitPoint(null);

      // Validar correo si el usuario compra como invitado
      if (!isUserLoggedIn) {
        if (!guestEmail || !guestEmail.includes('@') || !guestEmail.includes('.')) {
          setErrorMessage('Por favor ingresa un correo electrónico válido para asociar tu pase.');
          setLoading(false);
          return;
        }
        localStorage.setItem('lomonegrotv_guest_email', guestEmail.toLowerCase().trim());
        if (onGuestEmailConfirmed) {
          onGuestEmailConfirmed(guestEmail.toLowerCase().trim());
        }
      }

      const resolvedEmail = (isUserLoggedIn && userEmail ? userEmail : guestEmail)?.toLowerCase()?.trim();

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          guestEmail: resolvedEmail,
          userEmail: userEmail || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al conectar con Mercado Pago Checkout Pro.');
      }

      setLastInitPoint(data.init_point);

      // Redirección directa e infalible al portal oficial de Mercado Pago Checkout Pro
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('No se recibió el enlace de pago de Mercado Pago.');
      }
    } catch (err: any) {
      console.error('Error en Checkout Pro:', err);
      setErrorMessage(err.message || 'Error al conectar con la pasarela de Mercado Pago.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Script oficial de Mercado Pago SDK v2 */}
      <Script
        src="https://sdk.mercadopago.com/js/v2"
        strategy="lazyOnload"
        onLoad={() => setSdkReady(true)}
      />

      <div className="w-full space-y-4 text-left font-mono">
        {errorMessage && (
          <div className="p-3.5 bg-red-950/80 border border-red-700 text-red-300 text-xs rounded-2xl text-center shadow-lg">
            {errorMessage}
          </div>
        )}

        {/* Formulario de Email para Invitados */}
        {!isUserLoggedIn && (
          <div className="bg-[#121218] border border-white/[0.08] rounded-2xl p-4">
            <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>Tu Correo Electrónico para el Pase</span>
              </span>
              <span className="text-[9px] text-zinc-500 font-normal lowercase">
                (sin contraseña ni registro)
              </span>
            </label>
            <input
              type="email"
              required
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full bg-black/70 border border-white/[0.1] focus:border-[#009ee3] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 outline-none transition"
            />
            <p className="text-[10px] text-zinc-500 mt-2">
              El acceso a la transmisión se activará automáticamente para este correo al confirmarse el pago.
            </p>
          </div>
        )}

        {/* Indicador de Usuario Registrado */}
        {isUserLoggedIn && userEmail && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-[#121218] border border-white/[0.08] px-3.5 py-2 rounded-xl">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Comprando como:</span>
            <strong className="text-white">{userEmail}</strong>
          </div>
        )}

        {/* Botón Principal Oficial Mercado Pago Checkout Pro */}
        <button
          onClick={() => handleBuy(false)}
          disabled={loading}
          className="w-full group relative overflow-hidden flex items-center justify-center gap-3 bg-[#009ee3] hover:bg-[#0081ba] active:scale-[0.98] disabled:opacity-50 text-white font-black text-xs sm:text-sm uppercase tracking-wider py-4 px-6 rounded-2xl shadow-[0_4px_25px_rgba(0,158,227,0.35)] transition-all duration-200 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Conectando con Mercado Pago...</span>
            </>
          ) : (
            <>
              <MercadoPagoHandshakeIcon className="w-6 h-4 shrink-0 shadow-sm" />
              <span>Pagar con Mercado Pago</span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-md font-bold tracking-normal">
                Checkout Pro
              </span>
            </>
          )}
        </button>

        {/* Si el navegador bloqueó la ventana emergente, botón de enlace directo */}
        {lastInitPoint && (
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-700 text-center text-xs space-y-1">
            <span className="text-zinc-300 block">¿No se abrió la ventana de pago?</span>
            <a
              href={lastInitPoint}
              className="inline-flex items-center gap-1.5 text-[#009ee3] hover:underline font-bold"
            >
              <span>Continuar en Mercado Pago</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Desglose de Medios de Pago Aceptados con Checkout Pro */}
        <div className="bg-[#0f1015] border border-white/[0.06] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider border-b border-white/[0.05] pb-2">
            <span>Medios de Pago Habilitados</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Acreditación Inmediata</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-[11px] text-zinc-300">
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/[0.04]">
              <span className="text-sm">💳</span>
              <div>
                <strong className="block text-white text-[11px]">Débito y Crédito</strong>
                <span className="text-[9px] text-zinc-500">Visa, Mastercard, Cabal</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/[0.04]">
              <span className="text-sm">📱</span>
              <div>
                <strong className="block text-white text-[11px]">Dinero en Cuenta</strong>
                <span className="text-[9px] text-zinc-500">Saldo Mercado Pago</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/[0.04]">
              <span className="text-sm">⚡</span>
              <div>
                <strong className="block text-white text-[11px]">Mercado Crédito</strong>
                <span className="text-[9px] text-zinc-500">Cuotas sin tarjeta</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/[0.04]">
              <span className="text-sm">💵</span>
              <div>
                <strong className="block text-white text-[11px]">Efectivo</strong>
                <span className="text-[9px] text-zinc-500">Pago Fácil y Rapipago</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-1 border-t border-white/[0.04]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#009ee3]" />
            <span>Transacción segura y encriptada por Mercado Pago Argentina</span>
          </div>
        </div>
      </div>
    </>
  );
}
