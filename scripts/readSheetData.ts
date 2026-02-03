import * as dotenv from "dotenv";
import { google } from "googleapis";
import { GOOGLE_API_SCOPE } from "../common/consts.ts";
import * as utils from "../common/utils.ts";

dotenv.config();

// Configuration
const SHEET_NAME = process.env.SPREADSHEET_NAME || "Main";

const auth = new google.auth.GoogleAuth({
  keyFile: "./service-account-key.json", // Downloaded from Google Cloud
  scopes: [GOOGLE_API_SCOPE],
});

async function readData() {
  try {
    const client = await auth.getClient();
    const sheetsApi = google.sheets({ version: "v4", auth: client as any });

    console.log(`Reading data from sheet: ${SHEET_NAME}...`);

    const entries = await utils.readSheet(sheetsApi, SHEET_NAME);

    console.log(`Successfully read ${entries.length} entries.`);
    console.log(`Last 5 entries:`);
    console.log(JSON.stringify(entries.slice(-5), null, 2));
  } catch (error) {
    console.error("Error reading sheet:", error);
  }
}

readData();
