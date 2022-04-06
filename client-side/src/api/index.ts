import EventEmitter from "events";

export const API_EVENTS = {
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    USER_CHANGED: "USER_CHANGED",
}


export const APIEmitter = new EventEmitter();