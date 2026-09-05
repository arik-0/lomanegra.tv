'use client';

import { useState, useEffect } from 'react';
import { Loader2, CreditCard, ShieldCheck, Mail, Zap } from 'lucide-react';

interface CheckoutButtonProps {
  matchId: string;
  isUserLoggedIn?: boolean;
  userEmail?: string;
  onGuestEmailConfirmed?: (email: string) => void;
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

  useEffect(() => {
    // Recuperar correo de invitado previo si existe
    if (!isUserLoggedIn) {
      const savedEmail = localStorage.getItem('lomonegrotv_guest_email') || localStorage.getItem('lomanegratv_guest_email');
      if (savedEmail) {
        setGuestEmail(savedEmail);
      }
    }
  }, [isUserLoggedIn]);

  const handleBuy = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Si no está autenticado, validar que el correo sea válido
      if (!isUserLoggedIn) {
        if (!guestEmail || !guestEmail.includes('@') || !guestEmail.includes('.')) {
          setErrorMessage('Por favor ingresa un correo electrónico válido para recibir tu pase.');
          setLoading(false);
          return;
        }
        localStorage.setItem('lomonegrotv_guest_email', guestEmail.toLowerCase().trim());
        if (onGuestEmailConfirmed) {
          onGuestEmailConfirmed(guestEmail.toLowerCase().trim());
        }
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          guestEmail: isUserLoggedIn ? undefined : guestEmail.toLowerCase().trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar la compra.');
      }

      // Redirigir al Checkout Pro de Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('No se recibió la URL de pago de Mercado Pago.');
      }
    } catch (err: any) {
      console.error('Error en CheckoutButton:', err);
      setErrorMessage(err.message || 'Error al conectar con la pasarela de pagos.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 text-left">
      {errorMessage && (
        <div className="p-3 bg-red-950/70 border border-red-800 text-red-300 text-xs rounded-xl text-center font-mono">
          {errorMessage}
        </div>
      )}

      {/* Si es invitado, mostrar campo de correo electrónico */}
      {!isUserLoggedIn && (
        <div className="bg-[#121218] border border-white/[0.08] rounded-2xl p-4">
          <label className="block text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-red-500" />
              <span>Tu Correo Electrónico</span>
            </span>
            <span className="text-[9px] text-zinc-500 font-normal lowercase">
              (sin contraseña)
            </span>
          </label>
          <input
            type="email"
            required
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            className="w-full bg-black/70 border border-white/[0.1] focus:border-red-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-zinc-600 outline-none transition"
          />
          <p className="text-[10px] font-mono text-zinc-500 mt-2">
            El pase se asociará a este correo para ver la transmisión en directo.
          </p>
        </div>
      )}

      {isUserLoggedIn && userEmail && (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-[#121218] border border-white/[0.08] px-3.5 py-2 rounded-xl">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Usuario:</span>
          <strong className="text-white">{userEmail}</strong>
        </div>
      )}

      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-[0_4px_20px_rgba(255,255,255,0.12)] transition-all duration-200"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span className="font-mono">Conectando con Mercado Pago...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 text-black" />
            <span>Pagar Pase con Mercado Pago</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-500">
        <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
        <span>Pago seguro e instantáneo con Mercado Pago</span>
      </div>
    </div>
  );
}
