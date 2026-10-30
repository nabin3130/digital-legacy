import type { Metadata } from "next";
import { commonDocuments, commonProcedures } from "@/lib/common-guidance";
import { pageMetadata } from "@/lib/seo";
import ContentHub from "@/components/ContentHub";
import { prepareGuidesEn } from "@/lib/hubs";
import styles from "@/app/prepare/Prepare.module.css";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/prepare",
  title: "Plan ahead",
  description: "Prepare a digital account inventory, review account settings, and leave clear instructions for family.",
});

const safeInheritance = commonProcedures.find((item) => item.id === "safe-inheritance");

export default function EnglishPreparePage() {
  return (
    <>
    <ContentHub asSection locale="en" label="PLAN AHEAD" title="Plan ahead" intro="A short account list and a few settings can help family find the right route later." guides={prepareGuidesEn} note="Do not write passwords, recovery codes, or wallet recovery phrases on these forms. Store access information separately using a method you trust." />
    <main className={styles.page}>
      <div className="container">
        <header className={styles.heading}>
          <p className="eyebrow">DOCUMENTS</p>
          <h2>Documents for a company request</h2>
          <p>Requirements vary by company and request. Use this section for orientation, then follow the company’s official instructions.</p>
        </header>

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
    </>
  );
}
