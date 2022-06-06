import { MenuItem, TextField, TextFieldProps } from "@mui/material"
import { FC } from "react"
import { optionCSS } from "react-select/dist/declarations/src/components/Option"
import { IFormIK } from "../../_interfaces/formik"
import { ISelectable } from "../../_interfaces/selectable"

export interface FormIkSelectProps<T = any> {
    formik: IFormIK, fieldName: string,
    options: ISelectable<T>[],
}
export const FormIkSelect: FC<FormIkSelectProps & TextFieldProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    return <TextField
        select
        name={props.fieldName}
        value={props.formik.values[props.fieldName]}
        onChange={(ev)=>{
            props.formik.setFieldValue(props.fieldName, ev.target.value);
        }}
        error={props.formik.touched[props.fieldName] && Boolean(props.formik.errors[props.fieldName])}
        helperText={props.formik.touched[props.fieldName] && props.formik.errors[props.fieldName]}
        {...customProps}
    >
        {props.options.map(e=>(<MenuItem key={e.label} value={e.value}>{e.label}</MenuItem>))}
    </TextField>
}