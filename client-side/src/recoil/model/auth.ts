import { atom } from "recoil";

interface IAuthState {
    token: string,
    roleId: number,
}

function loadAuthFromStorage(){
    const old = localStorage.getItem('auth');
    if(old){
        return JSON.parse(old);
    }
    return null;
}

export const authAtom = atom<IAuthState | null>({
    key: "authState",
    default: loadAuthFromStorage(),
});