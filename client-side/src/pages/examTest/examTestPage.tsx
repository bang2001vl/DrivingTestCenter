import { useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { ExamTestTable, ExamTestTableProps } from "./examTestTable";
import { BasicPage, BasicPageProps } from "../_builder/PageBuilder";

const HEAD_LABEL = [
    { id: 'name', label: 'Tên ca thi', alignRight: false },
    { id: 'exam', label: 'Kì thi', alignRight: false },
    { id: 'type', label: 'Loại bằng', alignRight: false },
    { id: 'time', label: 'Thời gian thi', alignRight: false },
    { id: 'date', label: 'Ngày thi', alignRight: false },
    { id: 'room', label: 'Nơi thi', alignRight: false },
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
    tableProps?: Partial<ExamTestTableProps>,
}

export default function ExamTestPage(props: IProps & Partial<BasicPageProps>) {
    const routeNameFE = "dashboard/session";
    const routeName = "examtest";
    const navigate = useNavigate();
    const api = useAPI();

    return (
        <BasicPage
            routeSelect={"examtest/overview"}
            routeNameFE={routeNameFE}
            
            searchOptionList={searchOptionList}
            orderOptionList={orderOptionList}

            searchbarText='Tìm tên ca thi'
            webTitle={"Dashboard | Session"}
            pageTitle={props.hideTitle ? "" : "Ca thi"}
            
            onRenderItem={(dataList, select, emptyView) => {
                return <ExamTestTable
                    dataList={dataList.map(e => ({
                        ...e,
                        dateTimeStart: new Date(e.dateTimeStart),
                        dateTimeEnd: new Date(e.dateTimeEnd),
                    }))}
                    headLabels={HEAD_LABEL}
                    emptyView={emptyView}
                    onEdit={(data) => {
                        navigate(`/${routeNameFE}/edit?id=` + data.id);
                    }}
                    onDetail={(data) => {
                        navigate(`/${routeNameFE}/detail?id=` + data.id);
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
            {...props}
        />
    )
}