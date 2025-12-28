import type { BallEntry } from "./types.ts";

/**
 * Converts a data object into a flat array for Google Sheets
 */
export const formatBallRow = (entry: BallEntry): string[] => {
  return [
    entry.timestamp.toISOString(),
    entry.bowlerType,
    entry.deliveryLocation,
    entry.takeResult,
    entry.outcomeDetails || "N/A",
    entry.throwInResult || "N/A",
  ];
};

export const getRandomElement = <T>(arr: readonly T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

