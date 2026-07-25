"use client";

import { useEffect, useMemo, useState } from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";

export type ApplicationStep = {
  id: number;
  company: string;
  journey: "pre_death" | "post_death";
  link_type: string;
  title: string;
  description: string | null;
  url: string;
  required_documents: string | null;
  sort_order: number | null;
  notes: string | null;
};

type Props = {
  companyName: string;
  preDeathSteps: ApplicationStep[];
  postDeathSteps: ApplicationStep[];
};

type ViewMode = "list" | "grid";
type Journey = ApplicationStep["journey"];
type ChecklistItem = {
  id: string;
  label: string;
  kind: "step" | "document";
  step?: ApplicationStep;
};

export default function ApplicationStepsView({
  companyName,
  preDeathSteps,
  postDeathSteps,
}: Props) {
  const [view, setView] = useState<ViewMode>("list");
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [activeJourney, setActiveJourney] = useState<Journey>("pre_death");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [hasLoadedChecklist, setHasLoadedChecklist] = useState(false);
  const displayName = getCompanyDisplayName(companyName);
  const storageKey = `digital-legacy-checklist-v1-${companyName.toLowerCase()}`;

  const checklistItems = useMemo(
    () => ({
      pre_death: createChecklistItems(preDeathSteps),
      post_death: createChecklistItems(postDeathSteps),
    }),
    [preDeathSteps, postDeathSteps],
  );

  const activeItems = checklistItems[activeJourney];
  const completedCount = activeItems.filter((item) => checkedItems[item.id]).length;
  const totalCount = activeItems.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const allItems = [...checklistItems.pre_death, ...checklistItems.post_death];
  const allCompleted = allItems.filter((item) => checkedItems[item.id]).length;

  useEffect(() => {
    const savedView = localStorage.getItem("application-steps-view-v2");
    if (savedView === "list" || savedView === "grid") setView(savedView);

    try {
      const savedChecklist = localStorage.getItem(storageKey);
      if (savedChecklist) setCheckedItems(JSON.parse(savedChecklist));
    } catch {
      localStorage.removeItem(storageKey);
    } finally {
      setHasLoadedChecklist(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hasLoadedChecklist) return;
    localStorage.setItem(storageKey, JSON.stringify(checkedItems));
  }, [checkedItems, hasLoadedChecklist, storageKey]);

  function changeView(nextView: ViewMode) {
    setView(nextView);
    localStorage.setItem("application-steps-view-v2", nextView);
  }

  function toggleItem(itemId: string) {
    setCheckedItems((current) => ({ ...current, [itemId]: !current[itemId] }));
  }

  function resetChecklist() {
    if (!window.confirm(`${displayName} 체크리스트를 모두 초기화할까요?`)) return;
    setCheckedItems({});
  }

  return (
    <div className={`application-steps-layout ${isChecklistOpen ? "checklist-is-open" : ""}`}>
      <div className="application-steps">
        <div className="company-header">
          <div className="company-title-area">
            <CompanyLogo companyName={companyName} />
            <h1>{displayName}</h1>
          </div>

          <div className="company-tools">
            <button
              type="button"
              className="checklist-open-button"
              onClick={() => setIsChecklistOpen(true)}
              aria-expanded={isChecklistOpen}
              aria-controls="account-checklist"
            >
              <span aria-hidden="true">✓</span>
              <span>체크리스트</span>
              {allItems.length > 0 && (
                <strong>
                  {allCompleted}/{allItems.length}
                </strong>
              )}
            </button>

            <div className="view-toggle" aria-label="보기 방식 선택">
              <button
                type="button"
                className={`view-button ${view === "list" ? "active" : ""}`}
                onClick={() => changeView("list")}
                aria-label="리스트 보기"
                title="리스트 보기"
              >
                <ViewListIcon fontSize="small" />
              </button>
              <button
                type="button"
                className={`view-button ${view === "grid" ? "active" : ""}`}
                onClick={() => changeView("grid")}
                aria-label="카드 보기"
                title="카드 보기"
              >
                <GridViewIcon fontSize="small" />
              </button>
            </div>
          </div>
        </div>

        <p className="company-description">
          생전에 준비하거나 사후에 처리할 수 있는 공식 안내와 신청 페이지를
          확인하세요.
        </p>

        <StepsSection
          title="생전에 준비하기"
          description="위에서부터 순서대로 설정하고 확인해 보세요."
          steps={preDeathSteps}
          view={view}
          journey="pre_death"
        />
        <hr className="journey-divider" />
        <StepsSection
          title="사후에 신청하기"
          description="고인의 계정을 어떻게 처리할지 원하는 방법을 선택하세요."
          steps={postDeathSteps}
          view={view}
          journey="post_death"
        />
      </div>

      {isChecklistOpen && (
        <button
          type="button"
          className="checklist-backdrop"
          onClick={() => setIsChecklistOpen(false)}
          aria-label="체크리스트 닫기"
        />
      )}

      <aside
        id="account-checklist"
        className="checklist-panel"
        aria-hidden={!isChecklistOpen}
        aria-label={`${displayName} 계정 준비 체크리스트`}
      >
        <div className="checklist-panel-header">
          <div>
            <span className="checklist-eyebrow">{displayName}</span>
            <h2>계정 준비 체크리스트</h2>
          </div>
          <button
            type="button"
            className="checklist-close-button"
            onClick={() => setIsChecklistOpen(false)}
            aria-label="체크리스트 닫기"
            title="닫기"
          >
            →
          </button>
        </div>

        <div className="checklist-tabs" role="tablist" aria-label="준비 시점 선택">
          <button
            type="button"
            className={activeJourney === "pre_death" ? "active" : ""}
            onClick={() => setActiveJourney("pre_death")}
            role="tab"
            aria-selected={activeJourney === "pre_death"}
          >
            생전 준비
          </button>
          <button
            type="button"
            className={activeJourney === "post_death" ? "active" : ""}
            onClick={() => setActiveJourney("post_death")}
            role="tab"
            aria-selected={activeJourney === "post_death"}
          >
            사후 처리
          </button>
        </div>

        <div className="checklist-progress">
          <div className="checklist-progress-label">
            <span>진행률</span>
            <strong>
              {completedCount}/{totalCount}
            </strong>
          </div>
          <div
            className="checklist-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="checklist-panel-body">
          {activeItems.length === 0 ? (
            <p className="checklist-empty">현재 확인할 수 있는 항목이 없습니다.</p>
          ) : (
            <ul className="checklist-items">
              {activeItems.map((item) => (
                <li
                  key={item.id}
                  className={`${item.kind === "document" ? "document-item" : ""} ${
                    checkedItems[item.id] ? "completed" : ""
                  }`}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(checkedItems[item.id])}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className="custom-checkbox" aria-hidden="true" />
                    <span className="checklist-item-copy">
                      {item.kind === "document" && <small>준비 서류</small>}
                      <span>{item.label}</span>
                    </span>
                  </label>
                  {item.step && (
                    <a href={item.step.url} target="_blank" rel="noopener noreferrer">
                      공식 페이지 열기 <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" className="checklist-reset" onClick={resetChecklist}>
          체크리스트 초기화
        </button>
      </aside>
    </div>
  );
}

function createChecklistItems(steps: ApplicationStep[]): ChecklistItem[] {
  return steps.flatMap((step) => {
    const stepItem: ChecklistItem = {
      id: `step-${step.journey}-${step.id}`,
      label: step.title,
      kind: "step",
      step,
    };
    const documentItems = getRequiredDocuments(step.required_documents).map(
      (document, index): ChecklistItem => ({
        id: `document-${step.journey}-${step.id}-${index}`,
        label: document,
        kind: "document",
      }),
    );
    return [stepItem, ...documentItems];
  });
}

function StepsSection({
  title,
  description,
  steps,
  view,
  journey,
}: {
  title: string;
  description: string;
  steps: ApplicationStep[];
  view: ViewMode;
  journey: Journey;
}) {
  if (steps.length === 0) {
    return (
      <section className="steps-section">
        <div className="steps-section-header">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <p className="steps-empty">현재 제공되는 공식 절차가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="steps-section">
      <div className="steps-section-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {view === "list" ? (
        <div className={`editorial-steps ${journey === "post_death" ? "post-death-choices" : ""}`}>
          {steps.map((step, index) => (
            <EditorialStep key={step.id} step={step} index={index} journey={journey} />
          ))}
        </div>
      ) : (
        <div className="steps-grid">
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

function EditorialStep({ step, index, journey }: { step: ApplicationStep; index: number; journey: Journey }) {
  const documents = getRequiredDocuments(step.required_documents);
  return (
    <article className="editorial-step">
      <div className="editorial-step-number">{getEditorialItemLabel(step, index, journey)}</div>
      <div className="editorial-step-body">
        <div className="editorial-step-heading"><h3>{step.title}</h3></div>
        {step.description && <p className="editorial-step-description">{step.description}</p>}
        {documents.length > 0 && (
          <div className="editorial-documents">
            <strong>필요한 서류</strong>
            <ul>{documents.map((document, i) => <li key={`${step.id}-${i}`}>{document}</li>)}</ul>
          </div>
        )}
        <a className={`editorial-step-action action-${step.link_type}`} href={step.url} target="_blank" rel="noopener noreferrer">
          {getActionLabel(step)} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}

function StepCard({ step, index }: { step: ApplicationStep; index: number }) {
  return (
    <a className="step-card-link" href={step.url} target="_blank" rel="noopener noreferrer">
      <article className="step-card">
        <div className="step-card-top">
          <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
          <span className={`step-type step-type-${step.link_type}`}>{getLinkTypeLabel(step.link_type)}</span>
        </div>
        <h3>{step.title}</h3>
        <div className="step-card-content">
          {step.description && <p>{step.description}</p>}
          {step.required_documents && <div className="required-documents"><strong>필요한 서류</strong><p>{step.required_documents}</p></div>}
        </div>
        <span className="step-card-action">{getActionLabel(step)} <span aria-hidden="true">↗</span></span>
      </article>
    </a>
  );
}

function CompanyLogo({ companyName }: { companyName: string }) {
  const key = getCompanyKey(companyName);
  const logos: Record<string, string> = {
    Kakao: "/logos/kakao.webp", Naver: "/logos/naver.svg", Instagram: "/logos/instagram.webp",
    Apple: "/logos/apple.svg", Google: "/logos/google.svg", Meta: "/logos/meta.svg", Samsung: "/logos/samsung.svg",
  };
  if (!logos[key]) return null;
  return <div className="company-logo"><img src={logos[key]} alt={`${getCompanyDisplayName(companyName)} 로고`} width={58} height={58} /></div>;
}

function getCompanyKey(companyName: string) {
  const keys: Record<string, string> = { 카카오: "Kakao", 네이버: "Naver", 인스타그램: "Instagram", 애플: "Apple", 구글: "Google", 메타: "Meta", 삼성: "Samsung" };
  return keys[companyName] ?? companyName;
}

function getCompanyDisplayName(companyName: string) {
  const names: Record<string, string> = { Kakao: "카카오", Naver: "네이버", Instagram: "인스타그램", Apple: "애플", Google: "구글", Meta: "메타", Samsung: "삼성" };
  return names[companyName] ?? companyName;
}

function getEditorialItemLabel(step: ApplicationStep, index: number, journey: Journey) {
  if (journey === "pre_death") return String(index + 1).padStart(2, "0");
  if (step.link_type === "guide") return "안내";
  if (step.link_type === "setup") return "설정";
  if (step.link_type === "support") return "지원";
  if (step.link_type === "request" || step.link_type === "application") return "선택";
  return String(index + 1).padStart(2, "0");
}

function getRequiredDocuments(value: string | null) {
  if (!value) return [];
  return value.split(/\n|,|·/).map((item) => item.trim()).filter(Boolean);
}

function getLinkTypeLabel(type: string) {
  return ({ application: "신청", request: "요청", guide: "안내", setup: "설정", support: "지원" } as Record<string, string>)[type] ?? "공식 안내";
}

function getActionLabel(step: ApplicationStep) {
  if (step.link_type === "application") return "신청 페이지 열기";
  if (step.link_type === "request") return step.title.includes("문의") ? "문의하기" : "요청 페이지 열기";
  if (step.link_type === "setup") return "설정 페이지 열기";
  if (step.link_type === "support") return "고객센터 열기";
  return "안내 확인하기";
}
