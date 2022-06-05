import { DatePicker, DatePickerProps } from "@mui/lab"
import { MenuItem, Stack, StackProps, TextField, TextFieldProps } from "@mui/material"
import { FC } from "react"
import { decodeAddress, encodeAddress, getDVHC_Lv1, getDVHC_Lv2, getDVHC_Lv3 } from "../../../_helper/address"
import { IFormIK } from "../../../_interfaces/formik"

interface IProps {
    formik: IFormIK,
    fieldName: string,
    propsItem?: TextFieldProps,
    propsStack?: StackProps,
}
export const FormIkAddress: FC<IProps> = (props) => {
    const address = props.formik.values[props.fieldName] ? decodeAddress(props.formik.values[props.fieldName]) : [];
    const lv1s = getDVHC_Lv1();
    const lv2s = getDVHC_Lv2(address[0]);
    const lv3s = getDVHC_Lv3(address[0], address[1]);
    return <Stack {...props.propsStack}>
        <TextField
            select
            onChange={(ev) => {
                console.log("Onchange with ", ev);
                props.formik.setFieldValue(props.fieldName, encodeAddress([ev.target.value]));
            }}
            value={address[0] ? lv1s.find(e => e.value === address[0]) : undefined}
            label={"Chọn tỉnh/ thành phố"}
            {...props.propsItem}
        >
            {lv1s.map(e => (<MenuItem key={e.label} value={e.label}>{e.label}</MenuItem>))}
        </TextField>

        <TextField
            select
            onChange={(ev) => {
                console.log("Onchange with ", ev);
                props.formik.setFieldValue(props.fieldName, encodeAddress([address[0], ev.target.value]));
            }}
            value={address[1] ? lv1s.find(e => e.value === address[1]) : undefined}
            label={"Chọn quận/ huyện"}
            {...props.propsItem}
        >
            {lv2s.map(e => (<MenuItem key={e.label} value={e.label}>{e.label}</MenuItem>))}
        </TextField>

        <TextField
            select
            onChange={(ev) => {
                console.log("Onchange with ", ev);
                props.formik.setFieldValue(props.fieldName, encodeAddress([address[0], address[1], ev.target.value]));
            }}
            value={address[2] ? lv1s.find(e => e.value === address[2]) : undefined}
            label={"Chọn xã/ phường"}
            {...props.propsItem}
        >
            {lv3s.map(e => (<MenuItem key={e.label} value={e.label}>{e.label}</MenuItem>))}
        </TextField>
    </Stack>
}