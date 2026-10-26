import type { Metadata } from "next";
import { companies } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "en",
  koPath: "/compare",
  title: "Compare policies",
  description: "Compare how major services handle account deletion, memorial accounts, and data download.",
});

function getStatusText(value: string) {
  switch (value) {
    case "yes":
      return "Supported";
    case "partial":
      return "Limited";
    case "no":
      return "Not supported";
    default:
      return "Not confirmed";
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
      return "status-checking";
  }
}

const philosophyEn: Record<string, string> = {
  apple: "Legacy Contact access key and strict privacy protection.",
  google: "Pre-designated Inactive Account Manager data sharing.",
  meta: "Memorialized accounts or complete profile deletion upon request.",
  facebook: "Memorialized accounts or complete profile deletion upon request.",
  x: "Account deactivation upon verified immediate family request.",
  instagram: "Legacy contact or delete-after-death, then memorialization or family removal.",
  samsung: "Legacy Manager access code, with a request window of one year after death.",
  naver: "Public blog post backup and verified account withdrawal.",
  kakao: "Optional memorial-profile agent, or closure by immediate family. Chats are not shared.",
};

export default function EnglishComparePage() {
  return (
    <main className="compare-page">
      <div className="container">
        <div className="compare-heading">
          <h1>Compare Policies</h1>
          <p>See which digital legacy options each platform supports.</p>
        </div>

        <p className="compare-scroll-hint">On a small screen, scroll the table sideways to see every column.</p>
        <div className="tablewrap" tabIndex={0} role="region" aria-label="Policy comparison table. Scroll sideways to see every column.">
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
                    <span className={`status ${getStatusClass(company.preDeathPlanning)}`}>
                      {getStatusText(company.preDeathPlanning)}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${getStatusClass(company.accountDeletion)}`}>
                      {getStatusText(company.accountDeletion)}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${getStatusClass(company.memorialAccount)}`}>
                      {getStatusText(company.memorialAccount)}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${getStatusClass(company.familyAccess)}`}>
                      {getStatusText(company.familyAccess)}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${getStatusClass(company.dataDownload)}`}>
                      {getStatusText(company.dataDownload)}
                    </span>
                  </td>

                  <td>
                    <span className={`status ${getStatusClass(company.courtOrder)}`}>
                      {getStatusText(company.courtOrder)}
                    </span>
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
            <i className="legend-dot legend-yes" aria-hidden="true" />
            Supported
          </span>
          <span>
            <i className="legend-dot legend-partial" aria-hidden="true" />
            Limited
          </span>
          <span>
            <i className="legend-dot legend-no" aria-hidden="true" />
            Not supported
          </span>
          <span>
            <i className="legend-dot legend-checking" aria-hidden="true" />
            Not confirmed
          </span>
        </div>
      </div>
    </main>
  );
}
