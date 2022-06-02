import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { FC } from "react";
import internal from "stream";
import ItemMoreMenu from "../../sections/user/ItemMoreMenu";
import { formatNumber } from "../../_helper/helper";
interface IProps {
    dataList: IData[];
    onEdit?: (data: IData) => void,
    onDelete?: (data: IData) => void,
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
    exam: {type: string, name: string,},
}
export const ExamTestTable: FC<IProps> = (props) => {
    function getStatus(data: IData) {
        const now = new Date();
        if (isAfter(data.dateTimeStart, now)) {
            return "Coming"
        }
        else if (isAfter(data.dateTimeEnd, now)) {
            return "Happening"
        }
        else {
            return "Closed"
        }
    }

    function renderRow(data: IData) {
        let timeFormat = "HH:mm";
        let dateFormat = "dd/MM/yyyy";
        return (
            <TableRow key={data.id}>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.exam.name}</TableCell>
                <TableCell>{data.exam.type}</TableCell>
                <TableCell>{`${format(data.dateTimeStart, timeFormat)} - ${format(data.dateTimeEnd, timeFormat)}`}</TableCell>
                <TableCell>{`${format(data.dateTimeStart, timeFormat)}`}</TableCell>
                <TableCell>{data.location}</TableCell>
                <TableCell>{`${data.countStudent}/${data.maxMember}`}</TableCell>
                <TableCell>{getStatus(data)}</TableCell>
                <TableCell>
                    <ItemMoreMenu
                        data={data}
                        items={[
                            {
                                label: "Delete",
                                iconURI: "eva:trash-2-outline",
                                onClick: props.onDelete
                            },
                            {
                                label: "Edit",
                                iconURI: "eva:edit-fill",
                                onClick: props.onEdit
                            },
                        ]}
                    ></ItemMoreMenu>
                </TableCell>
            </TableRow>
        );
    }

    return <TableContainer sx={{ minWidth: 800 }}>
        <Table>
            <TableHead >
                <TableRow>
                    <TableCell >Name</TableCell>
                    <TableCell align="left">Exam</TableCell>
                    <TableCell align="left">Type</TableCell>
                    <TableCell align="left">Exam Time</TableCell>
                    <TableCell align="left">Exam Date</TableCell>
                    <TableCell align="left">Room</TableCell>
                    <TableCell align="left">Candicates</TableCell>
                    <TableCell align="left">Status</TableCell>
                    {/* Actions cell */}
                    <TableCell align="right"></TableCell> 
                </TableRow>
            </TableHead>
            <TableBody>
                {props.dataList.map(e => renderRow(e))}
            </TableBody>
        </Table>
    </TableContainer>
}