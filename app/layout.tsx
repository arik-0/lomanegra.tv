import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import Navbar from '@/components/Navbar';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pasionlomonegra.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Pasión Lomonegra - Transmisiones Oficiales en Vivo',
    template: '%s | Pasión Lomonegra',
  },
  description:
    'Plataforma oficial de transmisiones en vivo y pay-per-view de Pasión Lomonegra. Viví los partidos de la Liga Deportiva del Sur en directo en alta definición con Cloudflare Stream.',
  keywords: [
    'Pasión Lomonegra',
    'Blanco y Negro',
    'Liga Deportiva del Sur',
    'Fútbol en vivo',
    'Hockey en vivo',
    'Streaming LDDS',
    'Alcorta',
  ],
  authors: [{ name: 'Pasión Lomonegra' }],
  creator: 'Pasión Lomonegra',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo-pasion-lomonegra.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Pasión Lomonegra - Transmisiones Oficiales en Vivo',
    description:
      'Plataforma oficial de transmisiones en vivo y PPV de Pasión Lomonegra. Viví la Liga Deportiva del Sur en directo.',
    url: baseUrl,
    siteName: 'Pasión Lomonegra',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/logo-pasion-lomonegra.png',
        width: 800,
        height: 800,
        alt: 'Pasión Lomonegra',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pasión Lomonegra - Transmisiones Oficiales en Vivo',
    description:
      'Plataforma oficial de transmisiones en vivo y PPV de Pasión Lomonegra.',
    images: ['/logo-pasion-lomonegra.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
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

          {/* Footer Técnico y Legal Oficial */}
          <footer className="border-t border-white/[0.07] bg-[#060608] py-8 text-xs font-mono mb-14 lg:mb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
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

                <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-400">
                  <Link href="/app" className="text-red-400 hover:text-red-300 font-bold transition-colors">
                    App Móvil &amp; TV
                  </Link>
                  <span>·</span>
                  <Link href="/vincular" className="hover:text-white transition-colors">
                    Vincular TV
                  </Link>
                  <span>·</span>
                  <Link href="/posiciones" className="hover:text-white transition-colors">
                    Tablas
                  </Link>
                  <span>·</span>
                  <a
                    href="https://www.youtube.com/@PasionlomonegraByN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-500 transition-colors"
                  >
                    YouTube
                  </a>
                  <span>·</span>
                  <a
                    href="https://www.instagram.com/pasion_lomonegra?igsi=ejZkcWJlejZ1NXU0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors"
                  >
                    Instagram
                  </a>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-3 text-zinc-500">
                  <span className="text-zinc-400 font-bold">© {new Date().getFullYear()} Pasión Lomonegra</span>
                </div>
              </div>

              <div className="pt-5 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/terminos" className="hover:text-zinc-300 transition-colors">
                    Términos y Condiciones
                  </Link>
                  <span>·</span>
                  <Link href="/privacidad" className="hover:text-zinc-300 transition-colors">
                    Política de Privacidad (Ley 25.326)
                  </Link>
                  <span>·</span>
                  <Link
                    href="/arrepentimiento"
                    className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  >
                    Botón de Arrepentimiento (Ley 24.240)
                  </Link>
                </div>
                <div className="text-[10px] text-zinc-600 text-center sm:text-right">
                  Protegido por Ley 11.723 de Propiedad Intelectual · Pagos procesados con estándar PCI-DSS
                </div>
              </div>
            </div>
          </footer>
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
