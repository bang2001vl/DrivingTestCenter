import { TextField, TextFieldProps } from "@mui/material"
import { FC } from "react"

interface IProps {
    formik: any, fieldName: string
}
export const FormIkTextField: FC<IProps & TextFieldProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    return <TextField
        name={props.fieldName}
        value={props.formik.values[props.fieldName]}
        onChange={props.formik.handleChange}
        error={props.formik.touched[props.fieldName] && Boolean(props.formik.errors[props.fieldName])}
        helperText={props.formik.touched[props.fieldName] && props.formik.errors[props.fieldName]}
        {...customProps}
    />
}