import { MenuItem, TextField, TextFieldProps } from "@mui/material"
import { FC } from "react"
import { optionCSS } from "react-select/dist/declarations/src/components/Option"
import { IFormIK } from "../../../_interfaces/formik"
import { ISelectable } from "../../../_interfaces/selectable"
import { FormIkSelect, FormIkSelectProps } from "../Select"

interface IProps<T = any> {
    formik: any, fieldName: string,
}

const Rooms = [
    "Phòng A.1",
    "Phòng A.2",
    "Phòng A.3",
    "Phòng A.4",
    "Phòng A.5",
    "Phòng B.1",
    "Phòng B.2",
    "Phòng B.3",
    "Phòng B.4",

]
export const FormIkRoom: FC<IProps & TextFieldProps> = (props) => {
    return <FormIkSelect
        options={Rooms.map((txt, index) => ({
            label: txt,
            value: txt,
        }))
        }
        {...props}
    />
}