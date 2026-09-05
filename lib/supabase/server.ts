import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : 'https://cyigamszhhdluqstjcut.supabase.co';

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : 'sb_publishable_0DiTRMSrhy3FU8Jc-gl-0A_L6_ORFWP';

  return createServerClient(url, key, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // El método `set` fallará silenciosamente si es llamado desde un Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // El método `remove` fallará silenciosamente si es llamado desde un Server Component
          }
        },
      },
    }
  );
}
