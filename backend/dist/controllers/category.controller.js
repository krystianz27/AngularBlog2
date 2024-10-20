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
exports.deleteCategoryController = exports.updateCategoryController = exports.addCategoryController = exports.getCategories = void 0;
const category_service_1 = require("../services/category.service");
const general_util_1 = require("../shared/general.util");
const zod_1 = require("zod");
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield (0, category_service_1.getAllCategories)();
    res.json(categories);
});
exports.getCategories = getCategories;
const addCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(1),
    });
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(req.body);
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        console.error("Validation Errors:", schemaValidator.error.flatten());
        return res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error.flatten(),
        });
    }
    // if (!schemaValidator.success) {
    //   return res.status(400).json({
    //     message: "Invalid data",
    //     erros: schemaValidator.error,
    //   });
    // }
    const { name } = req.body;
    const userId = 1;
    let slug = (0, general_util_1.generateSlug)(name);
    const categoryBySlug = yield (0, category_service_1.getCategoryBySlug)(slug);
    if (categoryBySlug) {
        slug = (0, general_util_1.generateSlug)(name, true);
    }
    const category = yield (0, category_service_1.addCategory)(name, slug, userId);
    return res.json(category);
});
exports.addCategoryController = addCategoryController;
const updateCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id, name } = req.body;
    let slug = (0, general_util_1.generateSlug)(name);
    const categoryBySlug = yield (0, category_service_1.getCategoryBySlug)(slug);
    if (categoryBySlug) {
        res.status(400).json({ message: "Category already exists" });
    }
    let dbCategory = yield (0, category_service_1.getCategoryById)(id);
    if (!dbCategory) {
        res.status(404).json({ message: "Category not found" });
    }
    let updatedCategory = yield (0, category_service_1.updateCategory)(name, slug, id);
    res.json(updatedCategory);
});
exports.updateCategoryController = updateCategoryController;
const deleteCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const category = (0, category_service_1.getCategoryById)(id);
    if (!category) {
        res.status(404).json({ message: "Category not found" });
    }
    yield (0, category_service_1.deleteCategory)(id);
    res.json({ message: "delete category" });
});
exports.deleteCategoryController = deleteCategoryController;
