import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Single GoTrueClient instance in the browser to avoid "Multiple GoTrueClient instances" warning
const globalForSupabase = typeof window !== "undefined" ? window : (globalThis as typeof globalThis & { __supabase?: SupabaseClient });
if (!globalForSupabase.__supabase) {
  globalForSupabase.__supabase = createClient(supabaseUrl, supabaseAnonKey);
}
export const supabase = globalForSupabase.__supabase;
