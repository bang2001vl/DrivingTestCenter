import { useNavigate } from "react-router-dom";
import { APIService, MyResponse } from "../api/service";

export default function useAPI(){
    const navigate = useNavigate();
    function onHandleResponse(response: MyResponse){
        if(!response.result){
            if(response.errorCode === 401){
                navigate("/login", {replace: true});
            }
        }
    }
    
    return new APIService(undefined, onHandleResponse)
} 