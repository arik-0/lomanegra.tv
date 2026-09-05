import { createClient } from '@supabase/supabase-js';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://cyigamszhhdluqstjcut.supabase.co';

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_0DiTRMSrhy3FU8Jc-gl-0A_L6_ORFWP';

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
