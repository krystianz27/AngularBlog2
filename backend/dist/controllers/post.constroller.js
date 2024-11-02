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
exports.deletePostController = exports.updatePostController = exports.addPostController = exports.getPostBySlugController = exports.getAllPostsController = void 0;
const post_service_1 = require("../services/post.service");
const zod_1 = require("zod");
const general_util_1 = require("../shared/general.util");
const category_service_1 = require("../services/category.service");
const tag_service_1 = require("../services/tag.service");
const post_tag_service_1 = require("../services/post-tag.service");
const comment_service_1 = require("../services/comment.service");
const getAllPostsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        categoryId: zod_1.z.string().optional(),
        tagId: zod_1.z.string().optional(),
    });
    const user = req.user;
    const schemaValidator = schema.safeParse(req.query);
    if (!schemaValidator.success) {
        res
            .status(400)
            .json({ message: "Invalid data", errors: schemaValidator.error });
        return;
    }
    const { categoryId, tagId } = schemaValidator.data;
    const posts = yield (0, post_service_1.getAllPosts)({
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        tagId: tagId ? parseInt(tagId) : undefined,
        userId: user === null || user === void 0 ? void 0 : user.id,
    });
    let postIds = posts.map((post) => post.id);
    const totalCommentsByPostIds = yield (0, comment_service_1.getTotalCommentsByPostIds)(postIds);
    // adding total comments to each post
    const postsWithTotalComments = posts.map((post) => {
        const totalComments = totalCommentsByPostIds.find((totalCommentsByPostId) => totalCommentsByPostId.postId === post.id);
        return Object.assign(Object.assign({}, post.toJSON()), { totalComments: (totalComments === null || totalComments === void 0 ? void 0 : totalComments.get("totalComments")) || 0 });
    });
    res.json(postsWithTotalComments);
    return;
});
exports.getAllPostsController = getAllPostsController;
const getPostBySlugController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    if (!slug) {
        res.status(400).json({ message: "Invalid slug" });
        return;
    }
    const post = yield (0, post_service_1.getPostBySlug)(slug);
    if (!post) {
        res.status(400).json({ message: "Post not found" });
        return;
    }
    res.json(post);
    return;
});
exports.getPostBySlugController = getPostBySlugController;
const addPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        title: zod_1.z.string().min(1),
        content: zod_1.z.string().min(1),
        categoryId: zod_1.z.number(),
        tagIds: zod_1.z.array(zod_1.z.number()).optional(),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const user = req.user;
    const { title, content, categoryId, tagIds } = req.body;
    yield validateTags(res, tagIds);
    let slug = (0, general_util_1.generateSlug)(title);
    const postWithGivenSlugName = yield (0, post_service_1.getPostBySlug)(slug);
    if (postWithGivenSlugName) {
        slug = (0, general_util_1.generateSlug)(title, true);
    }
    const category = yield (0, category_service_1.getCategoryById)(categoryId);
    if (!category) {
        res.status(400).json({
            message: "Invalid category",
        });
        return;
    }
    const post = yield (0, post_service_1.addPost)(title, content, categoryId, user.get("id"), slug);
    if (tagIds && tagIds.length > 0) {
        (0, post_tag_service_1.addPostTags)(post.id, tagIds);
    }
    res.status(201).json(post);
    return;
});
exports.addPostController = addPostController;
const updatePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userId = user.get("id");
    const schema = zod_1.z.object({
        id: zod_1.z.number(),
        title: zod_1.z.string().min(1).optional(),
        content: zod_1.z.string().min(1).optional(),
        categoryId: zod_1.z.number().optional(),
        tagIds: zod_1.z.array(zod_1.z.number()).optional(),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    let { id, title, content, categoryId, tagIds } = req.body;
    const post = yield (0, post_service_1.getPostById)(id);
    yield validateTags(res, tagIds);
    if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
    }
    if (post.userId !== userId) {
        res.status(403).json({ message: "Unauthorized to update" });
        return;
    }
    if (categoryId) {
        const category = yield (0, category_service_1.getCategoryById)(categoryId);
        if (!category) {
            res.status(400).json({ message: "Invalid category" });
            return;
        }
    }
    let slug;
    if (title && title !== post.title) {
        slug = (0, general_util_1.generateSlug)(title);
        const postWithGivenSlugName = yield (0, post_service_1.getPostBySlug)(slug);
        if (postWithGivenSlugName) {
            slug = (0, general_util_1.generateSlug)(title, true);
        }
    }
    const updatedPost = yield (0, post_service_1.updatePost)(id, title, content, categoryId, slug);
    const postTagsRelations = yield (0, post_tag_service_1.getPostTags)(id);
    if (tagIds) {
        const tagidsToDelete = postTagsRelations.filter;
    }
    if (tagIds && tagIds.length > 0) {
        tagIds = tagIds === null || tagIds === void 0 ? void 0 : tagIds.filter((tagId) => {
            const postTag = postTagsRelations.find((postTagRelation) => {
                return postTagRelation.tagId === tagId;
            });
            return !postTag;
        });
        if (tagIds.length > 0)
            yield (0, post_tag_service_1.addPostTags)(post.id, tagIds);
    }
    res.json(updatedPost);
    return;
});
exports.updatePostController = updatePostController;
const deletePostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userId = user.get("id");
    const schema = zod_1.z.object({
        id: zod_1.z.number(),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const { id } = schemaValidator.data;
    const post = yield (0, post_service_1.getPostById)(id);
    if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
    }
    if (post.userId !== userId) {
        res.status(403).json({ message: "Unauthorized to delete" });
        return;
    }
    yield (0, post_tag_service_1.deletePostTagRelations)({ postId: id });
    yield (0, comment_service_1.deletePostComments)(id);
    yield (0, post_service_1.deletePost)(id);
    res.json(post);
    return;
});
exports.deletePostController = deletePostController;
function validateTags(res, tagIds) {
    return __awaiter(this, void 0, void 0, function* () {
        if (tagIds && tagIds.length > 0) {
            const tags = yield (0, tag_service_1.getTagsByIds)(tagIds);
            if (tags.length !== tagIds.length) {
                res.status(400).json({
                    message: "Invalid tag ids",
                });
                return;
            }
        }
    });
}
