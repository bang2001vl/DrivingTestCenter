import { Box, Container, Stack } from "@mui/material";
import { FC, useState } from "react";
import { ActionMeta, GroupBase, MultiValue } from "react-select";
import AsyncSelect from 'react-select/async';
import { AsyncAdditionalProps } from "react-select/dist/declarations/src/useAsync";
import { CommonButton } from "../../components/Buttons/common";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";

interface IProps<T = any> {
    title?: string,
    isMulti?: boolean,
    onSubmit?: (value: MultiValue<any>) => void,
    onClose?: () => void,
    propSelect?: AsyncAdditionalProps<any, GroupBase<any>>
}
interface IOption<T = any> {
    label: string,
    value: T
}
export const ExamSelector: FC<IProps> = (props) => {
    const [value, setValue] = useState<any>();
    const api = useAPI();

    async function loadOption(inputValue: string): Promise<IOption[]> {
        const params = new URLSearchParams({
            searchvalue: inputValue,
            searchby: "name",
            orderby: "name",
            orderdirection: "asc",
            start: 0,
            count: 10,
        } as any).toString();
        const res = await api.get(appConfig.backendUri + `/exam/select?${params}`);
        if (res.result && res.data) {
            return res.data.map((e: any) => ({
                label: e.name,
                value: e,
            }))
        }
        else {
            console.log("HAVE ERROR", res);
            return [];
        }
    }

    function handleOnChange(newValue: MultiValue<any>, actionMeta: ActionMeta<any>) {
        setValue(newValue);
    }

    return <Stack justifyContent={"space-between"} style={{ minWidth: 400, minHeight: 1 }}>
        <AsyncSelect
            defaultOptions={[]}
            loadOptions={loadOption}
            isMulti={props.isMulti}
            value={value}
            onChange={handleOnChange}
            {...props.propSelect}
        />
        <Stack direction="row" justifyContent={"space-between"} style={{ fontSize: 14, marginTop: "20px" }}>
            <CommonButton
                sx={{ width: "45%" }}
                onClick={() => {
                    if (props.onSubmit) {
                        props.onSubmit(value);
                    }
                }}
            >
                Submit
            </CommonButton>
            <CommonButton
                sx={{ width: "45%" }}
                onClick={() => {
                    if (props.onClose) {
                        props.onClose();
                    }
                }}
            >
                Cancel
            </CommonButton>
        </Stack>
    </Stack>
}