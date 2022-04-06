import { APIEmitter, API_EVENTS } from ".";
import { appConfig } from "../configs";

export interface ISession {
  token: string;
  data: {
    roleId: number
  };
}

let _currentSession: ISession | null = null;
function setCurrentSession(session: ISession | null) {
  _currentSession = session;
  if(session !== null){
    
  }
}

export const AccountAPI = {
  async login(username: string, password: string, deviceInfo: any) {
    const inputBody = `{
          "account": {
            "username": ${username},
            "password": ${password}
          },
          "deviceInfo": ${JSON.stringify(deviceInfo)}
        }`;
  
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json; charset=utf-8',
    };
  
    const response = await fetch(`${appConfig.backendUri}/login`,
      {
        method: 'POST',
        body: inputBody,
        headers: headers,
      });
  
    if (response.status === 200 && response.body) {
      const responseData: any = response.json();
      if (responseData.result) {
        const { session } = responseData;
        setCurrentSession(session);
      }
      else {
        const {errorCode, errorMessage} = responseData;
        console.log(responseData);
      }
    }
  
    // Invalid response
    return undefined;
  },

  getSession(){
    return _currentSession
  },
}