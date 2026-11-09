import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Database,
  EyeOff,
  Trash2,
  Scale,
  CheckCircle2,
  Mail,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad y Protección de Datos',
  description:
    'Política de Privacidad oficial de Pasión Lomonegra conforme a la Ley N° 25.326 de Protección de Datos Personales de la República Argentina y normativas de Google Play.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacidadPage() {
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
            <span>Volver al inicio</span>
          </Link>

          <div className="bg-[#12131a] border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PROTECCIÓN DE DATOS // LEY N° 25.326</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Política de tratamiento de datos personales, seguridad de la información y privacidad aplicable a la plataforma web, aplicación móvil Android/iOS y aplicación para Smart TV (Android TV / Google TV) de Pasión Lomonegra.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
              <span>Última actualización: Noviembre 2026</span>
              <span>&bull;</span>
              <span>Cumplimiento Ley 25.326 (Argentina) &amp; Google Play Data Safety</span>
            </div>
          </div>
        </div>

        {/* Bloques de Privacidad */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-zinc-300 font-sans">
          {/* 1. Datos Recopilados */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-red-500 font-bold font-mono">01.</span>
              <span>Información que Recopilamos y Finalidad</span>
            </h2>
            <p>
              Pasión Lomonegra recopila únicamente los datos mínimos e indispensables para acreditar la titularidad de los pases de acceso a las transmisiones deportivas en vivo:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>
                <strong className="text-zinc-200">Dirección de correo electrónico:</strong> utilizada exclusivamente para vincular tu compra o cuenta con el acceso a la transmisión en vivo y permitir la activación en dispositivos móviles o televisores.
              </li>
              <li>
                <strong className="text-zinc-200">Identificador de operación de pago:</strong> código de referencia provisto por Mercado Pago para verificar automáticamente la aprobación del pase.
              </li>
              <li>
                <strong className="text-zinc-200">Token de sesión técnica (Anti-Concurrencia):</strong> identificador aleatorio temporal utilizado para garantizar que cada pase se reproduzca en un (1) dispositivo simultáneo a la vez.
              </li>
            </ul>
          </section>

          {/* 2. Seguridad Financiera */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-red-500 font-bold font-mono">02.</span>
              <span>Seguridad de Pagos y Datos Financieros</span>
            </h2>
            <p>
              <strong>Pasión Lomonegra jamás solicita, procesa ni almacena números de tarjetas de crédito, débito, claves bancarias ni códigos de seguridad (CVV).</strong>
            </p>
            <p className="text-zinc-400">
              Todas las transacciones se realizan de forma externa y encriptada en los servidores certificados bajo norma PCI-DSS de <strong>Mercado Pago (MercadoLibre S.R.L.)</strong>. Nuestra plataforma únicamente recibe la notificación criptográfica del estado del pago (aprobado, pendiente o rechazado).
            </p>
          </section>

          {/* 3. Permisos de las Aplicaciones (Móvil y Android TV) */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-blue-400" />
              <span className="text-red-500 font-bold font-mono">03.</span>
              <span>Privacidad en nuestras Apps (Móvil y Android TV)</span>
            </h2>
            <p>
              Nuestras aplicaciones oficiales para dispositivos móviles Android y televisores con Android TV / Google TV respetan estrictamente tu privacidad:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400 pl-2">
              <li>No accedemos a tu cámara, micrófono, agenda de contactos ni ubicación GPS.</li>
              <li>No vendemos, alquilamos ni cedemos tus datos personales a terceros ni a redes publicitarias externas.</li>
              <li>Toda comunicación entre la aplicación y nuestros servidores viaja cifrada mediante protocolo seguro HTTPS (TLS 1.2/1.3) y tokens firmados con algoritmo RSA-256.</li>
            </ul>
          </section>

          {/* 4. Eliminación de Cuenta y Datos (Requisito Google Play) */}
          <section className="bg-[#12131a] border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-bold font-mono">04.</span>
              <span>Derechos ARCO y Eliminación de Datos</span>
            </h2>
            <p>
              El titular de los datos personales puede ejercer en cualquier momento y de forma gratuita sus derechos de <strong>Acceso, Rectificación, Cancelación, Oposición y Supresión Total de Cuenta</strong>.
            </p>
            <div className="p-4 rounded-xl bg-black/50 border border-zinc-800 space-y-2 text-xs font-mono">
              <p className="text-zinc-200 font-bold">
                ¿Cómo solicitar la eliminación de tu cuenta y datos asociados?
              </p>
              <p className="text-zinc-400 font-sans">
                Puedes solicitar el borrado definitivo de tu correo electrónico e historial de sesión enviando un correo con el asunto <strong>&quot;ELIMINAR DATOS&quot;</strong> a <span className="text-white font-bold">contacto@pasionlomonegra.com</span>. La solicitud será procesada en un plazo máximo de 5 días hábiles conforme al Art. 16 de la Ley N° 25.326.
              </p>
            </div>
          </section>

          {/* 5. Cláusula Legal Obligatoria AAIP (Ley 25.326 Argentina) */}
          <section className="bg-gradient-to-br from-emerald-950/30 via-[#12131a] to-[#12131a] border border-emerald-800/50 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-black text-white uppercase font-mono flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span className="text-red-500 font-bold font-mono">05.</span>
              <span>Órgano de Control Legal (Ley N° 25.326 - República Argentina)</span>
            </h2>
            <p className="text-zinc-200 italic">
              &quot;El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326.&quot;
            </p>
            <p className="text-zinc-400 text-xs">
              &quot;LA AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.&quot;
            </p>
          </section>
        </div>

        {/* Enlaces relacionados */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 pb-12 text-xs">
          <Link
            href="/terminos"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-red-500" />
            <span>Ver Términos y Condiciones</span>
          </Link>
          <Link
            href="/arrepentimiento"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Botón de Arrepentimiento</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
