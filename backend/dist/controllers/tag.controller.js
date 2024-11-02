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
exports.getTagBySlugController = exports.getPostTagsController = exports.deleteTagController = exports.updateTagController = exports.addTagController = exports.getTagsController = void 0;
const tag_service_1 = require("../services/tag.service");
const zod_1 = require("zod");
const general_util_1 = require("../shared/general.util");
const post_service_1 = require("../services/post.service");
const post_tag_service_1 = require("../services/post-tag.service");
const getTagsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const tags = yield (0, tag_service_1.getAllTags)({
        userId: user === null || user === void 0 ? void 0 : user.get("id"),
    });
    res.json(tags);
    return;
});
exports.getTagsController = getTagsController;
const addTagController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(1),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
    }
    const user = req.user;
    const { name } = req.body;
    let slug = (0, general_util_1.generateSlug)(name);
    const tagAlreadyExists = yield (0, tag_service_1.getTagBySlug)(slug);
    if (tagAlreadyExists) {
        slug = (0, general_util_1.generateSlug)(name, true);
    }
    const newTag = yield (0, tag_service_1.addTag)(name, slug, user === null || user === void 0 ? void 0 : user.get("id"));
    res.status(201).json(newTag);
    return;
});
exports.addTagController = addTagController;
const updateTagController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        id: zod_1.z.number(),
        name: zod_1.z.string().min(1),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        return res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
    }
    const { name, id } = req.body;
    const tag = yield (0, tag_service_1.getTagById)(id);
    if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
    }
    if (tag.name === name) {
        return res.status(400).json({ message: "Nothing was changed." });
    }
    let slug = (0, general_util_1.generateSlug)(name);
    const tagAlreadyExists = yield (0, tag_service_1.getTagBySlug)(slug);
    if (tagAlreadyExists) {
        slug = (0, general_util_1.generateSlug)(name, true);
    }
    tag.name = name;
    tag.slug = slug;
    yield tag.save();
    return res.status(200).json(tag);
});
exports.updateTagController = updateTagController;
const deleteTagController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        id: zod_1.z.number(),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success)
        return res
            .status(400)
            .json({ message: "Invalid data", errors: schemaValidator.error });
    const { id } = req.body;
    const tag = yield (0, tag_service_1.getTagById)(id);
    if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
    }
    yield (0, post_tag_service_1.deletePostTagRelations)({ tagId: id });
    yield (0, tag_service_1.deleteTag)(id);
    return res.json(tag);
});
exports.deleteTagController = deleteTagController;
const getPostTagsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let postId = req.params.postId;
    postId = parseInt(postId);
    if (!postId) {
        return res.status(400).json({ message: "Post Id is required" });
        // return;
    }
    const post = yield (0, post_service_1.getPostById)(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
        // return;
    }
    const postTags = yield (0, post_tag_service_1.getPostTags)(postId);
    return res.json(postTags);
});
exports.getPostTagsController = getPostTagsController;
const getTagBySlugController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const tag = yield (0, tag_service_1.getTagBySlug)(slug);
    if (!tag) {
        res.status(404).json({ message: "Tag not found" });
    }
    return res.json(tag);
});
exports.getTagBySlugController = getTagBySlugController;
