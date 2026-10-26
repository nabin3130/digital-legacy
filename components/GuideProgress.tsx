import styles from "@/app/Home.module.css";

const copy = {
  ko: {
    label: (step: number) => `4단계 중 ${step}단계`,
    items: ["상황", "목적", "서비스", "절차"],
  },
  en: {
    label: (step: number) => `Step ${step} of 4`,
    items: ["Situation", "Goal", "Service", "Steps"],
  },
} as const;

export default function GuideProgress({ step, locale = "ko" }: { step: number; locale?: "ko" | "en" }) {
  const text = copy[locale];
  return (
    <ol className={styles.progress} aria-label={text.label(step)}>
      {text.items.map((item, index) => {
        const number = index + 1;
        const state = number < step ? styles.done : number === step ? styles.current : styles.upcoming;
        return (
          <li key={item} className={state} aria-current={number === step ? "step" : undefined}>
            <span>{number}</span>
            {item}
          </li>
        );
      })}
    </ol>
  );
}
