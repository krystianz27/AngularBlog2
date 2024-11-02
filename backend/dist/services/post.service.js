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
exports.deletePost = exports.updatePost = exports.getPostById = exports.addPost = exports.getPostBySlug = exports.getAllPosts = void 0;
const Category_1 = require("../models/Category");
const Post_1 = require("../models/Post");
const Tag_1 = require("../models/Tag");
const User_1 = require("../models/User");
const getAllPosts = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    let where = {};
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }
    // if (filters.userId) {
    //   where.userId = filters.userId;
    // }
    return yield Post_1.Post.findAll({
        where,
        include: [
            Category_1.Category,
            {
                model: User_1.User,
                attributes: {
                    exclude: ["password"],
                },
            },
            {
                model: Tag_1.Tag,
                where: filters.tagId
                    ? {
                        id: filters.tagId,
                    }
                    : undefined,
            },
        ],
        order: [["createdAt", "DESC"]],
    });
});
exports.getAllPosts = getAllPosts;
const getPostBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Post_1.Post.findOne({
        include: [Category_1.Category],
        where: { slug },
    });
});
exports.getPostBySlug = getPostBySlug;
const addPost = (title, content, cateogryId, userId, slug) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new Post_1.Post();
    post.title = title;
    post.content = content;
    post.categoryId = cateogryId;
    post.userId = userId;
    post.slug = slug;
    return yield post.save();
});
exports.addPost = addPost;
const getPostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Post_1.Post.findByPk(postId);
});
exports.getPostById = getPostById;
const updatePost = (postId, title, content, categoryId, slug) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield Post_1.Post.findByPk(postId);
    if (!post) {
        throw new Error("Post not found");
    }
    if (title) {
        post.title = title;
    }
    if (content) {
        post.content = content;
    }
    if (categoryId) {
        post.categoryId = categoryId;
    }
    if (slug) {
        post.slug = slug;
    }
    return yield post.save();
});
exports.updatePost = updatePost;
const deletePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Post_1.Post.destroy({
        where: { id: postId },
    });
});
exports.deletePost = deletePost;
