"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http2_1 = require("http2");
const config_1 = require("../helper/config");
const log_helper_1 = require("../helper/log_helper");
const app = express();
function start() {
    const http = (0, http2_1.createServer)(app);
    http.listen(config_1.config.port_http, () => {
        log_helper_1.default.traceWithTag("Listening on port = " + config_1.config.port_http, "HTTP");
    });
    // const https = createServerHttps(app);
    // https.listen(config.port_https, () =>{
    //     logger.traceWithTag("Listening on port = " + config.port_https, "HTTPs");
    // });
}
const apiServer = {
    start
};
exports.default = apiServer;
