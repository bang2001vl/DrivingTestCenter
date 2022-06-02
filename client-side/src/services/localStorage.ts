import { ISession } from "../_interfaces/session";

const LOCAL_STORAGE_KEYS = {
    session: "session",
    token: "token",
    roleId: "user_role",
}

export class MyLocalStorage{
    secretKey: string;

    constructor(secretKey?: string){
        if(typeof secretKey !== "string"){
            this.secretKey = "ASFBK34198yR#J%$&*%$#KJNvksdf";
        }
        else{
            this.secretKey = secretKey;
        }
    }

    saveSession(session: ISession){
        localStorage.setItem(LOCAL_STORAGE_KEYS.session, JSON.stringify(session));
    }

    getSession(){
        const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.session)
        if(!raw){
            return undefined;
        }
        const json = JSON.parse(raw) ;
        return {
            token: String(json.token),
            roleId: Number(json.roleId),
        }
    }

    clearSession(){
        localStorage.removeItem(LOCAL_STORAGE_KEYS.session);
    }

    private encryptString(raw: string){
        return raw;
    }

    private decryptString(encrypted: string){
        return encrypted;
    }

    public get<T = any>(key: string){
        const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.session)
        if(!raw){
            return undefined;
        }
        const json = JSON.parse(raw);
        return json as T
    }
}