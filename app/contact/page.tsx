import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";
import styles from "./Contact.module.css";

export const metadata: Metadata = pageMetadata({
  locale: "ko",
  koPath: "/contact",
  title: "문의",
  description: "잘못된 정책 정보나 추가가 필요한 서비스를 로그아웃에 알려 주세요.",
});

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.heading}>
          <p className="eyebrow">문의</p>
          <h1>문의하기</h1>
          <p>잘못된 정책 정보나 추가했으면 하는 서비스를 알려주세요.</p>
        </header>
        <ContactForm />
      </div>
    </main>
  );
}
