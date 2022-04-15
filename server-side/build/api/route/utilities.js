"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponseSuccess = exports.buildResponseError = void 0;
function buildResponseError(code, meassage) {
    return {
        result: false,
        errorCode: code,
        errorMessage: meassage,
    };
}
exports.buildResponseError = buildResponseError;
function buildResponseSuccess(data) {
    return {
        result: true,
        data: data,
    };
}
exports.buildResponseSuccess = buildResponseSuccess;
