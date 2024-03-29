import { TextField } from "@mui/material";
import { DateTimePicker, DateTimePickerProps } from "@mui/lab";
import { FC } from "react";
import isValid from "date-fns/isValid";

interface IProps<TDate = unknown> extends Partial<DateTimePickerProps<TDate>> {
    formik: any, 
    fieldName: string,
}
export const FormIkDateTimePicker: FC<IProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;
    return <DateTimePicker
        inputFormat="dd/MM/yyyy hh:mm"
        value={new Date(props.formik.values[props.fieldName])}
        onChange={(date :any) => {
            if (date && isValid(date)) {
                props.formik.setFieldValue(props.fieldName, date.toISOString());
            }
            else{
                props.formik.setFieldError(props.fieldName, "Thời gian không hợp lệ");
            }
        }}
        renderInput={(params) => <TextField
            {...params}
            style={{width:"100%"}}
            error={props.formik.touched[props.fieldName] && Boolean(props.formik.errors[props.fieldName])}
            helperText={props.formik.touched[props.fieldName] && props.formik.errors[props.fieldName]}
        />}
        {...customProps}
    />
}