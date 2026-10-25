export function revealStep(node: HTMLElement | null) {
  if (!node || typeof window === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  const heading = node.querySelector("h2");
  const target = heading instanceof HTMLElement ? heading : node;
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function scrollToId(id: string) {
  const node = document.getElementById(id);
  if (!node) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
