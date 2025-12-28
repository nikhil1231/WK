import { google } from "googleapis";
import { formatBallRow, getRandomElement } from "../common/utils.ts";
import * as dotenv from "dotenv";
import type {
  BallEntry,
  BowlerType,
  OutcomeDetails,
  TakeResult,
} from "../common/types.ts";
import {
  bowlerTypes,
  collectionDifficulties,
  deliveryLocations,
  errorReasons,
  takeResults,
  throwInResults,
} from "../common/types.ts";
dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: "./service-account-key.json", // Downloaded from Google Cloud
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_ID = "SAMPLE";

const NUM_OVERS = 20;
const OVER_LENGTH = 6;
const POST_BALL_DELAY = 1;
const POST_OVER_DELAY = 5;

async function populate() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client as any });

  const dummyData = generateDummyRows();
  const values = dummyData.map(formatBallRow);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_ID}!A2`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });

  console.log(`Successfully populated sheet with ${NUM_OVERS} overs.`);
}

const generateDummyRows = (): BallEntry[] => {
  let rows: BallEntry[] = [];
  let timestamp = new Date();
  for (let i = 0; i < NUM_OVERS; i++) {
    // Pick a random bowler type
    const bowlerType: BowlerType = getRandomElement(bowlerTypes);

    Array.from({ length: OVER_LENGTH }, () => {
      const takeResult: TakeResult = getRandomElement(takeResults);
      let outcomeDetails: OutcomeDetails = getRandomElement(errorReasons);

      if (takeResult === "No touch") {
        outcomeDetails = undefined;
      } else if (["Clean take", "Catch", "Stumping"].includes(takeResult)) {
        outcomeDetails = getRandomElement(collectionDifficulties);
      }
      timestamp = addMinutes(timestamp, POST_BALL_DELAY);

      const entry: BallEntry = {
        timestamp,
        bowlerType,
        deliveryLocation: getRandomElement(deliveryLocations),
        takeResult: getRandomElement(takeResults),
        outcomeDetails,
        throwInResult: getRandomElement(throwInResults),
      };

      rows.push(entry);
    });

    timestamp = addMinutes(timestamp, POST_OVER_DELAY);
  }
  return rows;
};

const addMinutes = (date: Date, minutes: number): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

populate();
