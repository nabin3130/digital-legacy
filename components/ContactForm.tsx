"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/contact/Contact.module.css";

const recipient = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kimnabin01@gmail.com";

export default function ContactForm({ locale = "ko" }: { locale?: "ko" | "en" }) {
  const isEnglish = locale === "en";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recipient) return;
    setStatus("sending");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: isEnglish ? "Logout website inquiry" : "로그아웃 웹사이트 문의",
          _template: "table",
          _captcha: "false",
          email,
          message,
        }),
      });

      if (!response.ok) throw new Error("문의 전송에 실패했습니다.");
      setEmail("");
      setMessage("");
      setStatus("sent");
      window.alert(isEnglish ? "Your message has been sent. We’ll reply to the email you entered." : "문의가 전송되었습니다. 확인 후 입력한 이메일로 답변드릴게요.");
    } catch {
      setStatus("error");
      window.alert(isEnglish ? "We couldn’t send your message. Please try again shortly." : "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <label htmlFor="contact-email">{isEnglish ? "Email for replies" : "연락받을 이메일"}</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">{isEnglish ? "Message" : "문의 내용"}</label>
        <textarea id="contact-message" name="message" required value={message} onChange={(event) => setMessage(event.target.value)} placeholder={isEnglish ? "Tell us how we can help." : "문의 내용을 적어주세요."} />
      </div>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? (isEnglish ? "Sending…" : "보내는 중…") : (isEnglish ? "Send message" : "문의 보내기")}</button>
      <p className={styles.notice} aria-live="polite">
        {status === "sent" && (isEnglish ? "Your message has been sent. We’ll reply to the email you entered." : "문의가 전송되었습니다. 확인 후 입력한 이메일로 답변드릴게요.")}
        {status === "error" && (isEnglish ? "We couldn’t send your message. Please try again shortly." : "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.")}
        {status === "idle" && (isEnglish ? "Your message will be delivered directly to the Logout project team." : "입력한 내용은 로그아웃 운영자 이메일로 바로 전달됩니다.")}
      </p>
    </form>
  );
}
