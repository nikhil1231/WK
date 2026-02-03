
import { Button, Navbar } from "react-bootstrap";
import StepProgress from "./StepProgress";
import type { OverCount, PageType, SelectionState } from "../../../common/types";

interface HeaderProps {
    isSignedIn: boolean;
    isSummary: boolean;
    visiblePages: PageType[];
    selections: SelectionState;
    currentStepIndex: number;
    overCount: OverCount;
    onLogout: () => void;
    onStepClick: (index: number) => void;
}

const Header = ({
    isSignedIn,
    isSummary,
    visiblePages,
    selections,
    currentStepIndex,
    overCount,
    onLogout,
    onStepClick
}: HeaderProps) => {
    if (!isSignedIn) return null;

    return (
        <div className="sticky-top bg-white border-bottom shadow-sm z-3">
            <Navbar bg="light" variant="light" className="px-3">
                <Navbar.Brand className="fw-bold text-primary">WK Tracker</Navbar.Brand>
                {overCount && (
                  <Navbar.Text className="mx-auto fw-bold">
                    {overCount.over}.{overCount.ball} Overs
                  </Navbar.Text>
                )}
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Button variant="outline-danger" size="sm" onClick={onLogout}>
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Navbar>
            {!isSummary && (
                <StepProgress
                    visiblePages={visiblePages}
                    selections={selections}
                    activeIndex={currentStepIndex}
                    onStepClick={onStepClick}
                />
            )}
        </div>
    );
};

export default Header;
