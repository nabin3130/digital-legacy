"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/contact/Contact.module.css";

const recipient = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kimnabin01@gmail.com";

export default function ContactForm() {
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
          _subject: "망각인프라 웹사이트 문의",
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
      window.alert("문의가 전송되었습니다. 확인 후 입력한 이메일로 답변드릴게요.");
    } catch {
      setStatus("error");
      window.alert("문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}>
        <label htmlFor="contact-email">연락받을 이메일</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">문의 내용</label>
        <textarea id="contact-message" name="message" required value={message} onChange={(event) => setMessage(event.target.value)} placeholder="문의 내용을 적어주세요." />
      </div>
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "보내는 중…" : "문의 보내기"}</button>
      <p className={styles.notice} aria-live="polite">
        {status === "sent" && "문의가 전송되었습니다. 확인 후 입력한 이메일로 답변드릴게요."}
        {status === "error" && "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요."}
        {status === "idle" && "입력한 내용은 망각인프라 운영자 이메일로 바로 전달됩니다."}
      </p>
    </form>
  );
}
