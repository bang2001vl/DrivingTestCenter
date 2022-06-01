import { TextField, TextFieldProps } from "@mui/material"
import { FC } from "react"

interface IProps {
    formik: any,
    fieldName: string,
}
export const FormIkNumberField: FC<IProps & TextFieldProps> = (props) => {
    let value = props.formik.values[props.fieldName];
    if (value) {
        value = Number(value).toLocaleString('en-US');
    }

    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    function handleChange(ev: any) {
        const value = ev.target.value;
        if (!value || value === "") {
            props.formik.setFieldValue([props.fieldName], 0);
            return;
        }

        const cleanvalue = value.replaceAll(',', '');
        if (!isNaN(Number(cleanvalue))) {
            props.formik.setFieldValue([props.fieldName], Number(cleanvalue));
            return;
        }
    }

    return <TextField
        name={props.fieldName}
        value={value}
        onChange={handleChange}
        error={props.formik.touched[props.fieldName] && Boolean(props.formik.errors[props.fieldName])}
        helperText={props.formik.touched[props.fieldName] && props.formik.errors[props.fieldName]}
        {...customProps}
    />
}