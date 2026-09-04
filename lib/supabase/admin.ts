import { createClient } from '@supabase/supabase-js';

// Cliente con permisos de superusuario (Service Role) para omitir RLS de forma segura en Route Handlers
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
