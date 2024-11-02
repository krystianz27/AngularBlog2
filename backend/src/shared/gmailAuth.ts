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

// Ustawienie początkowych poświadczeń z pliku .env
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Funkcja uzyskiwania adresu URL do autoryzacji – jednorazowa dla początkowego uzyskania `refresh_token`
export function getAuthUrl() {
  //   console.log(process.env.GMAIL_CLIENT_ID);
  const scopes = ["https://www.googleapis.com/auth/gmail.send"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
}

// Funkcja do pobrania i ustawienia tokenu za pomocą kodu autoryzacyjnego
export async function getAccessToken(code: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  } catch (error) {
    console.error("Failed to retrieve access token:", error); // Dodaj więcej szczegółów o błędzie
    throw new Error("Failed to retrieve access token");
  }
}

// Funkcja sprawdzająca dostępność tokenu lub jego odświeżanie
export async function ensureAccessToken() {
  const tokenInfo = await oauth2Client.getAccessToken();

  if (!tokenInfo.token) {
    throw new Error("Unable to obtain a valid access token");
  }

  // Automatyczne odświeżenie tokenu, jeśli jest bliski wygaśnięcia
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      console.log("New refresh token:", tokens.refresh_token);
    }
    oauth2Client.setCredentials(tokens);
  });
}
