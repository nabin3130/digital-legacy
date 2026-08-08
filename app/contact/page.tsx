import ContactForm from "@/components/ContactForm";
import styles from "./Contact.module.css";

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.heading}>
          <p className="eyebrow">CONTACT</p>
          <h1>문의하기</h1>
          <p>잘못된 정책 정보나 추가했으면 하는 서비스를 알려주세요.</p>
        </header>
        <ContactForm />
      </div>
    </main>
  );
}
