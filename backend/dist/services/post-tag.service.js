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
exports.deletePostTagRelations = exports.getPostTags = exports.addPostTags = void 0;
const PostTag_1 = require("../models/PostTag");
const Tag_1 = require("../models/Tag");
const addPostTags = (postId, tagIds) => __awaiter(void 0, void 0, void 0, function* () {
    const data = tagIds.map((tagId) => ({
        postId,
        tagId,
    }));
    return yield PostTag_1.PostTag.bulkCreate(data);
});
exports.addPostTags = addPostTags;
const getPostTags = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield PostTag_1.PostTag.findAll({
        include: [Tag_1.Tag],
        where: { postId },
    });
});
exports.getPostTags = getPostTags;
const deletePostTagRelations = (_a) => __awaiter(void 0, [_a], void 0, function* ({ postId, tagId, }) {
    let where = {};
    if (postId)
        where.postId = postId;
    if (tagId)
        where.tagId = tagId;
    yield PostTag_1.PostTag.destroy({
        where,
    });
});
exports.deletePostTagRelations = deletePostTagRelations;
