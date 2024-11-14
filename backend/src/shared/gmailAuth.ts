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

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

export function getAuthUrl() {
  //   console.log(process.env.GMAIL_CLIENT_ID);
  const scopes = ["https://www.googleapis.com/auth/gmail.send"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
}

export async function getAccessToken(code: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log("Token:", tokens);
    if (tokens.refresh_token) {
      process.env.GMAIL_REFRESH_TOKEN = tokens.refresh_token;
      console.log("New Refresh Token:", tokens.refresh_token);
    } else {
      console.error("No Refresh Token!");
    }
    return tokens;
  } catch (error) {
    console.error("Failed to retrieve access token:", error);
    throw new Error("Failed to retrieve access token");
  }
}

export async function ensureAccessToken() {
  try {
    const tokenInfo = await oauth2Client.getAccessToken();
    if (!tokenInfo.token) {
      throw new Error("Unable to obtain a valid access token");
    }
    oauth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        console.log("New refresh token:", tokens.refresh_token);
      }
      oauth2Client.setCredentials(tokens);
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new Error("Unable to refresh access token");
  }
}
