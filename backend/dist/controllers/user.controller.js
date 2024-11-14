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
exports.deleteUserController = exports.updateUserController = exports.getUserController = void 0;
const user_service_1 = require("../services/user.service");
const zod_1 = require("zod");
const getUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const user = yield (0, user_service_1.getUserById)(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Server error", error: error.message });
        return;
    }
});
exports.getUserController = getUserController;
const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const schema = zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().min(6).optional(),
    });
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ message: "Invalid data", errors: validation.error });
        return;
    }
    try {
        const updatedUser = yield (0, user_service_1.updateUser)(userId, validation.data.name, validation.data.email, validation.data.password);
        res.json(updatedUser);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
});
exports.updateUserController = updateUserController;
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        yield (0, user_service_1.deleteUser)(userId);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
});
exports.deleteUserController = deleteUserController;
