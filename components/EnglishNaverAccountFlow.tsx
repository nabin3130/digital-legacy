"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompanyAccountSelector from "@/components/CompanyAccountSelector";
import styles from "./GoogleAccountFlow.module.css";

type KnowsId = "yes" | "no";
type Audience = "mine" | "deceased";
type RouteId = "backup" | "delete" | "npay";

const officialHelpUrl = "https://help.naver.com/service/5640/contents/17441?lang=en";
const governmentCertificateUrl = "https://efamily.scourt.go.kr/";

type DocumentItem = { title: string; description: string; badge: string; href?: string };

const commonDocuments: DocumentItem[] = [
  {
    title: "Basic Certificate (Detailed)",
    description: "Available online after death registration is officially processed.",
    badge: "Available via e-Family system",
    href: governmentCertificateUrl,
  },
  {
    title: "Family Relation Certificate (Detailed)",
    description: "Used to verify the legal familial relationship between applicant and deceased.",
    badge: "Available via e-Family system",
    href: governmentCertificateUrl,
  },
  {
    title: "Death Certificate",
    description: "Official medical certificate confirming the fact and date of death.",
    badge: "Issued by Hospital",
  },
];

const routes: Array<{ id: RouteId; title: string; description: string }> = [
  {
    id: "backup",
    title: "Request backup of public posts",
    description: "Request an export archive of publicly viewable content (e.g., Naver Blog posts).",
  },
  {
    id: "delete",
    title: "Request account deletion for the deceased",
    description: "Prepare required documents to request complete Naver account withdrawal.",
  },
  {
    id: "npay",
    title: "Inquire about remaining Naver Pay balance",
    description: "Check if inheritable Naver Pay points or deposit money remain in the account.",
  },
];

export default function EnglishNaverAccountFlow() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [knowsId, setKnowsId] = useState<KnowsId | null>(null);
  const [route, setRoute] = useState<RouteId | null>(null);

  useEffect(() => {
    function restoreFromHistory(event?: PopStateEvent) {
      const saved = event?.state?.naverAccountFlow;
      if (saved) {
        setAudience(saved.audience ?? null);
        setKnowsId(saved.knowsId ?? null);
        setRoute(saved.route ?? null);
        return;
      }
      const params = new URLSearchParams(window.location.hash.slice(1));
      const savedAudience = params.get("account") as Audience | null;
      setAudience(savedAudience ?? (params.has("knows-id") ? "deceased" : null));
      setKnowsId((params.get("knows-id") as KnowsId | null) ?? null);
      setRoute((params.get("route") as RouteId | null) ?? null);
    }
    restoreFromHistory();
    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, []);

  function navigate(next: { audience: Audience | null; knowsId?: KnowsId | null; route?: RouteId | null }) {
    const nextKnowsId = next.knowsId ?? null;
    const nextRoute = next.route ?? null;
    const params = new URLSearchParams();
    if (next.audience) params.set("account", next.audience);
    if (nextKnowsId) params.set("knows-id", nextKnowsId);
    if (nextRoute) params.set("route", nextRoute);
    const hash = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState(
      { naverAccountFlow: { audience: next.audience, knowsId: nextKnowsId, route: nextRoute } },
      "",
      hash,
    );
    setAudience(next.audience);
    setKnowsId(nextKnowsId);
    setRoute(nextRoute);
  }

  function reset() {
    navigate({ audience: null });
  }

  return (
    <div className={styles.page}>
      {audience && (
        <header className={styles.header}>
          <button type="button" className={styles.brand} onClick={reset} aria-label="Naver Guide Home">
            <img src="/logos/naver.svg" alt="" width="48" height="48" />
            <span><small>Official Guide</small>Naver</span>
          </button>
          {audience && <button type="button" className={styles.back} onClick={() => window.history.back()}>← Back</button>}
        </header>
      )}

      {audience && (
        <nav className={styles.contextNavigation} aria-label="Naver help navigation">
          <ol className={styles.breadcrumb}>
            <li><Link href="/en/#services">Services</Link></li>
            <li><button type="button" onClick={reset}>Naver</button></li>
            <li><button type="button" onClick={() => navigate({ audience })}>{audience === "mine" ? "My Naver account" : "Deceased person’s Naver account"}</button></li>
          </ol>
        </nav>
      )}

      {!audience && (
        <CompanyAccountSelector
          mine={{
            title: "My Naver account",
            description: "I want to organize my data or delete my personal Naver account.",
            onSelect: () => navigate({ audience: "mine" }),
          }}
          deceased={{
            title: "A deceased person’s Naver account",
            description: "I need to handle public posts, account deletion, or Naver Pay balances.",
            onSelect: () => navigate({ audience: "deceased" }),
          }}
        />
      )}

      {audience === "mine" && <MineDetail />}

      {audience === "deceased" && !knowsId && (
        <StepShell
          eyebrow="Deceased person’s Naver account"
          title="Do you know the deceased person’s Naver ID?"
          description="Naver requires the account's Naver ID to process any deceased user requests."
        >
          <Choice
            title="Yes, I know the Naver ID"
            description="Proceed to select the required procedure and review document requirements."
            onClick={() => navigate({ audience: "deceased", knowsId: "yes" })}
          />
          <Choice
            title="No, I do not know the ID"
            description="Review Naver’s identity policies and how to locate the account ID."
            onClick={() => navigate({ audience: "deceased", knowsId: "no" })}
          />
        </StepShell>
      )}

      {audience === "deceased" && knowsId === "yes" && !route && (
        <StepShell
          eyebrow="Deceased person’s Naver account"
          title="What assistance do you need?"
          description="Choose the option that best matches your objective."
        >
          {routes.map((item) => (
            <Choice
              key={item.id}
              title={item.title}
              description={item.description}
              onClick={() => navigate({ audience: "deceased", knowsId: "yes", route: item.id })}
            />
          ))}
        </StepShell>
      )}

      {audience === "deceased" && knowsId === "no" && <UnknownId onReset={reset} />}
      {audience === "deceased" && route === "backup" && <BackupDetail />}
      {audience === "deceased" && route === "delete" && <DeleteDetail />}
      {audience === "deceased" && route === "npay" && <NpayDetail />}
    </div>
  );
}

function StepShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className={`${styles.shell} ${styles.compact}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p className={styles.lead}>{description}</p>
      <div className={styles.choices}>{children}</div>
    </main>
  );
}

function Choice({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.choice} onClick={onClick}>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </button>
  );
}

function UnknownId({ onReset }: { onReset: () => void }) {
  return (
    <DetailPage
      eyebrow="Deceased person’s Naver account"
      title="Please identify the deceased user’s Naver ID first"
      intro="Naver strictly provides assistance for deceased accounts only when the family can provide the exact Naver ID."
      note="Naver does not search for or disclose a deceased member's user ID or password to family members, in compliance with South Korean Personal Information Protection laws."
      action={{ label: "Back to start", onClick: onReset }}
    />
  );
}

function MineDetail() {
  return (
    <DetailPage
      eyebrow="My Naver account"
      title="Organize your Naver account step by step"
      intro="Review your stored emails, posts, cloud files, and connected services before deciding to close your account."
      sections={[
        [
          "What to review first",
          [
            "Public Blog posts, Cafe articles, and MYBOX cloud storage files.",
            "Remaining Naver Pay points and active recurring monthly subscriptions.",
            "Third-party apps and websites connected via Naver Login.",
          ],
        ],
        [
          "To delete your account",
          [
            "Save and export all necessary photos and documents.",
            "Cancel active subscriptions and settle any Naver Pay balances.",
            "Change login methods on external sites before initiating account withdrawal.",
          ],
        ],
      ]}
      note="Once deleted, your Naver ID and associated data cannot be recovered. Ensure you have backed up all files."
    />
  );
}

function BackupDetail() {
  return (
    <DetailPage
      eyebrow="Public content backup"
      title="Request backup of public posts"
      intro="You can request an archive of publicly viewable content (such as public Naver Blog articles) that can be accessed without logging in."
      warning="Private posts, Naver Mail, MYBOX files, and login credentials cannot be provided under any circumstances."
      sections={[
        [
          "Required documents",
          [
            "Official death certificate or basic certificate verifying death.",
            "Family relation certificate verifying relationship to the deceased.",
            "Naver’s official applicant consent and request form.",
          ],
        ],
        [
          "Important privacy guidelines",
          [
            "Mask the second half (last 7 digits) of all national ID numbers on submitted documents.",
            "Only content that was publicly published before death is eligible for export.",
          ],
        ],
      ]}
      documents={commonDocuments}
      link={{ label: "View Naver public post backup policy", href: officialHelpUrl }}
    />
  );
}

function DeleteDetail() {
  return (
    <DetailPage
      eyebrow="Account deletion"
      title="Request deletion of the deceased user's Naver account"
      intro="Submit proof of death and family relation documents to request permanent withdrawal and deletion of the deceased member's Naver account."
      warning="Once the account is deleted, the ID and all associated data are permanently destroyed. If you need a backup of public posts, request it first."
      sections={[
        [
          "Required documents",
          [
            "Deceased person's Naver ID.",
            "Certified death certificate and family relation certificate.",
            "Completed Naver account closure consent form.",
          ],
        ],
        [
          "Document submission tips",
          [
            "All documents must be official certificates issued by public agencies.",
            "The last 7 digits of all resident registration numbers must be masked.",
          ],
        ],
      ]}
      documents={commonDocuments}
      link={{ label: "View Naver account closure request", href: officialHelpUrl }}
    />
  );
}

function NpayDetail() {
  return (
    <DetailPage
      eyebrow="Naver Pay points & balance"
      title="Check inheritable Naver Pay balances"
      intro="You can inquire whether inheritable Naver Pay points or cash deposit money remain in the deceased user's account."
      sections={[
        [
          "Required documents",
          [
            "Certified death certificate and family relation certificate.",
            "Additional inheritance and probate documentation as requested by Naver Pay.",
          ],
        ],
        [
          "Important notes",
          [
            "Refunds for financial balances follow separate banking and estate inheritance procedures via Naver Pay Customer Center.",
          ],
        ],
      ]}
      documents={commonDocuments}
      link={{ label: "Open Naver Pay Help Center", href: "https://help.pay.naver.com/" }}
    />
  );
}

type Section = [string, string[]];
function DetailPage({
  eyebrow,
  title,
  intro,
  warning,
  note,
  sections = [],
  documents,
  link,
  action,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  warning?: string;
  note?: string;
  sections?: Section[];
  documents?: DocumentItem[];
  link?: { label: string; href: string };
  action?: { label: string; onClick: () => void };
}) {
  const [checked, setChecked] = useState(false);
  const storageKey = `digital-legacy-checklist-en-naver-${title.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    setChecked(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function updateChecklist(next: boolean) {
    setChecked(next);
    localStorage.setItem(storageKey, String(next));
  }

  return (
    <main className={`${styles.shell} ${styles.compact} ${styles.detail}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p className={styles.lead}>{intro}</p>
      {warning && (
        <div className={styles.warning}>
          <strong>Please review first</strong>
          <p>{warning}</p>
        </div>
      )}
      {sections.length > 0 && (
        <div className={styles.sections}>
          {sections.map(([heading, items]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      {documents && <DocumentGuide documents={documents} />}
      {note && <p className={styles.note}>{note}</p>}
      <label className={styles.checklistOption}>
        <input type="checkbox" checked={checked} onChange={(event) => updateChecklist(event.target.checked)} />
        <span>I have reviewed this procedure</span>
      </label>
      <div className={styles.actions}>
        {action && (
          <button type="button" className={styles.secondary} onClick={action.onClick}>
            {action.label}
          </button>
        )}
        {link && (
          <a className={styles.primary} href={link.href} target="_blank" rel="noopener noreferrer">
            {link.label} ↗
          </a>
        )}
      </div>
    </main>
  );
}

function DocumentGuide({ documents }: { documents: DocumentItem[] }) {
  return (
    <section className={styles.documentGuide}>
      <h2>Where to obtain required documents</h2>
      <p>Review the list below to prepare the necessary Korean administrative certificates.</p>
      <div className={styles.documentList}>
        {documents.map((document) => (
          <article className={styles.documentItem} key={document.title}>
            <span className={styles.documentIcon} aria-hidden="true">
              {document.href ? "📄" : "🏥"}
            </span>
            <div>
              <h3>{document.title}</h3>
              <p>{document.description}</p>
            </div>
            {document.href ? (
              <a className={document.badge} href={document.href} target="_blank" rel="noopener noreferrer">
                {document.badge} ↗
              </a>
            ) : (
              <span className={styles.documentBadge}>{document.badge}</span>
            )}
          </article>
        ))}
      </div>
      <Link className={styles.commonDocumentsLink} href="/en/prepare#documents">
        View common required documents guide →
      </Link>
    </section>
  );
}
