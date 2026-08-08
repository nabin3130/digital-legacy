"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/contact/Contact.module.css";

const recipient = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kimnabin01@gmail.com";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recipient) return;
    const subject = encodeURIComponent("망각인프라 웹사이트 문의");
    const body = encodeURIComponent(`회신 받을 이메일: ${email}\n\n문의 내용:\n${message}`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
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
      <button type="submit">이메일로 문의 보내기</button>
      <p className={styles.notice}>버튼을 누르면 사용 중인 이메일 앱에서 문의 내용을 확인한 뒤 보낼 수 있어요.</p>
    </form>
  );
}
