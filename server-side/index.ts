import APIServer from "./api/server";
import appConfig from "./config";
import helper from "./helper";

const apiServer = APIServer();
apiServer.listen(appConfig.port_http, ()=>{
    helper.logger.traceWithTag("Server", `Listening on port ${appConfig.port_http}`);
})
