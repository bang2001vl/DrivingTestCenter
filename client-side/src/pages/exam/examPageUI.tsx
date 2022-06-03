import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { useRootDialog } from "../../hooks/rootDialog";
import { ExamCreateUI } from "./examCreateUI";
import { ExamTable } from "./examTable";
import { EDIT_METHOD } from "../../_enums";
import DataTable4 from "../../sections/DataTable4";

const EXAM_HEAD_LABEL = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'type', label: 'Category', alignRight: false },
    { id: 'dateRegist', label: 'Registration date', alignRight: false },
    { id: 'dateExam', label: 'Exam date', alignRight: false },
    { id: 'candidate', label: 'Candidates', alignRight: false },
    { id: 'fee', label: 'Fees', alignRight: false },
    { id: 'examStatus', label: 'Status', alignRight: false },
    { id: '' }
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

const routeName = "exam";

export default function ExamPageUI() {
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

        const url = `${appConfig.backendUri}/${routeName}/select?${queryParams}`
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
        //     children: <ExamCreateUI
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
            children: <ExamCreateUI
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
        );;
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
        return <ExamTable
            dataList={dataList.map(e => ({
                ...e,
                id: Number(e.id),
                countStudent: Number(e.countStudent),
                dateClose: new Date(e.dateClose),
                dateEnd: new Date(e.dateEnd),
                dateOpen: new Date(e.dateOpen),
                dateStart: new Date(e.dateStart),
                maxMember: Number(e.maxMember),
                name: e.name,
                price: Number(e.price),
                type: e.type,
            }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    }
    



    return (
        <DataTable4 
        searchOptionList={searchOptionList} 
        orderOptionList={orderOptionList} 
        searchbarText='Tìm tên kì thi'
        title="Dashboard | Exam"
        textLabel="Kì thi"
        maxRow={10} 
        urlSelect='select'
        onClickCreate={handleCreate} 
        headLabels={EXAM_HEAD_LABEL}
         routeName="exam" 
         onRenderItem={renderTable }
        />

    )
}