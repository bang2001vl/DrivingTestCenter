import { DialogActionsClassKey } from "@mui/material";
import axios, { Axios, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";
import { appConfig } from "../configs";
import { AccountSingleton } from "../singleton/account";

export class MyResponse<D = any> {
    result: boolean;
    data?: D;
    errorCode?: number;
    errorMessage?: string;

    constructor(
        result: boolean,
        errorCode?: number,
        errorMessage?: string,
        data?: any
    ) {
        this.result = result;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.data = data;
    }

    static fromJson(json: any) {
        if(typeof json === "string"){
            json = JSON.parse(json);
        }
        return new MyResponse(
            json["result"],
            json["errorCode"],
            json["errorMessage"],
            json["data"]
        );
    }
}

const UNAUTHORIZED_RESPONSE = new MyResponse(false, 401, "Need login");

axios.interceptors.request.use(request => {
        console.log('Starting Request', JSON.stringify(request, null, 2))
        return request
      });

export class APIService {
    axios: Axios;
    private onHandleReponse?: (response: MyResponse)=> any;
    
    constructor(cancelToken?: CancelToken, onHandleReponse?: (response: MyResponse)=> any){
        this.onHandleReponse = onHandleReponse;
        this.axios = axios;
        // this.axios = axios.create({
        //     //baseURL: appConfig.backendUri,
        //     cancelToken: cancelToken,
        //     timeout: 1000,
        // });
        // this.axios.interceptors.request.use(request => {
        //     console.log('Starting Request', JSON.stringify(request, null, 2))
        //     return request
        //   })
    }

    private handleReponse(response: AxiosResponse) {
        console.log(response);

        const myResponse = this._handleResponse(response);
        if(this.onHandleReponse){
            this.onHandleReponse(myResponse);
        }
        console.log(myResponse);
        
        return myResponse;
    }

    private _handleResponse(response: AxiosResponse) {
        if (!response) {
            return new MyResponse(false, -1, "Not receive response");
        }
        const myResponse = MyResponse.fromJson(response.data);
        if (myResponse.errorCode === 401) {
            return UNAUTHORIZED_RESPONSE;
        }
        return myResponse;
    }

    private handleException(errors: any) {
        console.log('ERROR RESPONSE:', errors);

        return new MyResponse(false, -2, "Catch exeption when call api");
    }

    private _buildConfigWithToken<D = any>(
        config?: AxiosRequestConfig<D>
    ): AxiosRequestConfig<D> | null {
        if (!AccountSingleton.instance.isLogined) return null;

        const tokenHeader = { token: AccountSingleton.instance.session!.token };
        if (config) {
            return { ...config, headers: { ...config.headers, ...tokenHeader } };
        } else {
            return { headers: tokenHeader };
        }
    }

    public async request<T = any, D = any>(
        config: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        return this.axios
            .request(config)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }

    public async get<T = any, D = any>(
        url: string,
        config?: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        return this.axios
            .get(url, config)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }
    public async getWithToken<T = any, D = any>(
        url: string,
        config?: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        var newConfig = this._buildConfigWithToken(config);
        if (!newConfig)
            return Promise.resolve(UNAUTHORIZED_RESPONSE);

        return this.axios
            .get(url, newConfig)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }


    public post<T = any, D = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        return this.axios
            .post(url, data, config)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }

    public postWithToken<T = any, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        var newConfig = this._buildConfigWithToken(config);
        if (!newConfig)
            return Promise.resolve(UNAUTHORIZED_RESPONSE);

        return this.axios
            .post(url, data, newConfig)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }

    public put<T = any, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        return this.axios
            .put(url, data, config)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }
    public putWithToken<T = any, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        var newConfig = this._buildConfigWithToken(config);
        if (!newConfig)
            return Promise.resolve(UNAUTHORIZED_RESPONSE);

        return this.axios
            .put(url, data, newConfig)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }

    public delete<T = any, D = any>(
        url: string,
        config?: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        return this.axios
            .delete(url, config)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }
    public deleteWithToken<T = any, D = any>(
        url: string,
        config?: AxiosRequestConfig<D>
    ): Promise<MyResponse<T>> {
        var newConfig = this._buildConfigWithToken(config);

        if (!newConfig)
            return Promise.resolve(UNAUTHORIZED_RESPONSE);

        return this.axios
            .delete(url, newConfig)
            .then((res)=>this.handleReponse(res))
            .catch((reason)=>this.handleException(reason));
    }
}