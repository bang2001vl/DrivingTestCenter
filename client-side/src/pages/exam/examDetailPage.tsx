import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomizedTabs from "../../components/tabs";
import { DialogHelper } from "../../singleton/dialogHelper";
import { EDIT_METHOD } from "../../_enums";
import ExamTestPage from "../examTest/examTestPage";
import { ExamCreateUI } from "./examCreateUI";

interface IProps {

}

export const ExamDetailPage : FC<IProps> = ()=>{
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const key = searchParams.get("id");
    if(!key){
        navigate("/", {replace: true});
        DialogHelper.showAlert("Not found id");
    }

    return <CustomizedTabs
        listtab={["Thông tin", "Quản lý lớp", "Quản lý ca thi"]}
    >
        <ExamCreateUI method={EDIT_METHOD.update}/>
        <ExamTestPage filter={{
            examId: key
        }}/> 
    </CustomizedTabs>
}