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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.forgotPasswordController = exports.confirmEmailController = exports.logoutController = exports.refreshTokenController = exports.loginController = exports.registerController = void 0;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../services/user.service");
const auth_util_1 = require("../shared/auth.util");
const token_service_1 = require("../services/token.service");
const email_util_1 = require("../shared/email.util");
const passwordZodRules = zod_1.z
    .string()
    .min(6)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter and one number.",
});
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(3).max(100),
        email: zod_1.z.string().email(),
        password: passwordZodRules,
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    let { name, email, password } = schemaValidator.data;
    const existingUser = yield (0, user_service_1.getUserByEmail)(email);
    if (existingUser) {
        res.status(400).json({ message: "Email already in use" });
        return;
    }
    password = (0, auth_util_1.encryptPassword)(password);
    let user = yield (0, user_service_1.addUser)(email, password, name);
    user = user.toJSON();
    delete user.password;
    const token = (0, auth_util_1.generateToken)(user.id);
    yield (0, token_service_1.addToken)(token, "activation", user.id);
    yield (0, email_util_1.sendConfirmationEmail)(email, token);
    res.status(201).json({ message: "User registered successfully", user });
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6).max(100),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const { email, password } = schemaValidator.data;
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    if (user.get("status") !== "active") {
        res
            .status(403)
            .json({ message: "User is not active. Please confirm your email." });
        return;
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({ message: "Incorrect password" });
        return;
    }
    const accessToken = (0, auth_util_1.generateToken)(user.get("id"), "7d");
    const refreshToken = (0, auth_util_1.generateToken)(user.get("id"), "7d");
    yield (0, token_service_1.deleteTokens)(user.get("id"));
    yield (0, token_service_1.addToken)(refreshToken, "refresh", user.get("id"));
    yield (0, token_service_1.addToken)(accessToken, "access", user.get("id"));
    const session = {
        accessToken,
        refreshToken,
        user: user.toJSON(),
    };
    delete session.user.password;
    res.json(session);
    return;
});
exports.loginController = loginController;
const refreshTokenController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        refreshToken: zod_1.z.string(),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const { refreshToken } = schemaValidator.data;
    const isTokenValid = (0, auth_util_1.verifyToken)(refreshToken);
    if (!isTokenValid) {
        res.status(400).json({ message: "Invalid token or expired" });
        return;
    }
    const dbRefreshToken = yield (0, token_service_1.getToken)(refreshToken);
    if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
        res.status(400).json({ message: "Invalid token" });
        return;
    }
    const userId = dbRefreshToken.get("userId");
    const accessToken = (0, auth_util_1.generateToken)(userId);
    const newRefreshToken = (0, auth_util_1.generateToken)(userId, "7d");
    yield (0, token_service_1.deleteTokens)(userId);
    yield (0, token_service_1.addToken)(refreshToken, "refresh", userId);
    yield (0, token_service_1.addToken)(accessToken, "access", userId);
    res.json({ accessToken, refreshToken: newRefreshToken });
    return;
});
exports.refreshTokenController = refreshTokenController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        refreshToken: zod_1.z.string(),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json({
            message: "Invalid data",
            errors: schemaValidator.error,
        });
        return;
    }
    const { refreshToken } = schemaValidator.data;
    const isTokenValid = (0, auth_util_1.verifyToken)(refreshToken);
    if (!isTokenValid) {
        res.status(400).json({ message: "Invalid token or expired" });
        return;
    }
    const dbRefreshToken = yield (0, token_service_1.getToken)(refreshToken);
    if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
        res.status(400).json({ message: "Invalid token" });
        return;
    }
    const userId = dbRefreshToken.get("userId");
    yield (0, token_service_1.deleteTokens)(userId);
    res.json({ message: "User logged out successfully" });
    return;
});
exports.logoutController = logoutController;
const confirmEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    console.log("Received token:", token);
    const isTokenValid = (0, auth_util_1.verifyToken)(token);
    if (!isTokenValid) {
        res.status(400).json({ message: "Invalid token or expired" });
        return;
    }
    console.log("TOKEN TO@", token);
    const dbToken = yield (0, token_service_1.getToken)(token);
    console.log("token confirm: ", dbToken);
    if (!dbToken || dbToken.get("type") !== "activation") {
        res.status(400).json({ message: "Invalid token!@" });
        return;
    }
    const userId = dbToken.get("userId");
    if (!userId) {
        res.status(400).json({ message: "User ID not found" });
        return;
    }
    console.log("TOKEN DELETE");
    yield (0, user_service_1.updateUser)(userId, undefined, undefined, undefined, "active");
    yield (0, token_service_1.deleteTokens)(userId);
    // res.status(200).json({ message: "Email confirmed" });
    // res.redirect(process.env.FRONTEND_URL + "#/auth/login");
    res.redirect(process.env.FRONTEND_URL + "#/auth/login?confirmed=true");
    return;
});
exports.confirmEmailController = confirmEmailController;
const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        email: zod_1.z.string().email(),
    });
    const schemaValidator = schema.safeParse(req.body);
    if (!schemaValidator.success) {
        res.status(400).json(schemaValidator.error);
        return;
    }
    const { email } = schemaValidator.data;
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (!user) {
        res.status(400).json({ message: "User not found." });
        return;
    }
    const token = (0, auth_util_1.generateToken)(user.get("id"));
    yield (0, token_service_1.deleteTokens)(user.get("id"));
    yield (0, token_service_1.addToken)(token, "reset", user.get("id"));
    yield (0, email_util_1.sendForgotPasswordEmail)(email, token);
    res.status(200).json({ message: "Email has been sent." });
    return;
});
exports.forgotPasswordController = forgotPasswordController;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = zod_1.z.object({
        token: zod_1.z.string(),
        password: passwordZodRules,
    });
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json(parsedData.error);
        return;
    }
    const { token, password } = parsedData.data;
    const isTokenValid = (0, auth_util_1.verifyToken)(token);
    if (!isTokenValid) {
        res.status(400).json({ message: "Invalid token or expired." });
        return;
    }
    console.log("Token####", token);
    const dbToken = yield (0, token_service_1.getToken)(token);
    console.log("DBToken####", token);
    if (!dbToken || dbToken.get("type") !== "reset") {
        res.status(400).json({ message: "Invalid token.!@@" });
        return;
    }
    const userId = dbToken.get("userId");
    if (!userId) {
        res.status(400).json({ message: "User ID not found." });
        return;
    }
    const encryptedPassword = (0, auth_util_1.encryptPassword)(password);
    yield (0, user_service_1.updateUser)(userId, undefined, undefined, encryptedPassword);
    yield (0, token_service_1.deleteTokens)(userId);
    res.status(200).json({ message: "Password updated." });
    return;
});
exports.resetPasswordController = resetPasswordController;
