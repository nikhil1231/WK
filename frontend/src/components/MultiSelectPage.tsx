import { Col, Row, Button } from "react-bootstrap";
import {
  bowlerTypes,
  deliveryLocations,
  takeResults,
  collectionDifficulties,
  errorReasons,
  throwInResults,
} from "../../../common/types";

type PageType =
  | "bowler"
  | "delivery"
  | "take"
  | "collection"
  | "error"
  | "throwIn";

type Props = {
  pageType: PageType;
  selectedValue: string;
  onChange: (value: string) => void;
};

const getPageConfig = (pageType: PageType) => {
  switch (pageType) {
    case "bowler":
      return {
        title: "Bowler Type",
        shortLabel: "Bowler",
        options: bowlerTypes.map((type: string) => ({
          value: type,
          label: type,
        })),
      };
    case "delivery":
      return {
        title: "Delivery Location",
        shortLabel: "Delivery",
        options: deliveryLocations.map((loc: string) => ({
          value: loc,
          label: loc,
        })),
      };
    case "take":
      return {
        title: "Take Result",
        shortLabel: "Take",
        options: takeResults.map((result: string) => ({
          value: result,
          label: result,
        })),
      };
    case "collection":
      return {
        title: "Collection Difficulty",
        shortLabel: "Difficulty",
        options: collectionDifficulties.map((diff: string) => ({
          value: diff,
          label: diff,
        })),
      };
    case "error":
      return {
        title: "Error Reason",
        shortLabel: "Error",
        options: errorReasons.map((reason: string) => ({
          value: reason,
          label: reason,
        })),
      };
    case "throwIn":
      return {
        title: "Throw In Result",
        shortLabel: "Throw In",
        options: throwInResults.map((result: string) => ({
          value: result,
          label: result,
        })),
      };
  }
};

const MultiSelectPage = ({ pageType, selectedValue, onChange }: Props) => {
  const config = getPageConfig(pageType);

  const handleSelect = (value: string) => {
    onChange(value);
  };

  // Special 3x3 grid layout for delivery location
  if (pageType === "delivery") {
    const gridOptions = [
      ["High Off Side", "High Straight", "High Leg Side"],
      ["Waist Off Side", "Waist Straight", "Waist Leg Side"],
      ["Low Off Side", "Low Straight", "Low Leg Side"],
    ];

    return (
      <section className="multiselect-page rounded-3 shadow-sm bg-body p-3">
        <header className="mb-3">
          <p className="eyebrow text-uppercase fw-semibold text-primary mb-1 small">
            {config.shortLabel}
          </p>
          <h1 className="h5 fw-bold mb-1">{config.title}</h1>
        </header>

        <div className="delivery-grid">
          {gridOptions.map((row, rowIdx) => (
            <Row key={rowIdx} className="g-1 mb-1">
              {row.map((location) => {
                const isActive = selectedValue === location;
                return (
                  <Col key={location} xs={4}>
                    <Button
                      size="sm"
                      variant={isActive ? "primary" : "outline-primary"}
                      className="w-100 delivery-button"
                      onClick={() => handleSelect(location)}
                      style={{ aspectRatio: "1", minHeight: "60px" }}
                    >
                      <div className="fw-semibold small">{location}</div>
                    </Button>
                  </Col>
                );
              })}
            </Row>
          ))}
        </div>
      </section>
    );
  }

  // Regular button layout for other pages
  return (
    <section className="multiselect-page rounded-3 shadow-sm bg-body p-3">
      <header className="mb-3">
        <p className="eyebrow text-uppercase fw-semibold text-primary mb-1 small">
          {config.shortLabel}
        </p>
        <h1 className="h5 fw-bold mb-1">{config.title}</h1>
      </header>

      <Row xs={1} sm={2} lg={3} className="g-2">
        {config.options.map((option: { value: string; label: string }) => {
          const isActive = selectedValue === option.value;
          return (
            <Col key={option.value}>
              <Button
                size="sm"
                variant={isActive ? "primary" : "outline-primary"}
                className="w-100 text-start option-button"
                onClick={() => handleSelect(option.value)}
              >
                <div className="fw-semibold small">{option.label}</div>
              </Button>
            </Col>
          );
        })}
      </Row>
    </section>
  );
};

export default MultiSelectPage;
