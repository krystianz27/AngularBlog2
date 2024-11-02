"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentController = exports.updateCommentController = exports.addCommentController = exports.getPostCommentsController = void 0;
const zod_1 = require("zod");
const post_service_1 = require("../services/post.service");
const comment_service_1 = require("../services/comment.service");
const getPostCommentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        postId: zod_1.z.number(),
    });
    const schemaValidator = schema.safeParse({
        postId: parseInt(req.params.postId),
    });
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const { postId } = schemaValidator.data;
    const post = yield (0, post_service_1.getPostById)(postId);
    if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
    }
    const comments = yield (0, comment_service_1.getPostComments)(postId);
    res.json(comments);
    return;
});
exports.getPostCommentsController = getPostCommentsController;
const addCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        postId: zod_1.z.number(),
        content: zod_1.z.string().min(1),
    });
    console.log("$$$$$$$$$$$$$$$$$");
    const user = req.user;
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const { postId, content } = req.body;
    const userId = user.get("id");
    const post = yield (0, post_service_1.getPostById)(postId);
    if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
    }
    const comment = yield (0, comment_service_1.addComment)(postId, userId, content);
    res.json(comment);
    return;
});
exports.addCommentController = addCommentController;
const updateCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        commentId: zod_1.z.number(),
        content: zod_1.z.string().min(1),
    });
    const user = req.user;
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const { commentId, content } = schemaValidator.data;
    const userId = user.get("id");
    const comment = yield (0, comment_service_1.getCommendById)(commentId);
    if (!comment) {
        res.status(400).json({ message: "Invalid comment ID" });
        return;
    }
    if (comment.userId !== userId) {
        res
            .status(400)
            .json({ message: "You are not allowed to edit the comment" });
        return;
    }
    const updatedComment = yield (0, comment_service_1.updateComment)(commentId, content);
    res.json(updatedComment);
    return;
});
exports.updateCommentController = updateCommentController;
const deleteCommentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        commentId: zod_1.z.number(),
    });
    const user = req.user;
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const { commentId } = schemaValidator.data;
    const userId = user.get("id");
    const comment = yield (0, comment_service_1.getCommendById)(commentId);
    if (!comment) {
        res.status(400).json({ message: "Invalid comment ID" });
        return;
    }
    if (comment.userId !== userId) {
        res
            .status(400)
            .json({ message: "You are not allowed to delete the comment" });
        return;
    }
    yield comment.destroy();
    res.json({ message: "Comment deleted" });
    return;
});
exports.deleteCommentController = deleteCommentController;
