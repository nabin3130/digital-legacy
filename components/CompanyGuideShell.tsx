"use client";

import { useRef, type ReactNode } from "react";
import styles from "./CompanyGuideShell.module.css";

export type GuideAudience = "mine" | "deceased";
export type GuideRoute = { id: string | number; title: string; description?: string | null };

/** Keep explicit valid routes; old audience-only URLs open the first help topic. */
export function selectedGuideRoute<T extends GuideRoute>(routes: readonly T[], id: T["id"] | null): T | undefined {
  return routes.find(route => route.id === id) ?? routes[0];
}

export default function CompanyGuideShell({ companyName, logo, locale = "ko", audience, routes, selectedRouteId, onSelectAudience, onSelectRoute, onReset, children }: {
  companyName: string; logo?: string; locale?: "ko" | "en"; audience: GuideAudience;
  routes: Record<GuideAudience, readonly GuideRoute[]>; selectedRouteId?: string | number;
  onSelectAudience: (audience: GuideAudience) => void;
  onSelectRoute: (audience: GuideAudience, id: string | number) => void;
  onReset: () => void; children: ReactNode;
}) {
  const detail = useRef<HTMLDivElement>(null);
  function select(group: GuideAudience, id?: string | number) {
    if (id === undefined) onSelectAudience(group); else onSelectRoute(group, id);
    requestAnimationFrame(() => {
      const heading = detail.current?.querySelector<HTMLElement>("h1, h2");
      if (heading) { heading.tabIndex = -1; heading.focus(); heading.scrollIntoView({ block: "start", behavior: "instant" }); }
    });
  }
  const en = locale === "en";
  return <section className={styles.shell} aria-label={en ? `${companyName} help` : `${companyName} 도움말`}>
    <button type="button" className={styles.back} onClick={onReset}>← {en ? "Choose account type" : "계정 선택으로"}</button>
    <div className={styles.layout}>
      <nav className={styles.menu} aria-label={en ? "Help topics" : "도움 항목"}>
        {logo && <img className={styles.logo} src={logo} width="32" height="32" alt="" />}
        {(["mine", "deceased"] as const).map(group => <div className={styles.group} key={group}>
          <h2><button type="button" onClick={() => select(group)}>{en ? (group === "mine" ? `My ${companyName} account` : `${companyName} account for someone who died`) : (group === "mine" ? `내 ${companyName} 계정` : `고인의 ${companyName} 계정`)}</button></h2>
          <ul>{routes[group].map(route => <li key={route.id}><button type="button" aria-current={group === audience && route.id === selectedRouteId ? "page" : undefined} onClick={() => select(group, route.id)}>
            <span>{route.title}</span>{route.description && <small>{route.description}</small>}
          </button></li>)}</ul>
        </div>)}
      </nav>
      <div className={styles.detail} ref={detail}>{children}</div>
    </div>
  </section>;
}
