import { atom, selector } from "recoil";
import { loadAuthFromStorage } from "../actions/auth";

interface IAuthState {
    token: string,
    roleId: number,
}

export const roleSelector = selector({
    key: "roleSelector",
    get : ({get})=>{
        const auth = get(authAtom);
        const roleId = auth ? auth.roleId : -1;
        if(roleId === 1){
            return "Admin";
          }
          if(roleId === 2){
            return "Student";
          }
          if(roleId === 3){
            return "Employee";
          }
          return '';
    }
})

export const authAtom = atom<IAuthState | null>({
    key: "authState",
    default: loadAuthFromStorage(),
});