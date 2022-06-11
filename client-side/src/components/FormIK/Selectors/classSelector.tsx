import { Box, Container, FormControl, FormControlProps, FormHelperText, FormLabel, InputLabel, MenuItem, Stack, TextField } from "@mui/material";
import { FC, useState } from "react";
import { components, GroupBase, ValueContainerProps } from "react-select";
import AsyncSelect from 'react-select/async';
import { AsyncAdditionalProps } from "react-select/dist/declarations/src/useAsync";
import { appConfig } from "../../../configs";
import useAPI from "../../../hooks/useApi";
import { BasicFormIKModelSelector, BasicFormIKModelSelectorProps } from "./_modelSelector";

interface IProps{
    formik: any,
    fieldName: string,
}
export const FormIKClassSelector: FC<IProps & Partial<BasicFormIKModelSelectorProps>> = (props) => {
    
    return <BasicFormIKModelSelector
        getURL={(input)=>`${appConfig.backendUri}/course/select?searchvalue=${String(input)}&searchby=name&orderby=name&orderdirection=asc&start=0&count=10`}
        {...props}
    />
}