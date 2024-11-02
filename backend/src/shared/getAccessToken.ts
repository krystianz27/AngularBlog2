import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

async function getAccessToken(code: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Access Token:", tokens.access_token);
    console.log("Refresh Token:", tokens.refresh_token);
  } catch (error) {
    console.error("Error obtaining tokens:", error);
  }
}
