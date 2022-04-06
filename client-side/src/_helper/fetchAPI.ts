import { appConfig } from "../configs";

export async function fetchAPI(method: string, apiPath: string, body: any, token?: string) {
    const url = `${appConfig.backendUri}/${apiPath}`;
    const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json; charset=utf-8',
    };
    if (token) {
        headers['token'] = token;
    }
    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: headers,
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
  
    // Failed to make request
    console.log("Failed to make request " + url);
    console.log(response);
  
    return [{
        errorCode: response.status,
        errorMessage: 'Cannot connect to server',
    }, null];
  }

export const APIFetcher = {
        get: (apiPath: string, body: any, token?: string) => fetchAPI("GET", apiPath, body, token),
        post: (apiPath: string, body: any, token?: string) => fetchAPI("POST", apiPath, body, token),
        delete: (apiPath: string, body: any, token?: string) => fetchAPI("DELETE", apiPath, body, token),
        put: (apiPath: string, body: any, token?: string) => fetchAPI("PUT", apiPath, body, token),
}