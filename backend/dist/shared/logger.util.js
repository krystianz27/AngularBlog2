"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: "error",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json(), winston_1.format.printf(({ level, message, timestamp, stack }) => {
        const formattedStack = stack ? stack.replace(/\n/g, "\n    ") : ""; // Dodaje wcięcie do każdego wiersza stack trace
        return `${timestamp} ${level}: ${message || "No message"}\n    ${formattedStack}`;
    })),
    transports: [
        new winston_1.transports.File({ filename: "error.log" }),
        new winston_1.transports.Console(),
    ],
});
exports.default = logger;
