import { TracableArgs, TracableModel } from "./tracable";

interface IArg extends TracableArgs{
    maxStudent?:number;
    fullName?:string;
    description?:string;
    startTime?:string;
    endTime?:string;
    cost?:number;
    status?:number;
}

export default class ClassModel extends TracableModel{
    maxStudent?:number;
    fullName?:string;
    description?:string;
    startTime?:string;
    endTime?:string;
    cost?:number;
    status?:number;
    constructor(args: IArg){
        super(args);
        this.maxStudent = args.maxStudent;
        this.fullName = args.fullName;
        this.description = args.description;
        this.startTime = args.startTime;
        this.endTime = args.endTime;
        this.cost = args.cost;
        this.status = args.status;
    }

    static fromJSON(json: any){
        return new ClassModel(json);
    }
}