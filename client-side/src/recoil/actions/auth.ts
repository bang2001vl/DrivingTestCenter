import { useRecoilState, useSetRecoilState } from "recoil";
import { appConfig } from "../../configs";
import getDeviceInfo from "../../_helper/deviceInfo";
import { APIFetcher } from "../../_helper/fetchAPI";
import { authAtom } from "../model/auth";

function saveAuthToLocalStorage(auth: any){
  localStorage.setItem("auth", auth);
}

export function loadAuthFromStorage(){
    const old = localStorage.getItem('auth');
    if(old){
        return JSON.parse(old);
    }
    return null;
}

export function logoutSession(){

}

const useAuthActions = () => {
  const [auth, setAuth] = useRecoilState(authAtom);
  
  return {
    async login(username: string, password: string, deviceInfo: string) {
      const body = {
        account: {
          username,
          password,
        },
        deviceInfo: JSON.stringify(getDeviceInfo())
      };

      const [error, data] = await APIFetcher.post(`login`, body);

      if (!error) {
        const session = data.session;
        const newAuth = {
          token: session.token,
          roleId: session.roleId,
        }
        // Login successfull
        setAuth(newAuth);
        saveAuthToLocalStorage(newAuth);
        return [null, newAuth];
      }

      // Invalid response
      setAuth(null);
      saveAuthToLocalStorage(null);
      return [error, null];
    },

    logoutSession(){
      setAuth(null);
      saveAuthToLocalStorage(null);
    }
  };


}

export default useAuthActions;