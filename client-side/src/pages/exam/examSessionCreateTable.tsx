import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { FC } from "react";
import internal from "stream";
import { BorderLinearProgress } from "../../components/LinearProgress";
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
}
export const ExamSessionCreateTable: FC<IProps> = (props) => {
    let timeFormat = "HH:mm";
    let dateFormat = "dd/MM/yyyy";


    return <>
        <TableHead>
            <TableRow>
                <TableCell
                    key={1}
                    align={'left'} >
                    Tên ca thi
                </TableCell>
                <TableCell
                    key={2}
                    align={'left'} >
                    Phòng thi
                </TableCell>
                <TableCell
                    key={3}
                    align={'left'} >
                    Giờ thi
                </TableCell>
                <TableCell
                    key={4}
                    align={'left'} >
                    Ngày thi
                </TableCell>
                <TableCell
                    key={5}
                    align={'left'} >
                    Thí sinh tối đa
                </TableCell>

            </TableRow>
        </TableHead>
        <TableBody>
            {
                props.dataList.map((data) => {
                    const cells = [];
                    cells.push(<TableCell>{data.name}</TableCell>);
                    cells.push(<TableCell>{data.location}</TableCell>);
                    cells.push(<TableCell>{`${format(data.dateTimeStart, timeFormat)} - ${format(data.dateTimeEnd, timeFormat)}`}</TableCell>);
                    cells.push(<TableCell>{format(data.dateTimeStart, dateFormat)}</TableCell>);
                    cells.push(<TableCell> {data.maxMember} </TableCell>);
                    cells.push(<TableCell>
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
                    </TableCell>);
                    return <TableRow>{cells} </TableRow>;

                })}
        </TableBody>
    </>
}