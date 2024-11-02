"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
// export const connection = new Sequelize({
//   dialect: "mysql",
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: (process.env.DB_PORT as any) || 3306,
//   models: [__dirname + "/../models"],
// });
// export const connection = new Sequelize({
//   dialect: "mysql",
//   host: process.env.DB_HOST || "mysql",
//   username: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "password",
//   database: process.env.DB_NAME || "blog",
//   port: Number(process.env.DB_PORT) || 3306,
//   models: [__dirname + "/../models"],
// });
exports.connection = new sequelize_typescript_1.Sequelize({
    dialect: "mysql",
    host: "mysql",
    username: "root",
    password: "password",
    database: "blog",
    port: 3306,
    models: [__dirname + "/../models"],
});
