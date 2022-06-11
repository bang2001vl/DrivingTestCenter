import { MenuItem, TextField, TextFieldProps } from "@mui/material"
import { FC } from "react"
import Rooms from "../../../_mocks_/rooms"
import { FormIkSelect, FormIkSelectProps } from "../Select"

interface IProps<T = any> {
    formik: any, fieldName: string,
}


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