import { getAuthUrl } from "./gmailAuth";
import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});

console.log("Authorize this app by visiting this URL:", getAuthUrl());
