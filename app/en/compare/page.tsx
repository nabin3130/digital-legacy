import type { Metadata } from "next";
import { companies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Policy Comparison",
  description: "Compare digital legacy policies and support scopes across major online platforms.",
  alternates: { canonical: "/en/compare" },
};

function getStatusText(value: string) {
  switch (value) {
    case "yes":
      return "Supported";
    case "partial":
      return "Partial";
    case "no":
      return "Not supported";
    default:
      return "Checking";
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
          <h1>Policy Comparison</h1>
          <p>Compare digital legacy policies and supported scopes across major online platforms.</p>
        </div>

        <div className="tablewrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Pre-planning</th>
                <th>Account Deletion</th>
                <th>Memorialization</th>
                <th>Family Access</th>
                <th>Data Download</th>
                <th>Court Order</th>
                <th>Key Features</th>
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
            <i className="legend-dot legend-yes" />
            Supported
          </span>
          <span>
            <i className="legend-dot legend-partial" />
            Partial Support
          </span>
          <span>
            <i className="legend-dot legend-no" />
            Not Supported
          </span>
          <span>
            <i className="legend-dot legend-checking" />
            Checking
          </span>
        </div>
      </div>
    </main>
  );
}
