import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getStoredMatches } from '@/lib/adminStore';
import MatchViewClient from './MatchViewClient';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

interface MatchPageProps {
  params: { id: string };
  searchParams?: { payment?: string; guest_email?: string };
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
          return { data };
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
        const cookieStore = cookies();
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
    } else if (params.id === 'b1a9c001-0000-4000-8000-000000000002') {
      match = {
        id: 'b1a9c001-0000-4000-8000-000000000002',
        title: 'Blanco y Negro vs Deportivo Sarmiento',
        description: 'Fútbol Mayor • Fecha Oficial del Torneo Apertura',
        date: null,
        is_date_confirmed: false,
        price: 3500,
        cloudflare_live_input_uid: 'live_input_byn_vs_dep_sarmiento',
        image_url: '/matches/blanco-y-negro-vs-ifc.png',
        is_active: true,
      };
    } else if (params.id === 'b1a9c001-0000-4000-8000-000000000003') {
      match = {
        id: 'b1a9c001-0000-4000-8000-000000000003',
        title: 'Blanco y Negro vs San Martín (ST)',
        description: 'Reserva e Inferiores • Próxima Fecha',
        date: null,
        is_date_confirmed: false,
        price: 3500,
        cloudflare_live_input_uid: 'live_input_byn_vs_san_martin',
        image_url: '/matches/blanco-y-negro-vs-ifc.png',
        is_active: true,
      };
    } else {
      match = {
        id: '0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
        title: 'Blanco y Negro vs I. F. C.',
        description: 'El gran clásico regional en vivo con relatos en directo para toda la hinchada.',
        date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        is_date_confirmed: true,
        price: 3500,
        cloudflare_live_input_uid: 'live_input_byn_vs_ifc',
        image_url: '/matches/blanco-y-negro-vs-ifc.png',
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
          match={match}
          serverHasPaid={serverHasPaid}
          currentUserEmail={user?.email || null}
          paymentStatus={searchParams?.payment}
          queryGuestEmail={searchParams?.guest_email}
        />
      </div>
    </main>
  );
}
