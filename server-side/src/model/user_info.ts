interface IArg{
    accountId?:number;
    name?:string;
    email?:string;
    phone?:string;
    gender?:number;
    address?:string;
    avatarPath?:string;
}

export class UserInfo{
    accountId?:number;
    name?:string;
    email?:string;
    phone?:string;
    gender?:number;
    address?:string;
    avatarPath?:string;

    constructor(args: IArg){
        this.accountId = args.accountId;
        this.name = args.name;
        this.email = args.email;
        this.phone = args.phone;
        this.gender = args.gender;
        this.address = args.address;
        this.avatarPath = args.avatarPath;
    }

    static fromJSON(json: any){
        return new UserInfo(json);
    }
}