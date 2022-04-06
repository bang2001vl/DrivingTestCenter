import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { appConfig } from "../../configs";
import { APIFetcher } from "../../_helper/fetchAPI";
import { useFetchWrapper } from "../../_helper/fetchWrapper";
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
                    setUser(data.student);
                    return;
                }
                if (data.employee) {
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