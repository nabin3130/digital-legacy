import type { Metadata } from "next";
import { policyUpdates } from "@/lib/policy-updates";
import styles from "../PolicyPages.module.css";

export const metadata: Metadata = {
  title: "정책 업데이트",
  description: "로그아웃의 회사별 정책 확인과 운영 정책 변경 내역을 안내합니다.",
  alternates: { canonical: "/updates" },
};

export default function UpdatesPage() {
  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.eyebrow}>변경 내역</p>
          <h1>정책 업데이트</h1>
          <p>회사별 디지털 유산 정책의 확인과 로그아웃 운영 정책의 변경 내역을 투명하게 기록합니다.</p>
        </header>
        <div className={styles.updates}>
          {policyUpdates.map((update) => (
            <article className={styles.update} key={`${update.date}-${update.title.ko}`}>
              <time dateTime={update.date}>{update.date.replaceAll("-", ".")}</time>
              <div>
                <span className={styles.tag}>{update.category.ko}</span>
                <h2>{update.title.ko}</h2>
                <p>{update.summary.ko}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
