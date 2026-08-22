import type { CommonDocument } from "@/lib/common-guidance";
import styles from "./CommonGuidance.module.css";

export default function DocumentCard({ document }: { document: CommonDocument }) {
  return <article className={styles.documentCard} id={document.id}><div><h2>{document.name.ko}</h2><span className={`${styles.onlineBadge} ${document.online ? "" : styles.offlineBadge}`}>{document.online ? "온라인 발급 가능" : "방문 발급"}</span></div><div><div className={styles.documentMeta}><dl><dt>용도</dt><dd>{document.purpose.ko}</dd></dl><dl><dt>발급처</dt><dd>{document.issuer.ko}</dd></dl></div>{document.url ? <a className={styles.documentLink} href={document.url} target="_blank" rel="noopener noreferrer" aria-label={`${document.name.ko} 발급처 보기 (새 창)`}>발급처 보기</a> : <span className={styles.disabledButton} aria-disabled="true">{document.online ? "발급처 링크 준비 중" : "발급처에 문의"}</span>}</div></article>;
}
