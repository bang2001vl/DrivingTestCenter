import { Stack, StackProps, TextFieldProps } from "@mui/material"
import { FC } from "react"
import { decodeAddress, encodeAddress, getDVHC_Lv1, getDVHC_Lv2, getDVHC_Lv3 } from "../../../_helper/address"
import { IFormIK } from "../../../_interfaces/formik"
import { FormIkSelect } from "../Select"

interface IProps {
    formik: IFormIK,
    fieldName: string,
    propsItem?: TextFieldProps,
    propsStack?: StackProps,
}
export const FormIkAddress: FC<IProps> = (props) => {
    console.log("Address render", props.formik.values[props.fieldName]);

    const address = decodeAddress(props.formik.values[props.fieldName]);
    const lv1s = getDVHC_Lv1();
    console.log("Render Address", address);

    const lv2s = getDVHC_Lv2(address[0]);
    const lv3s = getDVHC_Lv3(address[0], address[1]);
    return <Stack {...props.propsStack}>
        <FormIkSelect formik={props.formik} fieldName={props.fieldName}
            label={"Chọn tỉnh/ thành phố"}
            options={lv1s}
            onChange={(ev) => {
                //console.log("Onchange with ", ev);
                props.formik.setFieldValue(props.fieldName, encodeAddress([ev.target.value]));
            }}
            value={address[0]}
            {...props.propsItem}
        />

        <FormIkSelect formik={props.formik} fieldName={props.fieldName}
            label={"Chọn quận/ huyện"}
            options={lv2s}
            onChange={(ev) => {
                //console.log("Onchange with ", ev);
                props.formik.setFieldValue(props.fieldName, encodeAddress([address[0], ev.target.value]));
            }}
            value={address[1]}
            {...props.propsItem}
        />
        <FormIkSelect formik={props.formik} fieldName={props.fieldName}
            label={"Chọn xã/ phường"}
            options={lv3s}
            onChange={(ev) => {
                //console.log("Onchange with ", ev);
                props.formik.setFieldValue(props.fieldName, encodeAddress([address[0], address[1], ev.target.value]));
            }}
            value={address[2]}
            {...props.propsItem}
        />
    </Stack>
}