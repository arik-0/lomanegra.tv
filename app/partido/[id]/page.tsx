import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getStoredMatches } from '@/lib/adminStore';
import MatchViewClient from './MatchViewClient';
import { ArrowLeft } from 'lucide-react';
import { sanitizeRegionalText } from '@/lib/sanitize';

export const revalidate = 0;

interface MatchPageProps {
  params: { id: string };
  searchParams?: {
    payment?: string;
    guest_email?: string;
    payment_id?: string;
    collection_id?: string;
    status?: string;
  };
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);
  let title = 'Transmisión Oficial en Vivo';
  let description = 'Mirá el partido en directo por Pasión Lomonegra en alta definición HD.';
  let imageUrl = '/logo-pasion-lomonegra.png';

  try {
    const isSupabaseConfigured = true;

    if (isSupabaseConfigured) {
      const { data } = isUUID
        ? await supabaseAdmin.from('matches').select('*').eq('id', params.id).maybeSingle()
        : await supabaseAdmin.from('matches').select('*').ilike('title', '%blanco y negro%').maybeSingle();

      if (data && !data.title?.startsWith('__SYSTEM_')) {
        title = sanitizeRegionalText(data.title);
        if (data.description) {
          const cleanDesc = data.description
            .replace(/\[META:\{.*?\}\]/g, '')
            .replace('[A CONFIRMAR]', '')
            .trim();
          if (cleanDesc) description = sanitizeRegionalText(cleanDesc);
        }
        if (data.image_url) imageUrl = data.image_url;
      }
    }
  } catch {
    // Si falla la consulta, continuar con el fallback
  }

  if (title === 'Transmisión Oficial en Vivo') {
    const fromStore = getStoredMatches().find((m) => m.id === params.id);
    if (fromStore) {
      title = sanitizeRegionalText(fromStore.title);
      if (fromStore.description) description = sanitizeRegionalText(fromStore.description);
      if (fromStore.image_url) imageUrl = fromStore.image_url;
    }
  }

  return {
    title: `${title} | Pasión Lomonegra`,
    description,
    openGraph: {
      title: `${title} | Pasión Lomonegra`,
      description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
    },
    robots: {
      index: false,
      follow: true,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Pasión Lomonegra`,
      description,
      images: [imageUrl],
    },
  };
}

// Helper con timeout para que ninguna consulta externa demore la carga
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutHandle = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timeoutHandle);
      return res;
    }),
    timeoutPromise,
  ]);
}

export default async function MatchPage({
  params,
  searchParams,
}: MatchPageProps) {
  const isSupabaseConfigured = true;

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);

  let user: any = null;
  let match: any = null;
  let serverHasPaid = false;

  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session');
  const isAdmin = adminSession?.value === 'authenticated';

  // serverHasPaid reflejará estrictamente si existe compra aprobada en la base de datos

  if (isSupabaseConfigured) {
    try {
      const supabase = createServerSupabaseClient();

      const fetchUser = async () => {
        try {
          const { data } = await supabase.auth.getUser();
          return { data };
        } catch {
          return { data: { user: null } };
        }
      };

      const fetchMatch = async () => {
        try {
          if (isUUID) {
            const { data } = await supabaseAdmin
              .from('matches')
              .select('*')
              .eq('id', params.id)
              .maybeSingle();
            if (data && !data.title?.startsWith('__SYSTEM_')) {
              return { data };
            }
          }

          // Si no es UUID o no se encontró por ID, buscar partidos activos en Supabase
          const { data: activeList } = await supabaseAdmin
            .from('matches')
            .select('*')
            .eq('is_active', true)
            .not('title', 'like', '__SYSTEM_%')
            .order('date', { ascending: true });

          if (activeList && activeList.length > 0) {
            const liveMatch =
              activeList.find((m: any) => m.description?.includes('"is_live":true')) ||
              activeList[0];
            return { data: liveMatch };
          }
          return { data: null };
        } catch {
          return { data: null };
        }
      };

      // Ejecutar autenticación y consulta de partido en paralelo con timeout resiliente de 4000ms
      const [authRes, matchRes] = await Promise.all([
        withTimeout(fetchUser(), 3000, { data: { user: null } }),
        withTimeout(fetchMatch(), 4000, { data: null }),
      ]);

      user = authRes?.data?.user || null;
      let rawMatch = matchRes?.data || null;

      if (rawMatch) {
        const rawDesc = rawMatch.description || '';
        const isTbd =
          rawDesc.includes('[A CONFIRMAR]') ||
          (rawMatch.date && new Date(rawMatch.date).getFullYear() >= 2099);

        let league = rawMatch.league || 'Liga Deportiva del Sur';
        let category = rawMatch.category || 'Primera';
        if (category === 'Fútbol Mayor') category = 'Primera';
        let is_live = rawMatch.is_live !== undefined ? Boolean(rawMatch.is_live) : false;

        const metaMatch = rawDesc.match(/\[META:(\{.*?\})\]/);
        if (metaMatch) {
          try {
            const parsed = JSON.parse(metaMatch[1]);
            if (parsed.league) league = parsed.league;
            if (parsed.category) category = parsed.category;
            if (category === 'Fútbol Mayor') category = 'Primera';
            if (parsed.is_live !== undefined) is_live = Boolean(parsed.is_live);
          } catch {}
        }

        const cleanDesc = rawDesc
          .replace(/\[META:\{.*?\}\]/g, '')
          .replace('[A CONFIRMAR]', '')
          .trim();

        match = {
          ...rawMatch,
          title: sanitizeRegionalText(rawMatch.title),
          is_date_confirmed: !isTbd,
          date: isTbd ? null : rawMatch.date,
          description: sanitizeRegionalText(cleanDesc),
          league: sanitizeRegionalText(league),
          category: sanitizeRegionalText(category),
          is_live,
        };
      }

      if (!user) {
        const cookieEmail = cookieStore.get('lomonegro_user_email')?.value;
        if (cookieEmail) {
          user = { id: 'guest-buyer', email: cookieEmail.toLowerCase().trim() };
        }
      }

      // Helper para validar UUID antes de consultar columnas Postgres UUID
      const isValidUUID = (str?: string | null): boolean =>
        !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      // Verificar compras aprobadas con timeout buscando por user_id o email
      const cookieEmail = cookieStore.get('lomonegro_user_email')?.value?.toLowerCase().trim();
      const guestEmail = (searchParams?.guest_email || cookieEmail)?.toLowerCase().trim();
      const checkEmail = user?.email?.toLowerCase().trim() || guestEmail;

      if (match && (user || checkEmail)) {
        const fetchPurchase = async () => {
          try {
            let q = supabaseAdmin
              .from('purchases')
              .select('id, status, match_id')
              .eq('status', 'approved');

            if (isValidUUID(match.id)) {
              q = q.eq('match_id', match.id);
            }

            if (user && isValidUUID(user.id)) {
              if (checkEmail) {
                q = q.or(`user_id.eq.${user.id},guest_email.ilike.${checkEmail}`);
              } else {
                q = q.eq('user_id', user.id);
              }
            } else if (checkEmail) {
              q = q.ilike('guest_email', checkEmail);
            } else {
              return { data: null };
            }
            const { data: pList } = await q.limit(10);
            return { data: pList && pList.length > 0 ? pList[0] : null };
          } catch {
            return { data: null };
          }
        };

        const purchaseRes = await withTimeout(
          fetchPurchase(),
          3000,
          { data: null }
        );

        if (purchaseRes?.data) {
          serverHasPaid = true;
        }
      }
    } catch {
      // Fallback de ultra velocidad en caso de error
    }
  }

  // Fallback de seguridad inmediato si no se encontró en la DB
  if (!match) {
    const fromStore = getStoredMatches().find((m) => m.id === params.id);
    if (fromStore) {
      match = fromStore;
    } else {
      match = {
        id: 'b1343cdc-be37-4e30-9c29-fbb505721566',
        title: 'Carreras vs Blanco y Negro',
        description: 'Primera • Liga Deportiva del Sur',
        date: '2026-09-21T23:40:00.000Z',
        is_date_confirmed: true,
        price: 1,
        cloudflare_live_input_uid: 'dac066a4fb5c97117189392adae3f453',
        image_url: '/matches/blanco-y-negro-vs-ifc.png',
        is_active: true,
        is_live: true,
      };
    }
  }

  // Asegurar que el UID no sea un mock/placeholder en producción
  if (
    !match.cloudflare_live_input_uid ||
    match.cloudflare_live_input_uid.startsWith('live_input_')
  ) {
    match.cloudflare_live_input_uid = 'dac066a4fb5c97117189392adae3f453';
  }

  const persistentEmail =
    user?.email ||
    cookieStore.get('lomonegro_user_email')?.value ||
    searchParams?.guest_email ||
    null;

  return (
    <main className="min-h-screen bg-[#08080a] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navegación superior */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white bg-[#0c0c10] hover:bg-[#121218] border border-white/[0.07] px-4 py-2 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4 text-red-500" />
            <span>Volver a la Cartelera</span>
          </Link>
        </div>

        {/* Vista interactiva del partido (reproductor o compra con/sin cuenta) */}
        <MatchViewClient
          match={{
            ...match,
            title: sanitizeRegionalText(match.title),
            description: sanitizeRegionalText(match.description),
          }}
          serverHasPaid={serverHasPaid}
          currentUserEmail={persistentEmail}
          paymentStatus={searchParams?.payment}
          queryGuestEmail={persistentEmail || undefined}
          paymentId={searchParams?.payment_id || searchParams?.collection_id}
          isAdmin={isAdmin}
        />
      </div>
    </main>
  );
}
