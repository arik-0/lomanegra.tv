import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import MatchViewClient from './MatchViewClient';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export const revalidate = 0;

interface MatchPageProps {
  params: { id: string };
  searchParams?: { payment?: string; guest_email?: string };
}

export default async function MatchPage({
  params,
  searchParams,
}: MatchPageProps) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Obtener detalles del partido
  const { data: match, error: matchError } = await supabaseAdmin
    .from('matches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (matchError || !match) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-black mb-2">Partido no encontrado</h1>
        <p className="text-zinc-400 text-sm mb-6 max-w-md">
          El evento solicitado no existe o fue deshabilitado de la cartelera oficial de Lomanegratv.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la cartelera</span>
        </Link>
      </main>
    );
  }

  // 2. Verificar compra aprobada: si está autenticado o si viene el correo por parámetro
  let serverHasPaid = false;

  if (user) {
    const { data: purchase } = await supabaseAdmin
      .from('purchases')
      .select('status')
      .eq('user_id', user.id)
      .eq('match_id', match.id)
      .eq('status', 'approved')
      .maybeSingle();

    if (purchase) {
      serverHasPaid = true;
    }
  } else if (searchParams?.guest_email) {
    const { data: purchase } = await supabaseAdmin
      .from('purchases')
      .select('status')
      .eq('guest_email', searchParams.guest_email.toLowerCase().trim())
      .eq('match_id', match.id)
      .eq('status', 'approved')
      .maybeSingle();

    if (purchase) {
      serverHasPaid = true;
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navegación superior */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl transition"
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
