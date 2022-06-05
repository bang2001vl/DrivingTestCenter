import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { ExamTable } from "./examTable";
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
    const api = useAPI();
    const [loadChild, setLoadChild] = useState(false);
    const navigate = useNavigate();
    const reload = ()=>{
        setLoadChild(!loadChild);
    }

    const handleDelete = async (data: any) => {
        const id = data.id;
        const res = await api.deleteWithToken(
            `${appConfig.backendUri}/${routeName}/delete?keys=${String(id)}`
        );
        if (res.result) {
            DialogHelper.showAlert("Success");
            reload();
        }
        else {
            DialogHelper.showAlert(res.errorMessage);
        }
    }
    const handleEdit = (data: any) => {
        navigate("edit/"+data.id, { replace: true });
        
    }


    const renderTable = (dataList: any[]) => {
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
            selectURL='select'
            createURL="create"
            headLabels={EXAM_HEAD_LABEL}
            routeName="exam"
            onRenderItem={renderTable} 
            needReload={false} />

    )
}