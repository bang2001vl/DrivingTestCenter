import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import DataTable4 from "../../sections/DataTable4";

// const HEAD_LABEL = [
//     { id: 'name', label: 'Name', alignRight: false },
//     { id: 'gender', label: 'Gender', alignRight: false },
//     { id: 'email', label: 'Email', alignRight: false },
//     { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
//     { id: 'address', label: 'Address', alignRight: false },
//     { id: 'joinDate', label: 'Join Date', alignRight: false },
//     { id: 'status', label: 'Status', alignRight: false },
//     { id: '' }
// ]
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

export default function CoursesPage() {
    const routeName = "course";
    const api = useAPI();
    const [loadChild, setLoadChild] = useState(false);
    const navigate = useNavigate();
    const reload = ()=>{
        setLoadChild(!loadChild);
    }

    const handleSelect = (params: URLSearchParams)=>{
        return api.get(
            `${appConfig.backendUri}/${routeName}/select/include?${params.toString()}`
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
        navigate("edit?id="+data.id);
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


    const renderTable = (dataList: any[], emptyView?: JSX.Element) => {
        return <p>{JSON.stringify(dataList, null, 4)}</p>
    }

    return (
        <DataTable4
            searchOptionList={searchOptionList}
            orderOptionList={orderOptionList}
            searchbarText='Tìm tên kì thi'
            title="Dashboard | Khóa học"
            textLabel="Khóa học"
            needReload={loadChild}

            onRenderItem={renderTable} 
            count={handleCount}
            select={handleSelect}
            onClickCreate={handleCreate}
            />
        // <p>ádasd</p>
    )
}