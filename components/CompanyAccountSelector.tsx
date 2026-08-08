import Link from "next/link";
import styles from "./CompanyAccountSelector.module.css";

type AccountOption = {
  title: string;
  description: string;
  onSelect: () => void;
};

export default function CompanyAccountSelector({ mine, deceased }: { mine: AccountOption; deceased: AccountOption }) {
  return (
    <section className={styles.section} aria-labelledby="account-selector-title">
      <span className={styles.step}>STEP 1</span>
      <h2 id="account-selector-title">어떤 계정에 관한 도움이 필요한가요?</h2>
      <p className={styles.description}>상황을 선택하면 필요한 공식 절차를 순서대로 안내해 드려요.</p>

      <div className={styles.options}>
        <button type="button" className={styles.option} onClick={mine.onSelect}>
          <span className={styles.icon} aria-hidden="true">●</span>
          <strong>{mine.title}</strong>
          <small>{mine.description}</small>
        </button>
        <button type="button" className={`${styles.option} ${styles.deceased}`} onClick={deceased.onSelect}>
          <span className={styles.icon} aria-hidden="true">●●</span>
          <strong>{deceased.title}</strong>
          <small>{deceased.description}</small>
        </button>
      </div>

      <p className={styles.prepareNote}>
        공통적으로 필요한 서류는 ‘준비’ 메뉴에서 확인할 수 있어요.
        <Link href="/prepare#documents">준비 메뉴 보기 →</Link>
      </p>
    </section>
  );
}
