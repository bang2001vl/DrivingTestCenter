import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EmployeePicker } from "../../components/Picker/employee";
import { StudentPicker } from "../../components/Picker/student";
import CustomizedTabs from "../../components/tabs";
import { appConfig } from "../../configs";
import { useRootDialog } from "../../hooks/rootDialog";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { EDIT_METHOD } from "../../_enums";
import AccountManagerPage from "../accountManager/AccountManagerPage";
import { CoursesCreate } from "./CoursesCreate";

interface IProps {

}
let tempSelect = ()=>{};
export const CourseDetailPage: FC<IProps> = (props) => {
    const [searchParams] = useSearchParams();
    const [oldData, setOldData] = useState<any>({});

    const rootDialog = useRootDialog();
    const navigate = useNavigate();
    const api = useAPI();

    useEffect(() => {
        const key = searchParams.get("id");
        if (!key) {
            navigate("/", { replace: true });
            DialogHelper.showAlert("Not found id");
        }
        else {
            api.getWithToken(
                `${appConfig.backendUri}/course/select?${new URLSearchParams({
                    searchvalue: "",
                    searchby: "name",
                    orderby: "name",
                    orderdirection: "asc",
                    start: "0",
                    count: "1",
                    id: String(searchParams.get("id")),
                }).toString()}`,
            ).then(res => {
                if (res.result) {
                    console.log("Set OldData", res.data[0]);
                    setOldData(res.data[0]);
                }
            })
        }
    }, [searchParams.get("id")]);

    return <div>
        <CustomizedTabs
            listtab={["Thông tin", "Quản lý học viên", , "Quản lý giảng viên"]}
        >
            <CoursesCreate
                hideTitle
                method={EDIT_METHOD.update}
            />
            <AccountManagerPage
                hideTitle
                filter={oldData ? {
                    roleId: 1,
                    classId: oldData.id,
                } : undefined}
                tableProps={{
                    onEdit: undefined,
                    onDelete: async (item)=>{
                        const data = {
                            classId: oldData.id,
                            employeeIdList: [item.id],
                        }
                        const res = await api.postWithToken(`${appConfig.backendUri}/cnn/delete/class/employees`, data);
                        if (res.result) {
                            rootDialog.closeDialog();
                            if(tempSelect){tempSelect();}
                            DialogHelper.showAlert("Success");
                        }
                        else {
                            DialogHelper.showAlert(res.errorMessage);
                        }
                    }
                }}
                onClickCreate={(select) => {
                    tempSelect = select;
                    rootDialog.openDialog({
                        children: <StudentPicker
                            isMulti
                            title="Chọn học sinh"
                            filterClassId={oldData.id}
                            onSubmit={async (selected) => {
                                const data = {
                                    classId: oldData.id,
                                    studentIdList: selected.map(e => e.value.id)
                                };

                                const res = await api.postWithToken(
                                    `${appConfig.backendUri}/cnn/join/class/students`,
                                    data
                                );

                                if (res.result) {
                                    rootDialog.closeDialog();
                                    select();
                                    DialogHelper.showAlert("Success");
                                }
                                else {
                                    DialogHelper.showAlert(res.errorMessage);
                                }
                            }}
                            onClose={() => rootDialog.closeDialog()}
                        />
                    });
                }}
            />
            <AccountManagerPage
                hideTitle
                filter={oldData ? {
                    roleId: 2,
                    classId: oldData.id,
                } : undefined}
                tableProps={{
                    onEdit: undefined,
                    onDelete: async (item)=>{
                        const data = {
                            classId: oldData.id,
                            employeeIdList: [item.id],
                        }
                        const res = await api.postWithToken(`${appConfig.backendUri}/cnn/delete/class/employees`, data);
                        if (res.result) {
                            rootDialog.closeDialog();
                            if(tempSelect){tempSelect();}
                            DialogHelper.showAlert("Success");
                        }
                        else {
                            DialogHelper.showAlert(res.errorMessage);
                        }
                    }
                }}
                onClickCreate={(select) => {
                    tempSelect = select;
                    rootDialog.openDialog({
                        children: <EmployeePicker
                            isMulti
                            title="Chọn nhân viên"
                            filterClassId={oldData.id}
                            onSubmit={async (selected) => {
                                const data = {
                                    classId: oldData.id,
                                    employeeIdList: selected.map(e => e.value.id)
                                };

                                const res = await api.postWithToken(
                                    `${appConfig.backendUri}/cnn/join/class/employees`,
                                    data
                                );

                                if (res.result) {
                                    rootDialog.closeDialog();
                                    select();
                                    DialogHelper.showAlert("Success");
                                }
                                else {
                                    DialogHelper.showAlert(res.errorMessage);
                                }
                            }}
                            onClose={() => rootDialog.closeDialog()}
                        />
                    });
                }}
            />
        </CustomizedTabs>
    </div>
}