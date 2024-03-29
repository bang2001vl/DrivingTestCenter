import { AlertColor } from "@mui/material";
import { appConfig } from "../configs";

export function createBEPublicURI(localURI: string) {
    return `${appConfig.backendUri}/public/${localURI}`;
}

export function formatNumber(num: number | string | undefined) {
    if (!num) return undefined;
    return Number(num).toLocaleString('en-US');
}

export function objectToFormData(data: any) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key])
        }
    });
    return formData;
}

export function validYupToObject<T = any>(values: T, schema: any) {
    try {
        schema.validateSync(values, { abortEarly: false });
        return {};
    }
    catch (err: any) {
        let errors: any = {};
        console.log("Error Innner", JSON.stringify(err.inner, null, 2));
        err.inner.forEach((e: any) => {
            errors = { ...errors, [e.path]: e.message };
        });
        return errors;
    };
}

export function validYupToArray<T = any>(values: T, schema: any) {
    try {
        schema.validateSync(values, { abortEarly: false });
        return [];
    }
    catch (err: any) {
        let errors: any = [];
        console.log("Error Innner", JSON.stringify(err.inner, null, 2));
        err.inner.forEach((e: any) => {
            errors.push(`${e.path}: ${e.message}`);
        });
        return errors;
    };
}

export function getMyWindowVariable(){
    return (window as any).my as {
        showSnackBar: (content: string, color: AlertColor)=>void,
    };
}