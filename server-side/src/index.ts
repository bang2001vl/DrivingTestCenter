import {ApiServer} from "./api";
import appConfig from "./config";
import helper from "./helper";
import { findMaxPk, myPrisma } from "./prisma";

const apiServer = ApiServer();
apiServer.listen(appConfig.port_http, ()=>{
    helper.logger.traceWithTag("Server", `Listening on port ${appConfig.port_http}`);
});

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