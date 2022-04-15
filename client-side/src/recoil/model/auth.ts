import { atom } from "recoil";
import { loadAuthFromStorage } from "../actions/auth";

interface IAuthState {
    token: string,
    roleId: number,
}


export const authAtom = atom<IAuthState | null>({
    key: "authState",
    default: loadAuthFromStorage(),
});