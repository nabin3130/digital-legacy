import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertSupabaseEnv } from "./supabase-env";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function createServerSupabaseClient() {
  const { url, key } = assertSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. This product has no signed-in session,
          // so a missing write here does not drop user state.
        }
      },
    },
  });
}
