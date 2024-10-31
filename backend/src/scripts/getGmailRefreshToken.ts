import { google } from "googleapis";
import * as readline from "readline"; // Zmiana na import całego modułu

// Konfiguracja OAuth2
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Żądanie tokenu z odpowiednimi uprawnieniami
const SCOPES = ["https://mail.google.com/"];

function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the code from that page here: ", async (code) => {
    rl.close();
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      // Token dostępu oraz token odświeżania
      console.log("Your refresh token:", tokens.refresh_token);
    } catch (err) {
      console.error("Error retrieving access token", err);
    }
  });
}

getAccessToken();
