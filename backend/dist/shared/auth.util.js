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
exports.generateToken = generateToken;
exports.encryptPassword = encryptPassword;
exports.comparePassword = comparePassword;
exports.verifyToken = verifyToken;
exports.authenticateJWT = authenticateJWT;
exports.authenticateJWTOptional = authenticateJWTOptional;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const secretKey = process.env.JWT_SECRET_KEY;
function generateToken(userId, expiresIn = "12h") {
    const payload = { userId };
    const token = jsonwebtoken_1.default.sign(payload, secretKey, {
        expiresIn,
    });
    return token;
}
function encryptPassword(password) {
    const saltRounds = 10;
    const hashedPassword = bcrypt_1.default.hashSync(password, saltRounds);
    return hashedPassword;
}
function comparePassword(password, hashedPassword) {
    return bcrypt_1.default.compareSync(password, hashedPassword);
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        return null;
    }
}
function authenticateJWT(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.header("authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer", "").trim();
        if (!token) {
            res.status(401).json({ message: "Access denied. Token not provided." });
            return;
        }
        yield authenticateJWT_admin(res, req, next, token);
        // const verified = verifyToken(token);
        // if (!verified) {
        //   res.status(403).json({ message: "Invalid token" });
        //   return;
        // }
        // try {
        //   const user = await User.findByPk((verified as any).userId);
        //   if (!user) {
        //     res.status(403).json({ message: "User not found" });
        //     return;
        //   }
        //   (req as any).user = user;
        //   next();
        // } catch (error) {
        //   res.status(500).json({ message: "Server error" });
        //   return;
        // }
    });
}
function authenticateJWTOptional(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.header("authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer", "").trim();
        yield authenticateJWT_admin(res, req, next, token);
    });
}
function authenticateJWT_admin(res, req, next, token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!token) {
            next();
            return;
        }
        const verified = verifyToken(token);
        if (!verified) {
            res.status(403).json({ message: "Invalid token" });
            return;
        }
        try {
            const user = yield User_1.User.findByPk(verified.userId);
            if (!user) {
                res.status(403).json({ message: "User not found" });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            res.status(500).json({ message: "Server error" });
            return;
        }
    });
}
// export function authenticateJWT(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const token = req.header("authorization")?.replace("Bearer", "").trim();
//   if (!token) {
//     res.status(401).json({ message: "Acces denied" });
//     return;
//   }
//   const verified = verifyToken(token);
//   if (!verified) {
//     res.status(403).json({ message: "Invalid token" });
//     return;
//   }
//   User.findByPk((verified as any).userId).then((user) => {
//     if (user) {
//       (req as any).user = user;
//       next();
//     } else {
//       res.status(403).json({ message: "User not found" });
//       return;
//     }
//   });
// }
