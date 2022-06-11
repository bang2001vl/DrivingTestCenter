import { MenuItem, TextField, TextFieldProps } from "@mui/material"
import { FC } from "react"
import { optionCSS } from "react-select/dist/declarations/src/components/Option"
import { IFormIK } from "../../../_interfaces/formik"
import { ISelectable } from "../../../_interfaces/selectable"
import { FormIkSelect } from "../Select"

interface IProps<T = any> {
    formik: IFormIK, fieldName: string,
}
export const FormIkType: FC<IProps & TextFieldProps> = (props) => {
    const customProps: any = {
        ...props,
    }
    delete customProps.formik;
    delete customProps.fieldName;

    return <FormIkSelect
        options={[
            {
                label: "A1",
                value: "A1"
            },
            {
                label: "A2",
                value: "A2"
            },
            {
                label: "B1",
                value: "B1"
            },
            {
                label: "B2",
                value: "B2"
            },
            {
                label: "C",
                value: "C"
            }
        ]}
        {...props}
    />
}