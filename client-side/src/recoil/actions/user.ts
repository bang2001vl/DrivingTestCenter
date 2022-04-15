import { useRecoilState,} from "recoil";
import { APIFetcher } from "../../_helper/fetchAPI";
import { userAtom } from "../model/user";

const useUserActions = () => {
    const [user, setUser] = useRecoilState(userAtom);
    return {
        async loadUserData(token: string) {
            console.log("On loadCurrentUserData");

            const [error, data] = await APIFetcher.get("account/detail", undefined, token);
            if (!error) {
                // Success received data
                if (data.student) {
                    data.student.imageURI = '/static/mock-images/avatars/avatar_default.jpg';
                    console.log(data);
                    
                    setUser(data.student);
                    return;
                }
                if (data.employee) {
                    data.employee.imageURI = '/static/mock-images/avatars/avatar_default.jpg';
                    console.log(data);
                    setUser(data.employee);
                    return;
                }
                throw "Unexpected response";
            }
            setUser(null);
        },
    };
}

export default useUserActions;