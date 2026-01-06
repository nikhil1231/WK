import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import type { BallEntry, SelectionState } from "../../common/types";
import { initGoogleClient, logBallToSheet, signIn } from "./api/sheets";
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

  return (
    <Container fluid className="vh-100 px-3 d-flex flex-column app-shell">
      <Row className="flex-grow-1 justify-content-center align-items-center">
        {isSignedIn === null ? (
          <Spinner
            className="loading-spinner"
            animation="border"
            variant="primary"
          />
        ) : isSignedIn === false ? (
          <div className="d-flex flex-column align-items-center text-center">
            <h1 className="mb-4">Wicket Keeping Tracker</h1>
            <Button onClick={signIn}>
              Login with Google
            </Button>
          </div>
        ) : (
          <Col xs={12} xl={10}>
            <MainPage
              selections={selections}
              setSelections={setSelections}
              handleSubmit={handleSubmit}
            />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default App;
