"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldGetter = void 0;
const isValid_1 = __importDefault(require("date-fns/isValid"));
const parseISO_1 = __importDefault(require("date-fns/parseISO"));
const utilities_1 = require("../route/utilities");
function buildGetter(checker) {
    return (input, fieldName, required = false) => {
        if (input !== undefined && input[fieldName] !== undefined) {
            const data = checker(input[fieldName]);
            if (data !== undefined) {
                return data;
            }
            else {
                throw (0, utilities_1.buildResponseError)(1, "Invalid " + fieldName);
            }
        }
        else if (required) {
            throw (0, utilities_1.buildResponseError)(1, "Not found " + fieldName);
        }
    };
}
exports.FieldGetter = {
    Number: buildGetter((data) => {
        if (!isNaN(Number(data))) {
            return Number(data);
        }
    }),
    String: buildGetter((data) => {
        if (typeof data === "string") {
            return String(data);
        }
    }),
    Array: buildGetter((data) => {
        if (Array.isArray(data)) {
            return data;
        }
    }),
    Date: buildGetter(data => {
        if ((0, isValid_1.default)((0, parseISO_1.default)(data))) {
            return new Date(data);
        }
    }),
    Json: buildGetter(data => {
        if (typeof data === "string") {
            try {
                return JSON.parse(data);
            }
            catch (err) {
                return undefined;
            }
        }
    })
};
