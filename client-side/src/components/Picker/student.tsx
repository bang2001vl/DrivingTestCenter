import { FC, useState } from "react";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { BasicModelPicker, BasicModelPickerProps } from "./_modelPicker";

interface IProps{
    filterClassId? :any;
    filterExamTestId? :any;
    filterExamId? :any;
}
export const StudentPicker: FC<IProps & Partial<BasicModelPickerProps>> = (props) => {
    const api = useAPI();
    
    return <BasicModelPicker
        loadOption={async (input) => {
            const params = new URLSearchParams({
                searchby: "fullname",
                searchvalue: String(input),
                orderby: "fullname",
                orderdirection: "asc",
                start: String(0),
                count: String(5),
                roleId: "1",
            });
            
            if(props.filterClassId){
                params.append("notHaveClassId", String(props.filterClassId));
            }
            if(props.filterExamTestId){
                params.append("notHaveExamTestId", String(props.filterExamTestId));
            }
            if(props.filterExamId){
                params.append("notHaveExamId", String(props.filterExamId));
            }

            const res = await api.getWithToken(
                `${appConfig.backendUri}/account/manager/select?${params.toString()}`
            );
            if (res.result && res.data) {
                res.data = res.data.map((e: any) => ({
                    label: e.fullname,
                    value: e
                }));
            }
            return res;
        }}
        {...props}
    />
}