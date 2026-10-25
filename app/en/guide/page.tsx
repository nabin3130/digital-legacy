import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/guide",
  title: "Glossary",
  description: "Short definitions for digital legacy terms, including memorial accounts and dormant accounts.",
});

const terms = [
  ["Digital legacy", "Accounts, data, posts, and other digital assets that remain after death"],
  ["Digital remains", "Data and records a person left in online services"],
  ["Information tied to the person", "Information that belongs only to the individual and is generally not transferred or inherited"],
  ["Memorial account", "An account state that blocks login while preserving the person’s profile and posts"],
  ["Dormant account", "An account left unused for a long time and held separately or scheduled for deletion"],
];

export default function EnglishGuidePage() {
  return (
    <main className="section">
      <div className="container">
        <h1>Glossary</h1>
        <div className="grid">
          {terms.map(([term, description]) => (
            <section className="card" key={term}>
              <h3>{term}</h3>
              <p className="muted">{description}</p>
            </section>
          ))}
        </div>
        <section className="card" style={{ marginTop: 24 }}>
          <h2>When you need to manage a family member’s account</h2>
          <ul>
            <li>Prepare a death certificate and family relationship documents</li>
            <li>Check whether the person set up a legacy contact in advance</li>
            <li>Decide whether the goal is account deletion or a data backup</li>
            <li>Review the platform’s official request page</li>
            <li>Keep a copy of the result and the documents you submitted</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
