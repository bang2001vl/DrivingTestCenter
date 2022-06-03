import { Icon } from "@iconify/react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { useRootDialog } from "../../hooks/rootDialog";
import { ExamController } from "../../api/controllers/examController";
import { EDIT_METHOD } from "../../_enums";
import { ExamTestCreate } from "./examTestCreate";
import { ExamTestTable } from "./examTestTable";
import DataTable4 from "../../sections/DataTable4";

const EXAM_HEAD_LABEL = [
        { id: 'name', label: 'Tên ca thi', alignRight: false },
        { id: 'exam', label: 'Kì thi', alignRight: false },
        { id: 'type', label: 'Loại bằng', alignRight: false },
        { id: 'time', label: 'Thời gian thi', alignRight: false },
        { id: 'date', label: 'Ngày thi', alignRight: false },
        { id: 'room', label: 'Địa chỉ', alignRight: false },
        { id: 'candidate', label: 'Thí sinh', alignRight: false },
        { id: 'sessionStatus', label: 'Trạng thái', alignRight: false },
        { id: '', label: '', alignRight: false },
]
const searchOptionList = [{
    label: "Name",
    value: {
        searchby: "name"
    }
}];

const orderOptionList = [
    {
        label: "Name (A-Z)",
        value: {
            orderby: "name",
            orderdirection: "asc"
        }
    },
    {
        label: "Name (Z-A)",
        value: {
            orderby: "name",
            orderdirection: "desc"
        }
    }
];

const routeName = "examtest";

export default function ExamTestPage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const api = useAPI();
    const rootDialog = useRootDialog();

    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [options, setOptions] = useState({
        searchby: "name",
        searchvalue: "",
        orderby: "name",
        orderdirection: "asc",
    });
    const [maxCount, setMaxCount] = useState(0);
    const [dataList, setDataList] = useState<any[]>([]);

    useEffect(() => {
        countMax();
    }, [options.searchvalue]);

    useEffect(() => {
        select();
    }, [page, rowPerPage, options]);

    const select = () => {
        //console.log("onSelect");

        const queryParams = new URLSearchParams({
            ...options,
            start: rowPerPage * page,
            count: rowPerPage,
        } as any).toString();

        const url = `${appConfig.backendUri}/${routeName}/select/include/exam?${queryParams}`
        setIsLoading(true);
        api.get(url)
            .then(res => {
                setIsLoading(false);
                if (res.result) {
                    setDataList(res.data);
                }
                else {
                    DialogHelper.showAlert(res.errorMessage);
                }
            })
    }

    const countMax = () => {
        //console.log("onCountMax");

        const queryParams = new URLSearchParams({
            ...options,
            start: rowPerPage * page,
            count: rowPerPage,
        } as any).toString();

        const url = `${appConfig.backendUri}/${routeName}/count?${queryParams}`
        setIsLoading(true);
        api.get(url)
            .then(res => {
                setIsLoading(false);
                if (res.result) {
                    setMaxCount(res.data);
                }
                else {
                    DialogHelper.showAlert(res.errorMessage);
                }
            })
    }

    const handleCreate = () => {
        // rootDialog.openDialog({
        //     children: <ExamTestCreate
        //         method={EDIT_METHOD.create}
        //         onSuccess={() => {
        //             rootDialog.closeDialog();
        //             select();
        //         }}
        //         onClose={() => rootDialog.closeDialog()}
        //     />,
        // });
        navigate("create", { replace: true });
    }

    const handleEdit = (data: any) => {
        rootDialog.openDialog({
            children: <ExamTestCreate
                method={EDIT_METHOD.update}
                oldData={data}
                onSuccess={() => {
                    rootDialog.closeDialog();
                    select();
                }}
                onClose={() => rootDialog.closeDialog()}
            />,
        });
    }

    const handleDelete = async (data: any) => {
        const id = data.id;
        setIsLoading(true);
        const res = await api.deleteWithToken(
            `${appConfig.backendUri}/${routeName}/delete?keys=${String(id)}`
        );
        setIsLoading(false);
        if (res.result) {
            DialogHelper.showAlert("Success");
            select();
        }
        else {
            DialogHelper.showAlert(res.errorMessage);
        }
    }

    const renderTable = () => {
        return <ExamTestTable
            dataList={dataList.map(e => ({
                ...e,
                dateTimeStart: new Date(e.dateTimeStart),
                dateTimeEnd: new Date(e.dateTimeEnd),
            }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
            />
    }

    return (
        <DataTable4 
        searchOptionList={searchOptionList} 
        orderOptionList={orderOptionList} 
        searchbarText='Tìm tên ca thi'
        title="Dashboard | Session"
        textLabel="Ca thi"
        maxRow={10} 
        urlSelect='select/include/exam'
        onClickCreate={handleCreate} 
        headLabels={EXAM_HEAD_LABEL}
         routeName="examtest" 
         onRenderItem={renderTable }
        />
    )
}