import type { CommonProcedure } from "@/lib/common-guidance";
import ExternalLinkButton from "./ExternalLinkButton";
import styles from "./CommonGuidance.module.css";

export default function CommonProcedureCard({ procedure, index }: { procedure: CommonProcedure; index: number }) {
  return <article className={styles.procedureCard}><span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span><h2>{procedure.name.ko}</h2><p>{procedure.description.ko}</p><ExternalLinkButton href={procedure.url} label="공식 사이트 보기" targetName={procedure.name.ko} /></article>;
}
