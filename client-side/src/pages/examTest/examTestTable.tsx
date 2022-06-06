import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { FC } from "react";
import internal from "stream";
import { BorderLinearProgress } from "../../components/LinearProgress";
import { DataTableLayout, DataTableLayoutProps } from "../../sections/CRUD/BasicDataTable";
import DataListHead from "../../sections/user/DataListHead";
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
    exam: { type: string, name: string, },
}
export const ExamTestTable: FC<IProps & DataTableLayoutProps> = (props) => {
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
        cells.push(<TableCell>{data.name}</TableCell>);
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
        return <TableRow
        >{cells}
        </TableRow>;
    }

    return <DataTableLayout
        {...props}
    >
        {props.dataList.map(e => renderRow(e))}
    </DataTableLayout>
}