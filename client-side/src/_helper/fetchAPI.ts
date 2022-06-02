import { appConfig } from "../configs";

export interface IErrorResponse {
    errorCode: number,
    errorMessage: string,
}

export async function fetchAPI(method: string, apiPath: string, body: any, token?: string, abortController?: AbortController): Promise<[IErrorResponse | null, any | null]> {
    const url = `${appConfig.backendUri}/${apiPath}`;
    const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8',
    };
    if (token) {
        headers['token'] = token;
    }
    try {
        const response = await fetch(url, {
            method: method,
            body: body ? JSON.stringify(body) : undefined,
            headers: headers,
            signal: abortController ? abortController.signal : undefined,
        });

        let err = {
            errorCode: 400,
            errorMessage: 'Something wrong',
        }

        if (response.ok) {
            const data = await response.json();
            if (!data.result) {
                // Has error message from server
                return [{
                    errorCode: data.errorCode,
                    errorMessage: data.errorMessage,
                }, null];
            }
            else {
                // Success
                return [null, data.data]
            }
        }

        // Unauthorized
        if (response.status === 401) {
            return [{
                errorCode: response.status,
                errorMessage: 'Unauthorized',
            }, null];
        }

        // Received unexpected http response
        console.log("Received unexpected http response with request " + url);
        console.log(response);

        return [{
            errorCode: response.status,
            errorMessage: 'Cannot connect to server',
        }, null];
    }
    catch (err) {
        console.log("Cannot connect to server with request " + url);
        return [{
            errorCode: 0,
            errorMessage: 'Cannot connect to server',
        }, null];
    }
}

export const APIFetcher = {
    get: (apiPath: string, body: any, token?: string, abortController?: AbortController) => fetchAPI("GET", apiPath, body, token, abortController),
    post: (apiPath: string, body: any, token?: string, abortController?: AbortController) => fetchAPI("POST", apiPath, body, token, abortController),
    delete: (apiPath: string, body: any, token?: string, abortController?: AbortController) => fetchAPI("DELETE", apiPath, body, token, abortController),
    put: (apiPath: string, body: any, token?: string, abortController?: AbortController) => fetchAPI("PUT", apiPath, body, token, abortController),
}