'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface SimulatePurchaseButtonProps {
  matchId: string;
  onSimulated?: (email: string) => void;
}

export default function SimulatePurchaseButton({
  matchId,
  onSimulated,
}: SimulatePurchaseButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    try {
      setLoading(true);
      const guestEmail =
        localStorage.getItem('lomonegrotv_guest_email') ||
        localStorage.getItem('lomanegratv_guest_email') ||
        'invitado@pasionlomonegra.com';

      // 1. Guardar de inmediato en localStorage para activar el visor sin depender de la red
      localStorage.setItem(`lomonegrotv_approved_${matchId}`, 'true');
      localStorage.setItem('lomonegrotv_guest_email', guestEmail);

      // 2. Notificar al servidor en segundo plano (silencioso)
      try {
        await fetch('/api/dev/simulate-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId, guestEmail }),
        });
      } catch {
        // Ignorar fallos de red durante la simulación de pruebas
      }

      // 3. Activar el reproductor de inmediato
      if (onSimulated) {
        onSimulated(guestEmail);
      } else {
        window.location.reload();
      }
    } catch {
      // Fallback garantizado: recargar para aplicar localStorage
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.07]">
      <button
        onClick={handleSimulate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-dashed border-white/[0.12] text-zinc-400 hover:text-white text-[11px] font-mono transition active:scale-95"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span>[Modo Dev] Simular Pase Aprobado (Sin pagar)</span>
      </button>
    </div>
  );
}
