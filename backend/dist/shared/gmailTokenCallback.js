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
// callback.ts
const gmailAuth_1 = require("./gmailAuth");
// Replacr with Code value from URL params
const code = "4/0AeanS0a7VUPz7NMBCd5RzUMK9DYcogM0LMPWu1f0TemkpGSOUIs0FAgQD6PX0C-k8SBX0Q";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, gmailAuth_1.getAccessToken)(code);
        }
        catch (error) {
            console.error("Wystąpił błąd podczas uzyskiwania tokenów:", error);
        }
    });
}
main();
