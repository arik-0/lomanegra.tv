-- ==============================================================================
-- MIGRACIÓN 002 CORREGIDA: ACCESO INVITADOS Y BLANCO Y NEGRO VS I. F. C.
-- Ejecutar en Supabase -> SQL Editor
-- ==============================================================================

-- 1. Permitir compras sin cuenta (invitados mediante guest_email)
ALTER TABLE public.purchases ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- 2. Actualizar índices únicos
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS unique_user_match;
DROP INDEX IF EXISTS unique_user_match_idx;
DROP INDEX IF EXISTS unique_guest_match_idx;

CREATE UNIQUE INDEX IF NOT EXISTS unique_user_match_idx 
  ON public.purchases (user_id, match_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS unique_guest_match_idx 
  ON public.purchases (guest_email, match_id) 
  WHERE guest_email IS NOT NULL;

-- 3. Adaptar active_sessions para soportar invitados (eliminando políticas previas)
DROP POLICY IF EXISTS "Users can view own active session" ON public.active_sessions;
DROP POLICY IF EXISTS "Users can update own active session" ON public.active_sessions;

ALTER TABLE public.active_sessions DROP CONSTRAINT IF EXISTS active_sessions_user_id_fkey;
ALTER TABLE public.active_sessions ALTER COLUMN user_id TYPE TEXT;

-- Recrear las políticas RLS adaptadas al nuevo tipo TEXT
CREATE POLICY "Users can view own active session" 
  ON public.active_sessions FOR SELECT 
  TO authenticated 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own active session" 
  ON public.active_sessions FOR ALL 
  TO authenticated 
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- 4. Agregar columna de imagen de portada a la tabla matches si no existe
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 5. Insertar el partido estelar evitando duplicados mediante WHERE NOT EXISTS
INSERT INTO public.matches (
  title, 
  description, 
  date, 
  price, 
  cloudflare_live_input_uid, 
  is_active, 
  image_url
)
SELECT 
  'Blanco y Negro vs I. F. C.',
  'Gran clásico oficial transmitido en vivo y en directo en Ultra HD. Acceso exclusivo Pay-Per-View para hinchas de ambos clubes.',
  NOW() + INTERVAL '1 day',
  3500.00,
  'live_input_byn_vs_ifc',
  TRUE,
  '/matches/blanco-y-negro-vs-ifc.png'
WHERE NOT EXISTS (
  SELECT 1 FROM public.matches WHERE title = 'Blanco y Negro vs I. F. C.'
);
