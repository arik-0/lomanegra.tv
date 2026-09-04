-- ==============================================================================
-- FÚTBOL PPV - ESQUEMA DE BASE DE DATOS SUPABASE
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 0. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. TABLA: profiles (Perfiles de usuarios)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 2. TABLA: matches (Partidos / Eventos PPV)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  cloudflare_live_input_uid TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 3. TABLA: purchases (Compras / Pases PPV de usuarios o invitados)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_email TEXT,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  mp_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_user_match_idx 
  ON public.purchases (user_id, match_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS unique_guest_match_idx 
  ON public.purchases (guest_email, match_id) 
  WHERE guest_email IS NOT NULL;

-- ==============================================================================
-- 4. TABLA: active_sessions (Control de Sesión Única / Anti-Concurrencia)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.active_sessions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  last_heartbeat TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 5. TRIGGER: Creación automática de Perfil al registrarse en Supabase Auth
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 6. SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas anteriores si existen
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view active matches" ON public.matches;
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can view own active session" ON public.active_sessions;
DROP POLICY IF EXISTS "Users can update own active session" ON public.active_sessions;

-- Profiles: Cada usuario puede consultar únicamente su propio perfil
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Matches: Cualquier usuario (incluso anónimos) puede ver partidos marcados como activos
CREATE POLICY "Anyone can view active matches" 
  ON public.matches FOR SELECT 
  TO anon, authenticated 
  USING (is_active = TRUE);

-- Purchases: Los usuarios autenticados solo pueden consultar sus propias compras aprobadas o pendientes
CREATE POLICY "Users can view own purchases" 
  ON public.purchases FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Purchases: INSERTS y UPDATES están completamente bloqueados para clientes (anon y authenticated).
-- Únicamente el backend con SUPABASE_SERVICE_ROLE_KEY (Webhooks de Mercado Pago) puede modificar compras.

-- Active Sessions: Lectura y actualización de la sesión activa del usuario
CREATE POLICY "Users can view own active session" 
  ON public.active_sessions FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own active session" 
  ON public.active_sessions FOR ALL 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 7. DATOS DE PRUEBA (Partidos de Ejemplo)
-- ==============================================================================
INSERT INTO public.matches (title, description, date, price, cloudflare_live_input_uid, image_url, is_active)
VALUES 
  (
    'Blanco y Negro vs I. F. C.',
    'Gran clásico oficial transmitido en vivo y en directo en Ultra HD. Acceso exclusivo Pay-Per-View para hinchas de ambos clubes.',
    NOW() + INTERVAL '1 day',
    3500.00,
    'live_input_byn_vs_ifc',
    '/matches/blanco-y-negro-vs-ifc.png',
    TRUE
  ),
  (
    'Boca Juniors vs River Plate - Superclásico Final',
    'Transmisión exclusiva en 4K Ultra HD multicámara con relatos oficiales.',
    NOW() + INTERVAL '2 hours',
    4999.00,
    'mock_live_input_superclasico_01',
    NULL,
    TRUE
  ),
  (
    'Real Madrid vs Barcelona - El Clásico',
    'La gran batalla europea en vivo con previa y post-partido exclusivo.',
    NOW() + INTERVAL '2 days',
    6500.00,
    'mock_live_input_elclasico_02',
    NULL,
    TRUE
  )
ON CONFLICT DO NOTHING;
