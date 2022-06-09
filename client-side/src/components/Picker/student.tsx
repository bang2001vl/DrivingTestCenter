import { FC, useState } from "react";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { BasicModelPicker, BasicModelPickerProps } from "./_modelPicker";

interface IProps{
    filterClassId? :any;
    filterExamTestId? :any;
}
export const StudentPicker: FC<IProps & Partial<BasicModelPickerProps>> = (props) => {
    const api = useAPI();

    const filterClassId = props.filterClassId ? `notHaveClassId=${String(props.filterClassId)}&` : "";
    const filterExamTestId = props.filterExamTestId ? `notHaveExamTestId=${String(props.filterExamTestId)}&` : "";
    return <BasicModelPicker
        loadOption={async (input) => {
            const res = await api.getWithToken(
                `${appConfig.backendUri}/account/manager/select?roleId=1&${filterClassId}${filterExamTestId}searchvalue=${String(input)}&searchby=fullname&orderby=fullname&orderdirection=asc&start=0&count=5`
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