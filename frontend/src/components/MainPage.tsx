import { type Dispatch, type SetStateAction } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import MultiSelectPage from "./MultiSelectPage";
import type { PageType, SelectionState } from "../../../common/types";

type Props = {
  selections: SelectionState;
  setSelections: Dispatch<SetStateAction<SelectionState>>;
  handleSubmit: () => void;
  activeIndex: number;
  visiblePages: PageType[];
  setLastUpdatedPage: Dispatch<SetStateAction<PageType | null>>;
};

const MainPage = ({
    selections,
    setSelections,
    handleSubmit,
    activeIndex,
    visiblePages,
    setLastUpdatedPage
}: Props) => {

  const currentPageType = visiblePages[activeIndex];
  const isLastStep = activeIndex === visiblePages.length - 1;
  const selectedValue = currentPageType
    ? selections[currentPageType] ?? ""
    : "";
  const isCurrentStepValid = selectedValue.length > 0;

  const handleUpdateSelection = (pageType: PageType, value: string) => {
    updateSingleSelection(pageType, value);
    setLastUpdatedPage(pageType);

    if (pageType === "take") {
      updateSingleSelection("collection", "");
      updateSingleSelection("error", "");
    }
  };

  const updateSingleSelection = (pageType: PageType, value: string) =>
    setSelections((prev: SelectionState) => ({ ...prev, [pageType]: value }));

  if (!currentPageType) {
    return null;
  }

  return (
    <Container fluid className="py-3 app-shell">
      <Row className="justify-content-center">
        <Col xs={12} xl={10}>
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
