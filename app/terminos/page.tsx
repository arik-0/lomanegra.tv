'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Lock,
  CreditCard,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileText,
  Clock,
  Radio,
} from 'lucide-react';

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#0d0e12] text-white px-4 py-8 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabecera y Navegación */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver a la transmisión en vivo</span>
          </Link>

          <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-red-500 font-bold">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>MARCO LEGAL // PASIÓN LOMONEGRA PPV</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Términos y Condiciones del Servicio
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Condiciones generales de uso, contratación de pases por partido (Pay-Per-View) y acceso a las señales exclusivas de Pasión Lomonegra para las transmisiones del Club Atlético Blanco y Negro y la Liga Deportiva del Sur.
            </p>
            <div className="flex items-center gap-4 text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
              <span>Última actualización: Septiembre 2026</span>
              <span>&bull;</span>
              <span>Versión 1.2 Oficial</span>
            </div>
          </div>
        </div>

        {/* Bloques de Términos */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-zinc-300 font-sans">
          {/* 1. Objeto */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <span className="text-red-500 font-bold font-mono">01.</span>
              <span>Naturaleza y Objeto del Servicio</span>
            </h2>
            <p>
              Pasión Lomonegra proporciona un servicio digital de streaming en directo y bajo demanda (VOD) orientado a la difusión periodística y deportiva de los encuentros del Club Atlético Blanco y Negro en el marco de la <strong>Liga Deportiva del Sur</strong>, torneos regionales y eventos especiales asociados.
            </p>
            <p>
              El acceso a cada transmisión se comercializa bajo la modalidad Pay-Per-View (pago por evento) o mediante membresías habilitadas por el medio oficial.
            </p>
          </section>

          {/* 2. Compras y Mercado Pago */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span className="text-red-500 font-bold font-mono">02.</span>
              <span>Precios, Facturación y Pagos Seguros</span>
            </h2>
            <p>
              Todos los precios de los pases están expresados en Pesos Argentinos ($ ARS) e incluyen los tributos aplicables. Los cobros son procesados de forma encriptada e inmediata a través de la pasarela oficial de <strong>Mercado Pago</strong> (MercadoLibre S.R.L.).
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs sm:text-sm pl-2">
              <li>Se aceptan tarjetas de crédito, débito, dinero en cuenta de Mercado Pago y transferencias bancarias instantáneas.</li>
              <li>Una vez confirmado el pago por la pasarela, la señal queda inmediatamente desbloqueada para la dirección de correo electrónico informada al momento de la compra.</li>
              <li>El usuario puede solicitar su comprobante digital en cualquier momento indicando el identificador de operación.</li>
            </ul>
          </section>

          {/* 3. Control de Concurrencia y Sesión Única */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-bold font-mono">03.</span>
              <span>Acceso Personal y Protección de Sesión Simultánea</span>
            </h2>
            <p>
              Cada pase adquirido otorga derecho a una <strong>(1) única transmisión simultánea</strong> por cuenta o correo de invitado.
            </p>
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/60 text-xs text-red-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5 font-mono uppercase">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Control Anti-Retransmisión Concurrente</span>
              </p>
              <p>
                Si se detecta la apertura de la señal en un segundo dispositivo o navegador con el mismo pase, el sistema pausará automáticamente la primera reproducción para salvaguardar la cuenta y garantizar el uso personal del comprador.
              </p>
            </div>
          </section>

          {/* 4. Propiedad Intelectual */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="text-red-500 font-bold font-mono">04.</span>
              <span>Propiedad Intelectual y Derechos de Imagen</span>
            </h2>
            <p>
              Las imágenes, relatos, comentarios en vivo, gráficos, marcas, logotipo de Pasión Lomonegra y producciones audiovisuales son propiedad exclusiva del medio o de sus respectivos titulares.
            </p>
            <p className="text-zinc-400 text-xs">
              Queda estrictamente prohibida la retransmisión no autorizada, captura masiva, reemisión en plataformas públicas (YouTube, Twitch, TikTok, Facebook Live, etc.) o explotación comercial no consentida por escrito por Pasión Lomonegra.
            </p>
          </section>

          {/* 5. Requisitos de Red y Disponibilidad */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="text-red-500 font-bold font-mono">05.</span>
              <span>Requisitos de Conexión y Calidad de Señal</span>
            </h2>
            <p>
              Para disfrutar de la transmisión en alta definición (Full HD 1080p / 60 FPS), se recomienda una conexión a internet de banda ancha estable no inferior a <strong>10 Mbps</strong> de bajada.
            </p>
            <p className="text-zinc-400 text-xs">
              Pasión Lomonegra implementa servidores CDN globales de baja latencia con encriptación RSA-256 para asegurar la mayor estabilidad durante todo el partido.
            </p>
          </section>

          {/* 6. Cancelaciones y Reanudaciones */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-red-500 font-bold font-mono">06.</span>
              <span>Reprogramaciones y Políticas de Reembolso</span>
            </h2>
            <p>
              En caso de suspensión o postergación del partido por factores climáticos, decisiones arbitrales o de la Liga Deportiva del Sur, <strong>el pase adquirido conservará total validez</strong> para la fecha u horario de reprogramación oficial establecido.
            </p>
            <p className="text-zinc-400 text-xs">
              Ante imposibilidad técnica definitiva de emisión imputable a la plataforma, el usuario tendrá derecho a la devolución íntegra del importe abonado o a su acreditación para el siguiente cotejo.
            </p>
          </section>

          {/* 7. Contacto y Soporte */}
          <section className="bg-gradient-to-br from-red-950/40 via-[#12131a] to-[#12131a] border border-red-800/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-bold font-mono">07.</span>
              <span>Canales Oficiales de Atención al Usuario</span>
            </h2>
            <p>
              Ante cualquier consulta sobre tu compra, pase o acceso a la transmisión, nuestro equipo está a tu disposición en:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Correo de Soporte:</span>
                <span className="text-white font-bold">contacto@pasionlomonegra.com</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Canal de YouTube:</span>
                <span className="text-red-400 font-bold">@PasionlomonegraByN</span>
              </div>
            </div>
          </section>
        </div>

        {/* Botón de retorno al inicio */}
        <div className="text-center pt-4 pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider shadow-lg transition"
          >
            <ArrowLeft className="w-4 h-4 text-red-600" />
            <span>Ir a la Transmisión en Vivo</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
