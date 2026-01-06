import { gapi } from "gapi-script";
import {
  GOOGLE_SHEETS_DISCOVERY,
  GOOGLE_SHEETS_SCOPE,
} from "../../../common/consts";
import type { BallEntry } from "../../../common/types.ts";
import * as utils from "../../../common/utils.ts";

const CLIENT_ID = utils.getEnvVar("CLIENT_ID");

let tokenClient: any;

export const initGoogleClient = (
  onStatusChange: (isSignedIn: boolean) => void
) => {
  // 1. Initialize GAPI for the Sheets API
  gapi.load("client", async () => {
    await gapi.client.init({
      discoveryDocs: [GOOGLE_SHEETS_DISCOVERY],
    });
  });

  // 2. Initialize GIS for Authentication
  // @ts-ignore
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: GOOGLE_SHEETS_SCOPE,
    callback: (tokenResponse: any) => {
      if (tokenResponse && tokenResponse.access_token) {
        onStatusChange(true);
      }
    },
  });
};

export const signIn = () =>
  tokenClient.requestAccessToken({ prompt: "consent" });
export const signOut = () => gapi.auth2.getAuthInstance().signOut();

export const logBallToSheet = async (entry: BallEntry) =>
  await utils.logBallToSheet(entry, gapi.client.sheets);
