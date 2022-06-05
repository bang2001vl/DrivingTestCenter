import { FormControl, FormControlProps, FormHelperText, InputLabel } from "@mui/material";
import { Formik } from "formik";
import { FC } from "react"
import { IFormIK } from "../../_interfaces/formik";
import { AvatarUpload, AvatarUploadProps } from "../ImageUpload";

interface IProps {
    formik: IFormIK, fieldName: string,
    label?: string,
    propFormControl?: FormControlProps,
}
export const FormIkAvatar: FC<IProps & AvatarUploadProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    return <FormControl
        error={Boolean(props.formik.errors[props.fieldName])}
        {...props.propFormControl}
    >
        {/* <InputLabel>{props.label}</InputLabel> */}
        <AvatarUpload
            value={props.formik.values[props.fieldName]}
            onChange={(ev: any)=>{
                ev.preventDefault();
                if (ev.currentTarget.files === null) {
                    //setAvatarImage(null);
                    return;
                }
                if (ev.currentTarget.files[0]) {
                    const file = ev.currentTarget.files[0];

                    props.formik.setFieldValue(props.fieldName, file);
                }
            }}
            {...customProps}
        >
        </AvatarUpload>
        <FormHelperText>{props.formik.errors[props.fieldName]}</FormHelperText>
    </FormControl>;
}