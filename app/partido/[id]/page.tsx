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

  // 1. Obtener detalles del partido:
  // Si es un UUID válido, consultar directamente por ID; de lo contrario buscar por slug o título
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);

  let match = null;

  if (isUUID) {
    const { data } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();
    match = data;
  } else {
    // Si la URL es un slug como 'blanco-y-negro-vs-ifc'
    const { data } = await supabaseAdmin
      .from('matches')
      .select('*')
      .ilike('title', '%blanco y negro%')
      .maybeSingle();
    match = data;
  }

  // Fallback de seguridad: si no se encontró, obtener el partido estelar activo
  if (!match) {
    const { data: fallbackMatch } = await supabaseAdmin
      .from('matches')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();
    match = fallbackMatch;
  }

  if (!match) {
    return (
      <main className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0c0c10] border border-white/[0.08] flex items-center justify-center mb-4 text-zinc-500">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-black mb-2">Transmisión no disponible</h1>
        <p className="text-zinc-400 text-xs font-mono mb-6 max-w-md">
          El evento no fue encontrado o la base de datos no está configurada aún en este entorno.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-wider transition hover:bg-zinc-200"
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
    <main className="min-h-screen bg-[#08080a] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navegación superior */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
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
