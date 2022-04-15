import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import useAuthActions from "../recoil/actions/auth";
import { authAtom } from "../recoil/model/auth";
import { DialogHelper } from "../singleton/dialogHelper";
import { IErrorResponse } from "./fetchAPI";

export function useAPIResultHandler() {
    const authActions = useAuthActions();
    const navigate = useNavigate();
    return {
        catchAuthError(error: IErrorResponse) {
            if (error && error.errorCode === 401) {
                authActions.logoutSession();
                navigate("/login", { replace: true });
                return true;
            }
            else {
                return false;
            }
        },
        catchConnectionError(error: IErrorResponse) {
            if (error && error.errorCode === 0) {
                DialogHelper.showAlert("Không thể kết nối đến server");
                return true;
            }
            else {
                return false;
            }
        },
        catchFatalError(error: IErrorResponse){
            return (this.catchConnectionError(error) || this.catchAuthError(error));
        }
    }
}