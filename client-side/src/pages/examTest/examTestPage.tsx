import { Icon } from "@iconify/react";

import { FC, useEffect, useState } from "react";
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

const HEAD_LABEL = [
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


interface IProps {
    filter?: any,
}

export default function ExamTestPage(props: IProps){
const routeName = "examtest";
    const navigate = useNavigate();
    const api = useAPI();
    
    const [loadChild, setLoadChild] = useState(false);

    const reload = ()=>{
        setLoadChild(!loadChild);
    }

    const handleSelect = (params: URLSearchParams)=>{
        if(props.filter){
            for(let key in Object.keys(props.filter)){
                params.append(key, props.filter[key])
            }
        }
        return api.get(
            `${appConfig.backendUri}/${routeName}/select/include/exam?${params.toString()}`
        );
    }

    const handleCount = (params: URLSearchParams)=>{
        if(props.filter){
            for(let key in Object.keys(props.filter)){
                params.append(key, props.filter[key])
            }
        }
        return api.get(
            `${appConfig.backendUri}/${routeName}/count?${params.toString()}`
        );
    }

    const handleCreate = ()=>{
        navigate("create");
    }
    
    const handleEdit = (data: any) => {
        navigate("edit/"+ data.id);
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

    const renderTable = (dataList: any[], emptyView? : JSX.Element) => {
        return <ExamTestTable
            dataList={dataList.map(e => ({
                ...e,
                dateTimeStart: new Date(e.dateTimeStart),
                dateTimeEnd: new Date(e.dateTimeEnd),
            }))}
            headLabels={HEAD_LABEL}
            emptyView={emptyView}
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
            needReload={loadChild} 
            onRenderItem={renderTable} 
            count={handleCount}
            select={handleSelect}
            onClickCreate={handleCreate}    />
    )
}