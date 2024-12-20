"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostTag = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Post_1 = require("./Post");
const Tag_1 = require("./Tag");
let PostTag = class PostTag extends sequelize_typescript_1.Model {
};
exports.PostTag = PostTag;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Post_1.Post),
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", Number)
], PostTag.prototype, "postId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tag_1.Tag),
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", Number)
], PostTag.prototype, "tagId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Post_1.Post),
    __metadata("design:type", Post_1.Post)
], PostTag.prototype, "post", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Tag_1.Tag),
    __metadata("design:type", Tag_1.Tag)
], PostTag.prototype, "tag", void 0);
exports.PostTag = PostTag = __decorate([
    sequelize_typescript_1.Table
], PostTag);
