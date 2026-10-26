"use client";

import { useState, type FormEvent } from "react";
import { submitContact } from "@/app/contact/actions";
import { CONTACT_EMAIL_MAX, CONTACT_MESSAGE_MAX, parseContactSubmission, planContactDelivery } from "@/lib/contact-submission";
import { isSupabaseConfigured } from "@/lib/supabase-env";
import styles from "@/app/contact/Contact.module.css";

const recipient = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "kimnabin01@gmail.com";

const copy = {
  ko: {
    emailLabel: "연락받을 이메일",
    messageLabel: "문의 내용",
    messagePlaceholder: "문의 내용을 적어주세요.",
    send: "문의 보내기",
    sending: "보내는 중…",
    sent: "문의가 전송되었습니다. 확인 후 입력한 이메일로 답변드릴게요.",
    error: "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    invalid: "이메일과 문의 내용을 확인해 주세요.",
    rateLimited: "같은 이메일로 짧은 시간에 여러 번 문의가 접수되었습니다. 잠시 후 다시 시도해 주세요.",
    idle: "문의 내용은 로그아웃 운영자에게 전달됩니다.",
    hint: "계정 비밀번호, 신분증, 사망증명서 같은 증빙서류는 보내지 마세요.",
    subject: "로그아웃 웹사이트 문의",
  },
  en: {
    emailLabel: "Email for replies",
    messageLabel: "Message",
    messagePlaceholder: "Tell us how we can help.",
    send: "Send message",
    sending: "Sending…",
    sent: "Your message has been sent. We’ll reply to the email you entered.",
    error: "We couldn’t send your message. Please try again shortly.",
    invalid: "Check the email address and message, then try again.",
    rateLimited: "Too many messages were sent from this email. Please try again later.",
    idle: "Your message is delivered to the Logout team.",
    hint: "Do not send passwords, ID copies, or certificates.",
    subject: "Logout website inquiry",
  },
} as const;

async function notifyByEmail(locale: "ko" | "en", email: string, message: string) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: copy[locale].subject,
      _template: "table",
      _captcha: "false",
      email,
      message,
    }),
  });
  if (!response.ok) throw new Error("contact email failed");
}

export default function ContactForm({ locale = "ko" }: { locale?: "ko" | "en" }) {
  const text = copy[locale];
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "invalid" | "rate_limited">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    try {
      const parsed = parseContactSubmission({
        locale,
        email,
        message,
        companyWebsiteConfirm: website,
      });
      if (!parsed.ok) {
        setStatus("invalid");
        return;
      }
      if (parsed.honeypot) {
        setEmail("");
        setMessage("");
        setWebsite("");
        setStatus("sent");
        return;
      }

      const result = isSupabaseConfigured()
        ? await submitContact(parsed.value)
        : { ok: false as const, code: "not_configured" as const };
      const plan = planContactDelivery(result);

      if (plan.outcome === "invalid") {
        setStatus("invalid");
        return;
      }
      if (plan.outcome === "rate_limited") {
        setStatus("rate_limited");
        return;
      }
      if (plan.notifyByEmail) {
        try {
          await notifyByEmail(locale, parsed.value.email, parsed.value.message);
        } catch {
          if (plan.outcome === "email_required") {
            setStatus("error");
            return;
          }
        }
      }

      setEmail("");
      setMessage("");
      setWebsite("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const notice =
    status === "sent" ? text.sent :
    status === "error" ? text.error :
    status === "invalid" ? text.invalid :
    status === "rate_limited" ? text.rateLimited :
    text.idle;

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="company-website-confirm">Website</label>
        <input
          id="company-website-confirm"
          name="company_website_confirm"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-email">{text.emailLabel}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={CONTACT_EMAIL_MAX}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">{text.messageLabel}</label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={CONTACT_MESSAGE_MAX}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={text.messagePlaceholder}
          aria-describedby="contact-hint"
        />
      </div>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? text.sending : text.send}</button>
      <p className={styles.notice} aria-live="polite">{notice}</p>
      <p id="contact-hint" className={styles.hint}>{text.hint}</p>
    </form>
  );
}
