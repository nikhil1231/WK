import { type BallEntry, SHEET_HEADERS } from "./types.ts";

export const logBallToSheet = async (
  ball: BallEntry,
  googleSheetsApi: any,
  sheetName: string
): Promise<void> =>
  await logMultipleBallsToSheet([ball], googleSheetsApi, sheetName);

export const logMultipleBallsToSheet = async (
  balls: BallEntry[],
  googleSheetsApi: any,
  sheetName: string,
  isLocal: boolean = false
): Promise<void> => {
  const values = balls.map(formatBallRow);
  const spreadsheetId = getEnvVar("SPREADSHEET_ID");

  const appendRequest = {
    spreadsheetId: spreadsheetId,
    range: `${sheetName}!A2`,
    valueInputOption: "USER_ENTERED",
    ...(!isLocal && { resource: { values } }),
    ...(isLocal && { requestBody: { values } }),
  };

  try {
    await googleSheetsApi.spreadsheets.values.append(appendRequest);
  } catch (err: any) {
    // If sheet doesn't exist, Create it and retry
    // Error encoded string often contains "Unable to parse range"
    const errorMsg = err.result?.error?.message || err.message || "";
    if (errorMsg.includes("Unable to parse range") || err.status === 400) {
       console.log(`Sheet ${sheetName} not found. Creating...`);

       // Create the new sheet
       await googleSheetsApi.spreadsheets.batchUpdate({
         spreadsheetId,
         resource: {
           requests: [
             {
               addSheet: {
                 properties: {
                   title: sheetName
                 }
               }
             }
           ]
         }
       });

       // Create Header Row
       await googleSheetsApi.spreadsheets.values.append({
         spreadsheetId,
         range: `${sheetName}!A1`,
         valueInputOption: "USER_ENTERED",
         resource: { values: [SHEET_HEADERS] }
       });

       // Append the data
       await googleSheetsApi.spreadsheets.values.append(appendRequest);
    } else {
      throw err;
    }
  }
};

export const readSheet = async (
  googleSheetsApi: any,
  sheetName: string
): Promise<BallEntry[]> => {
  const spreadsheetId = getEnvVar("SPREADSHEET_ID");
  try {
    const response = await googleSheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A2:H`,
    });

    // Handle differences between nodejs googleapis (data.values) and browser gapi (result.values)
    const values = response.result
        ? response.result.values
        : response.data.values;

    if (!values) return [];

    return values.map(parseBallRow);
  } catch (err: any) {
    const errorMsg = err.result?.error?.message || err.message || "";
    if (errorMsg.includes("Unable to parse range") || err.status === 400) {
        // Sheet doesn't exist yet, return empty
        return [];
    }
    throw err;
  }
};

/**
 * Converts a data object into a flat array for Google Sheets
 */
export const formatBallRow = (entry: BallEntry): string[] => {
  return [
    entry.timestamp.toISOString(),
    entry.overCount.over.toString(),
    entry.overCount.ball.toString(),
    entry.bowlerType,
    entry.deliveryPosition,
    entry.takeResult,
    entry.outcomeDetails || "N/A",
    entry.throwInResult || "N/A",
  ];
};

export const parseBallRow = (row: string[]): BallEntry => {
  const [
    timestampStr,
    overStr,
    ballStr,
    bowlerType,
    deliveryPosition,
    takeResult,
    outcomeDetails,
    throwInResult,
  ] = row;

  return {
    timestamp: new Date(timestampStr),
    overCount: {
      over: Number(overStr) || 0,
      ball: Number(ballStr) || 0,
    },
    bowlerType: bowlerType as any,
    deliveryPosition: deliveryPosition as any,
    takeResult: takeResult as any,
    outcomeDetails: outcomeDetails === "N/A" ? undefined : (outcomeDetails as any),
    throwInResult: throwInResult === "N/A" ? undefined : (throwInResult as any),
  };
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
  if (typeof value === "undefined" || value === null || value === "") {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};
