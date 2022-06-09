import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { AccountManagerTable, AccountManagerTableProps } from "./AccountManagerTable";
import { BasicPage, BasicPageProps } from "../_builder/PageBuilder";

const HEAD_LABEL = [
    { id: 'name', label: 'Họ và tên', alignRight: false },
  //  { id: 'gender', label: 'Giới tính', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phoneNumber', label: 'Số điện thoại', alignRight: false },
    { id: 'address', label: 'Địa chỉ', alignRight: false },
    { id: 'status', label: 'Vai trò', alignRight: false },
    { id: '' }
]
const searchOptionList = [{
    label: "Name",
    value: {
        searchby: "fullname"
    }
}];

const orderOptionList = [
    {
        label: "Name (A-Z)",
        value: {
            orderby: "fullname",
            orderdirection: "asc"
        }
    },
    {
        label: "Name (Z-A)",
        value: {
            orderby: "fullname",
            orderdirection: "desc"
        }
    }
];

interface IProps{
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
                    onDelete={async (data) => {
                        const id = data.id;
                        const res = await api.deleteWithToken(
                            `${appConfig.backendUri}/${routeName}/delete?keys=${String(id)}`
                        );
                        if (res.result) {
                            DialogHelper.showAlert("Success");
                            select();
                        }
                        else {
                            DialogHelper.showAlert(res.errorMessage);
                        }
                    }}
                    {...props.tableProps}
                />
            }} 
            />

    )
}