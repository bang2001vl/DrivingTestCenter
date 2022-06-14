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
const keysFolder = "/home/azureuser/remote/keys";
const certPath = resolve(keysFolder, "certs", `${appConfig.domain}.certificate.crt`);
const caPath = resolve(keysFolder, "certs", `${appConfig.domain}.ca_bundle.crt`);
const keyPath = resolve(keysFolder, "private", `${appConfig.domain}.private.key`);
if (
    existsSync(certPath)
    && existsSync(caPath)
    && existsSync(keyPath)
) {
    const serverHttps = createServer({
        cert: readFileSync(certPath),
        ca: readFileSync(caPath),
        key: readFileSync(keyPath),
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