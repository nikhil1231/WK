import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import StepProgress from "./StepProgress";
import MultiSelectPage from "./MultiSelectPage";

type Props = {
  selections: SelectionState;
  setSelections: Dispatch<SetStateAction<SelectionState>>;
  handleSubmit: () => void;
};

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

const MainPage = ({ selections, setSelections, handleSubmit }: Props) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lastUpdatedPage, setLastUpdatedPage] = useState<PageType | null>(null);

  // Determine which pages to show based on take result
  const getVisiblePages = (): PageType[] => {
    const takeSelection = selections.take;
    const pages: PageType[] = ["bowler", "delivery", "take"];

    if (
      takeSelection === "Clean take" ||
      takeSelection === "Catch" ||
      takeSelection === "Stumping"
    ) {
      pages.push("collection");
    } else if (takeSelection && takeSelection != "No touch") {
      pages.push("error");
    }
    pages.push("throwIn");

    return pages;
  };

  const visiblePages = getVisiblePages();
  const currentPageType = visiblePages[currentStepIndex];
  const isLastStep = currentStepIndex === visiblePages.length - 1;
  const selectedValue = currentPageType
    ? selections[currentPageType] ?? ""
    : "";
  const isCurrentStepValid = selectedValue.length > 0;

  // Auto-advance after selection is made
  useEffect(() => {
    if (!lastUpdatedPage) return;

    const newVisiblePages = getVisiblePages();
    const currentIndex = newVisiblePages.indexOf(lastUpdatedPage);

    if (currentIndex !== -1 && currentIndex < newVisiblePages.length - 1) {
      // Advance to next page
      setCurrentStepIndex(currentIndex + 1);
    }

    setLastUpdatedPage(null);
  }, [selections, lastUpdatedPage]);

  // Ensure current step index is valid after pages change
  useEffect(() => {
    const newVisiblePages = getVisiblePages();
    if (selections.bowler === "") {
      setCurrentStepIndex(0);
      setLastUpdatedPage(null);
    } else if (currentStepIndex >= newVisiblePages.length) {
      setCurrentStepIndex(Math.max(0, newVisiblePages.length - 1));
    }
  }, [selections.bowler, selections.take]);

  const handleUpdateSelection = (pageType: PageType, value: string) => {
    updateSingleSelection(pageType, value);
    setLastUpdatedPage(pageType);

    if (pageType === "take") {
      updateSingleSelection("collection", "");
      updateSingleSelection("error", "");
    }
  };

  const updateSingleSelection = (pageType: PageType, value: string) =>
    setSelections((prev) => ({ ...prev, [pageType]: value }));

  const goToStep = (index: number) => {
    if (index >= 0 && index < visiblePages.length) {
      setCurrentStepIndex(index);
    }
  };

  if (!currentPageType) {
    return null;
  }

  return (
    <Container fluid className="py-3 app-shell">
      <Row className="justify-content-center">
        <Col xs={12} xl={10}>
          <StepProgress
            visiblePages={visiblePages}
            selections={selections}
            activeIndex={currentStepIndex}
            onStepClick={goToStep}
          />
          <MultiSelectPage
            pageType={currentPageType}
            selectedValue={selectedValue}
            onChange={(value) => handleUpdateSelection(currentPageType, value)}
          />
          {isLastStep && selectedValue && (
            <div className="mt-3 text-center">
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={!isCurrentStepValid}
              >
                Submit
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
