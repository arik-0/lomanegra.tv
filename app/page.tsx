import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import CountdownTimer from '@/components/CountdownTimer';
import SponsorsStrip from '@/components/SponsorsStrip';
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
} from 'lucide-react';

export const revalidate = 0; // Datos frescos en cada petición

export default async function HomePage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Obtener todos los partidos activos
  const { data: matches } = await supabaseAdmin
    .from('matches')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: true });

  // 2. Si el usuario está autenticado, obtener sus compras aprobadas
  let approvedMatchIds = new Set<string>();
  if (user) {
    const { data: purchases } = await supabaseAdmin
      .from('purchases')
      .select('match_id')
      .eq('user_id', user.id)
      .eq('status', 'approved');

    if (purchases) {
      approvedMatchIds = new Set(purchases.map((p) => p.match_id));
    }
  }

  // Datos estelares de respaldo para asegurar que el Hero y la Cartelera siempre se muestren
  const defaultFeaturedMatch = {
    id: '0790eca3-cc28-41bb-a4b8-8e2c0c514cdf',
    title: 'Blanco y Negro vs I. F. C.',
    description:
      'El gran clásico regional en vivo con relatos exclusivos, cámaras en campo de juego y repetición completa sin necesidad de abono mensual.',
    date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    price: 3500,
    cloudflare_live_input_uid: 'live_input_byn_vs_ifc',
    image_url: '/matches/blanco-y-negro-vs-ifc.png',
    is_active: true,
  };

  const defaultOtherMatches = [
    {
      id: '07ced47c-9f9a-4bce-a073-2c8e84b3de67',
      title: 'Boca Juniors vs River Plate - Superclásico Final',
      description: 'Transmisión exclusiva en 4K Ultra HD multicámara con relatos oficiales.',
      date: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      price: 4999,
      cloudflare_live_input_uid: 'mock_live_input_superclasico_01',
      image_url: null,
      is_active: true,
    },
    {
      id: 'de261139-f0e7-43d3-bd24-f2f9a7262fdf',
      title: 'Real Madrid vs Barcelona - El Clásico',
      description: 'La gran batalla europea en vivo con previa y post-partido exclusivo.',
      date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      price: 6500,
      cloudflare_live_input_uid: 'mock_live_input_elclasico_02',
      image_url: null,
      is_active: true,
    },
  ];

  // Identificar el partido estelar (Blanco y Negro vs I. F. C. o el primero)
  const activeMatches = matches && matches.length > 0 ? matches : [defaultFeaturedMatch, ...defaultOtherMatches];

  const featuredMatch =
    activeMatches.find((m) => m.title.toLowerCase().includes('blanco y negro')) ||
    activeMatches[0] ||
    defaultFeaturedMatch;

  const otherMatches = activeMatches.filter((m) => m.id !== featuredMatch.id);

  return (
    <main className="min-h-screen bg-[#08080a] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ============================================================================== */}
        {/* 1. HERO ESTELAR ESTILO FORG1.COM (HUD TACTICAL FRAME + SHADER GLOW) */}
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
              {/* Información y Cuenta Regresiva */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-950/70 border border-red-700/80 text-red-400 text-[10px] font-mono font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>TRANSMISIÓN EN VIVO // FECHA OFICIAL</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-[10px] font-mono">
                    <Radio className="w-3 h-3 text-red-500" />
                    <span>LOMANEGRA // STREAMING PPV</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-none [text-shadow:0_2px_24px_rgba(0,0,0,0.8)]">
                    {featuredMatch.title}
                  </h1>
                  <p className="mt-3 text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                    {featuredMatch.description ||
                      'El gran clásico regional en vivo con relatos exclusivos, cámaras en campo de juego y repetición completa sin necesidad de abono mensual.'}
                  </p>
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
                        alt="I. F. C."
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white tracking-wide">
                      I. F. C.
                    </span>
                  </div>
                </div>

                {/* Cuenta Regresiva */}
                <div className="pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">
                    Inicio de la transmisión:
                  </span>
                  <CountdownTimer targetDate={featuredMatch.date} />
                </div>

                {/* Precio y CTA Principal (Estilo Forg1) */}
                <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">
                      Pase de Partido
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                      ${Number(featuredMatch.price).toLocaleString('es-AR')}{' '}
                      <span className="text-xs font-bold text-red-500">ARS</span>
                    </span>
                  </div>

                  <Link
                    href={`/partido/${featuredMatch.id}`}
                    className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.12)] active:scale-95 ${
                      approvedMatchIds.has(featuredMatch.id)
                        ? 'bg-white hover:bg-zinc-200 text-black'
                        : 'bg-white hover:bg-zinc-200 text-black'
                    }`}
                  >
                    {approvedMatchIds.has(featuredMatch.id) ? (
                      <>
                        <PlayCircle className="w-4 h-4 text-red-600" />
                        <span>Ver Transmisión</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-red-600" />
                        <span>Comprar Pase Directo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 pt-1">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <CheckCircle2 className="w-3 h-3 text-red-500" />
                    Sin cuenta requerida
                  </span>
                  <span>//</span>
                  <span>Mercado Pago Seguro</span>
                  <span>//</span>
                  <span>1 Pantalla HD</span>
                </div>
              </div>

              {/* Imagen / Encuadre Oficial del Partido */}
              <div className="lg:col-span-5">
                <Link
                  href={`/partido/${featuredMatch.id}`}
                  className="block relative rounded-2xl overflow-hidden border border-white/[0.1] hover:border-red-500/60 transition-all duration-300 shadow-2xl group"
                >
                  <div className="relative w-full aspect-video bg-black flex items-center justify-center p-2">
                    {featuredMatch.image_url ? (
                      <Image
                        src={featuredMatch.image_url}
                        alt={featuredMatch.title}
                        fill
                        priority
                        className="object-contain transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Tv className="w-16 h-16 text-zinc-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-white/[0.1] text-white text-[10px] font-mono uppercase font-bold flex items-center gap-1.5 group-hover:bg-red-600 group-hover:border-red-500 transition-colors">
                      <PlayCircle className="w-3.5 h-3.5 text-red-500 group-hover:text-white" />
                      <span>Ingresar al Player</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================================== */}
        {/* 2. GRILLA CONECTADA DE 4 MÉTRICAS (FORG1 METRIC GRID) */}
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
              KICKOFF
            </div>
            <div className="text-xl sm:text-3xl font-black font-mono tracking-tight text-white leading-none">
              HOY 17:00
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
                const matchDate = new Date(match.date);

                return (
                  <div
                    key={match.id}
                    className="group bg-[#0c0c10] hover:bg-[#121218] border border-white/[0.07] hover:border-red-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-md text-[10px]">
                          <Calendar className="w-3 h-3 text-red-500" />
                          <span>
                            {matchDate.toLocaleString('es-AR', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">
                          PPV OFICIAL
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white group-hover:text-red-400 transition-colors leading-snug mb-2">
                        {match.title}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-5">
                        {match.description || 'Transmisión en vivo oficial para hinchas.'}
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

                      <Link
                        href={`/partido/${match.id}`}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                          hasAccess
                            ? 'bg-white hover:bg-zinc-200 text-black'
                            : 'bg-white hover:bg-zinc-200 text-black'
                        }`}
                      >
                        {hasAccess ? (
                          <>
                            <PlayCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Ver Partido</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5 text-red-600" />
                            <span>Comprar</span>
                          </>
                        )}
                      </Link>
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
