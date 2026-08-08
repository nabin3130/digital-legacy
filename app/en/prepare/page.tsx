import type { Metadata } from "next";
import Link from "next/link";
import { commonDocuments, commonProcedures } from "@/lib/common-guidance";
import styles from "@/app/prepare/Prepare.module.css";

export const metadata: Metadata = { title: "Prepare", description: "Prepare documents commonly requested in digital legacy procedures.", alternates: { canonical: "/en/prepare" } };
const safeInheritance = commonProcedures.find((item) => item.id === "safe-inheritance");

export default function EnglishPreparePage() {
  return <main className={styles.page}><div className="container">
    <header className={styles.heading}><p className="eyebrow">PREPARE</p><h1>Prepare to manage a digital account</h1><p>Review common documents and the basic process before starting a company-specific request.</p></header>
    <section id="documents" className={styles.section} aria-labelledby="documents-title"><div className={styles.sectionHeading}><h2 id="documents-title">Commonly requested documents</h2><p>Requirements vary by company, but these documents are frequently requested in Korea.</p></div>
      <div className={styles.documentGrid}>{commonDocuments.map((document) => <article className={styles.documentCard} id={document.id} key={document.id}><div><span className={styles.badge}>{document.online ? "Available online" : "Issued by a medical institution"}</span><h3>{document.name.en}</h3></div><dl><div><dt>When is it needed?</dt><dd>{document.purpose.en}</dd></div><div><dt>How do I get it?</dt><dd>{document.issueMethod.en}</dd></div></dl>{document.url ? <a className={styles.primaryButton} href={document.url} target="_blank" rel="noopener noreferrer" aria-label={`Get ${document.name.en} (opens in a new tab)`}>Get document ↗</a> : <span className={styles.offlineButton}>Ask the hospital</span>}</article>)}</div>
    </section>
    <section className={styles.section} aria-labelledby="process-title"><div className={styles.sectionHeading}><h2 id="process-title">Common process</h2></div><ol className={styles.flow}><li><strong>1</strong><span>Prepare the required documents.</span></li><li><strong>2</strong><span>Choose a company.</span></li><li><strong>3</strong><span>Follow the company-specific process.</span></li></ol><Link className={styles.companyLink} href="/en/#services">Choose a company →</Link></section>
    {safeInheritance?.url && <section className={styles.governmentSection} aria-labelledby="government-title"><p className="eyebrow">GOVERNMENT SERVICE</p><article className={styles.serviceCard}><div><h2 id="government-title">One-stop Inheritance Service</h2><p>Check financial assets, vehicles, land, national pension information, and other administrative records in one place.</p></div><a href={safeInheritance.url} target="_blank" rel="noopener noreferrer" aria-label="Open One-stop Inheritance Service in a new tab">Visit service ↗</a></article></section>}
  </div></main>;
}
