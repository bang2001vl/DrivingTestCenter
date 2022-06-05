import { appConfig } from "../configs";

export function createBEPublicURI(localURI: string) {
    return `${appConfig.backendUri}/public/${localURI}`;
}

export function formatNumber(num: number | string | undefined){
    if(!num) return undefined;
    return Number(num).toLocaleString('en-US')
}

export function validYupToObject<T = any>(values: T, yup: any){
    const errors: any = {};
    Object.keys(values).forEach(key =>{
        yup.validateAt(key, values)
        .catch((err: any) => {
            errors[key] = err.message;
        });
    });
    return errors;
}

export function validYupToArray<T = any>(values: T, yup: any){
    const errors: any[] = [];
    Object.keys(values).forEach(key =>{
        yup.validateAt(key, values)
        .catch((err: any) => {
            errors.push(err.message);
        });
    });
    return errors;
}