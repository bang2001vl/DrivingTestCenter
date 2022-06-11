"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const config_1 = __importDefault(require("./config"));
const helper_1 = __importDefault(require("./helper"));
const apiServer = (0, api_1.ApiServer)();
apiServer.listen(config_1.default.port_http, () => {
    helper_1.default.logger.traceWithTag("Server", `Listening on port ${config_1.default.port_http}`);
});
// myPrisma.account.findMany({
//     where: {
//         roleId: 1,
//         joingTest: {
//             none: {
//                 examTest: {
//                     examId: 1
//                 }
//             }
//         }
//     }
// }).then(r => console.log(r));
