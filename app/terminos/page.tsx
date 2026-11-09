import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Lock,
  CreditCard,
  AlertCircle,
  HelpCircle,
  FileText,
  Clock,
  Radio,
  Scale,
  Smartphone,
  RotateCcw,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones del Servicio',
  description:
    'Condiciones generales de uso, contratación de pases por partido (Pay-Per-View), normativa legal argentina y acceso a las señales de Pasión Lomonegra.',
  robots: {
    index: true,
    follow: true,
  },
};

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
              <span>MARCO LEGAL OFICIAL // PASIÓN LOMONEGRA PPV</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Términos y Condiciones del Servicio
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Condiciones generales de uso, contratación de pases por partido (Pay-Per-View), licencias de aplicaciones móviles y Smart TV, y acceso a las señales exclusivas de Pasión Lomonegra para las transmisiones del Club Atlético Blanco y Negro y la Liga Deportiva del Sur.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
              <span>Última actualización: Noviembre 2026</span>
              <span>&bull;</span>
              <span>Versión 2.0 Oficial (República Argentina)</span>
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
              Pasión Lomonegra proporciona un servicio digital de streaming en directo y bajo demanda (VOD) orientado a la difusión periodística y deportiva de los encuentros del Club Atlético Blanco y Negro en el marco de la <strong>Liga Deportiva del Sur (LDDS)</strong>, la Liga Cañadense de Hockey (LCUH), torneos regionales y eventos especiales asociados.
            </p>
            <p>
              El acceso a cada transmisión se comercializa bajo la modalidad Pay-Per-View (pago por evento individual) para uso estrictamente personal, doméstico y no comercial.
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
              Todos los precios de los pases están expresados en Pesos Argentinos ($ ARS) e incluyen los impuestos aplicables. Los cobros son procesados de forma encriptada e inmediata en la web a través de la pasarela oficial de <strong>Mercado Pago</strong> (MercadoLibre S.R.L.).
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs sm:text-sm pl-2">
              <li>Se aceptan tarjetas de crédito, débito, dinero en cuenta de Mercado Pago y transferencias bancarias instantáneas.</li>
              <li>Una vez confirmado el pago por la pasarela, la señal queda inmediatamente desbloqueada para la dirección de correo electrónico informada al momento de la compra.</li>
              <li>Las aplicaciones oficiales para Android TV y dispositivos móviles funcionan bajo la modalidad de consumo y vinculación de pase adquirido previamente en la plataforma web.</li>
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
              Cada pase adquirido otorga derecho a una <strong>(1) única transmisión simultánea</strong> por cuenta o correo de invitado, ya sea en navegador web, celular o Smart TV.
            </p>
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/60 text-xs text-red-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5 font-mono uppercase">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Control Anti-Retransmisión Concurrente</span>
              </p>
              <p>
                Si se detecta la apertura de la señal en un segundo dispositivo con el mismo pase, el sistema pausará automáticamente la primera reproducción para salvaguardar la cuenta y garantizar el uso personal del comprador.
              </p>
            </div>
          </section>

          {/* 4. Propiedad Intelectual (Ley 11.723) */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="text-red-500 font-bold font-mono">04.</span>
              <span>Propiedad Intelectual y Prohibición de Retransmisión (Ley N° 11.723)</span>
            </h2>
            <p>
              Las imágenes, relatos, comentarios en vivo, gráficos, tablas interactivas, marcas, logotipo de Pasión Lomonegra y producciones audiovisuales se encuentran protegidos por la <strong>Ley N° 11.723 de Régimen Legal de la Propiedad Intelectual</strong> de la República Argentina.
            </p>
            <p className="text-zinc-400 text-xs">
              Queda estrictamente prohibida la retransmisión no autorizada, captura de pantalla en video, distribución de enlaces firmados, reemisión en plataformas públicas (YouTube, Twitch, TikTok, Facebook Live, Instagram, etc.) o exhibición pública en locales comerciales sin licencia expresa y por escrito de Pasión Lomonegra. El incumplimiento facultará la revocación inmediata del pase sin derecho a reembolso y el inicio de las acciones legales pertinentes.
            </p>
          </section>

          {/* 5. Aplicaciones Móviles y Smart TV */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span className="text-red-500 font-bold font-mono">05.</span>
              <span>Uso de Aplicaciones Móviles, Cast, AirPlay y Android TV</span>
            </h2>
            <p>
              Pasión Lomonegra otorga al usuario una licencia limitada, no exclusiva, intransferible y revocable para instalar y utilizar sus aplicaciones oficiales en celulares Android/iOS y televisores con Android TV / Google TV, así como las funciones de transmisión inalámbrica mediante Google Cast (Chromecast) y Apple AirPlay.
            </p>
          </section>

          {/* 6. Requisitos de Red y Disponibilidad */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="text-red-500 font-bold font-mono">06.</span>
              <span>Requisitos de Conexión y Calidad de Señal</span>
            </h2>
            <p>
              Para disfrutar de la transmisión en alta definición (Full HD 1080p / 60 FPS), se recomienda una conexión a internet de banda ancha o Wi-Fi estable no inferior a <strong>10 Mbps</strong> de bajada. Pasión Lomonegra no será responsable por cortes o microcortes originados en el proveedor de internet (ISP) o red doméstica del usuario.
            </p>
          </section>

          {/* 7. Cancelaciones, Reprogramaciones y Botón de Arrepentimiento */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-red-500 font-bold font-mono">07.</span>
              <span>Reprogramaciones, Reembolsos y Derecho de Revocación (Ley 24.240)</span>
            </h2>
            <p>
              En caso de suspensión o postergación del partido por factores climáticos, cortes de suministro eléctrico en el estadio, decisiones arbitrales o disposiciones de la Liga Deportiva del Sur, <strong>el pase adquirido conservará total validez automática</strong> para la fecha y horario de reprogramación oficial.
            </p>
            <p className="text-zinc-400 text-xs">
              Conforme al Artículo 34 de la Ley N° 24.240 de Defensa del Consumidor y el Artículo 1116 del Código Civil y Comercial de la Nación, el usuario podrá revocar la compra a través del <Link href="/arrepentimiento" className="text-amber-400 underline font-bold">Botón de Arrepentimiento</Link> dentro de los 10 días corridos, siempre que el evento en directo no haya comenzado ni el servicio digital haya sido ejecutado.
            </p>
          </section>

          {/* 8. Jurisdicción y Ley Aplicable */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              <span className="text-red-500 font-bold font-mono">08.</span>
              <span>Legislación Aplicable y Jurisdicción</span>
            </h2>
            <p>
              Los presentes Términos y Condiciones se rigen en todos sus puntos por las leyes vigentes en la <strong>República Argentina</strong> (Ley 24.240, Ley 25.326, Ley 11.723 y Código Civil y Comercial de la Nación). Ante cualquier controversia derivada de la interpretación o ejecución del presente contrato, las partes se someten a la jurisdicción de los Tribunales Ordinarios competentes de la Provincia de Santa Fe, o a los tribunales correspondientes al domicilio real del consumidor conforme la normativa de orden público vigente.
            </p>
          </section>

          {/* 9. Contacto y Soporte */}
          <section className="bg-gradient-to-br from-red-950/40 via-[#12131a] to-[#12131a] border border-red-800/60 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-bold font-mono">09.</span>
              <span>Canales Oficiales de Atención al Usuario</span>
            </h2>
            <p>
              Ante cualquier consulta sobre tu compra, pase, privacidad de datos o acceso a la transmisión, nuestro equipo está a tu disposición en:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Correo de Soporte y Legales:</span>
                <span className="text-white font-bold">contacto@pasionlomonegra.com</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Canal de YouTube:</span>
                <span className="text-red-400 font-bold">@PasionlomonegraByN</span>
              </div>
            </div>
          </section>
        </div>

        {/* Enlaces Legales y Botón de retorno */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 pb-12 text-xs">
          <Link
            href="/privacidad"
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Política de Privacidad</span>
          </Link>
          <Link
            href="/arrepentimiento"
            className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold transition flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Botón de Arrepentimiento</span>
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-wider shadow-lg transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-red-600" />
            <span>Ir a la Transmisión en Vivo</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
