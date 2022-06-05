"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNestedInput_Insert = exports.uploadWrapper = exports.handleCleanUp = exports.pushToOldImage = exports.parseInputDeleted = exports.parsePathToPublicRelative = exports.parseStringToArrayId = exports.parseInputKeys = exports.checkArrayChange = exports.buildResponseSuccess = exports.buildResponseError = void 0;
const fs_1 = require("fs");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
const _wrapper_1 = require("./_wrapper");
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
function checkArrayChange(oldArr, newArr) {
    const deleted = oldArr.filter(e => !newArr.includes(e));
    const added = newArr.filter(e => !oldArr.includes(e));
    //if(deleted.length < 1 && added.length < 1 ) throw Error("Invalid array");
    return {
        added,
        deleted
    };
}
exports.checkArrayChange = checkArrayChange;
function parseInputKeys(input) {
    if (input && input.keys && Array.isArray(input.keys)) {
        input.keys;
    }
}
exports.parseInputKeys = parseInputKeys;
function parseStringToArrayId(str) {
    let keys = str.split(",");
    return keys.map((e) => parseInt(e));
}
exports.parseStringToArrayId = parseStringToArrayId;
function parsePathToPublicRelative(fullpath) {
    return fullpath.replace(config_1.default.publicFolder, "").slice(1).replace(/\\/g, "/");
}
exports.parsePathToPublicRelative = parsePathToPublicRelative;
function parseInputDeleted(input, primarykeyType = "number") {
    if (input
        && input.keys) {
        if (Array.isArray(input.keys)) {
            const keys = input.keys;
            if (keys.every(k => typeof k === primarykeyType)) {
                return input;
            }
        }
        if (typeof input.keys === "string") {
            return {
                keys: input.keys.split(",").map((e) => parseInt(e))
            };
        }
    }
}
exports.parseInputDeleted = parseInputDeleted;
const pushToOldImage = (fields, tag = "Utilities") => {
    return _wrapper_1.RouteHandleWrapper.wrapMiddleware((req, res) => {
        if (!res.locals.oldImages) {
            res.locals.oldImages = [];
        }
        if (res.locals.old) {
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if (res.locals.input.data[field] && res.locals.old[field]) {
                    res.locals.oldImages.push(res.locals.old[field]);
                }
            }
        }
    }, tag, true);
};
exports.pushToOldImage = pushToOldImage;
const handleCleanUp = (req, res, next) => {
    if (res.locals.error && req.files) {
        // Delete uploaded images if occur error
        const fields = Object.keys(req.files);
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            req.files[field].forEach((e) => { (0, fs_1.unlinkSync)(e.path); });
        }
    }
    else {
        if (res.locals.oldImages) {
            // Delete old images when success
            res.locals.oldImages.forEach((publicURI) => {
                (0, fs_1.unlinkSync)(path_1.default.resolve(config_1.default.publicFolder, publicURI));
            });
        }
    }
    next();
};
exports.handleCleanUp = handleCleanUp;
function uploadWrapper(upload) {
    return (req, res, next) => {
        upload(req, res, function (err) {
            if (err instanceof multer_1.default.MulterError) {
                res.locals.error = buildResponseError(5, "Upload file failed");
            }
            next();
        });
    };
}
exports.uploadWrapper = uploadWrapper;
function checkNestedInput_Insert(nestData, mainKey, checker) {
    const fakeId = 1;
    const checked = checker(Object.assign(Object.assign({}, nestData), { [mainKey]: fakeId }));
    if (!checked) {
        return undefined;
    }
    delete checked.data[mainKey];
    return checked;
}
exports.checkNestedInput_Insert = checkNestedInput_Insert;
