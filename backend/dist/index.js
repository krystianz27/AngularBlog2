"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "./src/.env",
});
const express_1 = __importDefault(require("express"));
require("express-async-errors");
require("./database/index");
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const tag_routes_1 = __importDefault(require("./routes/tag.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const logger_util_1 = __importDefault(require("./shared/logger.util"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// const port = process.env.PORT || 3000;
const port = parseInt(process.env.PORT || "3000", 10);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/categories", category_routes_1.default);
app.use("/api/tags", tag_routes_1.default);
app.use("/api/posts", post_routes_1.default);
app.use("/api/comments", comment_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
        res.json({ message: "Wrong API ENDPOINT" });
    }
    else {
        next();
    }
});
app.use((err, req, res, next) => {
    logger_util_1.default.error({
        message: err.message,
        stack: err.stack,
    });
    res.status(500).send("Something went wrong");
});
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${port}`);
});
