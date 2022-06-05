import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
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


export default function ExamPageUI() {
    const routeName = "exam";
    const api = useAPI();
    const [loadChild, setLoadChild] = useState(false);
    const navigate = useNavigate();
    const reload = ()=>{
        setLoadChild(!loadChild);
    }

    const handleSelect = (params: URLSearchParams)=>{
        return api.get(
            `${appConfig.backendUri}/${routeName}/select?${params.toString()}`
        );
    }

    const handleCount = (params: URLSearchParams)=>{
        return api.get(
            `${appConfig.backendUri}/${routeName}/count?${params.toString()}`
        );
    }

    const handleCreate = ()=>{
        navigate("create");
    }

    const handleEdit = (data: any) => {
        navigate("edit/"+data.id);
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


    const renderTable = (dataList: any[]) => {
        return <></>
    }

    return (
        <DataTable4
            searchOptionList={searchOptionList}
            orderOptionList={orderOptionList}
            searchbarText='Tìm tên kì thi'
            title="Dashboard | Exam"
            textLabel="Kì thi"
            maxRow={10}
            headLabels={EXAM_HEAD_LABEL}
            needReload={loadChild}

            onRenderItem={renderTable} 
            count={handleCount}
            select={handleSelect}
            onClickCreate={handleCreate}
            />

    )
}