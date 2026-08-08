"use client";

import { useState } from "react";
import Link from "next/link";
import type { CompanyPolicy } from "@/lib/types";
import { companyEnglish, type EnglishAction } from "@/lib/company-en";
import styles from "./CompanyAccountSelector.module.css";
import guideStyles from "./EnglishCompanyGuide.module.css";

type Audience = "mine" | "deceased";

export default function EnglishCompanyGuide({ company }: { company: CompanyPolicy }) {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [action, setAction] = useState<EnglishAction | null>(null);
  const content = companyEnglish[company.slug];
  const name = content?.name ?? company.company;
  const chooseAudience = (next: Audience) => { setAudience(next); setAction(null); };
  const reset = () => { setAudience(null); setAction(null); };

  if (!audience) return <section className={styles.section} aria-labelledby="english-account-title">
    <span className={styles.step}>STEP 1</span><h2 id="english-account-title">Which account do you need help with?</h2><p className={styles.description}>Choose your situation to see the relevant options and official process.</p>
    <div className={styles.options}>
      <button type="button" className={styles.option} onClick={() => chooseAudience("mine")}><span className={styles.icon} aria-hidden="true">●</span><strong>My {name} account</strong><small>I want to organize my data or prepare how my account should be handled.</small></button>
      <button type="button" className={`${styles.option} ${styles.deceased}`} onClick={() => chooseAudience("deceased")}><span className={styles.icon} aria-hidden="true">●●</span><strong>A deceased person’s {name} account</strong><small>I need to handle the person’s account, data, or remaining information.</small></button>
    </div>
    <p className={styles.prepareNote}>Commonly requested documents are listed in Prepare. <Link href="/en/prepare#documents">View Prepare →</Link></p>
  </section>;

  const actions = content?.[audience] ?? [];
  if (!action) return <section className={styles.section} aria-labelledby="english-action-title">
    <button type="button" className={guideStyles.backButton} onClick={reset}>← Change account</button>
    <span className={styles.step}>STEP 2</span><h2 id="english-action-title">What would you like to do?</h2><p className={styles.description}>{audience === "mine" ? `Choose an option for your ${name} account.` : `Choose the closest option for the deceased person’s ${name} account.`}</p>
    <div className={guideStyles.actionOptions}>{actions.map((item) => <button type="button" className={guideStyles.actionOption} key={item.id} onClick={() => setAction(item)}><strong>{item.title}</strong><small>{item.description}</small><span aria-hidden="true">→</span></button>)}</div>
  </section>;

  return <section className={styles.section} aria-labelledby="english-detail-title">
    <button type="button" className={guideStyles.backButton} onClick={() => setAction(null)}>← View other options</button>
    <span className={styles.step}>STEP 3</span><h2 id="english-detail-title">{action.title}</h2><p className={styles.description}>{action.description}</p>
    <div className={guideStyles.guidance}><h3>What to do</h3><p>{action.guidance}</p>{action.link && <a href={action.link} target="_blank" rel="noopener noreferrer" aria-label={`${action.linkLabel ?? "Open official page"} (opens in a new tab)`}>{action.linkLabel ?? "Open official page"} ↗</a>}</div>
    <p className={styles.prepareNote}>Requirements can vary by country and account. Check the official page before submitting. <Link href="/en/prepare#documents">View common documents →</Link></p>
  </section>;
}
