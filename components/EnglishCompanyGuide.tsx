"use client";

import { useState } from "react";
import Link from "next/link";
import type { CompanyPolicy } from "@/lib/types";
import { companyEnglish } from "@/lib/company-en";
import styles from "./CompanyAccountSelector.module.css";

export default function EnglishCompanyGuide({ company }: { company: CompanyPolicy }) {
  const [choice, setChoice] = useState<"mine" | "deceased" | null>(null);
  const name = companyEnglish[company.slug]?.name ?? company.company;
  return <section className={styles.section} aria-labelledby="english-account-title">
    <span className={styles.step}>STEP 1</span><h2 id="english-account-title">Which account do you need help with?</h2><p className={styles.description}>Choose your situation to find the most relevant official path.</p>
    <div className={styles.options}>
      <button type="button" className={styles.option} onClick={() => setChoice("mine")}><span className={styles.icon} aria-hidden="true">●</span><strong>My {name} account</strong><small>I want to organize my data or prepare how my account should be handled.</small></button>
      <button type="button" className={`${styles.option} ${styles.deceased}`} onClick={() => setChoice("deceased")}><span className={styles.icon} aria-hidden="true">●●</span><strong>A deceased person’s {name} account</strong><small>I need to handle the person’s account, data, or remaining information.</small></button>
    </div>
    {choice && <div className={styles.prepareNote} role="status"><span>{choice === "mine" ? "Review the official policy to see which settings and downloads are available for your account." : "Prepare proof of death and your authority or relationship before starting the official request."}</span>{company.policyLink && <a href={company.policyLink} target="_blank" rel="noopener noreferrer">Open the official process →</a>}</div>}
    <p className={styles.prepareNote}>Commonly requested documents are listed in Prepare. <Link href="/en/prepare#documents">View Prepare →</Link></p>
  </section>;
}
