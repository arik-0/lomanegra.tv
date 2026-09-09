import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pasión Lomonegra - Streaming Oficial',
    short_name: 'Lomonegra',
    description: 'Plataforma oficial de streaming y pay-per-view de la Liga Deportiva del Sur.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08080a',
    theme_color: '#08080a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
