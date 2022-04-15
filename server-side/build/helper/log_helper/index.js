"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppLogger {
    trace(msg) {
        console.log(msg);
    }
    traceWithTag(tag, msg) {
        console.log(`[${tag}] : ${msg}`);
    }
    error(msg) {
        console.error(msg);
    }
    errorWithTag(tag, ex) {
        console.log("Has error with tag: " + tag);
        console.log(ex);
        console.error(`\t${ex}`);
    }
}
exports.default = AppLogger;
