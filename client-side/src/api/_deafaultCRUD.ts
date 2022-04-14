import { APIFetcher } from "../_helper/fetchAPI";

export interface ICountOption {
    searchby: string,
    searchvalue: string,
    orderby: string,
    orderdirection: string,
}

export interface ISelectOption {
    searchby: string,
    searchvalue: string,
    orderby: string,
    orderdirection: string,
    start: number,
    count: number,
}


export interface IOrderOptions {
    property: string; // "name" | "id" ...
    direction: string; // "ASC" | "DESC" ...
}

export interface ISearchOption {
    property: string; // "name" | "id" ...
    value: string;
}

export interface IPagingOption {
    start: number,
    count: number,
}

export const buildAPI_CRUD = (path: string) => {
    return {
        async select(option: ISelectOption, token: string | undefined) {
            const optionParsed : any = option;
            optionParsed.start = String(option.start);
            optionParsed.count = String(option.count);

            const params = new URLSearchParams(optionParsed);
            console.log("Select with Params = ");
            console.log(params.toString());

            return APIFetcher.get(`${path}/select?${params.toString()}`, undefined, token);
        },
        
        async count(option: ICountOption, token: string | undefined) {
            const optionParsed : any = option;

            const params = new URLSearchParams(optionParsed);
            console.log("Count with Params = ");
            console.log(params.toString());

            return APIFetcher.get(`${path}/count?${params.toString()}`, undefined, token);
        },

        async create(data: any, token: string | undefined) {
            const body = {
                data: data
            }
            return APIFetcher.post(`${path}/create`, body, token);
        },

        async update(key: any, data: any, token: string | undefined) {
            const body = {
                key: key,
                data: data
            }
            return APIFetcher.put(`${path}/update`, body, token);
        },

        async delete(keys: any[], token: string | undefined) {
            const body = {
                keys: keys,
            }
            return await APIFetcher.delete(`${path}/delete`, body, token);
        },
    }
}