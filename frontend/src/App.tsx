import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
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
  const [isSignedIn, setIsSignedIn] = useState(false);

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
    <Container fluid className="py-3 app-shell">
      <Row className="justify-content-center">
        {!isSignedIn ? (
          <Button onClick={signIn}>Login with Google</Button>
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
