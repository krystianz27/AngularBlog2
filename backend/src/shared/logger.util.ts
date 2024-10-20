import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "error",
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.printf(({ level, message, timestamp, stack }) => {
      const formattedStack = stack ? stack.replace(/\n/g, "\n    ") : ""; // Dodaje wcięcie do każdego wiersza stack trace
      return `${timestamp} ${level}: ${
        message || "No message"
      }\n    ${formattedStack}`;
    })
  ),
  transports: [
    new transports.File({ filename: "error.log" }),
    new transports.Console(),
  ],
});

export default logger;
