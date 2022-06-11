import { DatePicker, DatePickerProps, LocalizationProvider } from "@mui/lab"
import { TextField, TextFieldProps } from "@mui/material"
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import isValid from "date-fns/isValid";
import { vi } from "date-fns/locale"
import { FC } from "react"

interface IProps<TDate = Date> extends Partial<DatePickerProps<TDate>> {
    formik: any,
    fieldName: string,
    textProps?: TextFieldProps,
}
export const FormIkDatePicker: FC<IProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;
    return <LocalizationProvider locale={vi} dateAdapter={AdapterDateFns}>
        <DatePicker
            inputFormat="dd/MM/yyyy"

            value={new Date(props.formik.values[props.fieldName])}
            onChange={(date: any) => {
                if (date && isValid(date)) {
                    props.formik.setFieldValue(props.fieldName, date.toISOString());
                }
                else{
                    props.formik.setFieldError(props.fieldName, "Thời gian không hợp lệ");
                }
            }}
            renderInput={(params) => <TextField
                {...params}
                error={props.formik.touched[props.fieldName] && Boolean(props.formik.errors[props.fieldName])}
                helperText={props.formik.touched[props.fieldName] && props.formik.errors[props.fieldName]}
                {...props.textProps}
                fullWidth
            />}
            {...customProps}
        />
    </LocalizationProvider>
}