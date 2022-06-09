import { FC, useState } from "react";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { BasicModelPicker, BasicModelPickerProps } from "./_modelPicker";

export const ExamPicker: FC<Partial<BasicModelPickerProps>> = (props) => {
    const api = useAPI();
    return <BasicModelPicker
        loadOption={async (input) => {
            const res = await api.getWithToken(
                `${appConfig.backendUri}/exam/select?searchvalue=${String(input)}&searchby=name&orderby=name&orderdirection=asc&start=0&count=5`,
            );
            if (res.result && res.data) {
                res.data = res.data.map((e: any) => ({
                    label: e.name,
                    value: e
                }));
            }
            return res;
        }}
        {...props}
    />
}