import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";
import styles from "@/app/contact/Contact.module.css";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/contact",
  title: "Contact",
  description: "Tell us about incorrect policy information or a service you would like us to add.",
});

export default function EnglishContactPage() {
  return <main className={styles.page}><div className="container"><header className={styles.heading}><p className="eyebrow">CONTACT</p><h1>Contact us</h1><p>Tell us about incorrect policy information or a service you would like us to add.</p></header><ContactForm locale="en" /></div></main>;
}
