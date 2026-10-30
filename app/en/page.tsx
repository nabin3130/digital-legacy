"use client";

import { FormEvent, useMemo } from "react";
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
import { clearAllProgress } from "@/components/GuideCompletion";
import GuideProgress from "@/components/GuideProgress";
import { ChevronIcon, GoalIcon, SearchIcon } from "@/components/GuideIcons";
import { useCompositionSearch } from "@/components/useCompositionSearch";
import HomeWizardStage from "@/components/HomeWizardStage";
import { useHomeJourney } from "@/components/useHomeJourney";
import { companyJourneyHref } from "@/lib/home-journey";

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
    title: "I’m planning ahead for my accounts",
    description: "I want to decide what happens to my digital records.",
  },
  {
    id: "deceased" as const,
    title: "I’m managing accounts for someone who died",
    description: "I need help with their accounts, photos, and other records.",
  },
  {
    id: "unsure" as const,
    title: "I don’t know where to start",
    description: "We’ll explain the options and guide you one step at a time.",
  },
];

const goals = [
  {
    id: "download" as const,
    title: "Download photos, posts, and data",
    description: "Find out what you can download or request from each platform.",
  },
  {
    id: "delete" as const,
    title: "Delete an account",
    description: "Review what to save, then follow the steps to permanently delete the account.",
  },
  {
    id: "memorial" as const,
    title: "Memorialize an account",
    description: "Keep the person’s profile available as a memorial, where supported.",
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
    description: "Save anything important, then review how to delete the account.",
  },
  {
    id: "memorial" as const,
    number: "03",
    title: "I want to preserve their online presence",
    description: "See which platforms support memorialized accounts.",
  },
];

export default function EnglishHomePage() {
  const router = useRouter();
  const { audience, goal, showSafeGuide, step, scrollOnChange, chooseAudience: selectAudience, chooseGoal: selectGoal, openSafeGuide, goBack, resetJourney } = useHomeJourney(true);
  const quickSearch = useCompositionSearch();
  const serviceSearch = useCompositionSearch();
  const quickQuery = quickSearch.query;
  const serviceQuery = serviceSearch.query;
  const setServiceQuery = serviceSearch.reset;
  function chooseAudience(next: Audience) { setServiceQuery(""); selectAudience(next); }
  function chooseGoal(next: Goal) { setServiceQuery(""); selectGoal(next); }

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

  function submit(e: FormEvent) {
    e.preventDefault();
    if (quickSearch.isComposing()) return;
    const q = quickQuery.trim().toLowerCase();
    if (!q) {
      router.push("/en/services");
      return;
    }
    const match = services.find(
      (s) => s.keywords.some((k) => k.toLowerCase().includes(q)) || s.name.toLowerCase().includes(q),
    );
    if (match) router.push(companyJourneyHref(match.slug, audience, goal, true));
    else router.push(`/en/services?q=${encodeURIComponent(quickQuery)}`);
  }

  function reset() { resetJourney(); clearAllProgress(); }


  return (
    <main className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.aurora} aria-hidden="true" />
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroContent}>
            <p className={styles.kicker}>DIGITAL LEGACY GUIDANCE</p>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroLine}>Find your next step</span>
              <span className={styles.heroLine}>among scattered records.</span>
            </h1>
            <p>
              Prepare ahead or find guidance for handling a loved one’s accounts.
            </p>
            <div className={styles.heroPaths}>
              <Link href="/en/prepare"><span>01</span><strong>Plan ahead</strong><small>Make a clear list of accounts and records</small><b aria-hidden="true">→</b></Link>
              <Link href="/en/after"><span>02</span><strong>After a death</strong><small>Review accounts and records at your own pace</small><b aria-hidden="true">→</b></Link>
            </div>
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

      <HomeWizardStage step={step} scrollOnChange={scrollOnChange} summary="Find a company guide step by step">
      {step === "audience" && <section className={styles.start}>
        <div className={styles.narrow}>
          <GuideProgress step={1} locale="en" />
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>GET STARTED</p>
              <h2>Whose accounts are you managing?</h2>
              <p>Choose your situation to see the most relevant guidance.</p>
            </div>
            <form className={styles.quickSearch} onSubmit={submit}>
              <label htmlFor="quick-company">Find a company</label>
              <div>
                <span className={styles.searchIcon} aria-hidden="true"><SearchIcon /></span>
                <input
                  id="quick-company"
                  {...quickSearch.inputProps}
                  placeholder="e.g. Google, Apple"
                />
                <button type="submit">Search</button>
              </div>
            </form>
          </div>
          <div className={styles.choiceList}>
            {audiences.map((o) => (
              <button
                type="button"
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
                <span className={styles.nextCue} aria-hidden="true"><ChevronIcon /></span>
              </button>
            ))}
          </div>
          <p className={styles.privacyNote}>
            Your progress is saved only on this device. No personal data or documents are collected.
          </p>
          <p className="visually-hidden" aria-live="polite">
            {goal
              ? "Step 3. Choose a service to open its official instructions."
              : showSafeGuide
                ? "A safer review order is open. You can start with photos and records."
                : audience
                  ? "Step 2. Choose the kind of help you need."
                  : ""}
          </p>
        </div>
      </section>}

      {(step === "goal" || step === "safe") && <section className={styles.flowSection}>
        <div className={styles.narrow}>
          <GuideProgress step={2} locale="en" />
          <button type="button" className={styles.back} onClick={goBack}>
            Back
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
              <h2>What would you like to do first?</h2>
              <p className={styles.helper}>
                You don’t need to decide everything now. Choose the outcome that feels closest.
              </p>
              {!showSafeGuide ? (
                <div className={styles.goalList}>
                  {unsureResults.map((o) => (
                  <button type="button" key={o.id} onClick={() => chooseGoal(o.id)}>
                    <span className={styles.resultNumber}>{o.number}</span>
                    <span>
                      <strong>{o.title}</strong>
                      <small>{o.description}</small>
                    </span>
                    <span className={styles.nextCue} aria-hidden="true"><ChevronIcon /></span>
                  </button>
                ))}
                <button type="button" onClick={openSafeGuide}>
                  <span className={styles.resultNumber}>04</span>
                  <span>
                    <strong>I’m still not sure</strong>
                    <small>We’ll walk through the safest order.</small>
                  </span>
                  <span className={styles.nextCue} aria-hidden="true"><ChevronIcon /></span>
                </button>
              </div>
            ) : (
              <SafeGuide onStart={() => chooseGoal("download")} onBack={goBack} />
            )}
          </>
        ) : (
          <>
            <h2>What would you like to do?</h2>
            <p className={styles.helper}>Your choice opens the services that match.</p>
            <div className={styles.goalList}>
              {availableGoals.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => chooseGoal(o.id)}
                  className={goal === o.id ? styles.selected : ""}
                  aria-pressed={goal === o.id}
                >
                  <span className={styles.goalIcon} aria-hidden="true"><GoalIcon id={o.id} /></span>
                  <span>
                    <strong>{o.title}</strong>
                    <small>{o.description}</small>
                  </span>
                  <span className={styles.nextCue} aria-hidden="true"><ChevronIcon /></span>
                </button>
              ))}
            </div>
          </>
        )}
        </div>
      </section>}

      {step === "services" && <section className={styles.services} id="services">
        <div className={styles.serviceLayout}>
          <aside>
            <GuideProgress step={3} locale="en" />
            <button type="button" className={styles.back} onClick={goBack}>
              Back
            </button>
            <p className={styles.kicker}>{goals.find((x) => x.id === goal)?.title}</p>
            <h2>
              {goal === "download" ? "Choose where your photos and records are stored" : "Choose a service"}
            </h2>
            <p>
              {goal === "memorial"
                ? "Only services that support memorialized accounts are shown."
                : goal === "download"
                  ? "If you use several services, start with the one that holds your most important records."
                  : "Services that support your selection appear first."}
            </p>
            <label className={styles.serviceSearch}>
              <span className={styles.searchIcon} aria-hidden="true"><SearchIcon /></span>
              <span className="visually-hidden">Search companies and services</span>
              <input
                {...serviceSearch.inputProps}
                placeholder="Search companies and services"
                aria-describedby="service-search-status"
              />
            </label>
            <small id="service-search-status" className={styles.searchFeedback} aria-live="polite">
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
                  <span className={styles.rowMeta}>
                    <span className={`${styles.status} ${styles[statusClass(status)]}`}>
                      {statusLabel(status)}
                    </span>
                    <span className={styles.rowAction}>View steps</span>
                  </span>
                </Link>
              );
            })}
            {!ordered.length && (
              <div className={styles.empty} aria-live="polite">
                <strong>
                  {goal === "memorial"
                    ? "Memorialized accounts aren’t available for this service."
                    : "No services found."}
                </strong>
                <p>
                  {goal === "memorial"
                    ? "Try another company or go back and choose a different option."
                    : "Try a different search or view all services."}
                </p>
                <button type="button" onClick={() => setServiceQuery("")}>View all services</button>
              </div>
            )}
          </div>
        </div>
      </section>}
      </HomeWizardStage>
      {step === "audience" && <ProgressSummary locale="en" />}

      {(audience || goal) && (
        <div className={styles.savedBar}>
          <span>Your progress is saved on this device.</span>
          <button type="button" onClick={reset}>Clear progress</button>
        </div>
      )}
    </main>
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
        <h3>Start with the steps that are hardest to undo</h3>
        <ol>
          <li>
            <b>1</b>
            <span>Check if there are important photos and records.</span>
          </li>
          <li>
            <b>2</b>
            <span>Download and save any available data first.</span>
          </li>
          <li>
            <b>3</b>
            <span>Decide whether to delete the account or preserve it as a memorial.</span>
          </li>
          <li>
            <b>4</b>
            <span>Choose the company and review its official instructions.</span>
          </li>
        </ol>
      </div>

      <div className={styles.resultComparison} aria-label="Method comparison by desired outcome">
        <div className={styles.comparisonHead}>
          <span>Your goal</span>
          <span>Best option</span>
          <span>Can it be undone?</span>
        </div>
        <div>
          <span><small className={styles.mobileLabel}>Your goal</small>I want to preserve records</span>
          <strong><small className={styles.mobileLabel}>Best option</small>Data Download</strong>
          <span><small className={styles.mobileLabel}>Can it be undone?</small>The account stays active</span>
        </div>
        <div>
          <span><small className={styles.mobileLabel}>Your goal</small>I want to remove the account</span>
          <strong><small className={styles.mobileLabel}>Best option</small>Account Deletion</strong>
          <span><small className={styles.mobileLabel}>Can it be undone?</small>Usually can’t be undone</span>
        </div>
        <div>
          <span><small className={styles.mobileLabel}>Your goal</small>I want to leave an online memorial</span>
          <strong><small className={styles.mobileLabel}>Best option</small>Memorialization</strong>
          <span><small className={styles.mobileLabel}>Can it be undone?</small>Depends on the platform</span>
        </div>
      </div>

      <div className={styles.safeActions}>
        <button type="button" className={styles.secondaryAction} onClick={onBack}>
          Choose another outcome
        </button>
        <button type="button" className={styles.primaryAction} onClick={onStart}>
          Review photos and records first
        </button>
      </div>
    </div>
  );
}

