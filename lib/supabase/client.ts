import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : 'https://cyigamszhhdluqstjcut.supabase.co';

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : 'sb_publishable_0DiTRMSrhy3FU8Jc-gl-0A_L6_ORFWP';

  return createBrowserClient(url, key);
}
