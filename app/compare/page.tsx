import type { Metadata } from "next";
import { companies } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  locale: "ko",
  koPath: "/compare",
  title: "정책 비교",
  description: "회사별 디지털 유산 정책에서 계정 삭제, 추모 계정, 데이터 다운로드 지원 범위를 비교합니다.",
});

const companyNames: Record<string, string> = {
  Apple: "애플",
  Google: "구글",
  Facebook: "페이스북",
  Meta: "메타",
  X: "X",
  Instagram: "인스타그램",
  Samsung: "삼성",
  NAVER: "네이버",
  Naver: "네이버",
  Kakao: "카카오",
};

function getStatusText(value: string) {
  switch (value) {
    case "yes":
      return "가능";

    case "partial":
      return "일부";

    case "no":
      return "불가";

    default:
      return "확인 필요";
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

export default function Compare() {
  return (
    <main className="compare-page">
      <div className="container">
        <div className="compare-heading">
          <h1>정책 비교</h1>
          <p>서비스별 디지털 유산 정책과 지원 범위를 비교합니다.</p>
        </div>

        <p className="compare-scroll-hint">좁은 화면에서는 표를 가로로 밀어 나머지 항목을 볼 수 있어요.</p>
        <div className="tablewrap" tabIndex={0} role="region" aria-label="정책 비교표. 가로로 스크롤할 수 있습니다.">
          <table className="compare-table">
            <thead>
              <tr>
                <th>회사</th>
                <th>사전 계획</th>
                <th>계정 삭제</th>
                <th>추모 계정</th>
                <th>유족 접근</th>
                <th>데이터 다운로드</th>
                <th>법원 명령</th>
                <th>특징</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <th scope="row">
                    {companyNames[company.company] ?? company.company}
                  </th>

                  <td>
                    <span
                      className={`status ${getStatusClass(
                        company.preDeathPlanning,
                      )}`}
                    >
                      {getStatusText(company.preDeathPlanning)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status ${getStatusClass(
                        company.accountDeletion,
                      )}`}
                    >
                      {getStatusText(company.accountDeletion)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status ${getStatusClass(
                        company.memorialAccount,
                      )}`}
                    >
                      {getStatusText(company.memorialAccount)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status ${getStatusClass(
                        company.familyAccess,
                      )}`}
                    >
                      {getStatusText(company.familyAccess)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status ${getStatusClass(
                        company.dataDownload,
                      )}`}
                    >
                      {getStatusText(company.dataDownload)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status ${getStatusClass(
                        company.courtOrder,
                      )}`}
                    >
                      {getStatusText(company.courtOrder)}
                    </span>
                  </td>

                  <td className="compare-feature">{company.philosophy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="compare-legend">
          <span>
            <i className="legend-dot legend-yes" aria-hidden="true" />
            가능
          </span>
          <span>
            <i className="legend-dot legend-partial" aria-hidden="true" />
            일부 지원
          </span>
          <span>
            <i className="legend-dot legend-no" aria-hidden="true" />
            불가
          </span>
          <span>
            <i className="legend-dot legend-checking" aria-hidden="true" />
            확인 필요
          </span>
        </div>
      </div>
    </main>
  );
}
