"use client";

import { useEffect, useState } from "react";
import { emptyJourney, homeStep, journeyHash, normalizeJourney, previousJourney, restoreJourney, type HomeJourney } from "@/lib/home-journey";
import type { Audience, Goal } from "@/lib/scenario-rules";

export function useHomeJourney(english = false) {
  const key = english ? "logout-guide-state-en" : "logout-guide-state";
  const [state, setState] = useState<HomeJourney>(emptyJourney);
  const [scrollOnChange, setScrollOnChange] = useState(false);
  useEffect(() => {
    function restore(event?: Event) {
      let saved: unknown = null;
      try { saved = JSON.parse(localStorage.getItem(key) ?? "null"); } catch { /* Storage is optional. */ }
      // Restore progress silently on first load; later history/hash navigation is intentional.
      const next = restoreJourney(window.location.hash, saved, Boolean(event));
      try {
        if (next.audience) localStorage.setItem(key, JSON.stringify(next));
        else localStorage.removeItem(key);
      } catch { /* Optional storage. */ }
      setScrollOnChange(Boolean(event));
      setState(next);
      if (!event && !window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    }
    restore();
    window.addEventListener("popstate", restore);
    window.addEventListener("hashchange", restore);
    return () => { window.removeEventListener("popstate", restore); window.removeEventListener("hashchange", restore); };
  }, [key]);

  function navigate(next: HomeJourney, replace = false, scroll = true) {
    const normalized = normalizeJourney(next);
    window.history[replace ? "replaceState" : "pushState"]({ ...window.history.state, logoutGuide: normalized, logoutGuideBack: state }, "", journeyHash(normalized) || `${window.location.pathname}${window.location.search}`);
    try {
      if (normalized.audience) localStorage.setItem(key, JSON.stringify(normalized));
      else localStorage.removeItem(key);
    } catch { /* Continue without persistence. */ }
    setScrollOnChange(scroll);
    setState(normalized);
  }

  return {
    audience: state.audience, goal: state.goal, showSafeGuide: state.safe, step: homeStep(state), scrollOnChange,
    chooseAudience: (audience: Audience) => navigate({ audience, goal: null, safe: false, viaSafe: false }),
    chooseGoal: (goal: Goal) => navigate({ ...state, goal, safe: false, viaSafe: state.safe || state.viaSafe }),
    openSafeGuide: () => navigate({ audience: "unsure", goal: null, safe: true, viaSafe: true }),
    goBack: () => {
      const previous = previousJourney(state);
      const saved = window.history.state?.logoutGuideBack;
      if (saved && journeyHash(normalizeJourney(saved)) === journeyHash(previous)) window.history.back();
      else navigate(previous);
    },
    resetJourney: () => {
      navigate(emptyJourney, true, false);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
  };
}
