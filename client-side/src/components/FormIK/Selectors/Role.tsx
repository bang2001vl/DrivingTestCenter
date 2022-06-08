import { TextFieldProps } from "@mui/material"
import { FC } from "react"
import { IFormIK } from "../../../_interfaces/formik"
import { FormIkSelect } from "../Select"

interface IProps<T = any> {
    formik: IFormIK, fieldName: string,
}
export const FormIkRole: FC<IProps & TextFieldProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    return <FormIkSelect
        options={[
            {
                label: "Học sinh",
                value: 1
            },
            {
                label: "Giảng viên",
                value: 2
            },
        ]}
        {...props}
    />
}