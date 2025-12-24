import { google } from "googleapis";
import { formatRowData } from "../common/utils.ts";
import type { SheetData } from "../common/types.ts";
import * as dotenv from "dotenv";
dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: "./service-account-key.json", // Downloaded from Google Cloud
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_ID = "SAMPLE";

async function populate() {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client as any });

  const dummyData = generateDummyRows(10);
  const values = dummyData.map(formatRowData);

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_ID}!A2`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });

  console.log("Successfully populated sheet with 10 rows!");
}

const generateDummyRows = (count: number): SheetData[] => {
  return Array.from({ length: count }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    timestamp: new Date().toISOString(),
  }));
};

populate();
