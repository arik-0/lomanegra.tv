import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pasionlomonegra.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/posiciones`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  let matchRoutes: MetadataRoute.Sitemap = [];
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

    if (isSupabaseConfigured) {
      const { data: matches } = await supabaseAdmin
        .from('matches')
        .select('id, updated_at, date')
        .eq('is_active', true);

      if (matches && matches.length > 0) {
        matchRoutes = matches.map((m) => ({
          url: `${baseUrl}/partido/${m.id}`,
          lastModified: m.updated_at ? new Date(m.updated_at) : new Date(m.date || Date.now()),
          changeFrequency: 'hourly' as const,
          priority: 0.9,
        }));
      }
    }
  } catch {
    // Si falla la conexión a la base de datos durante build time, continuar con rutas estáticas
  }

  return [...staticRoutes, ...matchRoutes];
}
