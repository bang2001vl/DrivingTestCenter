import { TracableModel, TracableArgs } from "./tracable";

interface SessionArgs {
    token:number[];
    data: string;
}

export interface SessionData {
    accountId: number;
    deviceInfo: JSON;
    createTime: string;
    updateTime: string;
    warnTime: number;
}

export class SessionModel {
    token:number[];
    data: string;

    constructor(args: SessionArgs) {
        this.token = args.token;
        this.data = args.data;
    }

    static fromJSON(json: any) {
        return new SessionModel(json);
    }

    receiveData() : SessionData {
        return JSON.parse(this.data);
    }
}