import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AccountSingleton } from "../singleton/account";

export default function FirstLaunch() {
    const navigate = useNavigate()
    useEffect(() => {
        if(!AccountSingleton.instance.isLogined){
            navigate("/login");
        }
    }, []);

    return <></>;
}