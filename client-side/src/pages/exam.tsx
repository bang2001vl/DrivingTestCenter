import { Box, LinearProgress, linearProgressClasses, Stack, styled, TableCell, Typography } from "@mui/material";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { APIExam } from "../api/exam";
import { ISelectOption } from "../api/_deafaultCRUD";
import { BorderLinearProgress } from "../components/LinearProgress";
import DataTable2 from "../sections/DataTable2";
import ItemMoreMenu from "../sections/user/ItemMoreMenu";
import { DialogHelper } from "../singleton/dialogHelper";
import useAPI from "../hooks/useApi";


const EXAM_HEAD_LABEL = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'type', label: 'Category', alignRight: false },
    { id: 'dateRegist', label: 'Registration date', alignRight: false },
    { id: 'dateExam', label: 'Exam date', alignRight: false },
    { id: 'candidate', label: 'Candidates', alignRight: false },
    { id: 'fee', label: 'Fees', alignRight: false },
    { id: 'examStatus', label: 'Status', alignRight: false },
    { id: '' }
]

const ExamPage = () => {
    return <></>;
    // const [maxRow, setMaxRow] = useState(0);
    // const [list, setList] = useState<any[]>([]);
    // const auth = useRecoilValue(authAtom);
    // const api = useAPI();
    // const navigate = useNavigate();

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

    //     const [error1, newList] = await APIExam.select(option, auth?.token);
    //     if (error1) {
    //         if (!api.catchFatalError(error1)) {
    //             DialogHelper.showAlert(error1.errorMessage);
    //         }
    //         return;
    //     }

    //     const [error2, newMaxRow] = await APIExam.count(option, auth?.token);
    //     if (error2) {
    //         if (!api.catchFatalError(error2)) {
    //             DialogHelper.showAlert(error2.errorMessage);
    //         }
    //         return;
    //     }
    //     console.log(newList);
    //     console.log(newMaxRow);

    //     setList(newList);
    //     setMaxRow(newMaxRow);
    // }

    // const onClickCreate = () => {
    //     //window.alert("Clicked create");
    //     navigate("create", { replace: true });
    // }
    // const onClickEdit = (item: any) => {
    //     //window.alert("Clicked edit on item = " + JSON.stringify(item, undefined, 4));
    //     const params = new URLSearchParams(item);
    //     navigate(`update?${params}`, { replace: true });
    // }
    // const checkExamStatus = (dateOpen: any, dateClose: any, dateStart: any, dateEnd: any) => {
    //     const currentDate = new Date();
    //     if (currentDate.getTime() < (new Date(dateOpen).getTime()))
    //         return 0;
    //     if (currentDate.getTime() <= new Date(dateClose).getTime())
    //         return 1;
    //     if (currentDate.getTime() < new Date(dateStart).getTime())
    //         return 2;
    //     if (currentDate.getTime() <= new Date(dateEnd).getTime())
    //         return 3;
    //     return 4;

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
    //     <DataTable2
    //         title="Exam | Search"
    //         textLabel="Exam"

    //         maxRow={maxRow}
    //         list={list}
    //         initSelectOption={initSelectOption}
    //         onClickCreate={onClickCreate}
    //         onChangedSearch={onSelectChanged}

    //         headLabels={EXAM_HEAD_LABEL}

    //         onRenderItem={(data) => {
    //             var { id, name, type, dateOpen, dateClose, dateStart, dateEnd, maxMember, Member, rules, price, examStatus } = data.row;

    //             const isItemSelected = data.isItemSelected;
    //             examStatus = checkExamStatus(dateOpen, dateClose, dateStart, dateEnd);
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
    //                 <TableCell key={3} component="th" scope="row" padding="normal">
    //                     {format(new Date(dateOpen), "dd/MM/yyyy")} - {format(new Date(dateClose), "dd/MM/yyyy")}
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={4} component="th" scope="row" padding="normal">
    //                     {format(new Date(dateStart), "dd/MM/yyyy")} - {format(new Date(dateEnd), "dd/MM/yyyy")}
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={5} align="left">
    //                     <Box style={{display: "flex"}}>
    //                     <BorderLinearProgress style={{margin: '3px', marginRight: "5", width: "50px"}} variant="determinate" value={Number(Member / maxMember) * 100}></BorderLinearProgress>
    //                      {Member}/{maxMember}
    //                     </Box>
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={6} align="left">
    //                     {price}
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={7} align="left">
    //                     {examStatus}
    //                 </TableCell>
    //             );
    //             cells.push(
    //                 <TableCell key={8} align="right">
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
    
}

export default ExamPage;