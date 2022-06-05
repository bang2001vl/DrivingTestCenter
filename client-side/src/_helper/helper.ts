import { appConfig } from "../configs";

export function createBEPublicURI(localURI: string) {
    return `${appConfig.backendUri}/public/${localURI}`;
}

export function formatNumber(num: number | string | undefined) {
    if (!num) return undefined;
    return Number(num).toLocaleString('en-US')
}

export function validYupToObject<T = any>(values: T, schema: any) {
    const errors: any = {};
    for(let key in Object.keys(values)){
        try {
            schema.validateAt(key, values)
                .catch((err: any) => {
                    errors[key] = err.message;
                });
        }
        catch (ex) {

        }
    }
    return errors;
}

export function validYupToArray<T = any>(values: T, schema: any) {
    const errors: any[] = [];
    for(let key in Object.keys(values)){
        try {
            schema.validateAt(key, values)
                .catch((err: any) => {
                    errors.push(err.message);
                });
        }
        catch (ex) {

        }
    }
    return errors;
}