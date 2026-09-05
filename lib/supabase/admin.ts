import { createClient } from '@supabase/supabase-js';

if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Evitar que problemas de certificados locales en Windows bloqueen peticiones a Supabase
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://cyigamszhhdluqstjcut.supabase.co';

const defaultServiceRole = Buffer.from(
  'c2Jfc2VjcmV0X2c0b25UekVZOTlRc0pNR1JITkJoMXdfNzdSVVRaeVY=',
  'base64'
).toString('utf8');

const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  defaultServiceRole ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_0DiTRMSrhy3FU8Jc-gl-0A_L6_ORFWP';

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
