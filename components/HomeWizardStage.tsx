"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { HomeStep } from "@/lib/home-journey";
import styles from "./HomeWizardStage.module.css";

const order: HomeStep[] = ["audience", "goal", "safe", "services"];

export default function HomeWizardStage({ step, children }: { step: HomeStep; children: ReactNode }) {
  const [rendered, setRendered] = useState({ step, children });
  const [phase, setPhase] = useState("");
  const currentStep = useRef(step);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step === currentStep.current) {
      setRendered(previous => previous.children === children ? previous : { step, children });
      return;
    }
    const forward = order.indexOf(step) > order.indexOf(currentStep.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let enterTimer: ReturnType<typeof setTimeout>;
    let focusFrame: number | undefined;
    const focus = () => {
      const heading = root.current?.querySelector<HTMLElement>("h2, h3");
      if (!heading) return;
      heading.tabIndex = -1;
      root.current?.scrollIntoView({ behavior: "instant", block: "start" });
      heading.focus({ preventScroll: true });
    };
    if (reduce) {
      currentStep.current = step;
      setRendered({ step, children });
      setPhase("");
      const frame = requestAnimationFrame(focus);
      return () => cancelAnimationFrame(frame);
    }
    setPhase(forward ? "exitForward" : "exitBack");
    const exitTimer = setTimeout(() => {
      currentStep.current = step;
      setRendered({ step, children });
      setPhase(forward ? "enterForward" : "enterBack");
      // One screen at a time: old content is removed before the next screen enters.
      root.current?.scrollIntoView({ behavior: "instant", block: "start" });
      enterTimer = setTimeout(() => {
        setPhase("");
        // Wait for React to remove inert before attempting keyboard focus.
        focusFrame = requestAnimationFrame(focus);
      }, 125);
    }, 125);
    return () => { clearTimeout(exitTimer); clearTimeout(enterTimer); if (focusFrame !== undefined) cancelAnimationFrame(focusFrame); };
  }, [step, children]);

  return <div id="start" ref={root} className={styles.stage} data-wizard-step={rendered.step}>
    <div className={phase ? styles[phase] : undefined} inert={phase ? true : undefined} aria-busy={phase ? true : undefined}>{rendered.children}</div>
  </div>;
}
