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
exports.Post = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const Comment_1 = require("./Comment");
const Tag_1 = require("./Tag");
const PostTag_1 = require("./PostTag");
const Category_1 = require("./Category");
let Post = class Post extends sequelize_typescript_1.Model {
    constructor() {
        super(...arguments);
        this.comments = [];
        this.tags = [];
    }
};
exports.Post = Post;
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: "TEXT",
    }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Post.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Post.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Category_1.Category),
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Post.prototype, "categoryId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Post.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Category_1.Category),
    __metadata("design:type", Category_1.Category)
], Post.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Comment_1.Comment),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Tag_1.Tag, () => PostTag_1.PostTag),
    __metadata("design:type", Array)
], Post.prototype, "tags", void 0);
exports.Post = Post = __decorate([
    sequelize_typescript_1.Table
], Post);
