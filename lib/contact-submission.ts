const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CONTACT_EMAIL_MAX = 320;
export const CONTACT_MESSAGE_MAX = 4000;

export type ContactLocale = "ko" | "en";

export type ContactSubmission = {
  locale: ContactLocale;
  email: string;
  message: string;
};

export type ContactActionResult =
  | { ok: true; stored: boolean; ignored?: boolean }
  | { ok: false; code: "invalid" | "rate_limited" | "not_configured" | "unavailable" };

export type ContactFollowUp = {
  notifyByEmail: boolean;
  outcome: "success" | "email_required" | "invalid" | "rate_limited";
};

export function parseContactSubmission(input: {
  locale?: unknown;
  email?: unknown;
  message?: unknown;
  companyWebsiteConfirm?: unknown;
}): { ok: true; honeypot: boolean; value: ContactSubmission } | { ok: false } {
  if (typeof input.companyWebsiteConfirm === "string" && input.companyWebsiteConfirm.trim() !== "") {
    return { ok: true, honeypot: true, value: { locale: "ko", email: "", message: "" } };
  }

  const locale = input.locale === "en" ? "en" : input.locale === "ko" ? "ko" : null;
  if (!locale || typeof input.email !== "string" || typeof input.message !== "string") return { ok: false };

  const email = input.email.trim();
  const message = input.message.trim();
  if (!EMAIL_PATTERN.test(email) || email.length > CONTACT_EMAIL_MAX) return { ok: false };
  if (message.length < 1 || message.length > CONTACT_MESSAGE_MAX) return { ok: false };

  return { ok: true, honeypot: false, value: { locale, email, message } };
}

export function contactStorageFailure(message: string): "rate_limited" | "invalid" | "unavailable" {
  if (message.includes("rate_limited")) return "rate_limited";
  if (message.includes("invalid_email") || message.includes("invalid_message") || message.includes("invalid_locale")) {
    return "invalid";
  }
  return "unavailable";
}

export function planContactDelivery(result: ContactActionResult): ContactFollowUp {
  if (!result.ok) {
    if (result.code === "invalid" || result.code === "rate_limited") {
      return { notifyByEmail: false, outcome: result.code };
    }
    return { notifyByEmail: true, outcome: "email_required" };
  }

  if (result.ignored) return { notifyByEmail: false, outcome: "success" };
  if (result.stored) return { notifyByEmail: true, outcome: "success" };
  return { notifyByEmail: true, outcome: "email_required" };
}
