import { useEffect, useState } from "react";
import { Button, Col, Container, Navbar, Row, Spinner, Toast, ToastContainer } from "react-bootstrap";
import type { BallEntry, PageType, SelectionState } from "../../common/types";
import { initGoogleClient, logBallToSheet, signIn, signOut } from "./api/sheets";
import MainPage from "./components/MainPage";
import StepProgress from "./components/StepProgress";
import SummaryPage from "./components/SummaryPage";
import { selectionStateToBallEntry } from "./utils";

const EMPTY_SELECTIONS: SelectionState = {
  bowler: "",
  delivery: "",
  take: "",
  collection: "",
  error: "",
  throwIn: "",
};

const App = () => {
  const [selections, setSelections] =
    useState<SelectionState>(EMPTY_SELECTIONS);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Navigation State (Lifted from MainPage)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lastUpdatedPage, setLastUpdatedPage] = useState<PageType | null>(null);

  useEffect(() => {
    initGoogleClient(setIsSignedIn);
  }, []);

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
  const isSummary = currentStepIndex === visiblePages.length;

  // Auto-advance after selection is made
  useEffect(() => {
    if (!lastUpdatedPage) return;

    const newVisiblePages = getVisiblePages();
    const currentIndex = newVisiblePages.indexOf(lastUpdatedPage);

    if (currentIndex !== -1 && currentIndex < newVisiblePages.length) {
      // Advance to next page (or summary)
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
    } else if (currentStepIndex > newVisiblePages.length) {
       // Cap at length (Summary page)
      setCurrentStepIndex(Math.max(0, newVisiblePages.length));
    }
  }, [selections.bowler, selections.take, visiblePages.length]);

  const goToStep = (index: number) => {
    if (index >= 0 && index <= visiblePages.length) {
      setCurrentStepIndex(index);
    }
  };

  const handleSubmit = async () => {
    const newEntry: BallEntry = selectionStateToBallEntry(selections);

    console.log("Logging ball entry", newEntry);

    try {
      await logBallToSheet(newEntry);
      setSelections({...EMPTY_SELECTIONS}); // Reset selections
      setCurrentStepIndex(0); // Reset to first step
      setShowToast(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  const handleLogout = () => {
    signOut();
    setIsSignedIn(false);
  };

  return (
    <Container fluid className="vh-100 px-0 d-flex flex-column app-shell">
      {isSignedIn === null ? (
        <Row className="flex-grow-1 justify-content-center align-items-center m-0">
          <Spinner
            className="loading-spinner"
            animation="border"
            variant="primary"
          />
        </Row>
      ) : isSignedIn === false ? (
        <Row className="flex-grow-1 justify-content-center align-items-center m-0">
          <div className="d-flex flex-column align-items-center text-center">
            <h1 className="mb-4">Wicket Keeping Tracker</h1>
            <Button onClick={signIn}>Login with Google</Button>
          </div>
        </Row>
      ) : (
        <>
          <div className="sticky-top bg-white border-bottom shadow-sm z-3">
            <Navbar bg="light" variant="light" className="px-3">
               <Navbar.Brand className="fw-bold text-primary">WK Tracker</Navbar.Brand>
               <Navbar.Toggle />
               <Navbar.Collapse className="justify-content-end">
                  <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
               </Navbar.Collapse>
            </Navbar>
            {!isSummary && (
                <StepProgress
                    visiblePages={visiblePages}
                    selections={selections}
                    activeIndex={currentStepIndex}
                    onStepClick={goToStep}
                />
            )}
          </div>
          <Container fluid className="px-3 flex-grow-1 overflow-y-auto">
             <Row className="justify-content-center h-100">
                <Col xs={12} xl={10} className="py-3">
                    {isSummary ? (
                        <SummaryPage
                            selections={selections}
                            visiblePages={visiblePages}
                            onEdit={goToStep}
                            onSubmit={handleSubmit}
                        />
                    ) : (
                        <MainPage
                            selections={selections}
                            setSelections={setSelections}
                            onReview={() => goToStep(visiblePages.length)}
                            activeIndex={currentStepIndex}
                            visiblePages={visiblePages}
                            setLastUpdatedPage={setLastUpdatedPage}
                        />
                    )}
                </Col>
            </Row>
          </Container>

          <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1100 }}>
             <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="primary">
                <Toast.Header>
                   <strong className="me-auto">WK Tracker</strong>
                   <small>Just now</small>
                </Toast.Header>
                <Toast.Body className="text-white">Entry saved successfully!</Toast.Body>
             </Toast>
          </ToastContainer>
        </>
      )}
    </Container>
  );
};

export default App;
