import { Icon } from "@iconify/react";
import { Box, Button, Container, Stack, TableCell, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { ISelectOption } from "../../api/_deafaultCRUD";
import { CommonButton } from "../../components/Buttons/common";
import { MySearchBar } from "../../components/MySearchBar.tsx/MySearchBar";
import Scrollbar from "../../components/Scrollbar";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { useRootDialog } from "../../hooks/rootDialog";
import { EDIT_METHOD, ExamCreateUI } from "./examCreateUI";
import { ExamTable } from "./examTable";
import { ExamController } from "../../api/controllers/examController";
import { ExamSelector } from "./examSelector";

const EXAM_HEAD_LABEL = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'type', label: 'Category', alignRight: false },
    { id: 'dateStart', label: 'Start Time', alignRight: false },
    { id: 'maxMember', label: 'Member', alignRight: false },
    { id: '' }
];

interface Props {
    maxRow: number,
    onClickCreate: () => void,
    onSelectChanged: (option: ISelectOption) => void,
    onClickDelete: (item: any) => void,
    onClickEdit: (item: any) => void,
    initSelectOption: ISelectOption,
}

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

export default function ExamPageUI(props: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const api = useAPI();
    const rootDialog = useRootDialog();

    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [options, setOptions] = useState({
        searchby: "name",
        searchvalue:"",
        orderby: "name",
        orderdirection: "asc",
    });
    const [dataList, setDataList] = useState<any[]>([]);

    // useEffect(()=>{
    //     // First load
    //     select();
    // }, []);

    useEffect(()=>{
        // First load
        select();
    }, [page, rowPerPage, options]);

    function select() {
        const queryParams = new URLSearchParams({
            ...options,
            start: rowPerPage * page,
            count: rowPerPage,
        } as any).toString();

        const selectURL =`${appConfig.backendUri}/exam/select?${queryParams}`
        setIsLoading(true);
        api.get(selectURL)
        .then(res =>{
            if(res.result && res.data){
                setDataList(res.data);
                setIsLoading(false);
            }
            else{
                DialogHelper.showAlert(res.errorMessage);
            }
        })
    }

    function handleCreate(){
        rootDialog.openDialog({
            children: <ExamCreateUI 
            method={EDIT_METHOD.create} 
            onSuccess={()=>{
                rootDialog.closeDialog();
                select();
            }}
            onClose={()=>rootDialog.closeDialog()}
            />,
        });
    }

    function handleEdit(data: any){
        rootDialog.openDialog({
            children: <ExamCreateUI 
            method={EDIT_METHOD.update} 
            oldData={data}
            onSuccess={()=>{
                rootDialog.closeDialog();
                select();
            }}
            onClose={()=>rootDialog.closeDialog()}
            />,
        });
    }

    async function handleDelete(data: any){
        const id = data.id;
        setIsLoading(true);
        const res = await new ExamController(api).delete(id);
        setIsLoading(false);
        if(res.result){
            DialogHelper.showAlert("Success");
            select();
        }
        else{
            DialogHelper.showAlert(res.errorMessage);
        }
    }

    return (
        <Stack spacing={1}>
            <Stack direction={"row"} alignItems="center" justifyContent="space-between">
                <Stack direction={"row"}>
                    <label>Exam</label>
                <label>&gt;</label>
                </Stack>
                <Stack direction={"row"}>
                    <CommonButton
                        onClick={()=>{
                            rootDialog.openDialog({
                                title: <h2>Select Exam</h2>,
                                children: <ExamSelector 
                                onSubmit={(val)=>{
                                    console.log("On select success", val);
                                }}
                                onClose={()=>rootDialog.closeDialog()}
                                ></ExamSelector>,
                            });
                        }}
                    >Test</CommonButton>
                                        <CommonButton
                        startIcon={<Icon icon="ant-design:plus-outlined" />}
                        onClick={handleCreate}
                    >Create</CommonButton>
                </Stack>
            </Stack>

            <MySearchBar
                searchOptionList={searchOptionList}
                orderOptionList={orderOptionList}
                onSubmit={(opt)=>{
                    setOptions(opt);
                }}
            ></MySearchBar>

            <Box alignSelf={"center"} style={{display: isLoading ? "inline" : "none"}}>
                <Icon icon="eos-icons:three-dots-loading" />
            </Box>

            <Scrollbar sx={undefined}>
                <ExamTable
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
                ></ExamTable>
            </Scrollbar>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={dataList.length}
                rowsPerPage={rowPerPage}
                page={page}
                onPageChange={(ev, newPage) => {
                    setPage(newPage);
                }}
                onRowsPerPageChange={(ev) => {
                    const newRowPerPage = ev.target.value;
                    setRowPerPage(parseInt(newRowPerPage, 10));
                    setPage(0);
                }}
            />
        </Stack>
    )
}