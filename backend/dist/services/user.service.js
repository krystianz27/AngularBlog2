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
exports.updateUser = exports.getUserById = exports.addUser = exports.getUserByEmail = void 0;
const User_1 = require("../models/User");
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
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.User.findByPk(id);
});
exports.getUserById = getUserById;
const updateUser = (userId, name, password, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getUserById)(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (name) {
        user.name = name;
    }
    if (password) {
        user.password = password;
    }
    if (status) {
        user.status = status;
    }
    return yield user.save();
});
exports.updateUser = updateUser;
