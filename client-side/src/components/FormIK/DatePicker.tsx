import { DatePicker, DatePickerProps } from "@mui/lab"
import { TextField } from "@mui/material"
import { FC } from "react"

interface IProps<TDate = unknown> extends Partial<DatePickerProps<TDate>> {
    formik: any, 
    fieldName: string,
}
export const FormIkDatePicker: FC<IProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;
    return <DatePicker
        value={new Date(props.formik.values[props.fieldName])}
        onChange={(newDate: any) => {
            if (newDate) {
                props.formik.setFieldValue([props.fieldName], new Date(newDate).toISOString());
            }
        }}
        renderInput={(params) => <TextField
            {...params}
            error={props.formik.touched[props.fieldName] && Boolean(props.formik.errors[props.fieldName])}
            helperText={props.formik.touched[props.fieldName] && props.formik.errors[props.fieldName]}
        />}
        {...customProps}
    />
}