import { Avatar, Stack, TableCell, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { APIExam } from "../api/exam";
import { ISelectOption } from "../api/_deafaultCRUD";
import { useExamActions } from "../recoil/actions/exam";
import { authAtom } from "../recoil/model/auth";
import { examsAtom } from "../recoil/model/exam";
import DataTable from "../sections/DataTable";
import DataTable2 from "../sections/DataTable2";
import DataListHead from "../sections/user/DataListHead";
import ItemMoreMenu from "../sections/user/ItemMoreMenu";
import { DialogHelper } from "../singleton/dialogHelper";
import { useAPIResultHandler } from "../_helper/responseHandle";

const EXAM_HEAD_LABEL = [
    { id: 'name', label: 'Tên', alignRight: false },
    { id: 'type', label: 'Thể loại', alignRight: false },
    { id: 'dateStart', label: 'Ngày bắt đầu', alignRight: false },
    { id: 'maxMember', label: 'Tối đa', alignRight: false },
    { id: '' }
]

const ExamPage = () => {
    const [maxRow, setMaxRow] = useState(0);
    const [list, setList] = useState<any[]>([]);
    const auth = useRecoilValue(authAtom);
    const apiResultHandler = useAPIResultHandler();
    const initSelectOption = {
        searchby: "name",
        searchvalue: "",
        orderby: "name",
        orderdirection: "asc",
        start: 0,
        count: 5,
    }

    useEffect(() => {
        onSelectChanged(initSelectOption);
    }, []);


    const onSelectChanged = async (option: ISelectOption) => {
        console.log("OnSelectChanged");
        console.log(option);
        
        const [error1, newList] = await APIExam.select(option, auth?.token);
        if (error1) {
            if(!apiResultHandler.catchFatalError(error1)){
                DialogHelper.showAlert(error1.errorMessage);
            }
            return;
        }

        const [error2, newMaxRow] = await APIExam.count(option, auth?.token);
        if (error2) {
            if(!apiResultHandler.catchFatalError(error2)){
                DialogHelper.showAlert(error2.errorMessage);
            }
            return;
        }
        console.log(newList);
        console.log(newMaxRow);

        setList(newList);
        setMaxRow(newMaxRow);
    }

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
            maxRow={maxRow}
            list={list}
            initSelectOption={initSelectOption}

            onClickCreate={onClickCreate}
            onChangedSearch={onSelectChanged}

            headLabels={EXAM_HEAD_LABEL}

            onRenderItem={(data) => {
                const { id, name, type, dateStart, maxMember, rules } = data.row;
                const isItemSelected = data.isItemSelected;

                const cells = [];
                cells.push(
                    <TableCell component="th" scope="row" padding="none">
                        {name}
                    </TableCell>
                );
                cells.push(
                    <TableCell align="left">
                        {type}
                    </TableCell>
                );
                cells.push(
                    <TableCell align="left">
                        {dateStart}
                    </TableCell>
                );
                cells.push(
                    <TableCell align="left">
                        {maxMember}
                    </TableCell>
                );
                cells.push(
                    <TableCell align="right">
                        <ItemMoreMenu
                            items={[
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
                            data={data.row}
                        ></ItemMoreMenu>
                    </TableCell>
                );
                return cells;
            }}
        ></DataTable2>
    )
}

export default ExamPage;