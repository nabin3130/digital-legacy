import { isGoalAvailable, type Audience, type Goal } from "./scenario-rules";

export type HomeJourney = { audience: Audience | null; goal: Goal | null; safe: boolean; viaSafe: boolean };
export const emptyJourney: HomeJourney = { audience: null, goal: null, safe: false, viaSafe: false };
export type HomeStep = "audience" | "goal" | "safe" | "services";

export function normalizeJourney(value: Partial<Record<keyof HomeJourney, unknown>>): HomeJourney {
  const audience = value.audience === "mine" || value.audience === "deceased" || value.audience === "unsure" ? value.audience : null;
  const requestedGoal = value.goal === "delete" || value.goal === "download" || value.goal === "memorial" ? value.goal : null;
  const goal = audience && isGoalAvailable(audience, requestedGoal) ? requestedGoal : null;
  const safe = audience === "unsure" && !goal && value.safe === true;
  return { audience, goal, safe, viaSafe: audience === "unsure" && (safe || value.viaSafe === true) };
}

export function homeStep(state: HomeJourney): HomeStep {
  return !state.audience ? "audience" : state.goal ? "services" : state.safe ? "safe" : "goal";
}

export function previousJourney(state: HomeJourney): HomeJourney {
  if (state.goal) return { ...state, goal: null, safe: state.viaSafe };
  if (state.safe) return { ...state, safe: false, viaSafe: false };
  return emptyJourney;
}

export function journeyHash(state: HomeJourney): string {
  const params = new URLSearchParams();
  if (state.audience) params.set("audience", state.audience);
  if (state.goal) params.set("goal", state.goal);
  if (state.safe) params.set("guide", "safe");
  if (state.viaSafe && state.goal) params.set("via", "safe");
  return params.size ? `#${params}` : "#start";
}

export function journeyFromHash(hash: string): HomeJourney {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return normalizeJourney({ audience: params.get("audience"), goal: params.get("goal"), safe: params.get("guide") === "safe", viaSafe: params.get("via") === "safe" });
}

export function restoreJourney(hash: string, saved: unknown, historyNavigation = false): HomeJourney {
  if (new URLSearchParams(hash.replace(/^#/, "")).has("audience") || historyNavigation) return journeyFromHash(hash);
  return saved && typeof saved === "object" ? normalizeJourney(saved) : emptyJourney;
}

export function companyJourneyHref(slug: string, audience: Audience | null, goal: Goal | null, english = false) {
  const params = new URLSearchParams();
  if (audience) params.set("audience", audience);
  if (goal) params.set("goal", goal);
  return `${english ? "/en" : ""}/company/${slug}${params.size ? `?${params}` : ""}`;
}
