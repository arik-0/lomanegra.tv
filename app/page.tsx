import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getStoredMatches } from '@/lib/adminStore';
import { MatchHeroBadge, MatchHeroCountdown } from '@/components/MatchHeroStatus';
import SponsorsStrip from '@/components/SponsorsStrip';
import SponsorsTicker from '@/components/SponsorsTicker';
import {
  Calendar,
  PlayCircle,
  ShoppingCart,
  Radio,
  Trophy,
  ShieldCheck,
  Flame,
  ArrowRight,
  Tv,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const revalidate = 0; // Datos frescos en cada petición

export default async function HomePage() {
  const isSupabaseConfigured =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  let user = null;
  let matches: any[] | null = null;
  let approvedMatchIds = new Set<string>();

  if (isSupabaseConfigured) {
    try {
      const withTimeout = async <T,>(p: PromiseLike<T>, ms = 2500): Promise<T | null> => {
        let t: any;
        const timeout = new Promise<null>((res) => { t = setTimeout(() => res(null), ms); });
        try {
          const res = await Promise.race([Promise.resolve(p), timeout]);
          clearTimeout(t);
          return res as T;
        } catch {
          clearTimeout(t);
          return null;
        }
      };

      const supabase = createServerSupabaseClient();
      const authRes: any = await withTimeout(supabase.auth.getUser(), 2000);
      user = authRes?.data?.user || null;

      const matchesRes: any = await withTimeout(
        supabaseAdmin
          .from('matches')
          .select('*')
          .eq('is_active', true)
          .order('date', { ascending: true }),
        2500
      );

      if (matchesRes && !matchesRes.error && matchesRes.data && matchesRes.data.length > 0) {
        matches = matchesRes.data.map((m: any) => {
          const isTbd =
            m.description?.includes('[A CONFIRMAR]') ||
            (m.date && new Date(m.date).getFullYear() >= 2099);
          return {
            ...m,
            is_date_confirmed: !isTbd,
            date: isTbd ? null : m.date,
            description: (m.description || '').replace('[A CONFIRMAR]', '').trim(),
          };
        });
      }

      if (!user) {
        const cookieStore = cookies();
        const cookieEmail = cookieStore.get('lomonegro_user_email')?.value;
        const cookieId = cookieStore.get('lomonegro_user_id')?.value;
        if (cookieEmail) {
          user = { id: cookieId || 'user-cookie', email: cookieEmail };
        }
      }

      if (user) {
        const purchasesRes: any = await withTimeout(
          supabaseAdmin
            .from('purchases')
            .select('match_id')
            .eq('user_id', user.id)
            .eq('status', 'approved'),
          2000
        );

        if (purchasesRes?.data) {
          approvedMatchIds = new Set(purchasesRes.data.map((p: any) => p.match_id));
        }
      }
    } catch {
      matches = null;
    }
  }

  // Datos estelares de respaldo para asegurar que el Hero y la Cartelera siempre se muestren
  const defaultFeaturedMatch = {
    id: '0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
    title: 'Blanco y Negro vs I. F. C.',
    description: 'El gran clásico regional en vivo con relatos en directo y campo de juego.',
    date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    is_date_confirmed: true,
    price: 3500,
    cloudflare_live_input_uid: 'live_input_byn_vs_ifc',
    image_url: '/matches/blanco-y-negro-vs-ifc.png',
    is_active: true,
  };

  const defaultOtherMatches = [
    {
      id: 'b1a9c001-0000-4000-8000-000000000002',
      title: 'Blanco y Negro vs Deportivo Sarmiento',
      description: 'Fútbol Mayor • Fecha Oficial',
      date: null,
      is_date_confirmed: false,
      price: 3500,
      cloudflare_live_input_uid: 'live_input_byn_vs_dep_sarmiento',
      image_url: '/matches/blanco-y-negro-vs-ifc.png',
      is_active: true,
    },
    {
      id: 'b1a9c001-0000-4000-8000-000000000003',
      title: 'Blanco y Negro vs San Martín (ST)',
      description: 'Reserva e Inferiores • Fecha a confirmar',
      date: null,
      is_date_confirmed: false,
      price: 3500,
      cloudflare_live_input_uid: 'live_input_byn_vs_san_martin',
      image_url: '/matches/blanco-y-negro-vs-ifc.png',
      is_active: true,
    },
  ];

  // Combinar partidos de Supabase con los del almacén de administración
  const adminMatches = getStoredMatches();
  const allCandidates = [...(matches || []), ...adminMatches];
  const seenIds = new Set<string>();
  const combinedMatches = allCandidates.filter((m) => {
    if (seenIds.has(m.id)) return false;
    seenIds.add(m.id);
    return true;
  });

  // Filtrar exclusivamente partidos activos de Pasión Lomonegra
  const validMatches = (combinedMatches.length > 0 ? combinedMatches : [defaultFeaturedMatch, ...defaultOtherMatches]).filter(
    (m) =>
      m.is_active !== false &&
      !m.title.toLowerCase().includes('boca juniors vs river') &&
      !m.title.toLowerCase().includes('real madrid') &&
      !m.title.toLowerCase().includes('argentina vs')
  );

  const activeMatches = validMatches.length > 0 ? validMatches : [defaultFeaturedMatch, ...defaultOtherMatches];
  const now = Date.now();

  // Buscar todos los partidos confirmados con fecha futura o en curso (hasta 3 horas de iniciados)
  // y ordenarlos cronológicamente: el más próximo siempre queda primero
  const upcomingConfirmedMatches = activeMatches
    .filter((m) => m.is_date_confirmed !== false && m.date)
    .map((m) => ({ ...m, timestamp: new Date(m.date!).getTime() }))
    .filter((m) => !isNaN(m.timestamp) && m.timestamp + 3 * 3600 * 1000 >= now)
    .sort((a, b) => a.timestamp - b.timestamp);

  // Si no hay partidos confirmados próximos, buscar uno "A Confirmar"
  const pendingMatch = activeMatches.find((m) => !m.is_date_confirmed || !m.date);

  // El partido estelar seleccionado automáticamente para el contador
  const featuredMatch =
    upcomingConfirmedMatches[0] ||
    pendingMatch ||
    activeMatches[0] ||
    defaultFeaturedMatch;

  // Sanitizar descripción eliminando textos publicitarios obsoletos o redundantes
  const cleanDescription = (featuredMatch.description || '')
    .replace(/transmisi[oó]n exclusiva en 4k ultra hd.*?relatos oficiales\.?/gi, '')
    .replace(/acceso exclusivo pay-per-view.*?clubes\.?/gi, '')
    .trim() || 'Transmisión oficial en directo para toda la hinchada lomonegra.';

  const otherMatches = activeMatches.filter((m) => m.id !== featuredMatch.id);

  // Estado de confirmación de la fecha para el contador
  const isFeaturedDateConfirmed = featuredMatch.is_date_confirmed !== false && !!featuredMatch.date;

  return (
    <main className="min-h-screen bg-[#08080a] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ============================================================================== */}
        {/* BANDA DE SPONSORS CONTINUA Y DINÁMICA (ARRIBA DE LA TRANSMISIÓN)               */}
        {/* ============================================================================== */}
        <SponsorsTicker />

        {/* ============================================================================== */}
        {/* 1. HERO ESTELAR ESTILO FORG1.COM (HUD TACTICAL FRAME + SHADER GLOW)           */}
        {/* ============================================================================== */}
        {featuredMatch && (
          <section className="relative isolate overflow-hidden rounded-3xl bg-[#0c0c10] border border-white/[0.07] shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
            {/* Escuadras tácticas HUD en las 4 esquinas */}
            <span className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-red-500/50 z-20 pointer-events-none" />
            <span className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-red-500/50 z-20 pointer-events-none" />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-red-500/50 z-20 pointer-events-none" />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-red-500/50 z-20 pointer-events-none" />

            {/* Resplandor radial de atmósfera en el fondo */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(220,38,38,0.12),transparent_72%)]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10 relative z-10">
              {/* Información y Compra Directa */}
              <div className="lg:col-span-7 space-y-5">
                {/* Badge Dinámico de Estado */}
                <MatchHeroBadge
                  targetDate={featuredMatch.date}
                  isDateConfirmed={isFeaturedDateConfirmed}
                />

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
                    TRANSMISIÓN DE FÚTBOL MAYOR
                  </div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-none [text-shadow:0_2px_24px_rgba(0,0,0,0.8)]">
                    {featuredMatch.title}
                  </h1>
                  <p className="mt-2.5 text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                    {cleanDescription}
                  </p>
                </div>

                {/* ======================================================================= */}
                {/* PRIORIDAD MÓVIL Y DESKTOP: PRECIO Y BOTÓN DE COMPRA DIRECTA             */}
                {/* ======================================================================= */}
                <div className="pt-1 flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                      Pase de Transmisión
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                      ${Number(featuredMatch.price).toLocaleString('es-AR')}{' '}
                      <span className="text-xs font-bold text-red-500">ARS</span>
                    </span>
                  </div>

                  {approvedMatchIds.has(featuredMatch.id) ? (
                    <Link
                      href={`/partido/${featuredMatch.id}`}
                      prefetch={true}
                      className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.12)] active:scale-95 bg-white hover:bg-zinc-200 text-black"
                    >
                      <PlayCircle className="w-4 h-4 text-red-600" />
                      <span>Ver Transmisión</span>
                    </Link>
                  ) : isFeaturedDateConfirmed ? (
                    <Link
                      href={`/partido/${featuredMatch.id}`}
                      prefetch={true}
                      className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.12)] active:scale-95 bg-white hover:bg-zinc-200 text-black"
                    >
                      <ShoppingCart className="w-4 h-4 text-red-600" />
                      <span>Comprar Pase Directo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-zinc-900 border border-amber-800/60 text-amber-400">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Venta al Confirmar Fecha</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 pt-0.5">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <CheckCircle2 className="w-3 h-3 text-red-500" />
                    Sin cuenta requerida
                  </span>
                  <span>//</span>
                  <span>Mercado Pago</span>
                  <span>//</span>
                  <span>1 Pantalla HD</span>
                </div>

                {/* Duelo de Escudos Oficiales */}
                <div className="flex items-center gap-4 sm:gap-6 bg-[#121218] border border-white/[0.08] px-4 py-2.5 rounded-2xl w-fit backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 relative drop-shadow-md">
                      <Image
                        src="/teams/blanco-y-negro.png"
                        alt="Blanco y Negro"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white tracking-wide">
                      Blanco y Negro
                    </span>
                  </div>

                  <div className="px-2 py-0.5 bg-red-600/90 text-white rounded-md font-mono font-black text-[10px] uppercase tracking-wider">
                    VS
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 relative drop-shadow-md">
                      <Image
                        src="/teams/ifc.png"
                        alt="Rival"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white tracking-wide">
                      {featuredMatch.title.toLowerCase().includes('vs')
                        ? featuredMatch.title.split(/vs/i)[1].trim()
                        : 'Rival'}
                    </span>
                  </div>
                </div>

                {/* Cuenta Regresiva Sincronizada Automáticamente al Partido */}
                <MatchHeroCountdown
                  targetDate={featuredMatch.date}
                  isDateConfirmed={isFeaturedDateConfirmed}
                />
              </div>

              {/* Imagen / Encuadre Oficial del Partido (Verde = Miniatura de Cancha) */}
              <div className="lg:col-span-5">
                <Link
                  href={`/partido/${featuredMatch.id}`}
                  prefetch={true}
                  className="block relative rounded-2xl overflow-hidden border border-emerald-500/30 hover:border-emerald-400/60 transition-all duration-300 shadow-[0_8px_32px_rgba(16,185,129,0.15)] group bg-gradient-to-br from-[#052312] via-[#091a11] to-[#0c0c10]"
                >
                  <div className="relative w-full aspect-video flex items-center justify-center p-3 overflow-hidden">
                    {/* Atmósfera verde de cancha de fútbol con líneas de campo sutiles */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_72%)] pointer-events-none" />
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[1px] bg-emerald-500/10 pointer-events-none" />
                    <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border border-emerald-500/15 pointer-events-none" />

                    {featuredMatch.image_url ? (
                      <Image
                        src={featuredMatch.image_url}
                        alt={featuredMatch.title}
                        fill
                        priority
                        className="object-contain transform group-hover:scale-105 transition-transform duration-500 relative z-10"
                      />
                    ) : (
                      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 relative drop-shadow-lg">
                            <Image src="/teams/blanco-y-negro.png" alt="Blanco y Negro" fill className="object-contain" />
                          </div>
                          <span className="text-emerald-400 font-mono font-black text-xs">VS</span>
                          <div className="w-12 h-12 relative drop-shadow-lg">
                            <Image src="/teams/ifc.png" alt="Rival" fill className="object-contain" />
                          </div>
                        </div>
                        <span className="font-mono font-black text-xs text-white uppercase tracking-wider">
                          {featuredMatch.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity z-20 pointer-events-none" />
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/[0.1] text-white text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 group-hover:bg-emerald-600 group-hover:border-emerald-500 transition-colors z-30">
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
                      <span>Ingresar al Player</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================================== */}
        {/* 2. GRILLA CONECTADA DE 4 MÉTRICAS (FORG1 METRIC GRID)                          */}
        {/* ============================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#0c0c10] border border-white/[0.07] rounded-3xl overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06] shadow-md">
          {/* Métrica 1 */}
          <div className="p-4 sm:p-6 text-left">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
              SEÑAL OFICIAL
            </div>
            <div className="text-xl sm:text-3xl font-black font-mono tracking-tight text-white leading-none">
              1080p <span className="text-[10px] sm:text-xs font-bold text-red-400 bg-red-950/70 border border-red-800/60 px-1.5 py-0.5 rounded align-middle">60 FPS</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-2 font-mono">
              Ultra HD en directo
            </div>
          </div>

          {/* Métrica 2 */}
          <div className="p-4 sm:p-6 text-left">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
              COMIENZA
            </div>
            <div className="text-xl sm:text-3xl font-black font-mono tracking-tight text-white leading-none">
              {isFeaturedDateConfirmed && featuredMatch.date ? (
                new Date(featuredMatch.date).toLocaleDateString('es-AR', {
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }).toUpperCase()
              ) : (
                'A CONFIRMAR'
              )}
            </div>
            <div className="text-[10px] sm:text-[11px] text-red-400 mt-2 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>Transmisión en vivo</span>
            </div>
          </div>

          {/* Métrica 3 */}
          <div className="p-4 sm:p-6 text-left">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
              PASE DIGITAL
            </div>
            <div className="text-xl sm:text-3xl font-black font-mono tracking-tight text-white leading-none">
              $3.500 <span className="text-xs font-bold text-red-500">ARS</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-2 font-mono">
              Sin abono mensual
            </div>
          </div>

          {/* Métrica 4 */}
          <div className="p-4 sm:p-6 text-left">
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
              ACCESO & CONEXIÓN
            </div>
            <div className="text-xl sm:text-3xl font-black font-mono tracking-tight text-white leading-none">
              1 Pantalla
            </div>
            <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-2 font-mono">
              Directo con tu email
            </div>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* 3. CARTELERA DE OTROS ENCUENTROS */}
        {/* ============================================================================== */}
        {otherMatches.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-red-500 mb-1">
                  AGENDA // TRANSMISIONES FUTURAS
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  Próximos Partidos en Cartelera
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherMatches.map((match) => {
                const hasAccess = approvedMatchIds.has(match.id);
                const isDateConfirmed = match.is_date_confirmed !== false && !!match.date;
                const matchDate = isDateConfirmed && match.date ? new Date(match.date) : null;

                return (
                  <div
                    key={match.id}
                    className="group bg-[#0c0c10] hover:bg-[#121218] border border-white/[0.07] hover:border-red-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-sm"
                  >
                    <div>
                      {/* Miniatura compacta (Reducida para dar jerarquía al partido principal) */}
                      <Link
                        href={`/partido/${match.id}`}
                        prefetch={true}
                        className="relative block w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-black mb-3 border border-white/[0.08] group-hover:border-red-500/40 transition-colors shadow-inner"
                      >
                        {match.image_url ? (
                          <Image
                            src={match.image_url}
                            alt={match.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#052312] via-[#08180e] to-[#0c0c10] p-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15),transparent_75%)] pointer-events-none" />
                            <div className="relative z-10 flex items-center gap-3">
                              <div className="w-7 h-7 relative">
                                <Image src="/teams/blanco-y-negro.png" alt="Blanco y Negro" fill className="object-contain" />
                              </div>
                              <span className="text-emerald-400 font-mono font-bold text-[10px]">VS</span>
                              <div className="w-7 h-7 relative">
                                <Image src="/teams/ifc.png" alt="Rival" fill className="object-contain" />
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                        {/* Insignia sobre la miniatura */}
                        <div className="absolute top-2.5 left-2.5">
                          {isDateConfirmed ? (
                            <span className="px-2 py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/[0.1] text-[9px] font-mono text-white font-bold uppercase tracking-wider">
                              OFICIAL
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-950/90 backdrop-blur-md border border-amber-600/70 text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              A CONFIRMAR
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="flex items-center justify-between mb-2 text-xs font-mono">
                        {isDateConfirmed && matchDate ? (
                          <div className="flex items-center gap-1.5 text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md text-[10px]">
                            <Calendar className="w-3 h-3 text-red-500" />
                            <span>
                              {matchDate.toLocaleString('es-AR', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md text-[10px]">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span className="font-bold">FECHA A DEFINIR</span>
                          </div>
                        )}

                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">
                          TRANSMISIÓN OFICIAL
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white group-hover:text-red-400 transition-colors leading-snug mb-1">
                        {match.title}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-1 leading-relaxed mb-4 font-mono">
                        {match.description || 'Transmisión oficial para toda la hinchada.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div>
                        <span className="text-[8px] uppercase font-mono tracking-widest text-zinc-500 block">
                          Tarifa Pase
                        </span>
                        <span className="text-lg font-black font-mono text-white">
                          ${Number(match.price).toLocaleString('es-AR')}{' '}
                          <span className="text-xs text-red-500">ARS</span>
                        </span>
                      </div>

                      {hasAccess ? (
                        <Link
                          href={`/partido/${match.id}`}
                          prefetch={true}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 bg-white hover:bg-zinc-200 text-black"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>Ver Partido</span>
                        </Link>
                      ) : isDateConfirmed ? (
                        <Link
                          href={`/partido/${match.id}`}
                          prefetch={true}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 bg-white hover:bg-zinc-200 text-black"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 text-red-600" />
                          <span>Comprar</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/partido/${match.id}`}
                          prefetch={true}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-zinc-900 border border-amber-900/50 text-amber-400 hover:bg-zinc-800"
                        >
                          <Clock className="w-3 h-3" />
                          <span>A Confirmar</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================================== */}
        {/* 4. SPONSORS OFICIALES DE LA TRANSMISIÓN */}
        {/* ============================================================================== */}
        <SponsorsStrip />

        {/* ============================================================================== */}
        {/* 5. BANNER TÉCNICO INFORMATIVO */}
        {/* ============================================================================== */}
        <section className="bg-[#0c0c10] border border-white/[0.07] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>Transmisiones encriptadas con Cloudflare Stream</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Pase único por partido sin suscripción mensual obligatoria. Puedes comprar con tu email o registrar tu cuenta.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/login"
              className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-mono font-bold rounded-lg border border-white/[0.08] transition"
            >
              Crear Cuenta Opcional
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
