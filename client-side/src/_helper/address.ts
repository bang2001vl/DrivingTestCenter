import dvhc from "../assets/dvhcvn.json"
const provinces = dvhc.data.map(e =>{
    return {
        label: e.name,
        value: e.name,
    }
});

export function getDVHC_Lv1(){
    return provinces;
}

export function getDVHC_Lv2(province: string){
    if (!province) return [];
        const lv1 = dvhc.data.find(e => e.name === province);
        if (!lv1) return [];

        return lv1.level2s.map(e => {
            return {
                value: e.name,
                label: e.name,
            }
        });
}

export function getDVHC_Lv3(province?: string, district?: string){
    if (!province) return [];
        if (!district) return [];

        const lv1 = dvhc.data.find(e => e.name === province);
        if (!lv1) return [];

        const lv2 = lv1.level2s.find(e => e.name === district);
        if (!lv2) return [];

        return lv2.level3s.map(e => {
            return {
                value: e.name,
                label: e.name,
            }
        });
}

export function encodeAddress(address: string[]){
    return address.join(", ");
}

export function decodeAddress(address: string){
    return address.split(", ");
}

export default provinces;