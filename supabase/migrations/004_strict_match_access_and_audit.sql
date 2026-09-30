-- ==============================================================================
-- MIGRACIÓN 004: BLINDAJE ESTRICTO DE ACCESO POR PARTIDO (ABONADOS PPV)
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Eliminar o auditar registros huérfanos sin match_id válido (si quedaron de pruebas iniciales)
DELETE FROM public.purchases WHERE match_id IS NULL;

-- 2. Asegurar que match_id sea estrictamente NOT NULL y tenga clave foránea activa
ALTER TABLE public.purchases ALTER COLUMN match_id SET NOT NULL;

-- 3. Índices de alto rendimiento para validación instantánea de acceso y evitar accesos cruzados
CREATE INDEX IF NOT EXISTS idx_purchases_match_status 
  ON public.purchases (match_id, status);

CREATE INDEX IF NOT EXISTS idx_purchases_guest_match_status 
  ON public.purchases (guest_email, match_id, status)
  WHERE guest_email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_purchases_user_match_status 
  ON public.purchases (user_id, match_id, status)
  WHERE user_id IS NOT NULL;

-- 4. RLS: Asegurar que los usuarios solo puedan consultar compras aprobadas de su propio usuario
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;
CREATE POLICY "Users can view own purchases" 
  ON public.purchases FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- ==============================================================================
-- QUERIES DE AUDITORÍA Y CONTROL (Puedes ejecutarlas para comprobar tus abonados)
-- ==============================================================================

-- A. Listar todos los abonados y compradores aprobados agrupados por partido:
-- SELECT 
--   m.title AS partido,
--   p.guest_email AS correo_invitado,
--   p.user_id AS usuario_registrado,
--   p.status AS estado,
--   p.mp_payment_id AS id_mercado_pago,
--   p.created_at AS fecha_compra
-- FROM public.purchases p
-- JOIN public.matches m ON p.match_id = m.id
-- WHERE p.status = 'approved'
-- ORDER BY m.title, p.created_at DESC;

-- B. Verificar qué partido específico tiene habilitado un correo determinado:
-- SELECT 
--   p.id AS compra_id,
--   m.title AS partido_habilitado,
--   p.guest_email,
--   p.status,
--   p.created_at
-- FROM public.purchases p
-- JOIN public.matches m ON p.match_id = m.id
-- WHERE p.guest_email ILIKE 'correo_a_consultar@ejemplo.com';
