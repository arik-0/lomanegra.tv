import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import Navbar from '@/components/Navbar';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import SupportChat from '@/components/SupportChat';

export const metadata: Metadata = {
  title: 'Pasión Lomonegra - Transmisiones Oficiales en Vivo',
  description:
    'Plataforma oficial de transmisiones en vivo de Pasión Lomonegra para ver partidos en directo en alta definición con Cloudflare Stream.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#08080a] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-red-500 selection:text-white">
        <AppLayoutWrapper>
          <Navbar />
          <div className="flex-1">{children}</div>
          <SupportChat />

          {/* Footer Técnico Forg1 */}
          <footer className="border-t border-white/[0.07] bg-[#060608] py-8 text-xs font-mono mb-14 lg:mb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <div className="w-7 h-7 relative shrink-0">
                  <Image
                    src="/logo-pasion-lomonegra.png"
                    alt="Pasión Lomonegra"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="font-bold text-white">
                  Pasión Lomonegra
                </span>
                <span className="text-zinc-500">· Transmisión Oficial en Vivo</span>
              </div>

              <div className="flex items-center justify-center gap-4 text-zinc-400">
                <a
                  href="https://www.youtube.com/@PasionlomonegraByN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors"
                >
                  YouTube Oficial
                </a>
                <span>·</span>
                <a
                  href="https://www.instagram.com/pasion_lomonegra?igsi=ejZkcWJlejZ1NXU0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500 transition-colors"
                >
                  Instagram Oficial
                </a>
                <span>·</span>
                <Link href="/posiciones" className="hover:text-white transition-colors">
                  Tablas
                </Link>
              </div>

              <div className="flex items-center justify-center md:justify-end gap-3 text-zinc-500">
                <span className="text-zinc-400 font-bold">© {new Date().getFullYear()} Pasión Lomonegra</span>
              </div>
            </div>
          </footer>
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
