"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/Home.module.css";
import {
  goalsByAudience,
  isGoalAvailable,
  shouldShowService,
  type Audience,
  type Goal,
  type Support,
} from "@/lib/scenario-rules";
import ProgressSummary from "@/components/ProgressSummary";

const services = [
  {
    name: "Kakao",
    slug: "kakao",
    logo: "/logos/kakao.webp",
    keywords: ["kakao", "kakaotalk", "daum"],
    records: "KakaoTalk and Kakao services",
    support: { delete: "지원", download: "조건부 지원", memorial: "지원" },
  },
  {
    name: "Naver",
    slug: "naver",
    logo: "/logos/naver.svg",
    keywords: ["naver", "blog", "mybox"],
    records: "Blog, Mail, MYBOX",
    support: { delete: "지원", download: "조건부 지원", memorial: "지원하지 않음" },
  },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "/logos/samsung.svg",
    keywords: ["samsung", "galaxy", "cloud"],
    records: "Samsung Cloud, Contacts, Notes",
    support: { delete: "확인 필요", download: "조건부 지원", memorial: "지원하지 않음" },
  },
  {
    name: "Google",
    slug: "google",
    logo: "/logos/google.svg",
    keywords: ["google", "gmail", "youtube"],
    records: "Google Photos, Gmail, Drive",
    support: { delete: "지원", download: "조건부 지원", memorial: "지원하지 않음" },
  },
  {
    name: "Apple",
    slug: "apple",
    logo: "/logos/apple.svg",
    keywords: ["apple", "icloud", "iphone"],
    records: "iCloud Photos and Files",
    support: { delete: "지원", download: "조건부 지원", memorial: "지원하지 않음" },
  },
  {
    name: "Meta",
    slug: "meta",
    logo: "/logos/meta.svg",
    keywords: ["meta", "facebook", "messenger"],
    records: "Facebook Posts, Photos, Messages",
    support: { delete: "지원", download: "조건부 지원", memorial: "지원" },
  },
  {
    name: "Instagram",
    slug: "instagram",
    logo: "/logos/instagram.webp",
    keywords: ["instagram", "threads", "insta"],
    records: "Photos, Videos, Comments, Profile",
    support: { delete: "지원", download: "조건부 지원", memorial: "지원" },
  },
  {
    name: "X",
    slug: "x",
    logo: "/logos/x.svg",
    keywords: ["x", "twitter"],
    records: "Posts, Media, Account Data",
    support: { delete: "지원", download: "지원", memorial: "지원하지 않음" },
  },
] as const;

const audiences = [
  {
    id: "mine" as const,
    title: "I am preparing my own accounts",
    description: "I want to decide how and with whom to share my records.",
  },
  {
    id: "deceased" as const,
    title: "I am managing a deceased family member’s accounts",
    description: "I need to safely handle accounts, photos, and personal records.",
  },
  {
    id: "unsure" as const,
    title: "I don’t know where to start",
    description: "We’ll guide you step by step through the differences between the options.",
  },
];

const goals = [
  {
    id: "download" as const,
    title: "Download photos, posts & data",
    description: "Request an archive or download data copies according to company policies.",
    icon: "↓",
  },
  {
    id: "delete" as const,
    title: "Account deletion & termination",
    description: "Safely close the account or terminate active online services.",
    icon: "×",
  },
  {
    id: "memorial" as const,
    title: "Convert to memorialized account",
    description: "Preserve the deceased person’s online space in a memorial state.",
    icon: "○",
  },
];

const unsureResults = [
  {
    id: "download" as const,
    number: "01",
    title: "I want to save photos and records first",
    description: "Review downloadable data before deleting anything.",
  },
  {
    id: "delete" as const,
    number: "02",
    title: "I want to remove accounts and records",
    description: "Guide you on how to delete accounts after verifying important data.",
  },
  {
    id: "memorial" as const,
    number: "03",
    title: "I want to preserve their online presence",
    description: "Check companies that offer memorialized account features.",
  },
];

export default function EnglishHomePage() {
  const router = useRouter();
  const goalRef = useRef<HTMLElement>(null);
  const serviceRef = useRef<HTMLElement>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [showSafeGuide, setShowSafeGuide] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");

  useEffect(() => {
    function restore(event?: PopStateEvent) {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const hashAudience = params.get("audience");
      const hashGoal = params.get("goal");
      if (hashAudience) {
        setAudience(["mine", "deceased", "unsure"].includes(hashAudience) ? (hashAudience as Audience) : null);
        setGoal(["delete", "download", "memorial"].includes(hashGoal ?? "") ? (hashGoal as Goal) : null);
        setShowSafeGuide(params.get("guide") === "safe");
        return;
      }
      if (event) {
        setAudience(null);
        setGoal(null);
        setShowSafeGuide(false);
        return;
      }
      const saved = localStorage.getItem("logout-guide-state-en");
      if (!saved) {
        setAudience(null);
        setGoal(null);
        setShowSafeGuide(false);
        return;
      }
      try {
        const state = JSON.parse(saved);
        setAudience(["mine", "deceased", "unsure"].includes(state.audience) ? state.audience : null);
        setGoal(["delete", "download", "memorial"].includes(state.goal) ? state.goal : null);
        setShowSafeGuide(false);
      } catch {
        setAudience(null);
        setGoal(null);
        setShowSafeGuide(false);
      }
    }
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useEffect(() => {
    if (audience || goal) {
      localStorage.setItem("logout-guide-state-en", JSON.stringify({ audience, goal }));
    }
  }, [audience, goal]);

  useEffect(() => {
    if (!isGoalAvailable(audience, goal)) setGoal(null);
  }, [audience, goal]);

  const filtered = useMemo(() => {
    const q = serviceQuery.trim().toLowerCase();
    return services.filter((s) => !q || s.keywords.some((k) => k.toLowerCase().includes(q)) || s.name.toLowerCase().includes(q));
  }, [serviceQuery]);

  const availableGoals = useMemo(
    () => (audience ? goals.filter((item) => goalsByAudience[audience].includes(item.id)) : goals),
    [audience],
  );

  const ordered = useMemo(() => {
    const available = goal
      ? filtered.filter((service) => shouldShowService(goal, service.support[goal] as Support))
      : filtered;
    return goal
      ? [...available].sort((a, b) => rank(a.support[goal] as Support) - rank(b.support[goal] as Support))
      : available;
  }, [filtered, goal]);

  function pushHomeState(nextAudience: Audience | null, nextGoal: Goal | null, safe = false) {
    const params = new URLSearchParams();
    if (nextAudience) params.set("audience", nextAudience);
    if (nextGoal) params.set("goal", nextGoal);
    if (safe) params.set("guide", "safe");
    const nextUrl = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState({ logoutGuide: { audience: nextAudience, goal: nextGoal, safe } }, "", nextUrl);
  }

  function chooseAudience(next: Audience) {
    pushHomeState(next, null);
    setAudience(next);
    setGoal(null);
    setShowSafeGuide(false);
    setServiceQuery("");
    setTimeout(() => {
      goalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      goalRef.current?.setAttribute("tabindex", "-1");
      goalRef.current?.focus({ preventScroll: true });
    }, 80);
  }

  function chooseGoal(next: Goal) {
    pushHomeState(audience, next);
    setGoal(next);
    setShowSafeGuide(false);
    setServiceQuery("");
    setTimeout(() => {
      serviceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      serviceRef.current?.setAttribute("tabindex", "-1");
      serviceRef.current?.focus({ preventScroll: true });
    }, 80);
  }

  function openSafeGuide() {
    pushHomeState("unsure", null, true);
    setShowSafeGuide(true);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = quickQuery.trim().toLowerCase();
    if (!q) {
      router.push("/en/#services");
      return;
    }
    const match = services.find(
      (s) => s.keywords.some((k) => k.toLowerCase().includes(q)) || s.name.toLowerCase().includes(q),
    );
    if (match) router.push(`/en/company/${match.slug}`);
    else router.push(`/en/#services`);
  }

  function reset() {
    setAudience(null);
    setGoal(null);
    setShowSafeGuide(false);
    localStorage.removeItem("logout-guide-state-en");
    document.getElementById("start")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.aurora} aria-hidden="true" />
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <p className={styles.kicker}>DIGITAL LEGACY GUIDE</p>
            <h1>
              Organize digital records<br />
              calmly and securely.
            </h1>
            <p>
              From account deletion and data download to memorialization,<br />
              we guide you through official policies and required procedures.
            </p>
            <a href="#start" className={styles.heroAction}>
              Start guide
            </a>
          </div>
          <div className={styles.lightCanvas} aria-hidden="true">
            <span className={styles.lightMint} />
            <span className={styles.lightBlue} />
            <span className={styles.lightCream} />
            <span className={styles.lightCore} />
            <i className={styles.lightRing} />
          </div>
        </div>
      </section>

      <section className={styles.start} id="start">
        <div className={styles.narrow}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>START GUIDE</p>
              <h2>Whose digital records are these?</h2>
              <p>Select your situation to see relevant procedures first.</p>
            </div>
            <form className={styles.quickSearch} onSubmit={submit}>
              <label htmlFor="quick-company">Search company directly</label>
              <div>
                <span>⌕</span>
                <input
                  id="quick-company"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="e.g. Google, Apple"
                />
              </div>
            </form>
          </div>
          <div className={styles.choiceList}>
            {audiences.map((o) => (
              <button
                key={o.id}
                className={audience === o.id ? styles.selected : ""}
                onClick={() => chooseAudience(o.id)}
                aria-pressed={audience === o.id}
              >
                <span className={styles.radio} />
                <span>
                  <strong>{o.title}</strong>
                  <small>{o.description}</small>
                </span>
              </button>
            ))}
          </div>
          <p className={styles.privacyNote}>
            Your progress is saved only on this device. No personal data or documents are collected.
          </p>
        </div>
      </section>

      <ProgressSummary locale="en" />

      <section
        className={`${styles.flowSection} ${!audience ? styles.locked : ""}`}
        ref={goalRef}
        aria-hidden={!audience}
      >
        <div className={styles.narrow}>
          <Progress step={2} />
          <button className={styles.back} onClick={() => window.history.back()}>
            ← Previous step
          </button>
          <p className={styles.kicker}>
            {audience === "mine"
              ? "Preparing my accounts"
              : audience === "deceased"
                ? "Managing deceased person’s accounts"
                : "Finding needed help"}
          </p>
          {audience === "unsure" ? (
            <>
              <h2>How can we help you first?</h2>
              <p className={styles.helper}>
                You don’t have to decide everything right now. Choose the option closest to your desired outcome.
              </p>
              {!showSafeGuide ? (
                <div className={styles.goalList}>
                  {unsureResults.map((o) => (
                    <button key={o.id} onClick={() => chooseGoal(o.id)}>
                      <span className={styles.resultNumber}>{o.number}</span>
                      <span>
                        <strong>{o.title}</strong>
                        <small>{o.description}</small>
                      </span>
                    </button>
                  ))}
                  <button onClick={openSafeGuide}>
                    <span className={styles.resultNumber}>04</span>
                    <span>
                      <strong>I’m still not sure</strong>
                      <small>Review options in the recommended safe order.</small>
                    </span>
                  </button>
                </div>
              ) : (
                <SafeGuide onStart={() => chooseGoal("download")} onBack={() => window.history.back()} />
              )}
            </>
          ) : (
            <>
              <h2>What kind of help do you need?</h2>
              <div className={styles.goalList}>
                {availableGoals.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => chooseGoal(o.id)}
                    className={goal === o.id ? styles.selected : ""}
                    aria-pressed={goal === o.id}
                  >
                    <span className={styles.goalIcon}>{o.icon}</span>
                    <span>
                      <strong>{o.title}</strong>
                      <small>{o.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section
        className={`${styles.services} ${!goal ? styles.locked : ""}`}
        id="services"
        ref={serviceRef}
        aria-hidden={!goal}
      >
        <div className={styles.serviceLayout}>
          <aside>
            <Progress step={3} />
            <button className={styles.back} onClick={() => window.history.back()}>
              ← Change goal
            </button>
            <p className={styles.kicker}>{goals.find((x) => x.id === goal)?.title}</p>
            <h2>
              {goal === "download" ? "Select a service with photos & records" : "Select a service"}
            </h2>
            <p>
              {goal === "memorial"
                ? "Showing only services that support memorialized accounts."
                : goal === "download"
                  ? "If using multiple services, start with the one holding the most important records."
                  : "Showing services that provide your selected option first."}
            </p>
            <label className={styles.serviceSearch}>
              <span>⌕</span>
              <input
                value={serviceQuery}
                onChange={(e) => setServiceQuery(e.target.value)}
                placeholder="Search company or service"
              />
            </label>
            <small className={styles.searchFeedback} aria-live="polite">
              {serviceQuery.trim()
                ? `${ordered.length} services found.`
                : "Type a company or service name."}
            </small>
          </aside>

          <div className={styles.serviceList}>
            {ordered.map((s) => {
              const status = goal ? (s.support[goal] as Support) : "확인 필요";
              const context = new URLSearchParams();
              if (audience) context.set("audience", audience);
              if (goal) context.set("goal", goal);
              return (
                <Link
                  href={`/en/company/${s.slug}?${context.toString()}`}
                  key={s.slug}
                  className={styles.serviceRow}
                >
                  <img src={s.logo} alt="" />
                  <span>
                    <strong>{s.name}</strong>
                    <small>{goal === "download" ? s.records : goals.find((x) => x.id === goal)?.title}</small>
                  </span>
                  <span className={`${styles.status} ${styles[statusClass(status)]}`}>
                    {statusLabel(status)}
                  </span>
                </Link>
              );
            })}
            {!ordered.length && (
              <div className={styles.empty} aria-live="polite">
                <strong>
                  {goal === "memorial"
                    ? "This service does not support memorialized accounts."
                    : "No matching services found."}
                </strong>
                <p>
                  {goal === "memorial"
                    ? "Search for another company or select a different goal in the previous step."
                    : "Check your search term or view the full list."}
                </p>
                <button onClick={() => setServiceQuery("")}>View all services</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {(audience || goal) && (
        <div className={styles.savedBar}>
          <span>Progress saved on this device.</span>
          <button onClick={reset}>Clear progress</button>
        </div>
      )}
    </main>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className={styles.progress} aria-label={`Step ${step} of 4`}>
      <span>
        <b>1 Situation</b> — <b className={step >= 2 ? styles.current : ""}>2 Goal</b> —{" "}
        <b className={step >= 3 ? styles.current : ""}>3 Service</b> — 4 Procedure
      </span>
      <em>{step} / 4</em>
    </div>
  );
}

function rank(status: Support) {
  return { 지원: 0, "조건부 지원": 1, "확인 필요": 2, "지원하지 않음": 3 }[status];
}

function statusClass(status: Support) {
  return status === "지원"
    ? "supported"
    : status === "조건부 지원"
      ? "conditional"
      : status === "지원하지 않음"
        ? "unsupported"
        : "checking";
}

function statusLabel(status: Support) {
  return status === "지원"
    ? "Available"
    : status === "조건부 지원"
      ? "Partial records only"
      : status === "지원하지 않음"
        ? "Not supported"
        : "Company verification required";
}

function SafeGuide({ onStart, onBack }: { onStart: () => void; onBack: () => void }) {
  return (
    <div className={styles.safeGuide}>
      <div className={styles.safeOrder}>
        <p className={styles.kicker}>RECOMMENDED REVIEW ORDER</p>
        <h3>Let’s review in a safe and secure order</h3>
        <ol>
          <li>
            <b>1</b>
            <span>Check if there are important photos and records.</span>
          </li>
          <li>
            <b>2</b>
            <span>Download and archive available data copies first.</span>
          </li>
          <li>
            <b>3</b>
            <span>Decide whether to permanently delete the account or preserve it as a memorial space.</span>
          </li>
          <li>
            <b>4</b>
            <span>Select the company and review official request procedures.</span>
          </li>
        </ol>
      </div>

      <div className={styles.resultComparison} aria-label="Method comparison by desired outcome">
        <div className={styles.comparisonHead}>
          <span>Desired Outcome</span>
          <span>Suitable Method</span>
          <span>Can it be undone?</span>
        </div>
        <div>
          <span>I want to preserve records</span>
          <strong>Data Download</strong>
          <span>Original account is preserved</span>
        </div>
        <div>
          <span>I want to remove the account</span>
          <strong>Account Deletion</strong>
          <span>Permanent and irreversible</span>
        </div>
        <div>
          <span>I want to leave an online memorial</span>
          <strong>Memorialization</strong>
          <span>Depends on company policy</span>
        </div>
      </div>

      <div className={styles.safeActions}>
        <button className={styles.secondaryAction} onClick={onBack}>
          Choose another outcome
        </button>
        <button className={styles.primaryAction} onClick={onStart}>
          Review photos and records first
        </button>
      </div>
    </div>
  );
}


