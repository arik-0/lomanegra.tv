'use client';

import { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketSent, setTicketSent] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      q: '¿Compré como invitado y no inicia la transmisión?',
      a: 'Haz clic en "Recuperar pase" e ingresa exactamente el mismo correo electrónico que utilizaste al abonar en Mercado Pago.',
    },
    {
      q: '¿En cuántas pantallas puedo mirar en simultáneo?',
      a: 'Cada pase digital habilita 1 pantalla activa en simultáneo con control de concurrencia seguro.',
    },
    {
      q: '¿Cuánto demora la acreditación de Mercado Pago?',
      a: 'Las transferencias, tarjetas de débito/crédito y saldo en cuenta de Mercado Pago se acreditan de forma inmediata.',
    },
  ];

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !email) return;
    setTicketSent(true);
    setTimeout(() => {
      setMessage('');
      setEmail('');
      setTicketSent(false);
      setIsOpen(false);
    }, 3000);
  };

  const whatsappUrl =
    'https://wa.me/5491130000000?text=' +
    encodeURIComponent(
      'Hola, necesito asistencia técnica con una transmisión en vivo en Pasión Lomonegra.'
    );

  return (
    <>
      {/* Botón Flotante de Soporte */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir chat de soporte"
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#0c0c10] hover:bg-zinc-900 border border-red-500/50 hover:border-red-500 text-white rounded-full shadow-[0_8px_30px_rgba(220,38,38,0.25)] active:scale-95 transition-all duration-200"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>

          <MessageSquare className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider hidden sm:inline">
            Soporte en Vivo
          </span>
        </button>
      </div>

      {/* Ventana Modal / Consola de Soporte */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] max-h-[560px] flex flex-col bg-[#0c0c10] border border-white/[0.1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden animate-fade-in font-mono">
          {/* Header */}
          <div className="p-4 bg-[#121218] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-white uppercase tracking-wider">
                  Mesa de Ayuda
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Operadores en línea</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Scrollable */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[460px] text-xs">
            {/* Botón Destacado WhatsApp */}
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-[#0c0c10] border border-emerald-600/50 hover:border-emerald-500 text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black text-base shrink-0 group-hover:scale-105 transition-transform">
                    WA
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-400">
                      Atención Directa WhatsApp
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Respuesta inmediata en minutos
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Soluciones Inmediatas / FAQs */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1">
                Soluciones Frecuentes
              </div>
              <div className="space-y-1.5">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-white/[0.06] rounded-xl overflow-hidden bg-black/40"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-2.5 flex items-center justify-between gap-2 text-zinc-300 hover:text-white transition"
                    >
                      <span className="text-[11px] font-bold">{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${
                          openFaq === idx ? 'rotate-180 text-red-500' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-2.5 pt-0 text-[10px] text-zinc-400 leading-relaxed border-t border-white/[0.04] bg-white/[0.01]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario de Mensaje Rápido */}
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-1 mb-2">
                Enviar Mensaje a Producción
              </div>

              {ticketSent ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Mensaje recibido! Te contactaremos a la brevedad.</span>
                </div>
              ) : (
                <form onSubmit={handleSendTicket} className="space-y-2.5">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo de contacto"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/[0.08] focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Describe tu consulta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-black/60 border border-white/[0.08] focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-white text-black hover:bg-zinc-200 active:scale-95 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Consulta</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-[#060608] border-t border-white/[0.06] text-center text-[9px] text-zinc-600 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-red-500" />
            <span>Pasión Lomonegra • Asistencia Técnica Oficial</span>
          </div>
        </div>
      )}
    </>
  );
}
