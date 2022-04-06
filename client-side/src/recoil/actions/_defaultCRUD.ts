import { RecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { APIFetcher } from "../../_helper/fetchAPI";
import { authAtom } from "../model/auth";

export default function buildCRUDAction(atom: RecoilState<any>, path: string){
    return ()=>{
        const auth = useRecoilValue(authAtom);
        const setAtom = useSetRecoilState(atom);
        return {
            create(data: any){
                const body = {
                    data: data
                }
                return APIFetcher.post(`${path}/create`, body, auth?.token);
            },
            
            update(key: any, data: any){
                const body = {
                    key: key,
                    data: data
                }
                return APIFetcher.put(`${path}/update`, body, auth?.token);
            },

            delete(keys: any[]){
                const body = {
                    keys: keys,
                }
                return APIFetcher.delete(`${path}/delete`, body, auth?.token);
            },

            list(keys: any[]){
                const body = {
                    keys: keys,
                }
                return APIFetcher.get(`${path}/list`, body);
            },

            range(start: number, count: number){
                const body = {
                    start,
                    count,
                }
                return APIFetcher.get(`${path}/range`, body);
            },

            count(){
                return APIFetcher.get(`${path}/count`, undefined);
            },
        }
    }
}