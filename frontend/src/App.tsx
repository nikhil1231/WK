import { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import StepProgress from "./components/StepProgress";
import MultiSelectPage from "./components/MultiSelectPage";

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

const App = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<SelectionState>({
    bowler: "",
    delivery: "",
    take: "",
    collection: "",
    error: "",
    throwIn: "",
  });
  const [lastUpdatedPage, setLastUpdatedPage] = useState<PageType | null>(null);

  // Determine which pages to show based on take result
  const getVisiblePages = (): PageType[] => {
    const takeSelection = selections.take;
    const pages: PageType[] = ["bowler", "delivery", "take"];

    if (takeSelection === "No touch") {
      // Skip collection/error, go to throw in
      pages.push("throwIn");
    } else if (
      takeSelection === "Clean take" ||
      takeSelection === "Catch" ||
      takeSelection === "Stumping"
    ) {
      pages.push("collection");
      pages.push("throwIn");
    } else if (takeSelection) {
      pages.push("error");
      pages.push("throwIn");
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections, lastUpdatedPage]);

  // Ensure current step index is valid after pages change
  useEffect(() => {
    const newVisiblePages = getVisiblePages();
    if (currentStepIndex >= newVisiblePages.length) {
      setCurrentStepIndex(Math.max(0, newVisiblePages.length - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections.take]);

  const updateSelections = (pageType: PageType, value: string) => {
    setSelections((prev) => ({ ...prev, [pageType]: value }));
    setLastUpdatedPage(pageType);
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < visiblePages.length) {
      setCurrentStepIndex(index);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting selections:", selections);
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
            onChange={(value) => updateSelections(currentPageType, value)}
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

export default App;
