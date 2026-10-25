"use server";

import {
  contactStorageFailure,
  parseContactSubmission,
  type ContactActionResult,
  type ContactSubmission,
} from "@/lib/contact-submission";
import type { Database } from "@/lib/database.types";
import { isSupabaseConfigured } from "@/lib/supabase-env";
import { createServerSupabaseClient } from "@/lib/supabase-server";

async function storeContact(submission: ContactSubmission): Promise<ContactActionResult> {
  if (!isSupabaseConfigured()) return { ok: false, code: "not_configured" };

  try {
    const supabase = await createServerSupabaseClient();
    const args: Database["public"]["Functions"]["submit_contact"]["Args"] = {
      p_locale: submission.locale,
      p_email: submission.email,
      p_message: submission.message,
    };
    const { error } = await supabase.rpc("submit_contact", args);

    if (!error) return { ok: true, stored: true };

    const code = contactStorageFailure(error.message);
    if (code === "unavailable") console.error("Supabase contact storage unavailable", error.code);
    return { ok: false, code };
  } catch {
    console.error("Supabase contact storage failed before a response");
    return { ok: false, code: "unavailable" };
  }
}

export async function submitContact(input: {
  locale?: unknown;
  email?: unknown;
  message?: unknown;
  companyWebsiteConfirm?: unknown;
}): Promise<ContactActionResult> {
  const parsed = parseContactSubmission(input);
  if (!parsed.ok) return { ok: false, code: "invalid" };
  if (parsed.honeypot) return { ok: true, stored: false, ignored: true };
  return storeContact(parsed.value);
}
