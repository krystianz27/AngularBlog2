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
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Post_1 = require("./Post");
const Comment_1 = require("./Comment");
const Token_1 = require("./Token");
const Category_1 = require("./Category");
const Tag_1 = require("./Tag");
let User = class User extends sequelize_typescript_1.Model {
    constructor() {
        super(...arguments);
        this.name = "";
        this.email = "";
        this.password = "";
        this.posts = [];
        this.comments = [];
        this.tokens = [];
        this.categories = [];
        this.tags = [];
    }
};
exports.User = User;
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        unique: true,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Post_1.Post),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Comment_1.Comment),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Token_1.Token),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Category_1.Category),
    __metadata("design:type", Array)
], User.prototype, "categories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Tag_1.Tag),
    __metadata("design:type", Array)
], User.prototype, "tags", void 0);
exports.User = User = __decorate([
    sequelize_typescript_1.Table
], User);
