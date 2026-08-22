import styles from "./CommonGuidance.module.css";

export default function ExternalLinkButton({ href, label, targetName }: { href: string | null; label: string; targetName: string }) {
  if (!href) return <span className={styles.disabledButton} aria-disabled="true">링크 준비 중</span>;
  return <a className={styles.linkButton} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${targetName} ${label} (새 창)`}>{label}</a>;
}
