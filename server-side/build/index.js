"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const https_1 = require("https");
const path_1 = require("path");
const api_1 = require("./api");
const config_1 = __importDefault(require("./config"));
const helper_1 = __importDefault(require("./helper"));
const apiServer = (0, api_1.ApiServer)();
apiServer.listen(config_1.default.port_http, () => {
    helper_1.default.logger.traceWithTag("Server", `Listening on port ${config_1.default.port_http}`);
});
// Start HTTPs server
if ((0, fs_1.existsSync)((0, path_1.resolve)(config_1.default.resourceFolder, ".keys", "certs", `${config_1.default.domain}.certificate.crt`))
    && (0, fs_1.existsSync)((0, path_1.resolve)(config_1.default.resourceFolder, ".keys", "certs", `${config_1.default.domain}.ca_bundle.crt`))
    && (0, fs_1.existsSync)((0, path_1.resolve)(config_1.default.resourceFolder, ".keys", "private", `${config_1.default.domain}.private.key`))) {
    const serverHttps = (0, https_1.createServer)({
        cert: (0, fs_1.readFileSync)((0, path_1.resolve)(config_1.default.resourceFolder, ".keys", "certs", `${config_1.default.domain}.certificate.crt`)),
        ca: (0, fs_1.readFileSync)((0, path_1.resolve)(config_1.default.resourceFolder, ".keys", "certs", `${config_1.default.domain}.ca_bundle.crt`)),
        key: (0, fs_1.readFileSync)((0, path_1.resolve)(config_1.default.resourceFolder, ".keys", "private", `${config_1.default.domain}.private.key`)),
    }, apiServer);
    serverHttps.listen(config_1.default.port_https, () => {
        helper_1.default.logger.traceWithTag("Listening on port = " + config_1.default.port_https, "HTTPs");
    });
}
// myPrisma.exam.findFirst({
//     where: {
//     },
//     include: {
//         examTests: {
//             select: {
//                 countStudent: true,
//                 maxMember: true,
//             }
//         }
//     }
// }).then(r => console.log(r));
