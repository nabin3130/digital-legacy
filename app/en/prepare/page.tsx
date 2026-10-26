import type { Metadata } from "next";
import Link from "next/link";
import { commonDocuments, commonProcedures } from "@/lib/common-guidance";
import { pageMetadata } from "@/lib/seo";
import styles from "@/app/prepare/Prepare.module.css";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/prepare",
  title: "Documents",
  description: "Documents and the usual order of steps before you request account deletion, a data download, or a memorial account.",
});

const safeInheritance = commonProcedures.find((item) => item.id === "safe-inheritance");

export default function EnglishPreparePage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.heading}>
          <p className="eyebrow">DOCUMENTS</p>
          <h1>Get your documents ready</h1>
          <p>Review documents commonly requested before you start with a specific company.</p>
        </header>

        <section className={`${styles.section} ${styles.processSection}`} aria-labelledby="process-title">
          <div className={styles.sectionHeading}>
            <h2 id="process-title">How it works</h2>
          </div>
          <ol className={styles.flow}>
            <li>
              <strong>1</strong>
              <span>Gather the required documents.</span>
            </li>
            <li>
              <strong>2</strong>
              <span>Choose a company.</span>
            </li>
            <li>
              <strong>3</strong>
              <span>Follow the company’s official instructions.</span>
            </li>
          </ol>
          <Link className={styles.companyLink} href="/en/services">
            Choose a company
          </Link>
        </section>

        <section id="documents" className={styles.section} aria-labelledby="documents-title">
          <div className={styles.sectionHeading}>
            <h2 id="documents-title">Documents you may need</h2>
            <p>Requirements vary, but many platforms ask for the documents below.</p>
          </div>
          <div className={styles.documentGrid}>
            {commonDocuments.map((document) => (
              <article className={styles.documentCard} id={document.id} key={document.id}>
                <div>
                  <span className={styles.badge}>
                    {document.online ? "Available online" : "From a medical provider"}
                  </span>
                  <h3>{document.name.en}</h3>
                </div>
                <dl>
                  <div>
                    <dt>When is it needed?</dt>
                    <dd>{document.purpose.en}</dd>
                  </div>
                  <div>
                    <dt>How do I get it?</dt>
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
                    Get document
                  </a>
                ) : (
                  <span className={styles.offlineButton}>Contact the hospital</span>
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
