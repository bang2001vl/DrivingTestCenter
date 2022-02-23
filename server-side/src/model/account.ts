import { TracableArgs, TracableModel } from "./tracable";
import { UserInfo } from "./user_info";

interface IArg extends TracableArgs{
    username?:string;
    password?:string;
    userInfo?:UserInfo;
}

export default class AccountModel extends TracableModel{
    username?:string;
    password?:string;
    userInfo?:UserInfo;
    constructor(args: IArg){
        super(args);
        this.username = args.username;
        this.password = args.password;
        this.userInfo = args.userInfo;
    }

    static fromJSON(json: any){
        return new AccountModel(json);
    }
}