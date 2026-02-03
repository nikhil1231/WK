
import { useEffect, useState } from "react";
import { initGoogleClient, logBallToSheet, readSheet, signIn, signOut } from "../api/sheets";
import type { BallEntry, OverCount, PageType, SelectionState } from "../../../common/types";
import * as utils from "../../../common/utils.ts";
import { selectionStateToBallEntry } from "../utils";

const EMPTY_SELECTIONS: SelectionState = {
  bowler: "",
  delivery: "",
  take: "",
  collection: "",
  error: "",
  throwIn: "",
};

// TODO: handle no-balls
const getNextOverCount = (current: OverCount): OverCount => {
  let { over, ball } = current;
  if (ball >= 6) {
    over += 1;
    ball = 1;
  } else {
    ball += 1;
  }
  return { over, ball };
};

export const useTracker = () => {
  const [selections, setSelections] = useState<SelectionState>(EMPTY_SELECTIONS);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Tracking State
  const [lastOverCount, setLastOverCount] = useState<OverCount>({ over: 0, ball: 0 });

  // Navigation State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lastUpdatedPage, setLastUpdatedPage] = useState<PageType | null>(null);

  useEffect(() => {
    initGoogleClient(setIsSignedIn);
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      const sheetName = utils.getEnvVar("SPREADSHEET_NAME");
      readSheet(sheetName).then((entries) => {
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          // Ensure we have a valid position
          if (lastEntry.overCount) {
            setLastOverCount(lastEntry.overCount);
          }
        }
      }).catch(console.error);
    }
  }, [isSignedIn]);

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
    const nextOverCount = getNextOverCount(lastOverCount);
    const newEntry: BallEntry = selectionStateToBallEntry(selections, nextOverCount);

    console.log("Logging ball entry", newEntry);

    try {
      const sheetName = utils.getEnvVar("SPREADSHEET_NAME");
      await logBallToSheet(newEntry, sheetName);
      setSelections({...EMPTY_SELECTIONS}); // Reset selections
      setLastOverCount(nextOverCount); // Update local state
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

  return {
    state: {
      selections,
      isSignedIn,
      showToast,
      currentStepIndex,
      visiblePages,
      isSummary,
      currentOverCount: getNextOverCount(lastOverCount)
    },
    actions: {
      setSelections,
      setLastUpdatedPage,
      goToStep,
      handleSubmit,
      handleLogout,
      signIn,
      setShowToast
    }
  };
};
