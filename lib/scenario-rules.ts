export type Audience = "mine" | "deceased" | "unsure";
export type Goal = "delete" | "download" | "memorial";
export type Support = "지원" | "조건부 지원" | "지원하지 않음" | "확인 필요";

export const goalsByAudience: Record<Audience, readonly Goal[]> = {
  mine: ["delete", "download"],
  deceased: ["delete", "download", "memorial"],
  unsure: ["delete", "download", "memorial"],
};

export function isGoalAvailable(audience: Audience | null, goal: Goal | null) {
  if (!audience || !goal) return true;
  return goalsByAudience[audience].includes(goal);
}

export function shouldShowService(goal: Goal | null, support: Support) {
  if (goal !== "memorial") return true;
  return support === "지원" || support === "조건부 지원";
}
