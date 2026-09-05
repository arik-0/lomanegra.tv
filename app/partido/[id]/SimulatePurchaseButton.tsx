'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';

export default function SimulatePurchaseButton({ matchId }: { matchId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSimulate = async () => {
    try {
      setLoading(true);
      const guestEmail =
        localStorage.getItem('lomonegrotv_guest_email') ||
        localStorage.getItem('lomanegratv_guest_email') ||
        'invitado@lomonegrotv.com';

      const res = await fetch('/api/dev/simulate-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, guestEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.guestEmail) {
          localStorage.setItem('lomonegrotv_guest_email', data.guestEmail);
        }
        window.location.reload();
      } else {
        alert(data.error || 'Error al simular pase');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.07]">
      <button
        onClick={handleSimulate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-dashed border-white/[0.12] text-zinc-400 hover:text-white text-[11px] font-mono transition"
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
