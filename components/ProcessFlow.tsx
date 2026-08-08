import { processFlow } from "@/lib/common-guidance";
import styles from "./ProcessFlow.module.css";

export default function ProcessFlow() {
  return <ol className={styles.flow} aria-label="사망 후 디지털 계정 처리 흐름">{processFlow.map((step) => <li className={styles.flowStep} key={step.ko}>{step.ko}</li>)}</ol>;
}
