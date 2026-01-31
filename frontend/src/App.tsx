import { useEffect, useState } from "react";
import { Button, Col, Container, Navbar, Row, Spinner } from "react-bootstrap";
import type { BallEntry, SelectionState } from "../../common/types";
import { initGoogleClient, logBallToSheet, signIn, signOut } from "./api/sheets";
import MainPage from "./components/MainPage";
import { selectionStateToBallEntry } from "./utils";

const EMPTY_SELECTIONS = {
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

  useEffect(() => {
    initGoogleClient(setIsSignedIn);
  }, []);

  const handleSubmit = async () => {
    const newEntry: BallEntry = selectionStateToBallEntry(selections);

    console.log("Logging ball entry", newEntry);

    try {
      await logBallToSheet(newEntry);
      setSelections(EMPTY_SELECTIONS);
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
          <Navbar bg="light" variant="light" className="mb-3 border-bottom shadow-sm px-3">
             <Navbar.Brand className="fw-bold text-primary">Wicket Keeping Tracker</Navbar.Brand>
             <Navbar.Toggle />
             <Navbar.Collapse className="justify-content-end">
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
             </Navbar.Collapse>
          </Navbar>
          <Container fluid className="px-3">
             <Row className="justify-content-center">
                <Col xs={12} xl={10}>
                    <MainPage
                    selections={selections}
                    setSelections={setSelections}
                    handleSubmit={handleSubmit}
                    />
                </Col>
            </Row>
          </Container>
        </>
      )}
    </Container>
  );
};

export default App;
