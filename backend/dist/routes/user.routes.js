"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_util_1 = require("../shared/auth.util");
const router = (0, express_1.Router)();
router.get("/me", auth_util_1.authenticateJWT, user_controller_1.getUserController);
router.post("/");
router.put("/", auth_util_1.authenticateJWT, user_controller_1.updateUserController);
router.delete("/", auth_util_1.authenticateJWT, user_controller_1.deleteUserController);
exports.default = router;
