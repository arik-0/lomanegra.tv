import { createClient } from '@supabase/supabase-js';

// Cliente con permisos de superusuario (Service Role) para omitir RLS de forma segura en Route Handlers
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
