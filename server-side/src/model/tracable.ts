import helper from "../helper";

export interface TracableArgs{
    id?: number;
    createTime?: string | undefined;
    updateTime?: string | undefined;
}

export class TracableModel{
    id?: number;
    createTime?: string | undefined;
    updateTime?: string | undefined;

    constructor(args: TracableArgs) {
        this.id = args.id;
        this.createTime = args.createTime;
        this.updateTime = args.updateTime;
    }

    receiveCreateTimeInDate(){
        return helper.converter.stringToDate(this.createTime);
    }

    receiveUpdateTimeInDate(){
        return helper.converter.stringToDate(this.updateTime);
    }

    removeSecureField(){
        delete this.id;
        delete this.createTime;
        delete this.updateTime;
    }
}