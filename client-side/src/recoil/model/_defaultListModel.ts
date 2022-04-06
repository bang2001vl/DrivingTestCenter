import { atom, selector } from "recoil"

export interface IListModel{
    orderType: string; // "ASC" | "DESC" ...
    searchProperty: string; // "name" | "id" ...
    searchValue: string;
    filterOptions?: any;
    datas: any[];
}

// export function buildListModel<T1 extends IListModel, T2>(customKey: string){
//     const rsAtom = atom<T1>({
//         key: customKey,
//     });
//     const rsDataSelector = selector<T2[]>({
//         key: `${customKey}_dataSelector`,
//         get: ({get})=>{
//             return get(rsAtom).datas;
//         }
//     });
//     return {
//         atom: rsAtom,
//         dataSelector: rsDataSelector
//     }
// }

export function buildListModel<T>(customKey: string){
    return atom<T[]>({
        key: customKey,
        default: [],
    })
}