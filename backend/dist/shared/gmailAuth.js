"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthUrl = getAuthUrl;
exports.getAccessToken = getAccessToken;
exports.ensureAccessToken = ensureAccessToken;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "../.env",
});
const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, process.env.REDIRECT_URI);
oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});
function getAuthUrl() {
    //   console.log(process.env.GMAIL_CLIENT_ID);
    const scopes = ["https://www.googleapis.com/auth/gmail.send"];
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    });
}
function getAccessToken(code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { tokens } = yield oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            console.log("Token:", tokens);
            if (tokens.refresh_token) {
                process.env.GMAIL_REFRESH_TOKEN = tokens.refresh_token;
                console.log("New Refresh Token:", tokens.refresh_token);
            }
            else {
                console.error("No Refresh Token!");
            }
            return tokens;
        }
        catch (error) {
            console.error("Failed to retrieve access token:", error);
            throw new Error("Failed to retrieve access token");
        }
    });
}
function ensureAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenInfo = yield oauth2Client.getAccessToken();
            if (!tokenInfo.token) {
                throw new Error("Unable to obtain a valid access token");
            }
            oauth2Client.on("tokens", (tokens) => {
                if (tokens.refresh_token) {
                    console.log("New refresh token:", tokens.refresh_token);
                }
                oauth2Client.setCredentials(tokens);
            });
        }
        catch (error) {
            console.error("Error refreshing access token:", error);
            throw new Error("Unable to refresh access token");
        }
    });
}
