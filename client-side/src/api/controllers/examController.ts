import { appConfig } from "../../configs";
import { APIService } from "../service";

export class ExamController {
    api: APIService;
    constructor(api: APIService){
        this.api = api;
    }

    create(data: any){
        return this.api.postWithToken(
            appConfig.backendUri + `/exam/insert`,
            data
        );
    }
    delete(id: number){
        return this.api.deleteWithToken(
            appConfig.backendUri + `/exam/delete?keys=${String(id)}`
        );
    }
}