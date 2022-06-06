import {ApiServer} from "./api";
import appConfig from "./config";
import helper from "./helper";
import { findMaxPk, myPrisma } from "./prisma";

const apiServer = ApiServer();
apiServer.listen(appConfig.port_http, ()=>{
    helper.logger.traceWithTag("Server", `Listening on port ${appConfig.port_http}`);
});

// myPrisma.class.findMany({
//     include: {
//         employeeCNNs: {
//             select: {employee: true}
//         },
//         _count: {
//             select: {
//                 studentCNNs: true,
//             }
//         }
//     }
// }).then(r => console.log(r));