"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./GoogleAccountFlow.module.css";

export const GUIDE_PROGRESS_EVENT = "logout-guide-progress";
const prefix = "digital-legacy-progress-v1-";

export type ProgressEntry = { company: string; task: string; href: string; completedAt: string };

export function readProgress(): ProgressEntry[] {
  if (typeof window === "undefined") return [];
  const entries: ProgressEntry[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(prefix)) continue;
    try { const value = JSON.parse(localStorage.getItem(key) ?? ""); if (value?.company && value?.task) entries.push(value); } catch {}
  }
  return entries.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

export default function GuideCompletion({ company, task, href }: { company: string; task: string; href: string }) {
  const storageKey = `${prefix}${company}-${task}`;
  const [checked, setChecked] = useState(false);
  useEffect(() => { setChecked(Boolean(localStorage.getItem(storageKey))); }, [storageKey]);
  function update(next: boolean) {
    setChecked(next);
    if (next) localStorage.setItem(storageKey, JSON.stringify({ company, task, href, completedAt: new Date().toISOString() } satisfies ProgressEntry));
    else localStorage.removeItem(storageKey);
    window.dispatchEvent(new Event(GUIDE_PROGRESS_EVENT));
  }
  return <section className={styles.completionArea}>
    <label className={styles.checklistOption}><input type="checkbox" checked={checked} onChange={(event) => update(event.target.checked)} /><span>이 안내를 확인했어요</span></label>
    <p className={styles.checklistHelp} aria-live="polite">{checked ? "확인 상태를 이 기기에 저장했어요." : "확인한 안내를 메인 화면에서 모아볼 수 있어요."}</p>
    {checked && <div className={styles.nextActions}><h2>다음으로 무엇을 할까요?</h2><div><Link href="/services">다른 회사도 확인하기</Link><Link href="/prepare#documents">준비 서류 확인하기</Link><Link href="/">내 확인 현황 보기</Link></div></div>}
  </section>;
}
