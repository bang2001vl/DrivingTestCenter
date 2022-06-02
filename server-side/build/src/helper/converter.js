"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Converter {
    stringToDate(str) {
        if (!str) {
            return null;
        }
        return new Date(str);
    }
}
exports.default = Converter;
