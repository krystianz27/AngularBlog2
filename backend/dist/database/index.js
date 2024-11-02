"use strict";
// import { connection } from "./connection";
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
exports.connection = void 0;
// connection.sync({
//   // force: true,
//   // alter: false,
// });
// export { connection };
const connection_1 = require("./connection");
Object.defineProperty(exports, "connection", { enumerable: true, get: function () { return connection_1.connection; } });
const demo_data_1 = __importDefault(require("../models/seeders/demo-data"));
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const queryInterface = connection_1.connection.getQueryInterface();
    const seeder = new demo_data_1.default();
    yield connection_1.connection.sync({ force: true });
    yield seeder.up(queryInterface, connection_1.connection);
    console.log("Data has been loaded into the database.");
});
connection_1.connection
    .authenticate()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connected to the database.");
    yield seedDatabase();
}))
    .catch((error) => {
    console.error("Error connecting to the database:", error);
});
