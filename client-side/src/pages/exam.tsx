import { Avatar, Dialog, DialogTitle, Stack, TableCell, Typography } from "@mui/material";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { boolean } from "yup";
import { APIExam } from "../api/exam";
import { ISelectOption } from "../api/_deafaultCRUD";
import DataTable from "../sections/DataTable";
import DataTable2 from "../sections/DataTable2";
import DataListHead from "../sections/user/DataListHead";
import ItemMoreMenu from "../sections/user/ItemMoreMenu";
import { DialogHelper } from "../singleton/dialogHelper";
import { useRootDialog } from "../hooks/rootDialog";
import ExamCreate from "./examCreate";

const EXAM_HEAD_LABEL = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'type', label: 'Category', alignRight: false },
    { id: 'dateStart', label: 'Start Time', alignRight: false },
    { id: 'maxMember', label: 'Member', alignRight: false },
    { id: '' }
];

const ExamPage = () => {
    return <></>;
    // const [maxRow, setMaxRow] = useState(0);
    // const [list, setList] = useState<any[]>([]);
    // const auth = useRecoilValue(authAtom);
    // const apiResultHandler = useAPIResultHandler();
    // const navigate = useNavigate();

    // let selectController = new AbortController();
    // selectController.signal.onabort = (ev) => {
    //     console.log("abort search");
    // };
    // let countController = new AbortController();
    // countController.signal.onabort = () => {
    //     console.log("abort count");
    // };

    // const initSelectOption = {
    //     searchby: "name",
    //     searchvalue: "",
    //     orderby: "name",
    //     orderdirection: "asc",
    //     start: 0,
    //     count: 5,
    // }

    // useEffect(() => {
    //     onSelectChanged(initSelectOption);
    // }, []);


    // const onSelectChanged = async (option: ISelectOption) => {
    //     console.log("OnSelectChanged");
    //     console.log(option);

    //     selectController.abort();
    //     selectController = new AbortController();
    //     const [error1, newList] = await APIExam.select(option, auth?.token, selectController);
    //     if (error1) {
    //         if (!apiResultHandler.catchFatalError(error1)) {
    //             DialogHelper.showAlert(error1.errorMessage);
    //         }
    //         return;
    //     }

    //     countController.abort();
    //     countController = new AbortController();
    //     const [error2, newMaxRow] = await APIExam.count(option, auth?.token, countController);
    //     if (error2) {
    //         if (!apiResultHandler.catchFatalError(error2)) {
    //             DialogHelper.showAlert(error2.errorMessage);
    //         }
    //         return;
    //     }
    //     console.log("Select completed");
    //     console.log(newList);
    //     console.log(newMaxRow);

    //     setList(newList);
    //     setMaxRow(newMaxRow);
    // }
    // const rootDialog = useRootDialog();
    // const handleCloseDialog = (ev: any, reason: any)=>{
    //     // console.log("On close dialog with reason = " + reason);
    //     // ev.
    // }
    // const onClickCreate = () => {
    //     //window.alert("Clicked create");
    //     //navigate("create", { replace: true });
    //     const setIsOpen = rootDialog.openDialog({
    //         title: "title",
    //         open: true,
    //         children: <h3>Hello</h3>
    //     })
    // }
    // const onClickEdit = (item: any) => {
    //     //window.alert("Clicked edit on item = " + JSON.stringify(item, undefined, 4));
    //     const params = new URLSearchParams(item);
    //     navigate(`update?${params}`, { replace: true });
    // }
    // const onClickDelete = async (item: any) => {
    //     //window.alert("Clicked delete on item = " + JSON.stringify(item, undefined, 4));
    //     const result = DialogHelper.showConfirm("Are you sure?");
    //     if (result) {
    //         const [error, newMaxRow] = await APIExam.delete([item.id], auth?.token);
    //         if (error) {
    //             if (!apiResultHandler.catchFatalError(error)) {
    //                 DialogHelper.showAlert(error.errorMessage);
    //             }
    //             return;
    //         }
    //     }
    //     else {
    //         onSelectChanged(initSelectOption);
    //     }
    // }
    // return (
    //     <div>
    //         <DataTable2
    //         title="Exam | Search"
    //         textLabel="Exam"

    //         maxRow={maxRow}
    //         list={list}
    //         initSelectOption={initSelectOption}

    //         onClickCreate={onClickCreate}
    //         onChangedSearch={onSelectChanged}

    //         headLabels={EXAM_HEAD_LABEL}

    //         onRenderItem={(data) => {
    //             const { id, name, type, dateStart, maxMember, rules } = data.row;
    //             const isItemSelected = data.isItemSelected;

    //             const cells = [];
    //             cells.push(
    //                 <TableCell key={1} component="th" scope="row" padding="none">
    //                     {name}
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={2} align="left">
    //                     {type}
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={3} align="left">
    //                     {format(new Date(dateStart), "yyyy-MM-dd hh:mm:ss")}
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={4} align="left">
    //                     {maxMember}
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={5} align="right">
    //                     <ItemMoreMenu
    //                         items={[
    //                             {
    //                                 label: "Delete",
    //                                 iconURI: "eva:trash-2-outline",
    //                                 onClick: onClickDelete
    //                             },
    //                             {
    //                                 label: "Edit",
    //                                 iconURI: "eva:edit-fill",
    //                                 onClick: onClickEdit
    //                             },
    //                         ]}
    //                         data={data.row}
    //                     ></ItemMoreMenu>
    //                 </TableCell>
    //             );
    //             return cells;
    //         }}
    //     ></DataTable2>
    //     </div>
    // )
}


export default ExamPage;