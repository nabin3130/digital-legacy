"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompanyAccountSelector from "@/components/CompanyAccountSelector";
import styles from "./GoogleAccountFlow.module.css";

type Audience = "mine" | "deceased";
type RouteId =
  | "add-contact"
  | "share-key"
  | "download"
  | "delete-mine"
  | "request-access"
  | "delete-account"
  | "no-key";

const routes: Record<Audience, Array<{ id: RouteId; title: string; description: string }>> = {
  mine: [
    { id: "add-contact", title: "Add a Legacy Contact", description: "Designate someone who may request access to eligible Apple Account data after your death." },
    { id: "share-key", title: "Share and safely store the access key", description: "Securely deliver the generated access key to your designated Legacy Contact." },
    { id: "download", title: "Download my Apple data", description: "Request a copy of photos, files, and data associated with your Apple Account." },
    { id: "delete-mine", title: "Delete my Apple Account", description: "Permanently delete the account after saving all important data." },
  ],
  deceased: [
    { id: "request-access", title: "I have a Legacy Contact access key", description: "Request account data access using the access key and death certificate." },
    { id: "delete-account", title: "Request account deletion for the deceased", description: "Permanently delete the deceased person's Apple Account if data access is not needed." },
    { id: "no-key", title: "Procedures when there is no access key", description: "Review the court-order and legal documentation route required in your jurisdiction." },
  ],
};

const GUIDE = "https://support.apple.com/en-us/102631";
const ACCESS_KEY = "https://support.apple.com/en-us/102678";
const DIGITAL_LEGACY = "https://digital-legacy.apple.com/";

export default function EnglishAppleAccountFlow() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [route, setRoute] = useState<RouteId | null>(null);

  useEffect(() => {
    function restore(event?: PopStateEvent) {
      const saved = event?.state?.appleAccountFlow;
      if (saved) {
        setAudience(saved.audience ?? null);
        setRoute(saved.route ?? null);
        return;
      }
      const params = new URLSearchParams(window.location.hash.slice(1));
      setAudience((params.get("account") as Audience | null) ?? null);
      setRoute((params.get("route") as RouteId | null) ?? null);
    }
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  function navigate(next: { audience: Audience | null; route?: RouteId | null }) {
    const nextRoute = next.route ?? null;
    const params = new URLSearchParams();
    if (next.audience) params.set("account", next.audience);
    if (nextRoute) params.set("route", nextRoute);
    const hash = params.toString() ? `#${params.toString()}` : window.location.pathname;
    window.history.pushState({ appleAccountFlow: { audience: next.audience, route: nextRoute } }, "", hash);
    setAudience(next.audience);
    setRoute(nextRoute);
  }

  const reset = () => navigate({ audience: null });

  return (
    <div className={styles.page}>
      {audience && (
        <header className={styles.header}>
          <button type="button" className={styles.brand} onClick={reset} aria-label="Apple Guide Home">
            <img src="/logos/apple.svg" alt="" width="48" height="48" />
            <span><small>Official Guide</small>Apple</span>
          </button>
          {(audience || route) && <button type="button" className={styles.back} onClick={() => window.history.back()}>← Back</button>}
        </header>
      )}

      {audience && (
        <nav className={styles.contextNavigation} aria-label="Apple help navigation">
          <ol className={styles.breadcrumb}>
            <li><Link href="/en/#services">Services</Link></li>
            <li><button type="button" onClick={reset}>Apple</button></li>
            <li><button type="button" onClick={() => navigate({ audience })}>{audience === "mine" ? "My Apple account" : "Deceased person’s Apple account"}</button></li>
          </ol>
          {route && (
            <div className={styles.quickNavigation}>
              <div className={styles.accountTabs} aria-label="Choose account type">
                <button
                  type="button"
                  className={audience === "mine" ? styles.activeTab : ""}
                  onClick={() => navigate({ audience: "mine" })}
                >
                  My Apple account
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
                <select value={route} onChange={(e) => navigate({ audience, route: e.target.value as RouteId })}>
                  {routes[audience].map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </nav>
      )}

      {!audience && (
        <CompanyAccountSelector
          locale="en"
          mine={{
            title: "My Apple account",
            description: "I want to designate a Legacy Contact and prepare an access key.",
            onSelect: () => navigate({ audience: "mine" }),
          }}
          deceased={{
            title: "A deceased person’s Apple account",
            description: "I need to request access to account data or handle account closure.",
            onSelect: () => navigate({ audience: "deceased" }),
          }}
        />
      )}


      {audience && !route && (
        <StepShell
          eyebrow={audience === "mine" ? "My Apple account" : "Deceased person’s Apple account"}
          title="What would you like to do?"
          description="Choose the option that best matches your situation."
        >
          {routes[audience].map((item) => (
            <Choice key={item.id} title={item.title} description={item.description} onClick={() => navigate({ audience, route: item.id })} />
          ))}
        </StepShell>
      )}

      {route && <Detail route={route} />}
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

function Detail({ route }: { route: RouteId }) {
  if (route === "add-contact") {
    return (
      <DetailPage
        eyebrow="My Apple account"
        title="Add a Legacy Contact"
        intro="A Legacy Contact is someone you designate in advance to request access to data stored in your Apple Account after your passing."
        sections={[
          [
            "How to set it up",
            [
              "Open Settings (or System Settings on Mac) and select your name/Apple ID.",
              "Choose Sign-In & Security, then select Legacy Contact > Add Legacy Contact.",
              "Authenticate with Face ID, Touch ID, or your device passcode.",
              "You can add any trusted contact (they do not need to be in Family Sharing) and assign multiple contacts.",
              "Share the generated access key via Messages or print a copy.",
            ],
          ],
          [
            "What happens if you do not set a Legacy Contact?",
            [
              "Family members will need to provide a court order or regional legal documents naming them as the rightful heir.",
              "The legal review process takes significantly longer and approval is not guaranteed.",
              "Apple does not grant account access with just a password or proof of relationship.",
            ],
          ],
          [
            "Important things to know",
            [
              "Legacy contacts do not receive your Apple Account password.",
              "They will need both the access key and a certified death certificate to request access.",
              "You can update or remove legacy contacts at any time in Settings.",
            ],
          ],
        ]}
        secondary={{ label: "Procedures without an access key", href: DIGITAL_LEGACY }}
        primary={{ label: "View Legacy Contact instructions on Apple", href: GUIDE }}
      />
    );
  }

  if (route === "share-key") {
    return (
      <DetailPage
        eyebrow="My Apple account"
        title="Share and safely store the access key"
        intro="When you add a Legacy Contact, Apple generates a unique access key. Deliver this key via Messages or save a printed/PDF copy to keep with important estate records."
        sections={[
          [
            "Sharing options",
            [
              "Send via Messages if the contact uses an Apple device running compatible software.",
              "Print a physical copy or export a PDF of the QR code/access key if they do not use Apple devices.",
              "If you update or replace a legacy contact, ensure you destroy old keys and issue new ones.",
            ],
          ],
          [
            "Important reminders",
            [
              "An access key alone does not grant access; an official death certificate is always required.",
              "Ensure your legacy contact knows where the physical or digital key is safely stored.",
            ],
          ],
        ]}
        primary={{ label: "Learn about Apple access keys", href: ACCESS_KEY }}
      />
    );
  }

  if (route === "download") {
    return (
      <DetailPage
        eyebrow="My Apple account"
        title="Download my Apple data"
        intro="You can request an export copy of data connected to your Apple Account via Apple’s Data and Privacy website."
        sections={[
          [
            "How to proceed",
            [
              "Sign in to privacy.apple.com with your Apple Account.",
              "Select 'Request a copy of your data'.",
              "Choose the services and data categories you want to download.",
              "Select a maximum file size and wait for Apple's completion notification email.",
            ],
          ],
          [
            "Important things to know",
            [
              "Available data may vary depending on active Apple services and regional regulations.",
              "Downloading your data does not delete it from Apple servers.",
              "If you plan to delete your account, back up all necessary data first.",
            ],
          ],
        ]}
        primary={{ label: "Request data copy on Apple", href: "https://privacy.apple.com/" }}
      />
    );
  }

  if (route === "delete-mine") {
    return (
      <DetailPage
        eyebrow="My Apple account"
        title="Delete my Apple Account"
        intro="Permanently delete your Apple Account and all connected personal data stored on Apple servers."
        warning="Ensure you have downloaded all photos, iCloud files, and important data before deleting."
        sections={[
          [
            "Before deleting",
            [
              "Download all photos, iCloud Drive files, and notes.",
              "Cancel active subscriptions and check recurring billing.",
              "Sign out of all Apple devices to prevent Activation Lock issues.",
            ],
          ],
          [
            "Important things to know",
            [
              "Once deletion is completed, the account and data cannot be restored.",
              "You will permanently lose access to App Store and iTunes purchases.",
            ],
          ],
        ]}
        primary={{ label: "Request account deletion on Apple", href: "https://privacy.apple.com/" }}
      />
    );
  }

  if (route === "request-access") {
    return (
      <DetailPage
        eyebrow="Deceased person’s Apple account"
        title="I have a Legacy Contact access key"
        intro="A Legacy Contact does not need an Apple device or Apple ID. You can submit the access key and death certificate through Apple’s Digital Legacy site to request data access."
        sections={[
          [
            "Before you start",
            [
              "You must be designated as a Legacy Contact by the account owner.",
              "You will need the access key provided by the deceased and a government-issued death certificate.",
              "Apple reviews each submission before granting approval.",
              "If there are multiple legacy contacts, each can request access independently.",
            ],
          ],
          [
            "Once approved",
            [
              "You do not log into the deceased person’s existing Apple ID directly.",
              "Apple creates a special Legacy Contact Apple ID for you to access the data.",
              "Access is granted for 3 years from approval date, after which the account is permanently deleted.",
              "Download and store all needed data safely within this 3-year period.",
            ],
          ],
          [
            "Eligible data includes",
            [
              "iCloud Photos, Mail, Contacts, Calendar, Notes, and Reminders",
              "Files stored in iCloud Drive, Call History, and Voice Memos",
              "Safari Bookmarks, Reading List, and Health data",
            ],
          ],
          [
            "Ineligible data (Not provided)",
            [
              "Purchased movies, music, books, or subscriptions",
              "In-app purchases and payment card details in Apple Pay",
              "Passwords and passkeys stored in iCloud Keychain",
            ],
          ],
        ]}
        primary={{ label: "Request account access on Digital Legacy", href: DIGITAL_LEGACY }}
      />
    );
  }

  if (route === "delete-account") {
    return (
      <DetailPage
        eyebrow="Deceased person’s Apple account"
        title="Request account deletion for the deceased"
        intro="This procedure permanently removes the deceased person’s account when you do not need access to account data."
        warning="If you need any photos, files, or documents, request access before deleting. Account deletion cannot be undone."
        sections={[
          [
            "Required information & documents",
            [
              "Deceased person’s Apple Account information (email / phone number).",
              "Official government-issued death certificate.",
              "Documents proving your relationship or legal estate authority.",
            ],
          ],
          [
            "Important things to know",
            [
              "Once deletion is completed, all data and purchases are permanently destroyed.",
              "Apple carefully verifies the applicant's legal authority before processing.",
            ],
          ],
        ]}
        primary={{ label: "Request account deletion on Digital Legacy", href: DIGITAL_LEGACY }}
      />
    );
  }

  return (
    <DetailPage
      eyebrow="Deceased person’s Apple account"
      title="Procedures when there is no access key"
      intro="If the deceased did not set a Legacy Contact or the access key cannot be found, you must follow Apple's legal request process."
      sections={[
        [
          "Required legal documentation",
          [
            "Proof of your identity and relationship to the deceased.",
            "Official certified death certificate.",
            "A court order or equivalent legal documentation issued in your jurisdiction explicitly mentioning the Apple Account.",
          ],
        ],
        [
          "Important things to know",
          [
            "Requirements vary by country and regional legal standards.",
            "Submitting documents does not guarantee approval; Apple reviews each case individually.",
          ],
        ],
      ]}
      primary={{ label: "Review legal request guidance on Apple", href: DIGITAL_LEGACY }}
    />
  );
}

import GuideCompletion from "@/components/GuideCompletion";

type ActionLink = { label: string; href: string };
function DetailPage({
  eyebrow,
  title,
  intro,
  sections,
  warning,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<[string, string[]]>;
  warning?: string;
  primary: ActionLink;
  secondary?: ActionLink;
}) {
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

      <section className={styles.officialHandoff}>
        <h2>When you open Apple's official page</h2>
        <ul>
          <li>Apple Account sign-in or Legacy Contact access key verification may be required.</li>
          <li>Apple may require official certified death certificates and proof of estate authority.</li>
          <li>This guide never requests or stores your Apple ID passwords or private access keys.</li>
        </ul>
      </section>

      <GuideCompletion company="Apple" task={title} href="/en/company/apple" locale="en" />

      <div className={styles.actions}>
        {secondary && (
          <a className={styles.secondary} href={secondary.href} target="_blank" rel="noopener noreferrer">
            {secondary.label}
          </a>
        )}
        <a className={styles.primary} href={primary.href} target="_blank" rel="noopener noreferrer">
          {primary.label} ↗
        </a>
      </div>
    </main>
  );
}

