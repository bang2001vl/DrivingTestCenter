import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import useUserActions from "../recoil/actions/user";
import { authAtom } from "../recoil/model/auth";

export default function FirstLaunch(){
    const auth = useRecoilValue(authAtom);
    const userActions = useUserActions();
    useEffect(()=>{
        if(auth){
            userActions.loadUserData(auth.token);
        }
    },[]);
    return <></>;
}