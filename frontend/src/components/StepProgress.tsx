import { ProgressBar } from "react-bootstrap";

type PageType =
  | "bowler"
  | "delivery"
  | "take"
  | "collection"
  | "error"
  | "throwIn";

type SelectionState = {
  bowler: string;
  delivery: string;
  take: string;
  collection: string;
  error: string;
  throwIn: string;
};

const PAGE_LABELS: Record<PageType, string> = {
  bowler: "Bowler",
  delivery: "Delivery",
  take: "Take",
  collection: "Difficulty",
  error: "Error",
  throwIn: "Throw In",
};

type Props = {
  visiblePages: PageType[];
  selections: SelectionState;
  activeIndex: number;
  onStepClick: (index: number) => void;
};

const StepProgress = ({
  visiblePages,
  selections,
  activeIndex,
  onStepClick,
}: Props) => {
  const progress = ((activeIndex + 1) / visiblePages.length) * 100;

  return (
    <section className="step-progress rounded-3 bg-body p-2 shadow-sm mb-3">
      <div className="d-flex flex-column gap-2 mb-2">
        {visiblePages.map((pageType, idx) => {
          const selection = selections[pageType] || "";
          const isActive = idx === activeIndex;
          const isComplete = idx < activeIndex;
          const isClickable = isComplete || isActive;

          return (
            <div
              key={idx}
              className={`step-item d-flex align-items-center gap-2 p-2 rounded ${
                isActive ? "current" : isComplete ? "complete" : ""
              } ${isClickable ? "clickable" : ""}`}
              onClick={() => isClickable && onStepClick(idx)}
              style={{ cursor: isClickable ? "pointer" : "default" }}
            >
              <div className="d-flex align-items-center gap-2">
                <span className="step-index">{idx + 1}</span>
                <span className="fw-semibold">{PAGE_LABELS[pageType]}</span>
              </div>
              {selection && (
                <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis ms-auto">
                  {selection}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <ProgressBar
        now={progress}
        aria-label={`Step ${activeIndex + 1} of ${visiblePages.length}`}
        style={{ height: "0.5rem" }}
      />
    </section>
  );
};

export default StepProgress;
