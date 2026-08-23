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
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? "");
      if (value?.company && value?.task) entries.push(value);
    } catch {}
  }
  return entries.sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}

export default function GuideCompletion({
  company,
  task,
  href,
  locale = "ko",
}: {
  company: string;
  task: string;
  href: string;
  locale?: "ko" | "en";
}) {
  const isEnglish = locale === "en";
  const storageKey = `${prefix}${company}-${task}`;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(Boolean(localStorage.getItem(storageKey)));
  }, [storageKey]);

  function update(next: boolean) {
    setChecked(next);
    if (next) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ company, task, href, completedAt: new Date().toISOString() } satisfies ProgressEntry),
      );
    } else {
      localStorage.removeItem(storageKey);
    }
    window.dispatchEvent(new Event(GUIDE_PROGRESS_EVENT));
  }

  return (
    <section className={styles.completionArea}>
      <label className={`${styles.checklistOption} ${checked ? styles.checklistOptionChecked : ""}`}>
        <input type="checkbox" checked={checked} onChange={(event) => update(event.target.checked)} />
        <span>
          {isEnglish
            ? checked
              ? "Completed"
              : "I have reviewed this guide"
            : checked
              ? "확인 완료"
              : "이 안내를 확인했어요"}
        </span>
      </label>

      {!checked && (
        <p className={styles.checklistHelp}>
          {isEnglish
            ? "Completed guides will be collected in ‘My Review Status’ on the home page."
            : "확인한 안내는 메인 화면의 ‘내 확인 현황’에 모아드려요."}
        </p>
      )}

      {checked && (
        <div className={styles.completionResult} role="status" aria-live="polite">
          <span className={styles.completionIcon} aria-hidden="true">✓</span>
          <div>
            <strong>
              {isEnglish ? `${company} guide marked as reviewed` : `${company} 안내를 확인했어요`}
            </strong>
            <p>
              {isEnglish
                ? "Saved to this device. You can pick up where you left off from the home page."
                : "이 기기에 저장했습니다. 다음에 메인 화면에서 이어서 볼 수 있어요."}
            </p>
          </div>
        </div>
      )}

      {checked && (
        <div className={styles.nextActions}>
          <h2>{isEnglish ? "What would you like to do next?" : "이어서 무엇을 할까요?"}</h2>
          <div>
            <Link href={isEnglish ? "/en" : "/"}>
              {isEnglish ? "View my progress" : "내 확인 현황 보기"}
            </Link>
            <Link href={isEnglish ? "/en/services" : "/services"}>
              {isEnglish ? "Check other companies" : "다른 회사 확인하기"}
            </Link>
            <Link href={isEnglish ? "/en/prepare#documents" : "/prepare#documents"}>
              {isEnglish ? "View required documents" : "준비서류 확인하기"}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

