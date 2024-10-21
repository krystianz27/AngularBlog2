import { Router } from "express";
import {
  addTagController,
  deleteTagController,
  getTagBySlugController,
  getPostTagsController,
  getTagsController,
  updateTagController,
} from "../controllers/tag.controller";
import { authenticateJWT } from "../shared/auth.util";

const router = Router();

router.get("/", getTagsController);
router.get("/getPostTagRelations/:postId", getPostTagsController);
router.get("/getTagBySlug/:slug", getTagBySlugController);
router.post("/", authenticateJWT, addTagController);
router.put("/", authenticateJWT, updateTagController);
router.delete("/", authenticateJWT, deleteTagController);

export default router;
