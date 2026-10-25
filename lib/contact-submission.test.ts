import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contactStorageFailure, parseContactSubmission, planContactDelivery } from "./contact-submission";
import { missingSupabaseEnvNames, readSupabaseEnv, supabaseEnvError } from "./supabase-env";

describe("parseContactSubmission", () => {
  it("accepts a trimmed Korean inquiry", () => {
    const parsed = parseContactSubmission({
      locale: "ko",
      email: "  name@example.com  ",
      message: "  정책 링크가 오래되었어요.  ",
    });
    assert.deepEqual(parsed, {
      ok: true,
      honeypot: false,
      value: { locale: "ko", email: "name@example.com", message: "정책 링크가 오래되었어요." },
    });
  });

  it("rejects a blank message and an invalid email", () => {
    assert.equal(parseContactSubmission({ locale: "en", email: "name@example.com", message: "   " }).ok, false);
    assert.equal(parseContactSubmission({ locale: "en", email: "not-an-email", message: "Hello" }).ok, false);
    assert.equal(parseContactSubmission({ locale: "fr", email: "name@example.com", message: "Hello" }).ok, false);
  });

  it("treats a filled honeypot as ignorable", () => {
    const parsed = parseContactSubmission({
      locale: "en",
      email: "name@example.com",
      message: "Hello",
      companyWebsiteConfirm: "https://spam.example",
    });
    assert.equal(parsed.ok, true);
    if (parsed.ok) assert.equal(parsed.honeypot, true);
  });
});

describe("planContactDelivery", () => {
  it("keeps a stored inquiry successful and still notifies by email", () => {
    assert.deepEqual(planContactDelivery({ ok: true, stored: true }), {
      notifyByEmail: true,
      outcome: "success",
    });
  });

  it("does not email a honeypot or a rate-limited sender", () => {
    assert.deepEqual(planContactDelivery({ ok: true, stored: false, ignored: true }), {
      notifyByEmail: false,
      outcome: "success",
    });
    assert.deepEqual(planContactDelivery({ ok: false, code: "rate_limited" }), {
      notifyByEmail: false,
      outcome: "rate_limited",
    });
  });

  it("falls back to email when Supabase is not configured or unavailable", () => {
    assert.equal(planContactDelivery({ ok: false, code: "not_configured" }).outcome, "email_required");
    assert.equal(planContactDelivery({ ok: false, code: "unavailable" }).outcome, "email_required");
  });
});

describe("contactStorageFailure", () => {
  it("maps database exceptions without treating unknown errors as validation", () => {
    assert.equal(contactStorageFailure("rate_limited"), "rate_limited");
    assert.equal(contactStorageFailure("invalid_email"), "invalid");
    assert.equal(contactStorageFailure("Could not find the function public.submit_contact"), "unavailable");
  });
});

describe("readSupabaseEnv", () => {
  it("accepts the anon key or the publishable key alias", () => {
    assert.deepEqual(
      readSupabaseEnv({ NEXT_PUBLIC_SUPABASE_URL: " https://example.supabase.co ", NEXT_PUBLIC_SUPABASE_ANON_KEY: " anon " }),
      { url: "https://example.supabase.co", key: "anon" },
    );
    assert.equal(
      readSupabaseEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test" })?.key,
      "sb_publishable_test",
    );
  });

  it("names the missing variables in the operator error", () => {
    assert.deepEqual(missingSupabaseEnvNames({}), ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]);
    assert.match(supabaseEnvError({}), /NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY/);
    assert.equal(readSupabaseEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co" }), null);
  });
});
