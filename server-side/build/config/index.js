"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appConfig = {
    port_http: 5000,
    port_https: 5001,
    port_socketio: 5002,
    domain: "http://thunderv-2.southeastasia.cloudapp.azure.com",
    tokenDuration: 5 * 60 * 60 * 1000, // 5 hours
};
exports.default = appConfig;
