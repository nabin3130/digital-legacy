"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_PROGRESS_EVENT, readProgress, type ProgressEntry } from "@/components/GuideCompletion";
import styles from "@/app/Home.module.css";

export default function ProgressSummary() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  useEffect(() => { const refresh = () => setEntries(readProgress()); refresh(); window.addEventListener(GUIDE_PROGRESS_EVENT, refresh); return () => window.removeEventListener(GUIDE_PROGRESS_EVENT, refresh); }, []);
  if (!entries.length) return null;
  return <section className={styles.progressSummary} aria-labelledby="progress-summary-title"><div className={styles.narrow}><p className={styles.kicker}>내 확인 현황</p><div className={styles.progressSummaryHead}><h2 id="progress-summary-title">확인한 안내를 이어서 볼 수 있어요</h2><span>{entries.length}개 완료</span></div><div className={styles.progressEntries}>{entries.map((entry) => <Link href={entry.href} key={`${entry.company}-${entry.task}`}><span aria-hidden="true">✓</span><strong>{entry.company}</strong><small>{entry.task}</small></Link>)}</div><p>확인 현황은 이 기기에만 저장됩니다.</p></div></section>;
}
