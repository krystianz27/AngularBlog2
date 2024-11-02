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
exports.getAllCategories = getAllCategories;
exports.addCategory = addCategory;
exports.getCategoryBySlug = getCategoryBySlug;
exports.updateCategory = updateCategory;
exports.getCategoryById = getCategoryById;
exports.deleteCategory = deleteCategory;
const Category_1 = require("../models/Category");
function getAllCategories(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = {};
        // if (filters && filters.userId) {
        //   where.userId = filters.userId;
        // }
        const categories = yield Category_1.Category.findAll({
            where,
            order: [["id", "DESC"]],
        });
        return categories;
    });
}
function addCategory(name, slug, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = new Category_1.Category();
        category.name = name;
        category.slug = slug;
        category.userId = userId;
        yield category.save();
        return category;
    });
}
function getCategoryBySlug(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield Category_1.Category.findOne({
            where: { slug },
        });
        return category;
    });
}
function updateCategory(name, slug, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield Category_1.Category.findByPk(id);
        if (!category) {
            throw new Error("Category not found");
        }
        if (name) {
            category.name = name;
        }
        if (slug) {
            category.slug = slug;
        }
        yield category.save();
        return category;
    });
}
function getCategoryById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield Category_1.Category.findByPk(id);
        return category;
    });
}
function deleteCategory(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield Category_1.Category.findByPk(id);
        if (!category) {
            throw new Error("Category not found");
        }
        yield category.destroy();
        return category;
    });
}
