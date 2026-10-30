"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { HomeStep } from "@/lib/home-journey";
import styles from "./HomeWizardStage.module.css";

const order: HomeStep[] = ["audience", "goal", "safe", "services"];

export default function HomeWizardStage({ step, scrollOnChange = true, children, summary }: { step: HomeStep; scrollOnChange?: boolean; children: ReactNode; summary: string }) {
  const [renderedStep, setRenderedStep] = useState(step);
  const latestChildren = useRef(children);
  const outgoingChildren = useRef(children);
  latestChildren.current = children;
  if (step === renderedStep) outgoingChildren.current = children;
  const [phase, setPhase] = useState("");
  const currentStep = useRef(step);
  const root = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (step === currentStep.current) {
      setPhase("");
      return;
    }
    // Hydration and reset swap content without animation, scrolling or stealing focus.
    if (!scrollOnChange) {
      currentStep.current = step;
      setRenderedStep(step);
      setPhase("");
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
      setRenderedStep(step);
      setPhase("");
      const frame = requestAnimationFrame(focus);
      return () => cancelAnimationFrame(frame);
    }
    setPhase(forward ? "exitForward" : "exitBack");
    const exitTimer = setTimeout(() => {
      currentStep.current = step;
      outgoingChildren.current = latestChildren.current;
      setRenderedStep(step);
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
  }, [step, scrollOnChange]);

  return <details id="start" ref={root} className={styles.stage} data-wizard-step={renderedStep}>
    <summary>{summary}</summary>
    <div className={phase ? styles[phase] : undefined} inert={phase ? true : undefined} aria-busy={phase ? true : undefined}>
      {/* Same-step input updates must reach React's DOM commit synchronously, not through an effect snapshot. */}
      {step === renderedStep ? children : outgoingChildren.current}
    </div>
  </details>;
}
