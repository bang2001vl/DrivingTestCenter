import { APIEmitter, API_EVENTS } from ".";
import { appConfig } from "../configs";
import { AccountAPI } from "./account";

export const USER_ROLES = {
  employee: "employee",
  admin: "admin",
  student: "student",
}

interface IUserData {

}

let _currentUser: IUserData | null = null;
function setCurrentUser(userData: IUserData) {
  _currentUser = userData;
  APIEmitter.emit(API_EVENTS.USER_CHANGED, userData);
}

async function getUserData(token: string) {
  const headers = {
    'token': token
  };
  const response = await fetch(`${appConfig.backendUri}/account/detail`, {
    headers
  });

  return response ;
}

export const UserAPI = {
  async getUserData(token: string) {
    const headers = {
      'token': token
    };
    const response = await fetch(`${appConfig.backendUri}/account/detail`, {
      headers
    });
  
    return await response.json() ;
  }
}