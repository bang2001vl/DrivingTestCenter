import { Dialog, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import readXlsxFile from "read-excel-file";
import { APIService } from "../../api/service";
import { EmployeePicker } from "../../components/Picker/employee";
import { ExcelPicker } from "../../components/Picker/excelPicker";
import { StudentPicker } from "../../components/Picker/student";
import CustomizedTabs from "../../components/tabs";
import { appConfig } from "../../configs";
import { useRootDialog } from "../../hooks/rootDialog";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { EDIT_METHOD } from "../../_enums";
import AccountManagerPage from "../accountManager/AccountManagerPage";
import { ExamTestCreate } from "../examTest/examTestCreate";

interface IProps {

}
export const ExamTestDetailPage: FC<IProps> = (props) => {
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
            console.log("load old from exam detail page", key);

            api.getWithToken(
                `${appConfig.backendUri}/exam/select?${new URLSearchParams({
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
                console.log("Olddata from exam detail page", oldData, res);
            })
        }
    }, [searchParams.get("id")]);

    return <div>
        <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
            Chỉnh sửa ca thi
        </Typography>
        <CustomizedTabs
            listtab={["Thông tin", "Quản lý học viên", "Quản lý giảng viên"]}
        >
            <ExamTestCreate
                hideTitle
                method={EDIT_METHOD.update}
            />
            <AccountManagerPage
                hideTitle
                filter={oldData ? {
                    roleId: 1,
                    examTestId: oldData.id,
                } : undefined}
                tableProps={{
                    onEdit: undefined,
                }}
                onDelete={async (item, select) => {
                    const data = {
                        examTestId: oldData.id,
                        employeeIdList: [item.id],
                    }
                    const res = await api.postWithToken(`${appConfig.backendUri}/cnn/delete/examTest/employees`, data);
                    if (res.result) {
                        rootDialog.closeDialog();
                        select();
                        DialogHelper.showAlert("Success");
                    }
                    else {
                        DialogHelper.showAlert(res.errorMessage);
                    }
                }}
                onClickCreate={(select) => {
                    rootDialog.openDialog({
                        children: <StudentPicker
                            isMulti
                            title="Chọn học sinh"
                            filterExamTestId={oldData.id}
                            onSubmit={async (selected) => {
                                const data = {
                                    examTestId: oldData.id,
                                    studentIdList: selected.map(e => e.value.id)
                                };

                                const res = await api.postWithToken(
                                    `${appConfig.backendUri}/cnn/join/examTest/students`,
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
                    examTestId: oldData.id,
                } : undefined}
                tableProps={{
                    onEdit: undefined,
                }}
                onDelete={async (item, select) => {
                    const data = {
                        examTestId: oldData.id,
                        employeeIdList: [item.id],
                    }
                    const res = await api.postWithToken(`${appConfig.backendUri}/cnn/delete/examTest/employees`, data);
                    if (res.result) {
                        rootDialog.closeDialog();
                        select();
                        DialogHelper.showAlert("Success");
                    }
                    else {
                        DialogHelper.showAlert(res.errorMessage);
                    }
                }}
                onClickCreate={(select) => {
                    rootDialog.openDialog({
                        children: <EmployeePicker
                            isMulti
                            title="Chọn nhân viên"
                            filterExamTestId={oldData.id}
                            onSubmit={async (selected) => {
                                const data = {
                                    examTestId: oldData.id,
                                    employeeIdList: selected.map(e => e.value.id)
                                };

                                const res = await api.postWithToken(
                                    `${appConfig.backendUri}/cnn/join/examTest/employees`,
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