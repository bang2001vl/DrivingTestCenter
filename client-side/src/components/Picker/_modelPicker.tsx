import { Box, Card, Container, Stack } from "@mui/material";
import { FC, useState } from "react";
import { ActionMeta, GroupBase, MultiValue } from "react-select";
import AsyncSelect from 'react-select/async';
import { AsyncAdditionalProps } from "react-select/dist/declarations/src/useAsync";
import { CommonButton } from "../../components/Buttons/common";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";

export interface BasicModelPickerProps {
    getURL: (input: string) => string,
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
export const BasicModelPicker: FC<BasicModelPickerProps> = (props) => {
    const [value, setValue] = useState<any>();
    const api = useAPI();

    async function loadOption(inputValue: string): Promise<IOption[]> {
        const res = await api.get(props.getURL(inputValue));
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

    return <Card style={{ minWidth: 400, minHeight: 1 }}>
        <Stack>
            <AsyncSelect
                loadOptions={loadOption}
                isMulti={props.isMulti}
                value={value}
                onChange={handleOnChange}
                styles={{
                    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                    menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    control: (base, state) => ({
                        ...base,
                        borderRadius: "8px",
                        height: "56px",
                        minWidth: "100%",
                        textAlign: "left",
                        paddingLeft: "8px",
                        zIndex: '9999',
                        borderColor: state.isFocused ? "green" : "lightGray",
                        boxShadow: state.isFocused ? "none" : "none",
                        '&:hover': {
                            boxShadow: state.isFocused ? "none" : "none"
                        }
                    }),
                    option: (base)=>({
                        ...base,
                        textAlign: "left",
                    }),
                }}
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
                    Xác nhận
                </CommonButton>
                <CommonButton
                    sx={{ width: "45%" }}
                    onClick={() => {
                        if (props.onClose) {
                            props.onClose();
                        }
                    }}
                >
                    Hủy
                </CommonButton>
            </Stack>
        </Stack>
    </Card>
}