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
exports.deleteCategoryController = exports.updateCategoryController = exports.addCategoryController = exports.getCategoryBySlugController = exports.getCategories = void 0;
const category_service_1 = require("../services/category.service");
const general_util_1 = require("../shared/general.util");
const zod_1 = require("zod");
const post_service_1 = require("../services/post.service");
const post_tag_service_1 = require("../services/post-tag.service");
const comment_service_1 = require("../services/comment.service");
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const categories = yield (0, category_service_1.getAllCategories)({
        userId: user === null || user === void 0 ? void 0 : user.get("id"),
    });
    res.json(categories);
});
exports.getCategories = getCategories;
const getCategoryBySlugController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const category = yield (0, category_service_1.getCategoryBySlug)(slug);
    if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
    }
    res.json(category);
});
exports.getCategoryBySlugController = getCategoryBySlugController;
const addCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(1),
    });
    const user = req.user;
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
    }
    const { name } = req.body;
    const userId = user.get("id");
    let slug = (0, general_util_1.generateSlug)(name);
    const categoryBySlug = yield (0, category_service_1.getCategoryBySlug)(slug);
    if (categoryBySlug) {
        slug = (0, general_util_1.generateSlug)(name, true);
    }
    const category = yield (0, category_service_1.addCategory)(name, slug, userId);
    res.json(category);
});
exports.addCategoryController = addCategoryController;
const updateCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(1),
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
    let { id, name } = req.body;
    let slug = (0, general_util_1.generateSlug)(name);
    const categoryBySlug = yield (0, category_service_1.getCategoryBySlug)(slug);
    if (categoryBySlug) {
        res.status(400).json({ message: "Category already exists" });
        return;
    }
    let dbCategory = yield (0, category_service_1.getCategoryById)(id);
    if (!dbCategory) {
        res.status(404).json({ message: "Category not found" });
        return;
    }
    let updatedCategory = yield (0, category_service_1.updateCategory)(name, slug, id);
    res.json(updatedCategory);
});
exports.updateCategoryController = updateCategoryController;
const deleteCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { id } = req.body;
    const category = (0, category_service_1.getCategoryById)(id);
    if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
    }
    const posts = yield (0, post_service_1.getAllPosts)({
        categoryId: id,
    });
    const postIds = posts.map((post) => post.get("id"));
    yield (0, post_tag_service_1.deletePostTagRelations)({
        postId: postIds,
    });
    yield (0, comment_service_1.deletePostComments)(postIds);
    yield (0, post_service_1.deletePost)(postIds);
    yield (0, category_service_1.deleteCategory)(id);
    res.json(category);
});
exports.deleteCategoryController = deleteCategoryController;
