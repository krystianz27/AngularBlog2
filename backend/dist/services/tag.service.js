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
exports.deleteTag = exports.getTagsByIds = exports.getTagById = exports.getTagBySlug = exports.addTag = exports.getAllTags = void 0;
const Tag_1 = require("../models/Tag");
const getAllTags = (filters) => {
    const where = {};
    // if (filters) {
    //   if (filters.userId) {
    //     where.userId = filters.userId;
    //   }
    // }
    return Tag_1.Tag.findAll({
        order: [["createdAt", "DESC"]],
        where,
    });
};
exports.getAllTags = getAllTags;
const addTag = (name, slug, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = new Tag_1.Tag();
    tag.name = name;
    tag.slug = slug;
    tag.userId = userId;
    yield tag.save();
    return tag;
});
exports.addTag = addTag;
const getTagBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Tag_1.Tag.findOne({
        where: { slug },
    });
});
exports.getTagBySlug = getTagBySlug;
const getTagById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Tag_1.Tag.findByPk(id);
});
exports.getTagById = getTagById;
const getTagsByIds = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Tag_1.Tag.findAll({
        where: { id: ids },
    });
});
exports.getTagsByIds = getTagsByIds;
const deleteTag = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Tag_1.Tag.destroy({
        where: { id },
    });
});
exports.deleteTag = deleteTag;
