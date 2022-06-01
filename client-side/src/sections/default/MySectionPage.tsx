import { useFormik } from "formik"
import { MyResponse } from "../../api/service"

interface Props{
    onLoadData: ()=> Promise<MyResponse>
}

export const MySectionPage : React.FC<Props> = (props)=> {
    //const formik = useFormik()
    return <div></div>
}