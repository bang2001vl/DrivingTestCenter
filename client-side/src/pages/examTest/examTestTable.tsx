import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { type } from "os";
import { FC } from "react";
import internal from "stream";
import { BorderLinearProgress } from "../../components/LinearProgress";
import { DataTableLayout, DataTableLayoutProps } from "../../sections/CRUD/BasicDataTable";
import DataListHead from "../../sections/user/DataListHead";
import ItemMoreMenu from "../../sections/user/ItemMoreMenu";
import { formatNumber } from "../../_helper/helper";
interface IProps {
    dataList: IData[];
    onAddStudent?: (data: IData) => void,
    onEdit?: (data: IData) => void,
    onDelete?: (data: IData) => void,
    onDetail?: (data: IData) => void,
}
interface IData {
    id: number,
    examId: number,
    name: string,
    location: string,
    dateTimeStart: Date,
    dateTimeEnd: Date,
    maxMember: number,
    countStudent: number,
    exam: { type: string, name: string, },
}
export type ExamTestTableProps = IProps & DataTableLayoutProps;
export const ExamTestTable: FC<ExamTestTableProps> = (props) => {
    function getStatus(data: IData) {
        const now = new Date();
        if (isAfter(data.dateTimeStart, now)) {
            return "Coming"
        }
        else if (isAfter(data.dateTimeEnd, now)) {
            return "Happening"
        }
        else {
            return "Finish"
        }
    }

    function renderRow(data: IData) {
        let timeFormat = "HH:mm";
        let dateFormat = "dd/MM/yyyy";

        const cells = [];
        cells.push(<TableCell>
            <Typography variant="subtitle2" noWrap>
                {data.name}
            </Typography></TableCell>);
        cells.push(<TableCell>{data.exam.name}</TableCell>);
        cells.push(<TableCell>{data.exam.type}</TableCell>);
        cells.push(<TableCell>{`${format(data.dateTimeStart, timeFormat)} - ${format(data.dateTimeEnd, timeFormat)}`}</TableCell>);
        cells.push(<TableCell>{`${format(data.dateTimeStart, dateFormat)}`}</TableCell>);
        cells.push(<TableCell>{data.location}</TableCell>);

        cells.push(<TableCell>
            <Box style={{ display: "flex" }}>
                <BorderLinearProgress style={{ margin: '3px', marginRight: "5", width: "50px" }} variant="determinate" value={(Number(data.countStudent / data.maxMember) * 100 == 0 ? 1 : Number(data.countStudent / data.maxMember) * 100)}></BorderLinearProgress>
                {`${data.countStudent}/${data.maxMember}`}
            </Box></TableCell>);
        cells.push(<TableCell>  {getStatus(data)}</TableCell>);
        cells.push(<TableCell>
            <ItemMoreMenu
                data={data}
                items={buildActions()}
            ></ItemMoreMenu>
        </TableCell>);
        return <TableRow
        >{cells}
        </TableRow>;
    }

    const buildActions = () => {
        const actions = [];
        if (props.onAddStudent) {
            actions.push({
                label: "Thêm học sinh",
                iconURI: "eva:person-add-outline",
                onClick: props.onDelete
            });
        }
        if (props.onDelete) {
            actions.push({
                label: "Xóa ca thi",
                iconURI: "eva:trash-2-outline",
                onClick: props.onDelete
            });
        }
        if (props.onEdit) {
            actions.push({
                label: "Sửa ca thi",
                iconURI: "eva:edit-fill",
                onClick: props.onEdit
            });
        }
        if (props.onAddStudent) {
            actions.push({
                label: "Thêm học sinh",
                iconURI: "eva:person-add-outline",
                onClick: props.onAddStudent
            });
        }
        if (props.onDetail) {
            actions.push({
                label: "Chi tiết",
                iconURI: "eva:info-outline",
                onClick: props.onDetail
            });
        }
        return actions;
    }

    return <DataTableLayout
        {...props}
    >
        {props.dataList.map(e => renderRow(e))}
    </DataTableLayout>
}