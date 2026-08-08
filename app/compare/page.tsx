import { companies } from "@/lib/data";

const companyNames: Record<string, string> = {
  Apple: "애플",
  Google: "구글",
  Facebook: "페이스북",
  Meta: "메타",
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
      return "확인 중";
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

        <div className="tablewrap">
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
            <i className="legend-dot legend-yes" />
            가능
          </span>
          <span>
            <i className="legend-dot legend-partial" />
            일부 지원
          </span>
          <span>
            <i className="legend-dot legend-no" />
            불가
          </span>
          <span>
            <i className="legend-dot legend-checking" />
            확인 중
          </span>
        </div>
      </div>
    </main>
  );
}
