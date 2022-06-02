import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { FC } from "react";
import ItemMoreMenu from "../../sections/user/ItemMoreMenu";
import { formatNumber } from "../../_helper/helper";
interface IProps {
    dataList: IData[];
    onEdit?: (data: IData) => void,
    onDelete?: (data: IData) => void,
}
interface IData {
    id: number,
    name: string,
    type: string,
    dateOpen: Date,
    dateClose: Date,
    dateStart: Date,
    dateEnd: Date,
    countStudent: number,
    maxMember: number,
    price: number,
}
export const ExamTable: FC<IProps> = (props) => {
    function getStatus(data: IData) {
        const now = new Date();
        if (isAfter(data.dateOpen, now)) {
            return "Pre-Open"
        }
        else if (isAfter(data.dateClose, now)) {
            return "Opening"
        }
        else if (isAfter(data.dateStart, now)) {
            return "Pre-Start"
        }
        else if (isAfter(data.dateEnd, now)) {
            return "Happening"
        }
        else {
            return "Closed"
        }
    }

    function renderRow(data: IData) {
        let timeFormat = "dd/MM/yyyy";
        return (
            <TableRow key={data.id}>
                <TableCell>{data.name}</TableCell>
                <TableCell>{data.type}</TableCell>
                <TableCell>{`${format(data.dateOpen, timeFormat)} - ${format(data.dateClose, timeFormat)}`}</TableCell>
                <TableCell>{`${format(data.dateStart, timeFormat)} - ${format(data.dateEnd, timeFormat)}`}</TableCell>
                <TableCell>{`${data.countStudent}/${data.maxMember}`}</TableCell>
                <TableCell>{formatNumber(data.price)}</TableCell>
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
                    <TableCell align="left">Type</TableCell>
                    <TableCell align="left">Registration Date</TableCell>
                    <TableCell align="left">Exam Date</TableCell>
                    <TableCell align="left">Candicates</TableCell>
                    <TableCell align="left">Fees</TableCell>
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