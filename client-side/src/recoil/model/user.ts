import { atom, selector } from "recoil";
import { UserAPI } from "../../api/user";
import { authAtom } from "./auth";

interface IUserState {
    fullname: string,
    birthday: string,
    gender: number,
    imageURI: string,
}

export const userAtom = atom<IUserState | null>({
    key: "userAtom",
    default: null,
});