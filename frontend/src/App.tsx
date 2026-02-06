import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import Header from "./components/Header";
import LoadingView from "./components/LoadingView";
import LoginView from "./components/LoginView";
import MainPage from "./components/MainPage";
import SummaryPage from "./components/SummaryPage";
import { useTracker } from "./hooks/useTracker";

const App = () => {
  const { state, actions } = useTracker();
  const {
    selections,
    isSignedIn,
    toast,
    isSubmitting,
    currentStepIndex,
    visiblePages,
    isSummary
  } = state;
  const {
    setSelections,
    setLastUpdatedPage,
    goToStep,
    handleSubmit,
    handleLogout,
    signIn,
    hideToast
  } = actions;

  return (
    <Container fluid className="vh-100 px-0 d-flex flex-column app-shell">
      {isSignedIn === null ? (
        <LoadingView />
      ) : isSignedIn === false ? (
        <LoginView onLogin={signIn} />
      ) : (
        <>
          <Header
            isSignedIn={isSignedIn}
            isSummary={isSummary}
            visiblePages={visiblePages}
            selections={selections}
            currentStepIndex={currentStepIndex}
            onLogout={handleLogout}
            onStepClick={goToStep}
            overCount={state.currentOverCount}
          />
          <Container fluid className="px-3 flex-grow-1 overflow-y-auto">
             <Row className="justify-content-center h-100">
                <Col xs={12} xl={10} className="py-3">
                    {isSummary ? (
                        <SummaryPage
                            selections={selections}
                            visiblePages={visiblePages}
                            onEdit={goToStep}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
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
             <Toast onClose={hideToast} show={toast.show} delay={3000} autohide bg={toast.variant}>
                <Toast.Header>
                   <strong className="me-auto">WK Tracker</strong>
                   <small>Just now</small>
                </Toast.Header>
                <Toast.Body className="text-white">{toast.message}</Toast.Body>
             </Toast>
          </ToastContainer>
        </>
      )}
    </Container>
  );
};

export default App;
