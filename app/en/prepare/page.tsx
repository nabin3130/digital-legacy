import type { Metadata } from "next";
import Link from "next/link";
import { commonDocuments, commonProcedures } from "@/lib/common-guidance";
import styles from "@/app/prepare/Prepare.module.css";

export const metadata: Metadata = {
  title: "Prepare",
  description: "Quickly check the purposes and issuance methods of commonly required documents for digital legacy procedures.",
  alternates: { canonical: "/en/prepare" },
};

const safeInheritance = commonProcedures.find((item) => item.id === "safe-inheritance");

export default function EnglishPreparePage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.heading}>
          <p className="eyebrow">PREPARE DOCUMENTS</p>
          <h1>Prepare to manage digital accounts</h1>
          <p>Review commonly required documents and the general process before starting company-specific requests.</p>
        </header>

        <section className={`${styles.section} ${styles.processSection}`} aria-labelledby="process-title">
          <div className={styles.sectionHeading}>
            <h2 id="process-title">General Process</h2>
          </div>
          <ol className={styles.flow}>
            <li>
              <strong>1</strong>
              <span>Prepare required certificates.</span>
            </li>
            <li>
              <strong>2</strong>
              <span>Choose a company.</span>
            </li>
            <li>
              <strong>3</strong>
              <span>Follow the company-specific official guide.</span>
            </li>
          </ol>
          <Link className={styles.companyLink} href="/en/services">
            Choose a company
          </Link>
        </section>

        <section id="documents" className={styles.section} aria-labelledby="documents-title">
          <div className={styles.sectionHeading}>
            <h2 id="documents-title">Commonly Required Documents</h2>
            <p>Requirements may vary slightly by platform, but most services request the documents below.</p>
          </div>
          <div className={styles.documentGrid}>
            {commonDocuments.map((document) => (
              <article className={styles.documentCard} id={document.id} key={document.id}>
                <div>
                  <span className={styles.badge}>
                    {document.online ? "Available Online" : "Issued by Medical Institution"}
                  </span>
                  <h3>{document.name.en}</h3>
                </div>
                <dl>
                  <div>
                    <dt>When is it needed?</dt>
                    <dd>{document.purpose.en}</dd>
                  </div>
                  <div>
                    <dt>How to obtain it?</dt>
                    <dd>{document.issueMethod.en}</dd>
                  </div>
                </dl>
                {document.url ? (
                  <a
                    className={styles.primaryButton}
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Get ${document.name.en} (opens in a new tab)`}
                  >
                    Obtain Document
                  </a>
                ) : (
                  <span className={styles.offlineButton}>Inquire at Hospital</span>
                )}
              </article>
            ))}
          </div>
        </section>

        {safeInheritance?.url && (
          <section className={styles.governmentSection} aria-labelledby="government-title">
            <p className="eyebrow">GOVERNMENT SERVICE</p>
            <article className={styles.serviceCard}>
              <div>
                <h2 id="government-title">One-stop Inheritance Administrative Service</h2>
                <p>
                  Look up administrative records including financial assets, vehicles, real estate, and national pensions in one single inquiry.
                </p>
              </div>
              <a
                href={safeInheritance.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open One-stop Inheritance Service in a new tab"
              >
                Visit Service
              </a>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
