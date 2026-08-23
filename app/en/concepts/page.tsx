"use client";

import { useState } from "react";
import styles from "@/app/concepts/Concepts.module.css";

const concepts = [
  ["1", "Light & Records", "Abstract motion of records organizing into an archive"],
  ["2", "Window, Photos & Letters", "Warm scene capturing natural sunlight and personal memories"],
  ["3", "Line Illustration", "Clear guidance with photos and messages gathering in one place"],
  ["4", "Light Gradient", "Current design with soft mint, cyan, and cream light diffusion"],
  ["5", "Tree Shadows", "Calm motion of nature metaphoring time and remembrance"],
  ["6", "Paper Collage", "Editorial composition combining photos, notes, and documents"],
] as const;

export default function EnglishConceptsPage() {
  const [selected, setSelected] = useState("4");
  const current = concepts.find(([id]) => id === selected)!;

  return (
    <main className={styles.page}>
      <div className={styles.toolbar}>
        <div>
          <p>Home Design Direction</p>
          <h1>Visual Concept Preview</h1>
        </div>
        <div className={styles.tabs} aria-label="Choose design option">
          {concepts.map(([id, name]) => (
            <button
              key={id}
              type="button"
              aria-pressed={selected === id}
              onClick={() => setSelected(id)}
            >
              <b>{id}</b>
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>

      <section className={`${styles.preview} ${styles[`concept${selected}`]}`}>
        <div className={styles.copy}>
          <p>DIGITAL LEGACY GUIDE</p>
          <h2>
            Organize digital records<br />
            calmly and securely.
          </h2>
          <span>
            From account deletion and data download to memorialization,<br />
            we guide you through official policies and required procedures.
          </span>
          <i>Start guide</i>
        </div>
        <Visual concept={selected} />
      </section>

      <div className={styles.caption}>
        <strong>
          {current[0]}. {current[1]}
        </strong>
        <span>{current[2]}</span>
      </div>
    </main>
  );
}

function Visual({ concept }: { concept: string }) {
  if (concept === "1") {
    return (
      <div className={`${styles.visual} ${styles.archiveVisual}`}>
        <i />
        <i />
        <i />
        <b>Records</b>
      </div>
    );
  }
  if (concept === "2") {
    return (
      <div className={`${styles.visual} ${styles.windowVisual}`}>
        <div className={styles.window} />
        <i className={styles.photo} />
        <i className={styles.letter} />
      </div>
    );
  }
  if (concept === "3") {
    return (
      <div className={`${styles.visual} ${styles.lineVisual}`}>
        <i>Photo</i>
        <i>Message</i>
        <span>→</span>
        <b>Records</b>
      </div>
    );
  }
  if (concept === "4") {
    return (
      <div className={`${styles.visual} ${styles.gradientVisual}`}>
        <i />
        <i />
        <i />
        <b />
      </div>
    );
  }
  if (concept === "5") {
    return (
      <div className={`${styles.visual} ${styles.treeVisual}`}>
        <i />
        <span />
        <b />
      </div>
    );
  }
  return (
    <div className={`${styles.visual} ${styles.collageVisual}`}>
      <i />
      <i />
      <i />
      <span>Records</span>
    </div>
  );
}
