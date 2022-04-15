"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./api/server"));
const config_1 = __importDefault(require("./config"));
const helper_1 = __importDefault(require("./helper"));
const apiServer = (0, server_1.default)();
apiServer.listen(config_1.default.port_http, () => {
    helper_1.default.logger.traceWithTag("Server", `Listening on port ${config_1.default.port_http}`);
});
