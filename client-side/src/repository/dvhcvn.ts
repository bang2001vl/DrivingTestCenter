import dvhcvn from "../assets/dvhcvn.json";

interface DVHCVN_Lv1 {
    "level1_id": string,
    "name": string,
    "type": string,
    "level2s": DVHCVN_Lv2[]
}

interface DVHCVN_Lv2 {
    "level2_id": string,
    "name": string,
    "type": string,
    "level3s": DVHCVN_Lv3[]
}

interface DVHCVN_Lv3 {
    "level3_id": string,
    "name": string,
    "type": string,
}

export class DVHCVN {
    data = dvhcvn.data;
    getLv1(): DVHCVN_Lv1[] {
        return dvhcvn.data;
    }
    
    getLv2(lv1: DVHCVN_Lv1): DVHCVN_Lv2[] {
        return lv1.level2s;
    }
    
    getLv3(lv2: DVHCVN_Lv2): DVHCVN_Lv3[]{
        return lv2.level3s;
    }

    getLv2ById(lv1_id: string): DVHCVN_Lv2[] | null {
        this.data.forEach((lv1)=>{
            if(lv1.level1_id === lv1_id){
                return this.getLv2(lv1);
            }
        });
        return null;
    }

    getLv3ById(lv1_id: string, lv2_id: string): DVHCVN_Lv2[] | null {
        let lv2_list = this.getLv2ById(lv1_id);
        if(lv2_list == null) return null;

        lv2_list.forEach((lv2)=>{
            if(lv2.level2_id === lv2_id){
                return this.getLv3(lv2);
            }
        });
        return null;
    }
}