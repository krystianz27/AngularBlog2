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
exports.getTotalCommentsByPostIds = exports.deletePostComments = exports.deleteComment = exports.updateComment = exports.getCommendById = exports.addComment = exports.getPostComments = exports.getAllComments = void 0;
const sequelize_1 = require("sequelize");
const Comment_1 = require("../models/Comment");
const User_1 = require("../models/User");
const getAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.Comment.findAll();
});
exports.getAllComments = getAllComments;
const getPostComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.Comment.findAll({
        include: [
            {
                model: User_1.User,
                attributes: {
                    exclude: ["password"],
                },
            },
        ],
        where: { postId },
        order: [["createdAt", "DESC"]],
    });
});
exports.getPostComments = getPostComments;
const addComment = (postId, userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = new Comment_1.Comment();
    comment.postId = postId;
    comment.userId = userId;
    comment.content = content;
    console.log(comment.content);
    return yield comment.save();
});
exports.addComment = addComment;
const getCommendById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.Comment.findByPk(id);
});
exports.getCommendById = getCommendById;
const updateComment = (commentId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield (0, exports.getCommendById)(commentId);
    if (!comment) {
        throw new Error("Comment not found");
    }
    comment.content = content;
    return yield comment.save();
});
exports.updateComment = updateComment;
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield (0, exports.getCommendById)(commentId);
    if (!comment) {
        throw new Error("Comment not found");
    }
    return yield comment.destroy();
});
exports.deleteComment = deleteComment;
const deletePostComments = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment_1.Comment.destroy({
        where: { postId },
    });
});
exports.deletePostComments = deletePostComments;
const getTotalCommentsByPostIds = (postIds) => __awaiter(void 0, void 0, void 0, function* () {
    return Comment_1.Comment.findAll({
        attributes: [
            "postId",
            [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.col("id")), "totalComments"],
        ],
        where: {
            postId: postIds,
        },
        group: ["postId"],
    });
});
exports.getTotalCommentsByPostIds = getTotalCommentsByPostIds;
