import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom } from "../recoil/model/auth";

const useAuthMiddleware = ()=>{
    const [auth, setAuth] = useRecoilState(authAtom);
    const navigate = useNavigate();
    return {
        tokenChecker(){
            if(!auth || !auth.token){
                // Logout
                localStorage.removeItem('user');
                setAuth(null);
                navigate("/login", {replace: true});
                return true;
            }
            return false;
        }
    }
}

export default useAuthMiddleware;