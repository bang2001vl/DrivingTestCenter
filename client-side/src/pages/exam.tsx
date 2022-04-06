import { Avatar, Stack, TableCell, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useExamActions } from "../recoil/actions/exam";
import { examsAtom } from "../recoil/model/exam";
import DataTable from "../sections/DataTable";
import DataTable2 from "../sections/DataTable2";
import DataListHead from "../sections/user/DataListHead";

const EXAM_HEAD_LABEL = [
    { id: 'name', label: 'Tên', alignRight: false },
    { id: 'type', label: 'Thể loại', alignRight: false },
    { id: 'dateStart', label: 'Ngày bắt đầu', alignRight: false },
    { id: 'maxMember', label: 'Tối đa', alignRight: false },
    { id: '' }
]

const ExamPage = () => {
    const onClickCreate = () => {
        window.alert("Clicked create");
    }
    const onClickEdit = (item: any) => {
        window.alert("Clicked edit on item = " + JSON.stringify(item, undefined, 4));
    }
    const onClickDelete = (item: any) => {
        window.alert("Clicked delete on item = " + JSON.stringify(item, undefined, 4));
    }

    return (
        <DataTable2
            title="Exam | Homepage"
            atom={examsAtom}
            actionListHook={useExamActions}

            onClickCreate={onClickCreate}
            
            menuItems={[
                {
                    label: "Delete",
                    iconURI: "eva:trash-2-outline",
                    onClick: onClickDelete
                },
                {
                    label: "Edit",
                    iconURI: "eva:edit-fill",
                    onClick: onClickEdit
                },
            ]}

            headLabels={EXAM_HEAD_LABEL}

            onRenderItem={(data) => {
                const { id, name, type, dateStart, maxMember, rules } = data.row;
                const isItemSelected = data.isItemSelected;
                const cells = [];
                cells.push(<TableCell component="th" scope="row" padding="none">
                    {name}
                </TableCell>);
                cells.push(<TableCell align="left">{type}</TableCell>);
                cells.push(<TableCell align="left">{dateStart}</TableCell>);
                cells.push(<TableCell align="left">{maxMember}</TableCell>);
                return cells;
            }}
        ></DataTable2>
    )
}

export default ExamPage;