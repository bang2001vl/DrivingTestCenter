import { TextField, TextFieldProps } from "@mui/material";
import { appConfig } from "../configs";

export function createBEPublicURI(localURI: string) {
    return `${appConfig.backendUri}/public/${localURI}`;
}

export function formatNumber(num: number | string | undefined){
    if(!num) return undefined;
    return Number(num).toLocaleString('en-US')
}