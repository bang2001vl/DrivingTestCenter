import { config } from "dotenv";
import { resolve } from "path";
import { exit } from "process";
import helper from "../helper";

config();
if(!process.env.SMTP_USER || !process.env.SMTP_PWD){
    console.log("Missing config of SMTP");
    exit(0);
}

const appConfig = {
    port_http : process.env.PORT_HTTP || 5000,
    port_https: process.env.PORT_HTTPS || 5001,
    port_socketio: process.env.PORT_SOCKET_IO || 5002,

    smtp_user: process.env.SMTP_USER,
    smtp_pwd: process.env.SMTP_PWD,

    domain: process.env.DOMAIN || "thunderv-2.southeastasia.cloudapp.azure.com",
    publicFolder: process.env.PUBLIC_FOLDER_PATH ? resolve(process.env.PUBLIC_FOLDER_PATH) : resolve(__dirname,"..","..","public"),
    resourceFolder: process.env.RESOURCE_FOLDER_PATH ? resolve(process.env.RESOURCE_FOLDER_PATH) : resolve(__dirname,"..","..","resources"),

    tokenDuration : 5*60*60*1000, // 5 hours
}

helper.logger.trace("App Config = " + JSON.stringify(appConfig, null, 2));

export default appConfig;