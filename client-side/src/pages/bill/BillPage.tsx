import { useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { BasicPage, BasicPageProps } from "../_builder/PageBuilder";
import { BillTable, BillTableProps } from "./BillTable";

const HEAD_LABEL = [
    { id: 'code', label: 'Mã hóa đơn', alignRight: false },
    { id: 'totalPrice', label: 'Tổng tiền', alignRight: false },
    { id: 'reason', label: 'Lý do', alignRight: false },
    { id: 'createdAt', label: 'Thời gian', alignRight: false },
    { id: '', label: '', alignRight: false },
]; 

const searchOptionList = [{
    label: "Mã hóa đơn",
    value: {
        searchby: "code"
    },
},{
    label: "Lý do",
    value: {
        searchby: "reason"
    },
},];

const orderOptionList = [
    {
        label: "Ngày tạo (A-Z)",
        value: {
            orderby: "createdAt",
            orderdirection: "asc"
        }
    },
    {
        label: "Ngày tạo (Z-A)",
        value: {
            orderby: "createdAt",
            orderdirection: "desc"
        }
    },
    {
        label: "Tổng tiền (A-Z)",
        value: {
            orderby: "totalPrice",
            orderdirection: "asc"
        }
    },
    {
        label: "Tổng tiền (Z-A)",
        value: {
            orderby: "totalPrice",
            orderdirection: "desc"
        }
    },
];


interface IProps {
    tableProps?: Partial<BillTableProps>,
}

export default function BillPage(props: IProps & Partial<BasicPageProps>) {
    const routeNameFE = "dashboard/bill";
    const routeName = "bill";
    const navigate = useNavigate();
    const api = useAPI();

    return (
        <BasicPage
            routeSelect={"bill"}
            routeNameFE={routeNameFE}
            
            searchOptionList={searchOptionList}
            orderOptionList={orderOptionList}

            searchbarText='Tìm hóa đơn'
            webTitle={"Dashboard | Bill"}
            pageTitle={props.hideTitle ? "" : "Hóa đơn"}
            
            onRenderItem={(dataList, select, emptyView) => {
                return <BillTable
                    dataList={dataList.map(e => ({
                        ...e,
                        dateTimeStart: new Date(e.dateTimeStart),
                        dateTimeEnd: new Date(e.dateTimeEnd),
                    }))}
                    headLabels={HEAD_LABEL}
                    emptyView={emptyView}
                    onDelete={async (data) => {
                        const id = data.id;
                        const res = await api.postWithToken(
                            `${appConfig.backendUri}/${routeName}/insert`,
                            {
                                totalPrice: -1 * Number(data.totalPrice),
                                reason: `[Auto-generated]: Hoàn tác đơn ${data.code}`,
                            }
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
            {...props}
        />
    )
}