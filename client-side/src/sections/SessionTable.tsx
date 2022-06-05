import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '../configs';
import { useRootDialog } from '../hooks/rootDialog';
import useAPI from '../hooks/useApi';
import { ExamTestTable } from '../pages/examTest/examTestTable';
import { DialogHelper } from '../singleton/dialogHelper';
import DataTable3 from './DataTable3';
import DataTable4 from './DataTable4';
const EXAM_HEAD_LABEL = [
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

interface TypeProps {
    onClickCreate: any,
    handleEdit: any,
    handleDelete: any,
    list: any[],
    handleCreate: any,
    renderItem:any,
}

   
export default function ExamTestPage(props: TypeProps) {
    const _dataList = props.list;
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const api = useAPI();
    const rootDialog = useRootDialog();
    const [selected, setSelected] = useState([]);

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
    const handleChangePage = (event:any, newPage:number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event:any) => {
        setRowPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    
      const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowPerPage - _dataList.length) : 0;
    

    //useEffect(() => {
    //     countMax();
    // }, [options.searchvalue]);

    // useEffect(() => {
    //     select();
    // }, [page, rowPerPage, options]);

    const select = () => {
        //console.log("onSelect");

    //     const queryParams = new URLSearchParams({
    //         ...options,
    //         start: rowPerPage * page,
    //         count: rowPerPage,
    //     } as any).toString();

    //    // const url = `${appConfig.backendUri}/${routeName}/select/include/exam?${queryParams}`
    //     setIsLoading(true);
    //     api.get(url)
    //         .then(res => {
    //             setIsLoading(false);
    //             if (res.result) {
    //                 setDataList(res.data);
    //             }
    //             else {
    //                 DialogHelper.showAlert(res.errorMessage);
    //             }
    //         })
    }

    // const countMax = () => {
    //     //console.log("onCountMax");

    //     const queryParams = new URLSearchParams({
    //         ...options,
    //         start: rowPerPage * page,
    //         count: rowPerPage,
    //     } as any).toString();

    //     const url = `${appConfig.backendUri}/${routeName}/count?${queryParams}`
    //     setIsLoading(true);
    //     api.get(url)
    //         .then(res => {
    //             setIsLoading(false);
    //             if (res.result) {
    //                 setMaxCount(res.data);
    //             }
    //             else {
    //                 DialogHelper.showAlert(res.errorMessage);
    //             }
    //         })
    // }

    // const handleCreate = () => {
    //     // rootDialog.openDialog({
    //     //     children: <ExamTestCreate
    //     //         method={EDIT_METHOD.create}
    //     //         onSuccess={() => {
    //     //             rootDialog.closeDialog();
    //     //             select();
    //     //         }}
    //     //         onClose={() => rootDialog.closeDialog()}
    //     //     />,
    //     // });
    //     navigate("create", { replace: true });
    // }

    // const handleEdit = (data: any) => {
    //     rootDialog.openDialog({
    //         children: <ExamTestCreate
    //             method={EDIT_METHOD.update}
    //             oldData={data}
    //             onSuccess={() => {
    //                 rootDialog.closeDialog();
    //                 select();
    //             }}
    //             onClose={() => rootDialog.closeDialog()}
    //         />,
    //     });
    // }

    // const handleDelete = async (data: any) => {
    //     const id = data.id;
    //     setIsLoading(true);
    //     const res = await api.deleteWithToken(
    //         `${appConfig.backendUri}/${routeName}/delete?keys=${String(id)}`
    //     );
    //     setIsLoading(false);
    //     if (res.result) {
    //         DialogHelper.showAlert("Success");
    //         select();
    //     }
    //     else {
    //         DialogHelper.showAlert(res.errorMessage);
    //     }
    //}


    return (
        <DataTable4 
            searchOptionList={searchOptionList}
            orderOptionList={orderOptionList}
            searchbarText='Tìm tên ca thi'
            title="Dashboard | Session"
            textLabel="Ca thi"
            maxRow={10}
            selectURL='select/include/exam'
            createURL='create'
            headLabels={EXAM_HEAD_LABEL}
            routeName="examtest"
            onRenderItem={props.renderItem} needReload={false}             />
    )
}