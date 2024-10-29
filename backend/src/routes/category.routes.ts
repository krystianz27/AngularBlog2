import { Router } from "express";
import {
  addCategoryController,
  deleteCategoryController,
  getCategories,
  getCategoryBySlugController,
  updateCategoryController,
} from "../controllers/category.controller";
import { authenticateJWT, authenticateJWTOptional } from "../shared/auth.util";

const router = Router();

router.get("/", authenticateJWTOptional, getCategories);
router.get("/slug/:slug", getCategoryBySlugController);
router.post("/", authenticateJWT, addCategoryController);
router.put("/", authenticateJWT, updateCategoryController);
router.delete("/", authenticateJWT, deleteCategoryController);

export default router;
