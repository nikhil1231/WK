import type { BallEntry } from "./types.ts";

export const logBallToSheet = async (
  ball: BallEntry,
  googleSheetsApi: any
): Promise<void> => await logMultipleBallsToSheet([ball], googleSheetsApi);

export const logMultipleBallsToSheet = async (
  balls: BallEntry[],
  googleSheetsApi: any,
  isLocal: boolean = false
): Promise<void> => {
  const values = balls.map(formatBallRow);

  const spreadsheetId = getEnvVar("SPREADSHEET_ID");
  const spreadsheetName = getEnvVar("SPREADSHEET_NAME");

  await googleSheetsApi.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: `${spreadsheetName}!A2`,
    valueInputOption: "USER_ENTERED",
    ...(!isLocal && { resource: { values } }),
    ...(isLocal && { requestBody: { values } }),
  });
};

/**
 * Converts a data object into a flat array for Google Sheets
 */
export const formatBallRow = (entry: BallEntry): string[] => {
  return [
    entry.timestamp.toISOString(),
    entry.bowlerType,
    entry.deliveryPosition,
    entry.takeResult,
    entry.outcomeDetails || "N/A",
    entry.throwInResult || "N/A",
  ];
};

export const getRandomElement = <T>(arr: readonly T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const getEnvVar = (key: string): string => {
  const value =
    typeof process !== "undefined" && process.env
      ? process.env[key]
      : import.meta.env[`VITE_${key}`];
  if (typeof value === "undefined" || value === null) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};
