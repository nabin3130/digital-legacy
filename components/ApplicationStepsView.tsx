"use client";

import { useEffect, useState } from "react";
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

export default function ApplicationStepsView({
    companyName,
    preDeathSteps,
    postDeathSteps,
  }: Props) {
    const [view, setView] = useState<ViewMode>("list");
    const displayName = getCompanyDisplayName(companyName);
  
    useEffect(() => {
      const savedView = localStorage.getItem("application-steps-view-v2");
  
      if (savedView === "list" || savedView === "grid") {
        setView(savedView);
      }
    }, []);
  
    function changeView(nextView: ViewMode) {
      setView(nextView);
      localStorage.setItem("application-steps-view-v2", nextView);
    }
  
    return (
      <div className="application-steps">
        <div className="company-header">
          <div className="company-title-area">
            <CompanyLogo companyName={companyName} />
            <h1>{displayName}</h1>
          </div>
  
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
    );
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
  journey: ApplicationStep["journey"];
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
        <div
          className={`editorial-steps ${
            journey === "post_death" ? "post-death-choices" : ""
          }`}
        >
          {steps.map((step, index) => (
            <EditorialStep
              key={step.id}
              step={step}
              index={index}
              journey={journey}
            />
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

function EditorialStep({
    step,
    index,
    journey,
  }: {
    step: ApplicationStep;
    index: number;
    journey: ApplicationStep["journey"];
  }) {
    const documents = getRequiredDocuments(step.required_documents);
    const itemLabel = getEditorialItemLabel(step, index, journey);
  
    return (
      <article className="editorial-step">
        <div className="editorial-step-number">{itemLabel}</div>
  
        <div className="editorial-step-body">
          <div className="editorial-step-heading">
            <h3>{step.title}</h3>
          </div>
  
          {step.description && (
            <p className="editorial-step-description">{step.description}</p>
          )}
  
          {documents.length > 0 && (
            <div className="editorial-documents">
              <strong>필요한 서류</strong>
  
              <ul>
                {documents.map((document, documentIndex) => (
                  <li key={`${step.id}-${documentIndex}`}>{document}</li>
                ))}
              </ul>
            </div>
          )}
  
          <a
            className={`editorial-step-action action-${step.link_type}`}
            href={step.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${step.title} 공식 페이지 열기`}
          >
            {getActionLabel(step)}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    );
  }

function StepCard({
  step,
  index,
}: {
  step: ApplicationStep;
  index: number;
}) {
  return (
    <a
      className="step-card-link"
      href={step.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${step.title} 공식 페이지 열기`}
    >
      <article className="step-card">
        <div className="step-card-top">
          <span className="step-number">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className={`step-type step-type-${step.link_type}`}>
            {getLinkTypeLabel(step.link_type)}
          </span>
        </div>

        <h3>{step.title}</h3>

        <div className="step-card-content">
          {step.description && <p>{step.description}</p>}

          {step.required_documents && (
            <div className="required-documents">
              <strong>필요한 서류</strong>
              <p>{step.required_documents}</p>
            </div>
          )}
        </div>

        <span className="step-card-action">
          {getActionLabel(step)}
          <span aria-hidden="true">↗</span>
        </span>
      </article>
    </a>
  );
}

function CompanyLogo({ companyName }: { companyName: string }) {
    const logos: Record<string, string> = {
      Kakao: "/logos/kakao.webp",
      Naver: "/logos/naver.svg",
      Instagram: "/logos/instagram.webp",
      Apple: "/logos/apple.svg",
      Google: "/logos/google.svg",
      Meta: "/logos/meta.svg",
      Samsung: "/logos/samsung.svg",
    };
  
    const logo = logos[companyName];
  
    if (!logo) return null;
  
    return (
      <div className="company-logo">
        <img
          src={logo}
          alt={`${getCompanyDisplayName(companyName)} 로고`}
          width={58}
          height={58}
        />
      </div>
    );
  }
  function getCompanyDisplayName(companyName: string) {
    const displayNames: Record<string, string> = {
      Kakao: "카카오",
      Naver: "네이버",
      Instagram: "인스타그램",
      Apple: "애플",
      Google: "구글",
      Meta: "메타",
      Samsung: "삼성",
    };
  
    return displayNames[companyName] ?? companyName;
  }

function getEditorialItemLabel(
    step: ApplicationStep,
    index: number,
    journey: ApplicationStep["journey"],
  ) {
    if (journey === "pre_death") {
      return String(index + 1).padStart(2, "0");
    }
  
    switch (step.link_type) {
      case "guide":
        return "안내";
  
      case "setup":
        return "설정";
  
      case "support":
        return "지원";
  
      case "request":
      case "application":
        return "선택";
  
      default:
        return String(index + 1).padStart(2, "0");
    }
  }

function getRequiredDocuments(requiredDocuments: string | null) {
  if (!requiredDocuments) {
    return [];
  }

  return requiredDocuments
    .split(/\n|,|·/)
    .map((document) => document.trim())
    .filter(Boolean);
}

function getLinkTypeLabel(linkType: string) {
  switch (linkType) {
    case "application":
      return "신청";

    case "request":
      return "요청";

    case "guide":
      return "안내";

    case "setup":
      return "설정";

    case "support":
      return "지원";

    default:
      return "공식 안내";
  }
}

function getActionLabel(step: ApplicationStep) {
  switch (step.link_type) {
    case "application":
      return "신청 페이지 열기";

    case "request":
      return step.title.includes("문의")
        ? "문의하기"
        : "요청 페이지 열기";

    case "setup":
      return "설정 페이지 열기";

    case "support":
      return "고객센터 열기";

    case "guide":
    default:
      return "안내 확인하기";
  }
}