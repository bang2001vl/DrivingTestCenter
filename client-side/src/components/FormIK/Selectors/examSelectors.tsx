import { Box, Container, FormControl, FormControlProps, FormHelperText, FormLabel, InputLabel, MenuItem, Stack, TextField } from "@mui/material";
import { FC, useState } from "react";
import { components, GroupBase, ValueContainerProps } from "react-select";
import AsyncSelect from 'react-select/async';
import { AsyncAdditionalProps } from "react-select/dist/declarations/src/useAsync";
import { appConfig } from "../../../configs";
import useAPI from "../../../hooks/useApi";
import palette from "../../../theme/palette";

interface IProps<T = any> extends AsyncAdditionalProps<IOption<T>, GroupBase<IOption<T>>> {
    formik: any,
    fieldName: string,
    label?: string,
    placeholder?: string,
    propFormControl?: FormControlProps;
}
interface IOption<T = any> {
    label: string,
    value: T
}
const routeName = "exam";
export const FormIKExamSelector: FC<IProps> = (props) => {
    const api = useAPI();

    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    async function loadOption(inputValue: string) {
        const params = new URLSearchParams({
            searchvalue: inputValue,
            searchby: "name",
            orderby: "name",
            orderdirection: "asc",
            start: 0,
            count: 10,
        } as any).toString();
        const res = await api.get(`${appConfig.backendUri}/${routeName}/select?${params}`);
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
            defaultOptions={[]}
            loadOptions={loadOption}
          
            value={props.formik.values[props.fieldName]}
            onChange={(option, action) => {
                props.formik.setFieldValue([props.fieldName], option)
            }}

            styles={{
                control: (base, state) => ({
                    ...base,
                    borderRadius: "8px",
                    height: "56px",
                    minWidth: "100%",
                    textAlign: "left",
                    paddingLeft: "8px",
                    borderColor: state.isFocused ? "green" : "lightGray",
                    boxShadow: state.isFocused ? "none" : "none",
                    '&:hover': {
                        boxShadow: state.isFocused ? "none" : "none"
                    }
                })
            }}
        />
        <FormHelperText>{props.formik.errors[props.fieldName]}</FormHelperText>
    </FormControl>
}