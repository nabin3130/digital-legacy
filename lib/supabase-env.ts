const URL_NAME = "NEXT_PUBLIC_SUPABASE_URL";
const ANON_KEY_NAME = "NEXT_PUBLIC_SUPABASE_ANON_KEY";
const PUBLISHABLE_KEY_NAME = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

export type SupabaseEnv = {
  url: string;
  key: string;
};

type EnvSource = Record<string, string | undefined>;

function trimmed(source: EnvSource, name: string) {
  const value = source[name];
  if (typeof value !== "string") return "";
  return value.trim();
}

export function readSupabaseEnv(source: EnvSource = process.env): SupabaseEnv | null {
  const url = trimmed(source, URL_NAME);
  const key = trimmed(source, ANON_KEY_NAME) || trimmed(source, PUBLISHABLE_KEY_NAME);
  if (!url || !key) return null;
  return { url, key };
}

export function missingSupabaseEnvNames(source: EnvSource = process.env) {
  const missing: string[] = [];
  if (!trimmed(source, URL_NAME)) missing.push(URL_NAME);
  if (!trimmed(source, ANON_KEY_NAME) && !trimmed(source, PUBLISHABLE_KEY_NAME)) {
    missing.push(ANON_KEY_NAME);
  }
  return missing;
}

export function supabaseEnvError(source: EnvSource = process.env) {
  const missing = missingSupabaseEnvNames(source);
  return `Supabase is not configured. Set ${missing.join(" and ")}. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY may be used instead of the anon key. Do not set a service role or secret key in a NEXT_PUBLIC variable.`;
}

export function isSupabaseConfigured(source: EnvSource = process.env) {
  return readSupabaseEnv(source) !== null;
}

export function assertSupabaseEnv(source: EnvSource = process.env) {
  const env = readSupabaseEnv(source);
  if (!env) throw new Error(supabaseEnvError(source));
  return env;
}
