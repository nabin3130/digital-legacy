import Link from "next/link";
import CommonProcedureCard from "@/components/CommonProcedureCard";
import ProcessFlow from "@/components/ProcessFlow";
import styles from "@/components/CommonGuidance.module.css";
import { commonProcedures } from "@/lib/common-guidance";

export default function ProceduresPage() {
  return <main className={styles.page}><div className="container"><header className={styles.heading}><p className={styles.eyebrow}>COMMON PROCEDURES / 04</p><h1>사망 후 먼저 해야 하는 일</h1><p>회사별 계정을 처리하기 전에 필요한 공통 행정 절차를 확인할 수 있습니다.</p></header><ProcessFlow /><section aria-labelledby="procedure-list-heading"><h2 className={styles.sectionHeading} id="procedure-list-heading">확인할 기관과 서비스</h2><div className={styles.grid}>{commonProcedures.map((procedure, index) => <CommonProcedureCard procedure={procedure} index={index} key={procedure.id} />)}</div></section><div className={styles.crossLink}><p>절차를 확인했다면 반복해서 필요한 서류와 발급처를 살펴보세요.</p><Link href="/documents">공통 서류 보기 →</Link></div></div></main>;
}
