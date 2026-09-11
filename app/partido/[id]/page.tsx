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
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

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
  const isSupabaseConfigured =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

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
          const { data } = isUUID
            ? await supabaseAdmin.from('matches').select('*').eq('id', params.id).maybeSingle()
            : await supabaseAdmin.from('matches').select('*').ilike('title', '%blanco y negro%').maybeSingle();

          if (!data || data.title?.startsWith('__SYSTEM_')) {
            return { data: null };
          }

          const rawDesc = data.description || '';
          const isTbd =
            rawDesc.includes('[A CONFIRMAR]') ||
            (data.date && new Date(data.date).getFullYear() >= 2099);

          let league = data.league || 'Liga Deportiva del Sur';
          let category = data.category || 'Primera';
          if (category === 'Fútbol Mayor') category = 'Primera';
          let is_live = data.is_live !== undefined ? Boolean(data.is_live) : false;

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

          return {
            data: {
              ...data,
              title: sanitizeRegionalText(data.title),
              is_date_confirmed: !isTbd,
              date: isTbd ? null : data.date,
              description: sanitizeRegionalText(cleanDesc),
              league: sanitizeRegionalText(league),
              category: sanitizeRegionalText(category),
              is_live,
            },
          };
        } catch {
          return { data: null };
        }
      };

      // Ejecutar autenticación y consulta de partido en paralelo con timeout de 1200ms
      const [authRes, matchRes] = await Promise.all([
        withTimeout(fetchUser(), 1200, { data: { user: null } }),
        withTimeout(fetchMatch(), 1200, { data: null }),
      ]);

      user = authRes?.data?.user || null;
      match = matchRes?.data || null;

      if (!user) {
        const cookieEmail = cookieStore.get('lomonegro_user_email')?.value;
        const cookieId = cookieStore.get('lomonegro_user_id')?.value;
        if (cookieEmail) {
          user = { id: cookieId || 'user-cookie', email: cookieEmail };
        }
      }

      // Verificar compras aprobadas con timeout de 800ms
      const guestEmail = searchParams?.guest_email?.toLowerCase().trim();
      if (match && (user || guestEmail)) {
        const fetchPurchase = async () => {
          try {
            const { data } = user
              ? await supabaseAdmin
                  .from('purchases')
                  .select('status')
                  .eq('user_id', user.id)
                  .eq('match_id', match.id)
                  .eq('status', 'approved')
                  .maybeSingle()
              : await supabaseAdmin
                  .from('purchases')
                  .select('status')
                  .eq('guest_email', guestEmail!)
                  .eq('match_id', match.id)
                  .eq('status', 'approved')
                  .maybeSingle();
            return { data };
          } catch {
            return { data: null };
          }
        };

        const purchaseRes = await withTimeout(
          fetchPurchase(),
          800,
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
    } else if (params.id === 'b1a9c001-0000-4000-8000-000000000004') {
      match = {
        id: 'b1a9c001-0000-4000-8000-000000000004',
        title: 'Blanco y Negro vs Los Andes',
        description: 'Torneo Clausura • Fecha 4 • Transmisión oficial en vivo',
        date: null,
        is_date_confirmed: false,
        price: 12000,
        cloudflare_live_input_uid: 'live_input_byn_vs_los_andes',
        image_url: null,
        is_active: true,
      };
    } else {
      match = {
        id: '0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
        title: 'Blanco y Negro vs Atlético Acebal',
        description: 'Primera • Liga Deportiva del Sur',
        date: '2026-09-13T18:45:00.000Z',
        is_date_confirmed: true,
        price: 12000,
        cloudflare_live_input_uid: 'live_input_byn_vs_acebal',
        image_url: null,
        is_active: true,
      };
    }
  }

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
          currentUserEmail={user?.email || null}
          paymentStatus={searchParams?.payment}
          queryGuestEmail={searchParams?.guest_email}
          paymentId={searchParams?.payment_id || searchParams?.collection_id}
          isAdmin={isAdmin}
        />
      </div>
    </main>
  );
}
