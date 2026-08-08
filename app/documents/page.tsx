import Link from "next/link";
import DocumentCard from "@/components/DocumentCard";
import styles from "@/components/CommonGuidance.module.css";
import { commonDocuments } from "@/lib/common-guidance";

export default function DocumentsPage() {
  return <main className={styles.page}><div className="container"><header className={styles.heading}><p className={styles.eyebrow}>COMMON DOCUMENTS / 05</p><h1>자주 필요한 서류</h1><p>회사별 디지털 유산 절차에서 반복적으로 요구될 수 있는 서류와 발급처를 확인할 수 있습니다.</p></header><section className={styles.documentGrid} aria-label="자주 필요한 서류 목록" style={{ marginTop: 52 }}>{commonDocuments.map((document) => <DocumentCard document={document} key={document.id} />)}</section><div className={styles.crossLink}><p>서류를 준비하기 전에 먼저 처리해야 할 공통 행정 절차도 확인할 수 있습니다.</p><Link href="/procedures">공통 절차 보기 →</Link></div></div></main>;
}
