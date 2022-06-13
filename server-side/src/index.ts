import { existsSync, readFileSync } from "fs";
import { createServer } from "https";
import { resolve } from "path";
import { ApiServer } from "./api";
import appConfig from "./config";
import helper from "./helper";
import { findMaxPk, myPrisma } from "./prisma";

const apiServer = ApiServer();
apiServer.listen(appConfig.port_http, () => {
    helper.logger.traceWithTag("Server", `Listening on port ${appConfig.port_http}`);
});

// Start HTTPs server
if (
    existsSync(resolve(appConfig.resourceFolder, ".keys", "certs", `${appConfig.domain}.certificate.crt`))
    && existsSync(resolve(appConfig.resourceFolder, ".keys", "certs", `${appConfig.domain}.ca_bundle.crt`))
    && existsSync(resolve(appConfig.resourceFolder, ".keys", "private", `${appConfig.domain}.private.key`))
) {
    const serverHttps = createServer({
        cert: readFileSync(resolve(appConfig.resourceFolder, ".keys", "certs", `${appConfig.domain}.certificate.crt`)),
        ca: readFileSync(resolve(appConfig.resourceFolder, ".keys", "certs", `${appConfig.domain}.ca_bundle.crt`)),
        key: readFileSync(resolve(appConfig.resourceFolder, ".keys", "private", `${appConfig.domain}.private.key`)),
    }, apiServer);
    serverHttps.listen(appConfig.port_https, () => {
        helper.logger.traceWithTag("Listening on port = " + appConfig.port_https, "HTTPs");
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