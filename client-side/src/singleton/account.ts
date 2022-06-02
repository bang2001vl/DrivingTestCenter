import { string } from "yup";
import { APIService, MyResponse } from "../api/service";
import { appConfig } from "../configs";
import { ISession } from "../_interfaces/session";
import { IUserInfo } from "../_interfaces/userInfo";

const LocalStorageValue = {
  session: "session",
  userinfo: "userInfo"
}

const ROLE = {
  admin: 0,
  student: 1,
  employee: 2,
}

export class AccountSingleton {
  private static _instance?: AccountSingleton;

  public static get instance() {
    if (!this._instance) {
      this._instance = new AccountSingleton();
    }

    return this._instance;
  };

  session?: ISession;
  userInfo?: IUserInfo;

  constructor() {
    const oldSession = localStorage.getItem(LocalStorageValue.session);
    if (oldSession) {
      this.session = JSON.parse(oldSession);
    }
    else {
      this.session = undefined;
    }

    const oldUserInfo = localStorage.getItem(LocalStorageValue.userinfo);
    if (oldUserInfo) {
      this.userInfo = JSON.parse(oldUserInfo);
    }
    else {
      this.userInfo = undefined;
    }
  }

  public get isLogined() {
    return this.session !== undefined
  }

  public get isAdmin() {
    return this.isLogined && this.session!.roleId === ROLE.admin;
  }

  public get isStudent() {
    return this.isLogined && this.session!.roleId === ROLE.student;
  }

  public get isEmployee() {
    return this.isLogined && this.session!.roleId === ROLE.employee;
  }

  public async login(username: string, password: string, deviceInfo: any) {
    const api = new APIService();
    const response = await api.post(
      appConfig.backendUri + `/auth/login`,
      {
        username: String(username),
        password: String(password),
        deviceInfo: JSON.stringify(deviceInfo),
      })

    if (response.result && response.data) {
      this.userInfo = response.data.userInfo;
      this.session = response.data.session;

      if (!this.userInfo || !this.session) {
        return new MyResponse(false, -3, "Failed when load userInfo");
      }

      // Success
      localStorage.setItem(LocalStorageValue.session, JSON.stringify(this.session));
      localStorage.setItem(LocalStorageValue.userinfo, JSON.stringify(this.userInfo));
    }

    // Invalid response
    return response;
  }

  async loadUserInfo() {
    const api = new APIService();
    const res = await api.getWithToken<IUserInfo>(
      appConfig.backendUri + "/user/info/self"
    );
    if (res.result && res.data) {
      this.saveUserInfo(res.data)
    }

    return res;
  }

  saveUserInfo(userInfo: IUserInfo) {
    this.userInfo = userInfo;
    localStorage.setItem(LocalStorageValue.userinfo, JSON.stringify(this.userInfo));
  }

  public async logout() {
    const api = new APIService();
    api.postWithToken(
      appConfig.backendUri + `/session/destroy/self`
    );
    localStorage.removeItem(LocalStorageValue.session);
    this.session = undefined;
    localStorage.removeItem(LocalStorageValue.userinfo);
    this.userInfo = undefined;
  }
}