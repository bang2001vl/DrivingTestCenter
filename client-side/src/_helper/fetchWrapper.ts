import { useRecoilState, useRecoilValue } from 'recoil';

import { authAtom } from '../recoil/model/auth';
import { useNavigate } from 'react-router-dom';
import {fetchAPI } from './fetchAPI';
import useAuthActions from '../recoil/actions/auth';

export function useAuthFetcher() {
    const auth = useRecoilValue(authAtom);
    const authActions = useAuthActions();
    const navigate = useNavigate();

    // if(!auth){
    //     navigate("/login", {replace: true});
    //     return undefined;
    // }

    return {
        get: request('GET'),
        post: request('POST'),
        put: request('PUT'),
        delete: request('DELETE')
    };

    function request(method: string) {
        return async (apiPath: string, body: any) => {
            const result = await fetchAPI(method, apiPath, body, auth?.token);
            const error = result[0];
            if(error && error.errorCode === 401){
                authActions.logoutSession();
                navigate("/login", {replace: true});
                return undefined;
            }
            else{
                return result;
            }
        }
    }
}