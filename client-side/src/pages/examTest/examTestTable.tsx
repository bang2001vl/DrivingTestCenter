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
    room: string,
    dateTimeStart: Date,
    dateTimeEnd: Date,
    maxMember: number,
    countStudent: number,
    exam: {type: string, name: string,},
}
export const ExamTestTable: FC<IProps> = (props) => {
    let timeFormat = "HH:mm";
    let dateFormat = "dd/MM/yyyy";
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

       

    return <>{props.dataList.map((data) => {
        const cells = [];
        cells.push(<TableCell>{data.name}</TableCell>);
        cells.push(<TableCell>{data.exam.name}</TableCell>);
        cells.push(<TableCell>{data.exam.type}</TableCell>);
        cells.push( <TableCell>{`${format(data.dateTimeStart, timeFormat)} - ${format(data.dateTimeEnd, timeFormat)}`}</TableCell>  );
        cells.push(<TableCell>{data.room}</TableCell>);

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
        return cells;
    })}
    </>
}