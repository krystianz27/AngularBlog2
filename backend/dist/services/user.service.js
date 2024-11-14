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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.addUser = exports.getUserByEmail = void 0;
const User_1 = require("../models/User");
const auth_util_1 = require("../shared/auth.util");
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.findOne({ where: { email } });
});
exports.getUserByEmail = getUserByEmail;
const addUser = (email, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.User();
    user.email = email;
    user.password = password;
    user.name = name;
    return yield user.save();
});
exports.addUser = addUser;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });
        return user ? user : null;
    }
    catch (error) {
        throw new Error("Error fetching user");
    }
});
exports.getUserById = getUserById;
const updateUser = (userId, name, email, password, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserById)(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (name) {
        user.name = name;
    }
    if (email) {
        user.email = email;
    }
    if (password) {
        user.password = (0, auth_util_1.encryptPassword)(password);
    }
    if (status) {
        user.status = status;
    }
    yield user.save();
    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;
    return userWithoutPassword;
});
exports.updateUser = updateUser;
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }
        yield user.destroy();
    }
    catch (error) {
        throw new Error("Failed to delete user: " + error.message);
    }
});
exports.deleteUser = deleteUser;
