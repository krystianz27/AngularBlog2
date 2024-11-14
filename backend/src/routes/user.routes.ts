import { Router } from "express";
import {
  deleteUserController,
  getUserController,
  updateUserController,
} from "../controllers/user.controller";
import { authenticateJWT } from "../shared/auth.util";

const router = Router();

router.get("/me", authenticateJWT, getUserController);
router.post("/");
router.put("/", authenticateJWT, updateUserController);
router.delete("/", authenticateJWT, deleteUserController);

export default router;
