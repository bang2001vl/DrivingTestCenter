import { browserName, browserVersion, deviceType } from "react-device-detect";

export default function getDeviceInfo(){
    return {
        browserName: browserName,
        browserVersion: browserVersion,
        deviceType: deviceType,
    }
}