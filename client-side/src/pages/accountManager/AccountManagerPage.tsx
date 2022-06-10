import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { AccountManagerTable, AccountManagerTableProps } from "./AccountManagerTable";
import { BasicPage, BasicPageProps } from "../_builder/PageBuilder";
import { useRootDialog } from "../../hooks/rootDialog";
import { ExcelPicker } from "../../components/Picker/excelPicker";
import { AccountManagerController } from "../../api/controllers/accountManagerController";

const HEAD_LABEL = [
    { id: 'avt', label: '', alignRight: false },
    { id: 'name', label: 'Họ và tên', alignRight: false },
  //  { id: 'gender', label: 'Giới tính', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phoneNumber', label: 'Số điện thoại', alignRight: false },
    { id: 'address', label: 'Địa chỉ', alignRight: false },
    { id: 'status', label: 'Vai trò', alignRight: false },
    { id: '' }
]
const searchOptionList = [{
    label: "Tên",
    value: {
        searchby: "fullname"
    }
}];

const orderOptionList = [
    {
        label: "Tên (A-Z)",
        value: {
            orderby: "fullname",
            orderdirection: "asc"
        }
    },
    {
        label: "Tên (Z-A)",
        value: {
            orderby: "fullname",
            orderdirection: "desc"
        }
    }
];

interface IProps{
    onDelete?: (data: any,select: ()=>void)=> any,
    hideTitle?: boolean,
    filter? : any,
    tableProps? : Partial<AccountManagerTableProps>,
}

export default function AccountManagerPage(props: IProps & Partial<BasicPageProps>) {
    console.log("REF3", props.ref);
    const routeNameFE = "dashboard/account/manager";
    const routeName = "account/manager";
    const api = useAPI();
    const navigate = useNavigate();
    const rootDialog = useRootDialog();

    const handleDelete = async (data: any,select: ()=>void) => {
        const id = data.id;
        const res = await api.deleteWithToken(
            `${appConfig.backendUri}/${routeName}/delete?key=${String(id)}`
        );
        if (res.result) {
            DialogHelper.showAlert("Thành công");
            select();
        }
        else {
            DialogHelper.showAlert(res.errorMessage);
        }
    }

    return (
        <BasicPage
            routeNameFE={routeNameFE}
            routeSelect={routeName}

            searchbarText='Tìm tên tài khoản'
            webTitle={props.title ? props.title : "Dashboard | Account"}
            pageTitle={props.hideTitle ? "" : "Tài khoản"}

            searchOptionList={searchOptionList}
            orderOptionList={orderOptionList}

            {...props}
            onRenderItem={(dataList ,select , emptyView ) => {
                return <AccountManagerTable
                    dataList={dataList}
                    emptyView={emptyView}
                    headLabels={HEAD_LABEL}
                    onEdit={(data) => {
                        navigate("edit?id="+data.id);
                    }}
                    onDelete={(data)=>{
                        if(props.onDelete){
                            props.onDelete(data, select);
                        }
                        else{
                            handleDelete(data, select);
                        }
                    }}
                    {...props.tableProps}
                />
            }} 
            onClickLoadExcel={(select) => {
                rootDialog.openDialog({
                    children: <ExcelPicker
                        title="Nhập Excel"
                        templateURI="/static/template/account.xlsx"
                        onSubmit={async (files) => {
                            rootDialog.closeDialog();
                            if (files.length > 0) {
                                const res  = await new AccountManagerController().insertFromExcelToDB(files[0], api);
                                if(res.result){
                                    DialogHelper.showAlert("Success");
                                    select();
                                }
                                else{
                                    DialogHelper.showAlert(res.errorMessage);
                                }
                            }
                        }}
                    />
                });
            }}
            />

    )
}