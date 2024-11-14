"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tag_controller_1 = require("../controllers/tag.controller");
const auth_util_1 = require("../shared/auth.util");
const router = (0, express_1.Router)();
router.get("/", auth_util_1.authenticateJWTOptional, tag_controller_1.getTagsController);
router.get("/getPostTagRelations/:postId", tag_controller_1.getPostTagsController);
router.get("/getTagBySlug/:slug", tag_controller_1.getTagBySlugController);
router.post("/", auth_util_1.authenticateJWT, tag_controller_1.addTagController);
router.put("/", auth_util_1.authenticateJWT, tag_controller_1.updateTagController);
router.delete("/", auth_util_1.authenticateJWT, tag_controller_1.deleteTagController);
exports.default = router;