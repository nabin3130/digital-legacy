import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseEnv } from "./supabase-env";

export function createClient() {
  const { url, key } = assertSupabaseEnv();
  return createBrowserClient(url, key);
}
