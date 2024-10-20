"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const connection_1 = require("./connection");
Object.defineProperty(exports, "connection", { enumerable: true, get: function () { return connection_1.connection; } });
connection_1.connection.sync({ force: false });
