"use client";

import { useState } from "react";
import styles from "./Concepts.module.css";

const concepts = [
  ["1", "빛과 기록", "기록이 보관함으로 정돈되는 추상 모션"],
  ["2", "창가의 사진과 편지", "자연광과 개인적인 기록을 담은 따뜻한 장면"],
  ["3", "선형 일러스트", "사진과 메시지가 한곳으로 모이는 명확한 안내"],
  ["4", "빛의 그라데이션", "청록·하늘·크림색 빛이 천천히 번지는 현재 안"],
  ["5", "나무 그림자", "시간과 기억을 은유하는 잔잔한 자연의 움직임"],
  ["6", "종이 콜라주", "사진·문서·메모를 편집한 정적인 에디토리얼 구성"],
] as const;

export default function ConceptsPage() {
  const [selected, setSelected] = useState("4");
  const current = concepts.find(([id]) => id === selected)!;

  return <main className={styles.page}>
    <div className={styles.toolbar}>
      <div><p>첫 화면 디자인</p><h1>시각 방향 미리보기</h1></div>
      <div className={styles.tabs} aria-label="디자인 안 선택">
        {concepts.map(([id, name]) => <button key={id} type="button" aria-pressed={selected === id} onClick={() => setSelected(id)}><b>{id}</b><span>{name}</span></button>)}
      </div>
    </div>

    <section className={`${styles.preview} ${styles[`concept${selected}`]}`}>
      <div className={styles.copy}>
        <p>디지털 유산 안내</p>
        <h2>남겨진 디지털 기록,<br/>차분하게 정리할 수 있도록.</h2>
        <span>계정 삭제부터 데이터 다운로드, 추모 계정 전환까지<br/>회사별 공식 정책과 필요한 절차를 안내합니다.</span>
        <i>안내 시작하기</i>
      </div>
      <Visual concept={selected}/>
    </section>

    <div className={styles.caption}><strong>{current[0]}. {current[1]}</strong><span>{current[2]}</span></div>
  </main>;
}

function Visual({concept}:{concept:string}) {
  if (concept === "1") return <div className={`${styles.visual} ${styles.archiveVisual}`}><i/><i/><i/><b>기록</b></div>;
  if (concept === "2") return <div className={`${styles.visual} ${styles.windowVisual}`}><div className={styles.window}/><i className={styles.photo}/><i className={styles.letter}/></div>;
  if (concept === "3") return <div className={`${styles.visual} ${styles.lineVisual}`}><i>사진</i><i>메시지</i><span>→</span><b>기록</b></div>;
  if (concept === "4") return <div className={`${styles.visual} ${styles.gradientVisual}`}><i/><i/><i/><b/></div>;
  if (concept === "5") return <div className={`${styles.visual} ${styles.treeVisual}`}><i/><span/><b/></div>;
  return <div className={`${styles.visual} ${styles.collageVisual}`}><i/><i/><i/><span>기록</span></div>;
}
