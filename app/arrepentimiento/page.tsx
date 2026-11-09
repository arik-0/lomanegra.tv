'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Scale,
} from 'lucide-react';

export default function ArrepentimientoPage() {
  const [email, setEmail] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [matchName, setMatchName] = useState('');
  const [reason, setReason] = useState('');
  const [ticketCode, setTicketCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !paymentId.trim()) return;

    // Generar código de gestión alfanumérico inmediato (Resolución 424/2020 SCI)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setTicketCode(`REV-${new Date().getFullYear()}-${randomNum}`);
  };

  return (
    <main className="min-h-screen bg-[#0d0e12] text-white px-4 py-8 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Volver al inicio</span>
        </Link>

        <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>DEFENSA DEL CONSUMIDOR // LEY N° 24.240 ART. 34</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Botón de Arrepentimiento
          </h1>

          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            En cumplimiento del Artículo 34 de la Ley N° 24.240 de Defensa del Consumidor y la Resolución 424/2020 de la Secretaría de Comercio Interior, podés solicitar la revocación de la compra de tu pase dentro de los diez (10) días corridos de efectuada la operación, <strong>siempre que la transmisión en vivo del partido no haya comenzado ni el pase haya sido utilizado</strong> (conforme al Art. 1116 del Código Civil y Comercial de la Nación para contenidos digitales de ejecución inmediata).
          </p>

          {ticketCode ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black text-white">
                  Solicitud Registrada Correctamente
                </h2>
                <p className="text-xs text-zinc-300 font-sans">
                  Conforme a la Resolución 424/2020, tu número de identificación de trámite de revocación es:
                </p>
              </div>
              <div className="py-3 px-4 bg-black border border-emerald-500/40 rounded-xl text-2xl font-black text-emerald-400 tracking-widest">
                {ticketCode}
              </div>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Guarda este código como constancia. Procesaremos el reintegro a través de <strong>Mercado Pago</strong> al mismo medio de pago utilizado para el correo <strong>{email}</strong> dentro de las próximas 24 a 72 horas hábiles.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Volver a Pasión Lomonegra
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                  Correo Electrónico de la Compra *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu-correo@ejemplo.com"
                  className="w-full bg-black border border-zinc-700 focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                  Número de Operación / Comprobante de Mercado Pago *
                </label>
                <input
                  type="text"
                  required
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="Ej: 89412398412"
                  className="w-full bg-black border border-zinc-700 focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                  Partido Adquirido
                </label>
                <input
                  type="text"
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  placeholder="Ej: Blanco y Negro vs Rival"
                  className="w-full bg-black border border-zinc-700 focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-1.5">
                  Motivo o Comentario (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej: Compré por error para otra fecha..."
                  className="w-full bg-black border border-zinc-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition resize-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-2.5 text-[11px] text-zinc-400 font-sans">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Al confirmar la revocación, el pase asociado a este partido quedará deshabilitado de forma inmediata para dar curso al reintegro en Mercado Pago.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Solicitar Revocación y Reembolso</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
