import dotenv from "dotenv";
dotenv.config({
  path: "./src/.env",
});

import express, { Request, Response } from "express";
import "express-async-errors";
import "./database/index";
import categoryRoutes from "./routes/category.routes";
import tagRoutes from "./routes/tag.routes";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import authRoutes from "./routes/auth.routes";
import logger from "./shared/logger.util";
import cors from "cors";
import userRoutes from "./routes/user.routes";

const app = express();
// const port = process.env.PORT || 3000;
const port = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.json({ message: "Wrong API ENDPOINT" });
  } else {
    next();
  }
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error({
    message: err.message,
    stack: err.stack,
  });
  res.status(500).send("Something went wrong");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port}`);
});
