import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cookie-free anon client for the public blog pages, so they stay
 * ISR-cacheable (a cookie-bound client would force dynamic rendering).
 * RLS only exposes published posts to this client.
 *
 * Returns null when Supabase env vars aren't set yet, so the site still
 * builds and runs (with an empty blog) before the project is configured.
 */
export function createPublicClient() {
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}
