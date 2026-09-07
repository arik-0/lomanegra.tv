-- ==============================================================================
-- MIGRACIÓN 003: TABLA DE POSICIONES, ZONAS, PLAY-OFFS Y GOLEADORES
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.standings (
  id TEXT PRIMARY KEY, -- 'apertura' | 'clausura'
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;

-- Lectura pública para que cualquier usuario o visitante pueda consultar las tablas
DROP POLICY IF EXISTS "Anyone can view standings" ON public.standings;
CREATE POLICY "Anyone can view standings" 
  ON public.standings FOR SELECT 
  TO public 
  USING (true);

-- Escritura restringida al backend mediante la Service Role Key
DROP POLICY IF EXISTS "Service role can manage standings" ON public.standings;
CREATE POLICY "Service role can manage standings" 
  ON public.standings FOR ALL 
  TO service_role 
  USING (true)
  WITH CHECK (true);
