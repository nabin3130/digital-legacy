import type { Metadata } from "next";
import { companies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Compare Policies",
  description: "Compare the digital legacy options available across major online platforms.",
  alternates: { canonical: "/en/compare" },
};

function getStatusText(value: string) {
  switch (value) {
    case "yes":
      return "Supported";
    case "partial":
      return "Limited";
    case "no":
      return "Not supported";
    default:
      return null;
  }
}

function getStatusClass(value: string) {
  switch (value) {
    case "yes":
      return "status-yes";
    case "partial":
      return "status-partial";
    case "no":
      return "status-no";
    default:
      return "";
  }
}

function PolicyMark({ value }: { value: string }) {
  const text = getStatusText(value);
  if (!text) {
    return (
      <span className="status-unknown" aria-label="Not stated in published guidance">
        —
      </span>
    );
  }

  return <span className={`status ${getStatusClass(value)}`}>{text}</span>;
}

const philosophyEn: Record<string, string> = {
  apple: "Legacy Contact access key and strict privacy protection.",
  google: "Pre-designated Inactive Account Manager data sharing.",
  meta: "Memorialized accounts or complete profile deletion upon request.",
  facebook: "Memorialized accounts or complete profile deletion upon request.",
  x: "Account deactivation upon verified immediate family request.",
  instagram: "Memorialized profile status or account removal upon family request.",
  samsung: "Samsung Account deletion and device data wipe.",
  naver: "Public blog post backup and verified account withdrawal.",
  kakao: "Memorial profile transition or permanent account closure.",
};

export default function EnglishComparePage() {
  return (
    <main className="compare-page">
      <div className="container">
        <div className="compare-heading">
          <h1>Compare Policies</h1>
          <p>See which digital legacy options each platform supports.</p>
        </div>

        <div className="tablewrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Plan Ahead</th>
                <th>Delete Account</th>
                <th>Memorialization</th>
                <th>Family Access</th>
                <th>Download Data</th>
                <th>Court Order</th>
                <th>How It Works</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <th scope="row">{company.company}</th>

                  <td>
                    <PolicyMark value={company.preDeathPlanning} />
                  </td>

                  <td>
                    <PolicyMark value={company.accountDeletion} />
                  </td>

                  <td>
                    <PolicyMark value={company.memorialAccount} />
                  </td>

                  <td>
                    <PolicyMark value={company.familyAccess} />
                  </td>

                  <td>
                    <PolicyMark value={company.dataDownload} />
                  </td>

                  <td>
                    <PolicyMark value={company.courtOrder} />
                  </td>

                  <td className="compare-feature">
                    {philosophyEn[company.slug] ?? company.philosophy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="compare-legend">
          <span>
            <i className="legend-dot legend-yes" />
            Supported
          </span>
          <span>
            <i className="legend-dot legend-partial" />
            Limited
          </span>
          <span>
            <i className="legend-dot legend-no" />
            Not supported
          </span>
          <span>
            <i className="legend-dash" aria-hidden="true">—</i>
            Not stated
          </span>
        </div>
        <p className="compare-note">
          A dash means published guidance does not state this option, so this guide does not mark it as supported or unsupported.
        </p>
      </div>
    </main>
  );
}
