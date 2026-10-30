import type { Metadata } from "next";
import Link from "next/link";
import { cryptoNotes } from "@/lib/hubs";
import { pageMetadata } from "@/lib/seo";
import styles from "@/app/content-hub.module.css";

export const metadata: Metadata = pageMetadata({ locale: "ko", koPath: "/crypto", title: "가상자산 계정 안내", description: "가상자산 거래소 계정과 개인 지갑을 확인할 때 유의할 점을 안내합니다." });

export default function CryptoPage() {
  return <main className={styles.page}><div className={styles.column}><nav className={styles.breadcrumb} aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><span aria-current="page">가상자산</span></nav><header className={styles.header}><p className={styles.eyebrow}>가상자산 · 한국 안내</p><h1>가상자산 기록을 확인할 때</h1><p>거래소에 보관한 계정 정보와 개인 지갑의 복구 수단은 서로 다른 경로로 확인해야 합니다.</p><p className={styles.review}>최종 확인: <time dateTime="2026-10">2026-10</time></p></header><ol className={styles.noteList}>{cryptoNotes.ko.map((text, index) => <li key={text}><span>{String(index + 1).padStart(2,"0")}</span><p>{text}</p></li>)}</ol><section className={styles.sourceBox}><h2>공식 자료</h2><ul><li><a href="https://www.law.go.kr/LSW/lsInfoP.do?lsId=014474" target="_blank" rel="noopener noreferrer">국가법령정보센터: 가상자산 이용자 보호 등에 관한 법률</a></li><li><a href="https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17400000001" target="_blank" rel="noopener noreferrer">정부24: 안심상속 원스톱 서비스</a></li></ul><p>법률 링크는 이용자 보호에 관한 법령을 찾기 위한 자료입니다. 상속 절차나 권리를 설명하거나 판단하는 페이지가 아닙니다.</p></section><p className={styles.next}><Link href="/after">사후 정리 안내 보기</Link></p></div></main>;
}
