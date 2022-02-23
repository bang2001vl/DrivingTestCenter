import * as express from "express";
import { createServer as createServerHttp } from "http2";
import { createServer as createServerHttps } from "https";
import appConfig from "../config";
import helper from "../helper";

const app = express();

function start() {

    // Start HTTP server
    app.listen(appConfig.port_http, () => {
        helper.logger.traceWithTag("Listening on port = " + appConfig.port_http, "HTTP");
    });

    // Start HTTPs server
    // const https = createServerHttps(app);
    // https.listen(config.port_https, () =>{
    //     logger.traceWithTag("Listening on port = " + config.port_https, "HTTPs");
    // });
}

const apiServer = {
    start
}

export default apiServer;