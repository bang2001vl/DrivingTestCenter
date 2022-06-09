import isValid from "date-fns/isValid";
import parse from "date-fns/parse";
import parseISO from "date-fns/parseISO";
import { buildResponseError } from "../route/utilities";

function buildGetter<T>(checker: (data: any) => T | undefined) {
    return (input: any, fieldName: string, required = false) => {
        if (input && input[fieldName]) {
            const data = checker(input[fieldName]);
            if (data !== undefined) {
                return data;
            }
            else{
                throw buildResponseError(1, "Invalid " + fieldName);
            }
        }
        else if (required) {
            throw buildResponseError(1, "Not found " + fieldName);
        }
    }
}

export const FieldGetter = {
    Number: buildGetter((data) => {
        if(!isNaN(Number(data))){
            return Number(data)
        }
    }),
    String: buildGetter((data) => {
        if(typeof data === "string"){
            return String(data);
        }
    }),
    Array: buildGetter((data) => {
        if(Array.isArray(data)){
            return data;
        }
    }),
    Date: buildGetter(data => {
        if(isValid(parseISO(data))){
            return new Date(data);
        }
    }),
    Json: buildGetter(data =>{
        if(typeof data === "string"){
            try{
                return JSON.parse(data);
            }
            catch(err){
                return undefined;
            }
        } 
    })
}