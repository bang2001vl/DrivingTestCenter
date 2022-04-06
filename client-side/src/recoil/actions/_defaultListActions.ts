import { RecoilState, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { APIFetcher } from "../../_helper/fetchAPI";
import { authAtom } from "../model/auth";
import { IListModel } from "../model/_defaultListModel";

interface IOrderOptions{
    direction: string; // "ASC" | "DESC" ...
    property: string
}

interface ISearchOption{
    property: string; // "name" | "id" ...
    value: string;
}

interface IPagingOption{
    start: number,
    count: number,
}

export interface IListAction {
    select(search: ISearchOption, order: IOrderOptions, paging: IPagingOption, filter: any, needToken?: boolean): Promise<any[]>;
    create(data: any): Promise<any[]>;
    update(key: any, data: any): Promise<any[]>;
    delete(datas: any[], pkName?: string): Promise<any>;
}

export default function buildListAction(atomList: RecoilState<any[]>, path: string){
    return ()=>{
        const auth = useRecoilValue(authAtom);
        const [list, setAtomList] = useRecoilState(atomList);
        return {
            count(){
                return APIFetcher.get(`${path}/count`, undefined);
            },

            async select(search: ISearchOption, order: IOrderOptions, paging: IPagingOption, filter: any = undefined, needToken = true){
                const body = {
                    search,
                    order,
                    paging,
                    filter,
                }
                console.log("Select body = ");
                console.log(body);
                
                const [error, responseData] = await APIFetcher.post(`${path}/select`, body, (needToken && auth) ? auth?.token : undefined);
                if(!error){
                    const datas = responseData.result
                    setAtomList(datas);
                    return [null, datas];
                }
                return [error, null];
            },

            async create(data: any){
                const body = {
                    data: data
                }
                return APIFetcher.post(`${path}/create`, body, auth?.token);
            },
            
            async update(key: any, data: any){
                const body = {
                    key: key,
                    data: data
                }
                return APIFetcher.put(`${path}/update`, body, auth?.token);
            },

            async delete(datas: any[], pkName: string = "id"){
                const keys = datas.map(e => e[pkName]);
                const body = {
                    keys: keys,
                }
                return await APIFetcher.delete(`${path}/delete`, body, auth?.token);
            },
        }
    }
}