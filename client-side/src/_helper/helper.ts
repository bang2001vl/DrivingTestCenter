import { appConfig } from "../configs";

export function createBEPublicURI(localURI: string) {
    return `${appConfig.backendUri}/public/${localURI}`;
}

export function formatNumber(num: number | string | undefined) {
    if (!num) return undefined;
    return Number(num).toLocaleString('en-US');
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