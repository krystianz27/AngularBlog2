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
exports.getToken = exports.deleteTokens = exports.addToken = void 0;
const Token_1 = require("../models/Token");
const addToken = (token, type, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenInstance = new Token_1.Token();
    tokenInstance.token = token;
    tokenInstance.type = type;
    tokenInstance.userId = userId;
    return yield tokenInstance.save();
});
exports.addToken = addToken;
const deleteTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Token_1.Token.destroy({
        where: { userId },
    });
});
exports.deleteTokens = deleteTokens;
const getToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Token being searched:", token);
    return yield Token_1.Token.findOne({ where: { token } });
});
exports.getToken = getToken;
