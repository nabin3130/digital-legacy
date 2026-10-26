"use client";

import { useEffect, useState } from "react";
import { emptyJourney, homeStep, journeyHash, normalizeJourney, previousJourney, restoreJourney, type HomeJourney } from "@/lib/home-journey";
import type { Audience, Goal } from "@/lib/scenario-rules";

export function useHomeJourney(english = false) {
  const key = english ? "logout-guide-state-en" : "logout-guide-state";
  const [state, setState] = useState<HomeJourney>(emptyJourney);
  useEffect(() => {
    function restore(event?: Event) {
      let saved: unknown = null;
      try { saved = JSON.parse(localStorage.getItem(key) ?? "null"); } catch { /* Storage is optional. */ }
      // On first load, #start still resumes local progress. A real history/hash change wins over storage.
      const next = restoreJourney(window.location.hash, saved, Boolean(event));
      try {
        if (next.audience) localStorage.setItem(key, JSON.stringify(next));
        else localStorage.removeItem(key);
      } catch { /* Optional storage. */ }
      setState(next);
    }
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    return () => { window.removeEventListener("popstate", restore); window.removeEventListener("hashchange", restore); };
  }, [key]);

  function navigate(next: HomeJourney, replace = false) {
    const normalized = normalizeJourney(next);
    window.history[replace ? "replaceState" : "pushState"]({ ...window.history.state, logoutGuide: normalized, logoutGuideBack: state }, "", journeyHash(normalized));
    try {
      if (normalized.audience) localStorage.setItem(key, JSON.stringify(normalized));
      else localStorage.removeItem(key);
    } catch { /* Continue without persistence. */ }
    setState(normalized);
  }

  return {
    audience: state.audience, goal: state.goal, showSafeGuide: state.safe, step: homeStep(state),
    chooseAudience: (audience: Audience) => navigate({ audience, goal: null, safe: false, viaSafe: false }),
    chooseGoal: (goal: Goal) => navigate({ ...state, goal, safe: false, viaSafe: state.safe || state.viaSafe }),
    openSafeGuide: () => navigate({ audience: "unsure", goal: null, safe: true, viaSafe: true }),
    goBack: () => {
      const previous = previousJourney(state);
      const saved = window.history.state?.logoutGuideBack;
      if (saved && journeyHash(normalizeJourney(saved)) === journeyHash(previous)) window.history.back();
      else navigate(previous);
    },
    resetJourney: () => navigate(emptyJourney, true),
  };
}
