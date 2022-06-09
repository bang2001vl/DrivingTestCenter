import { Dialog, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import readXlsxFile from "read-excel-file";
import { APIService } from "../../api/service";
import { ExcelPicker } from "../../components/Picker/excelPicker";
import CustomizedTabs from "../../components/tabs";
import { appConfig } from "../../configs";
import { useRootDialog } from "../../hooks/rootDialog";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { EDIT_METHOD } from "../../_enums";
import { ExamTestCreate } from "../examTest/examTestCreate";
import ExamTestPage from "../examTest/examTestPage";
import { ExamCreateUI } from "./examCreateUI";

interface IProps {

}
export const ExamDetailPage: FC<IProps> = (props) => {
    const [searchParams] = useSearchParams();
    const [oldData, setOldData] = useState<any>({});

    const rootDialog = useRootDialog();
    const navigate = useNavigate();
    const api = useAPI();

    useEffect(() => {
        const key = searchParams.get("id");
        if (!key) {
            navigate("/", { replace: true });
            DialogHelper.showAlert("Không thể tìm thấy kì thi!");
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
        <Typography variant="h3" gutterBottom style={{ color: "#3C557A", marginLeft: "10px" }}>
            Chỉnh sửa kì thi
        </Typography>
        <CustomizedTabs
            listtab={["Thông tin", "Quản lý ca thi"]}
        >
            <ExamCreateUI
                hideTitle
                method={EDIT_METHOD.update}
            />
            <ExamTestPage
                hideTitle
                filter={oldData ? {
                    examId: oldData.id,
                } : undefined}
                tableProps={{
                    onEdit: undefined,
                }}
                onClickCreate={(select) => {
                    console.log("SelectRaw", select);
                    rootDialog.openDialog({
                        children: <ExamTestCreate
                            method={EDIT_METHOD.create}
                            initValues={oldData ? {
                                examOption: {
                                    label: oldData.name,
                                    value: {
                                        id: oldData.id,
                                        name: oldData.name,
                                    }
                                }
                            } : undefined}
                            onSuccess={() => {
                                select();
                                rootDialog.closeDialog();
                            }}
                            onClose={() => rootDialog.closeDialog()}
                        />
                    });
                }}
                onClickLoadExcel={(select) => {
                    rootDialog.openDialog({
                        children: <ExcelPicker
                            title="Nhập Excel"
                            templateURI="/static/template/test.xlsx"
                            onSubmit={(files) => {
                                rootDialog.closeDialog();
                                if (files.length > 0) {
                                    readXlsxFile(files[0])
                                    .then((rows) => {
                                        console.log("Excel", rows);
                                    });
                                }
                            }}
                        />
                    });
                }}
            />
        </CustomizedTabs>
    </div>
}