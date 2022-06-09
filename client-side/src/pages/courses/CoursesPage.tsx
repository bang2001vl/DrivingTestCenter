import { generatePath, useNavigate } from "react-router-dom";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { CoursesTable, CourseTableProps } from "./CoursesTable";
import { BasicPage, BasicPageProps } from "../_builder/PageBuilder";

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

interface IProps {
    tableProps?: Partial<CourseTableProps>,
}

export default function CoursesPage(props: IProps & Partial<BasicPageProps>) {
    const routeNameFE = "dashboard/course";
    const routeName = "course";
    const api = useAPI();
    const navigate = useNavigate();
    return (
        <BasicPage
            routeNameFE={routeNameFE}
            routeSelect={"course"}

            searchOptionList={searchOptionList}
            orderOptionList={orderOptionList}

            searchbarText='Tìm tên lớp học'
            webTitle="Dashboard | Classes"
            pageTitle="Lớp học"

            cardColor='transparent'
            {...props}
            onRenderItem={(dataList, select, emptyView) => {
                if(dataList.length < 1) return emptyView ? emptyView : <></>;
                return <CoursesTable
                    dataList={dataList.map(e => ({
                        ...e,
                        id: Number(e.id),
                        name: e.name,
                        price: Number(e.price),
                        location: e.location,
                        dateStart: new Date(e.dateStart),
                        dateEnd: new Date(e.dateEnd),
                        countMember: e.countMember,
                     employeeCNNs: e.employeeCNNs,
                    }))}
                    onDetail={(data) => {
                        navigate("detail?id=" + data.id);
                    }}
                    onDelete={async (data: any) => {
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