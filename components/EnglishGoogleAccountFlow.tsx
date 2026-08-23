"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompanyAccountSelector from "@/components/CompanyAccountSelector";
import styles from "./GoogleAccountFlow.module.css";

type Audience = "mine" | "deceased";
type RouteId =
  | "prepare"
  | "download"
  | "delete-mine"
  | "receive-data"
  | "close-deceased"
  | "request-balance";
type ReceiverStatus = "designated" | "not-designated" | "unknown";

const routes: Record<Audience, Array<{ id: RouteId; title: string; description: string }>> = {
  mine: [
    { id: "prepare", title: "Set up Inactive Account Manager", description: "Choose trusted contacts, shared data, and whether the account should be deleted." },
    { id: "download", title: "Download my Google data", description: "Export an archive of your photos, emails, files, and activity via Google Takeout." },
    { id: "delete-mine", title: "Delete my Google Account", description: "Permanently remove your Google Account and all connected data." },
  ],
  deceased: [
    { id: "receive-data", title: "Request data from the deceased person's account", description: "Check how to receive account data depending on whether you were pre-designated." },
    { id: "close-deceased", title: "Close the deceased person’s account", description: "Request permanent deletion of the deceased user's account." },
    { id: "request-balance", title: "Request funds from the account", description: "Submit a request for remaining balances (Google Play, AdSense, etc.)." },
  ],
};

export default function EnglishGoogleAccountFlow() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [route, setRoute] = useState<RouteId | null>(null);
  const [receiverStatus, setReceiverStatus] = useState<ReceiverStatus | null>(null);

  useEffect(() => {
    function restoreFromHistory(event?: PopStateEvent) {
      const saved = event?.state?.googleAccountFlow;

      if (saved) {
        setAudience(saved.audience ?? null);
        setRoute(saved.route ?? null);
        setReceiverStatus(saved.receiverStatus ?? null);
        return;
      }

      const params = new URLSearchParams(window.location.hash.slice(1));
      setAudience((params.get("account") as Audience | null) ?? null);
      setRoute((params.get("route") as RouteId | null) ?? null);
      setReceiverStatus((params.get("receiver") as ReceiverStatus | null) ?? null);
    }

    restoreFromHistory();
    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, []);

  function navigate(next: {
    audience: Audience | null;
    route?: RouteId | null;
    receiverStatus?: ReceiverStatus | null;
  }) {
    const nextRoute = next.route ?? null;
    const nextReceiverStatus = next.receiverStatus ?? null;
    const params = new URLSearchParams();

    if (next.audience) params.set("account", next.audience);
    if (nextRoute) params.set("route", nextRoute);
    if (nextReceiverStatus) params.set("receiver", nextReceiverStatus);

    const hash = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState(
      { googleAccountFlow: { audience: next.audience, route: nextRoute, receiverStatus: nextReceiverStatus } },
      "",
      hash,
    );
    setAudience(next.audience);
    setRoute(nextRoute);
    setReceiverStatus(nextReceiverStatus);
  }

  function reset() {
    navigate({ audience: null });
  }

  function goBack() {
    window.history.back();
  }

  return (
    <div className={styles.page}>
      {audience && (
        <header className={styles.header}>
          <button type="button" className={styles.brand} onClick={reset} aria-label="Google Guide Home">
            <img src="/logos/google.svg" alt="" width="48" height="48" />
            <span><small>Official Guide</small>Google</span>
          </button>
          {(audience || route) && <button type="button" className={styles.back} onClick={goBack}>← Back</button>}
        </header>
      )}

      {audience && (
        <nav className={styles.contextNavigation} aria-label="Google help navigation">
          <ol className={styles.breadcrumb}>
            <li><Link href="/en/#services">Services</Link></li>
            <li><button type="button" onClick={reset}>Google</button></li>
            <li><button type="button" onClick={() => navigate({ audience })}>{audience === "mine" ? "My Google account" : "Deceased person’s Google account"}</button></li>
          </ol>

          {route && (
            <div className={styles.quickNavigation}>
              <div className={styles.accountTabs} aria-label="Choose account type">
                <button
                  type="button"
                  className={audience === "mine" ? styles.activeTab : ""}
                  onClick={() => navigate({ audience: "mine" })}
                >
                  My Google account
                </button>
                <button
                  type="button"
                  className={audience === "deceased" ? styles.activeTab : ""}
                  onClick={() => navigate({ audience: "deceased" })}
                >
                  Deceased person’s account
                </button>
              </div>

              <label className={styles.routeSelect}>
                <span>View other options</span>
                <select
                  value={route}
                  onChange={(event) => navigate({ audience, route: event.target.value as RouteId })}
                  aria-label="View other options"
                >
                  {routes[audience].map((item) => (
                    <option value={item.id} key={item.id}>{item.title}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </nav>
      )}

      {!audience && (
        <CompanyAccountSelector
          mine={{
            title: "My Google account",
            description: "I want to set up posthumous plans or organize my personal data.",
            onSelect: () => navigate({ audience: "mine" }),
          }}
          deceased={{
            title: "A deceased person’s Google account",
            description: "I need to handle the deceased person’s data, account, or remaining funds.",
            onSelect: () => navigate({ audience: "deceased" }),
          }}
        />
      )}

      {audience && !route && (
        <StepShell
          compact
          eyebrow={audience === "mine" ? "My Google account" : "Deceased person’s Google account"}
          title="What would you like to do?"
          description="Choose the option that best matches your situation."
        >
          {routes[audience].map((item) => (
            <Choice
              key={item.id}
              title={item.title}
              description={item.description}
              onClick={() => navigate({ audience, route: item.id })}
            />
          ))}
        </StepShell>
      )}

      {route === "receive-data" && !receiverStatus && (
        <StepShell
          compact
          eyebrow="Receive data from the account"
          title="Were you designated by the account owner as a trusted contact?"
          description="Designation status determines the exact path and portal for accessing data."
        >
          <Choice
            title="Yes, I was designated"
            description="Download shared data via the notification email link sent by Google."
            onClick={() => navigate({ audience: "deceased", route, receiverStatus: "designated" })}
          />
          <Choice
            title="No, I was not designated"
            description="Submit a request to Google as an immediate family member or legal representative."
            onClick={() => navigate({ audience: "deceased", route, receiverStatus: "not-designated" })}
          />
          <Choice
            title="I am not sure"
            description="Check your inbox for a notification email first; if none, proceed with a formal request."
            onClick={() => navigate({ audience: "deceased", route, receiverStatus: "unknown" })}
          />
        </StepShell>
      )}

      {route && route !== "receive-data" && <Detail route={route} />}
      {route === "receive-data" && receiverStatus && <DataRequestDetail status={receiverStatus} />}
    </div>
  );
}

function StepShell({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <main className={`${styles.shell} ${compact ? styles.compact : ""}`}>
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

function Detail({ route }: { route: Exclude<RouteId, "receive-data"> }) {
  if (route === "prepare") {
    return (
      <DetailPage
        eyebrow="My Google account"
        title="Set up Inactive Account Manager"
        intro="Decide who should be contacted and what data should be shared if your Google Account becomes inactive for a prolonged period."
        sections={[
          [
            "What you can configure",
            [
              "Inactivity waiting period (e.g. 3, 6, 12, or 18 months of no Google activity).",
              "Alert phone number and email addresses before the timeout triggers.",
              "Up to 10 trusted contacts who will be notified and given download access.",
              "Specific Google services and data categories shared with each contact.",
              "Option to automatically delete the Google Account after sharing is complete.",
            ],
          ],
          [
            "Important things to know",
            [
              "Triggers based on account inactivity, not an official government death notice.",
              "Trusted contacts receive a download link, never your account password or login access.",
              "You can modify or disable Inactive Account Manager at any time in your Google Account.",
            ],
          ],
        ]}
        note="Google refers to this official feature as ‘Inactive Account Manager’."
        primary={{ label: "Set up Inactive Account Manager on Google", href: "https://myaccount.google.com/inactive?hl=en" }}
      />
    );
  }

  if (route === "download") {
    return (
      <DetailPage
        eyebrow="My Google account"
        title="Download my Google data"
        intro="Export and store an archive of your photos, emails, files, and documents using Google Takeout."
        sections={[
          [
            "Available data categories",
            [
              "Gmail messages and attachments",
              "Google Photos and videos in full resolution",
              "Google Drive documents, spreadsheets, and files",
              "Google Calendar, Contacts, YouTube playlists and history",
            ],
          ],
          [
            "How it works",
            [
              "Select the specific Google services and data categories you want.",
              "Choose delivery method (email download link, Google Drive, Dropbox, OneDrive).",
              "Select file format (.zip or .tgz) and archive split size.",
              "Google will prepare the archive (which may take hours or days) and email you a download link.",
            ],
          ],
          [
            "Important things to know",
            [
              "Downloading an archive does not delete the original data from Google servers.",
              "Archive generation time depends on the volume of data.",
              "Store downloaded archives in a secure backup location.",
            ],
          ],
        ]}
        primary={{ label: "Export data via Google Takeout", href: "https://takeout.google.com/?hl=en" }}
      />
    );
  }

  if (route === "delete-mine") {
    return (
      <DetailPage
        eyebrow="My Google account"
        title="Delete my Google Account"
        intro="Permanently remove your Google Account and all connected Google services and data."
        warning="Make sure you have downloaded all necessary photos, emails, documents, and purchased media before proceeding with deletion."
        sections={[
          [
            "Before deleting",
            [
              "Download all critical data using Google Takeout.",
              "Update recovery emails and login credentials for third-party services linked to this Gmail.",
              "Review active Google Play subscriptions and recurring payments.",
              "Ensure all backup files are safely stored offline or on external storage.",
            ],
          ],
          [
            "Important things to know",
            [
              "You will permanently lose access to Gmail, Drive, Photos, YouTube, and all associated services.",
              "Account deletion cannot be undone once the recovery grace period expires.",
            ],
          ],
        ]}
        secondary={{ label: "Download data first", href: "https://takeout.google.com/?hl=en" }}
        primary={{ label: "Delete Google Account", href: "https://support.google.com/accounts/answer/32046?hl=en" }}
      />
    );
  }

  if (route === "close-deceased") {
    return (
      <DetailPage
        eyebrow="Deceased person’s Google account"
        title="Close the deceased person’s account"
        intro="Immediate family members or authorized legal representatives can submit a formal request to close the deceased user's account."
        warning="If you also need data from the account, submit a data request before closing it. Once closed, data cannot be recovered."
        sections={[
          [
            "Required information & documents",
            [
              "Applicant’s full name and contact email address.",
              "Deceased person’s full name and Google email address.",
              "Government-issued death certificate and proof of relationship or legal estate authority.",
            ],
          ],
          [
            "Important things to know",
            [
              "Google evaluates every submission under strict global privacy laws.",
              "Additional certified documentation may be requested depending on jurisdiction.",
              "Google never provides passwords or direct account login access.",
            ],
          ],
        ]}
        primary={{ label: "Submit account closure request", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=en" }}
      />
    );
  }

  return (
    <DetailPage
      eyebrow="Deceased person’s Google account"
      title="Request funds from the account"
      intro="Submit a request to Google if eligible balances (such as Google Play developer earnings, AdSense, or paid credits) remain in the deceased user's account."
      sections={[
        [
          "Required information & documents",
          [
            "Applicant’s full name and contact email address.",
            "Deceased person’s full name and Google email address.",
            "Certified death certificate and legal inheritance/estate administration documents.",
          ],
        ],
        [
          "Important things to know",
          [
            "Submitting a request does not guarantee payout; claims are subject to financial verification and probate rules.",
            "Additional banking and court documents may be requested.",
            "Passwords or login credentials will not be provided.",
          ],
        ],
      ]}
      primary={{ label: "Submit funds request to Google", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=en" }}
    />
  );
}

function DataRequestDetail({ status }: { status: ReceiverStatus }) {
  if (status === "designated") {
    return (
      <DetailPage
        eyebrow="Receive data from the account"
        title="Download pre-shared data"
        intro="Open the notification email sent by Google to download the specific data categories pre-selected by the account owner."
        sections={[
          [
            "How to proceed",
            [
              "Check your inbox for the official email sent by Google regarding shared data.",
              "Click the secure download link in the email.",
              "Complete identity verification using your phone number.",
              "Download the archive files within the stated expiration timeframe.",
            ],
          ],
          [
            "Important things to know",
            [
              "You will not have login access to the deceased user's Google Account.",
              "You will only receive data categories pre-selected by the owner.",
              "Download links expire after a designated period.",
            ],
          ],
        ]}
        note="Please check your email directly to access the shared data download link."
      />
    );
  }

  return (
    <DetailPage
      eyebrow="Receive data from the account"
      title="Request data from Google"
      intro={
        status === "unknown"
          ? "If you checked your email and found no pre-shared notification, immediate family members or legal representatives may submit a formal request to Google."
          : "Even if not pre-designated, verified immediate family members or legal representatives can request review for eligible account data."
      }
      warning="Do not close the account before requesting data. Submit the data request first, and proceed with account closure after review."
      sections={[
        [
          "Required information & documents",
          [
            "Applicant’s full name and contact email address.",
            "Deceased person’s full name and Google email address.",
            "Specific data categories requested and the legitimate reason for the request.",
            "Government-issued death certificate and proof of legal authority/relationship.",
          ],
        ],
        [
          "Important things to know",
          [
            "Submitting a request does not guarantee approval. Google reviews each case individually.",
            "Google complies with strict privacy regulations; passwords or direct account access are never provided.",
          ],
        ],
      ]}
      primary={{ label: "Submit deceased user data request", href: "https://support.google.com/accounts/troubleshooter/6357590?hl=en" }}
    />
  );
}

type ActionLink = { label: string; href: string };
function DetailPage({
  eyebrow,
  title,
  intro,
  sections,
  warning,
  note,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<[string, string[]]>;
  warning?: string;
  note?: string;
  primary?: ActionLink;
  secondary?: ActionLink;
}) {
  const [checked, setChecked] = useState(false);
  const storageKey = `digital-legacy-checklist-en-google-${title.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    setChecked(localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function updateChecklist(next: boolean) {
    setChecked(next);
    localStorage.setItem(storageKey, String(next));
  }

  const hasRequiredDocuments = sections.some(
    ([heading, items]) =>
      (heading.toLowerCase().includes("required") || heading.toLowerCase().includes("document")) &&
      items.some((item) => item.toLowerCase().includes("certificate") || item.toLowerCase().includes("document")),
  );

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
      {hasRequiredDocuments && (
        <Link className={styles.commonDocumentsLink} href="/en/prepare#documents">
          View common required documents and issuance guide →
        </Link>
      )}
      {note && <p className={styles.note}>{note}</p>}
      <label className={styles.checklistOption}>
        <input type="checkbox" checked={checked} onChange={(event) => updateChecklist(event.target.checked)} />
        <span>I have reviewed this procedure</span>
      </label>
      <div className={styles.actions}>
        {secondary && (
          <a className={styles.secondary} href={secondary.href} target="_blank" rel="noopener noreferrer">
            {secondary.label}
          </a>
        )}
        {primary && (
          <a className={styles.primary} href={primary.href} target="_blank" rel="noopener noreferrer">
            {primary.label} ↗
          </a>
        )}
      </div>
    </main>
  );
}
