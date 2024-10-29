"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
  path: "./src/.env",
});
const express_1 = __importDefault(require("express"));
require("./database/index");
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/categories", category_routes_1.default);
app.listen(port, () => {
  console.log(`Server is running at ${process.env.BACKEND_URL}`);
});
