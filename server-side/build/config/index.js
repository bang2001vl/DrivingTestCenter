"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const process_1 = require("process");
const helper_1 = __importDefault(require("../helper"));
(0, dotenv_1.config)();
if (!process.env.SMTP_USER || !process.env.SMTP_PWD) {
    console.log("Missing config of SMTP");
    (0, process_1.exit)(0);
}
const appConfig = {
    port_http: process.env.PORT_HTTP || 5000,
    port_https: process.env.PORT_HTTPS || 5001,
    port_socketio: process.env.PORT_SOCKET_IO || 5002,
    smtp_user: process.env.SMTP_USER,
    smtp_pwd: process.env.SMTP_PWD,
    domain: process.env.DOMAIN || "thunderv.southeastasia.cloudapp.azure.com",
    publicFolder: process.env.PUBLIC_FOLDER_PATH ? (0, path_1.resolve)(process.env.PUBLIC_FOLDER_PATH) : (0, path_1.resolve)(__dirname, "..", "..", "public"),
    resourceFolder: process.env.RESOURCE_FOLDER_PATH ? (0, path_1.resolve)(process.env.RESOURCE_FOLDER_PATH) : (0, path_1.resolve)(__dirname, "..", "..", "resources"),
    tokenDuration: 5 * 60 * 60 * 1000, // 5 hours
};
helper_1.default.logger.trace("App Config = " + JSON.stringify(appConfig, null, 2));
exports.default = appConfig;
