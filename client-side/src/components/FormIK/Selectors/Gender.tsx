import { MenuItem, TextField, TextFieldProps } from "@mui/material"
import { FC } from "react"
import { optionCSS } from "react-select/dist/declarations/src/components/Option"
import { IFormIK } from "../../../_interfaces/formik"
import { ISelectable } from "../../../_interfaces/selectable"
import { FormIkSelect } from "../Select"

interface IProps<T = any> {
    formik: IFormIK, fieldName: string,
}
export const FormIkGender: FC<IProps & TextFieldProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    return <FormIkSelect
        options={[
            {
                label: "Nữ",
                value: 0
            },
            {
                label: "Nam",
                value: 1
            }
        ]}
        {...props}
    />
}