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
exports.Tag = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Post_1 = require("./Post");
const PostTag_1 = require("./PostTag");
const User_1 = require("./User");
let Tag = class Tag extends sequelize_typescript_1.Model {
    constructor() {
        super(...arguments);
        this.posts = [];
    }
};
exports.Tag = Tag;
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Tag.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Tag.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Post_1.Post, () => PostTag_1.PostTag),
    __metadata("design:type", Array)
], Tag.prototype, "posts", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Tag.prototype, "user", void 0);
exports.Tag = Tag = __decorate([
    sequelize_typescript_1.Table
], Tag);
