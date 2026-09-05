import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import Navbar from '@/components/Navbar';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';

export const metadata: Metadata = {
  title: 'Pasión Lomonegra - Transmisiones Oficiales en Vivo',
  description:
    'Plataforma oficial de Pay-Per-View de Pasión Lomonegra para ver partidos en vivo y en directo en alta definición con Cloudflare Stream.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#08080a] text-white font-sans antialiased min-h-screen selection:bg-red-600 selection:text-white">
        <AppLayoutWrapper>
          <Navbar />
          <div className="flex-1">{children}</div>
          <footer className="mt-16 pt-7 pb-10 border-t border-white/[0.07] text-zinc-500 text-[11px] font-mono tracking-wide">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-5 h-5 relative shrink-0">
                  <Image
                    src="/teams/blanco-y-negro.png"
                    alt="Escudo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-white">
                  Pasión Lomonegra<span className="text-red-500">.tv</span>
                </span>
                <span className="text-zinc-500">· Señal Oficial PPV</span>
              </div>

              <div className="text-center text-zinc-500">
                Transmisiones encriptadas RSA-256 &bull; Mercado Pago
              </div>

              <div className="flex items-center justify-center md:justify-end gap-3 text-zinc-500">
                <span className="hover:text-zinc-300 transition-colors cursor-pointer">Términos</span>
                <span>·</span>
                <span className="hover:text-zinc-300 transition-colors cursor-pointer">Privacidad</span>
                <span>·</span>
                <span className="text-zinc-400 font-bold">© {new Date().getFullYear()}</span>
              </div>
            </div>
          </footer>
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
