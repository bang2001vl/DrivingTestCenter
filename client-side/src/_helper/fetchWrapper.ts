import { useRecoilState } from 'recoil';

import { authAtom } from '../recoil/model/auth';
import { appConfig } from '../configs';
import { useNavigate } from 'react-router-dom';

export { useFetchWrapper };

function useFetchWrapper() {
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();

    return {
        get: request('GET'),
        post: request('POST'),
        put: request('PUT'),
        delete: request('DELETE')
    };

    function request(method: string) {
        return (url: string, body: any) => {
            const requestOptions : any = {
                method,
                headers: authHeader(url)
            };
            if (body) {
                requestOptions.headers['Content-Type'] = 'application/json';
                requestOptions.body = JSON.stringify(body);
            }
            return fetch(url, requestOptions).then(handleResponse);
        }
    }
    
    // helper functions
    
    function authHeader(url: string) {
        // return auth header with jwt if user is logged in and request is to the api url
        const token = auth?.token;
        const isApiUrl = url.startsWith(appConfig.backendUri);
        if (token && isApiUrl) {
            return { token: `${token}` };
        } else {
            return {};
        }
    }
    
    function handleResponse(response: Response) {
        return response.text().then(text => {
            console.log(`Response received`);
            console.log(response);
            
            const data = text && JSON.parse(text);
            
            if (response.ok) {
                if(!data.result){
                    return [{
                        errorCode: data.errorCode, 
                        errorMessage: data.errorMessage,
                    }, null];
                }
                else {
                    return [null, data.data]
                }
            }
            
            if ([401, 403].includes(response.status) && auth?.token) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                localStorage.removeItem('user');
                setAuth(null);
                navigate("/login", {replace: true});
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        });
    }    
}