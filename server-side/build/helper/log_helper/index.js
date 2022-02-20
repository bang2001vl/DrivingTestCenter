"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppLogger {
    trace(msg) {
        console.log(msg);
    }
    traceWithTag(msg, tag) {
        console.log(`[${tag}] : ${msg}`);
    }
    error(msg) {
        console.error(msg);
    }
    errorWithTag(msg, tag) {
        console.error(`[${tag}] : ${msg}`);
    }
}
let logger = new AppLogger();
exports.default = logger;
