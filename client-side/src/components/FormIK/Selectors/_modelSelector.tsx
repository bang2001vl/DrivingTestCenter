import { Box, Container, FormControl, FormControlProps, FormHelperText, FormLabel, InputLabel, MenuItem, Stack, TextField } from "@mui/material";
import { type } from "os";
import { FC, useState } from "react";
import { components, GroupBase, ValueContainerProps } from "react-select";
import AsyncSelect from 'react-select/async';
import { AsyncAdditionalProps } from "react-select/dist/declarations/src/useAsync";
import { appConfig } from "../../../configs";
import useAPI from "../../../hooks/useApi";
import palette from "../../../theme/palette";

interface IProps<T = any>{
    formik: any,
    fieldName: string,
    getURL: (input: string) => string,
    label?: string,
    placeholder?: string,
    propFormControl?: FormControlProps;
}
interface IOption<T = any> {
    label: string,
    value: T
}

export type BasicFormIKModelSelectorProps<T = any> = IProps<T> & AsyncAdditionalProps<IOption<T>, GroupBase<IOption<T>>>;
const routeName = "exam";
export const BasicFormIKModelSelector: FC<BasicFormIKModelSelectorProps> = (props) => {
    const api = useAPI();

    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    async function loadOption(inputValue: string) {
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

    // console.log("Error", props.formik.touched[props.fieldName],Boolean(props.formik.errors[props.fieldName]));
    // console.log("HelperText", props.formik.touched[props.fieldName],props.formik.errors[props.fieldName]);
 

    return <FormControl
        error={Boolean(props.formik.errors[props.fieldName])}
        {...props.propFormControl}
    >
        <InputLabel>{props.label}</InputLabel>
        <AsyncSelect
            placeholder={props.placeholder}
            defaultOptions={true}
            loadOptions={loadOption}
          
            value={props.formik.values[props.fieldName]}
            onChange={(option, action) => {
                props.formik.setFieldValue([props.fieldName], option)
            }}

            styles={{
                menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
                control: (base, state) => ({
                    ...base,
                    borderRadius: "8px",
                    height: "56px",
                    minWidth: "100%",
                    textAlign: "start",
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
                })
            }}
        />
        <FormHelperText>{props.formik.errors[props.fieldName]}</FormHelperText>
    </FormControl>
}