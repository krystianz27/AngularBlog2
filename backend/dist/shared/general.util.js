"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = generateSlug;
function generateSlug(text, unique = false) {
    let slug = text.toLowerCase().replace(/ /g, "-");
    if (unique) {
        let uniqueNumber = Math.floor(Math.random() * 1000);
        slug += "-" + uniqueNumber;
    }
    return slug;
}
