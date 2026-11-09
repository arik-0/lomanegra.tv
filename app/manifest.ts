import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pasión Lomonegra - Streaming Oficial',
    short_name: 'Lomonegra',
    description:
      'Plataforma oficial de streaming y pay-per-view de la Liga Deportiva del Sur. Partidos en vivo, tablas de posiciones, play-offs y goleadores.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#08080a',
    theme_color: '#08080a',
    categories: ['sports', 'entertainment'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/icon-96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icon-144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Transmisión en Vivo',
        short_name: 'En Vivo',
        description: 'Ir al partido en directo',
        url: '/',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Tablas y Play-Offs',
        short_name: 'Tablas',
        description: 'Posiciones y goleadores de la Liga Deportiva del Sur',
        url: '/posiciones',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Vincular Smart TV',
        short_name: 'Vincular TV',
        description: 'Ingresar código de 6 dígitos para ver en el televisor',
        url: '/vincular',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
