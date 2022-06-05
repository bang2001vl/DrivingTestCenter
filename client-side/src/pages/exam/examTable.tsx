import { Label } from "@mui/icons-material";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { FC } from "react";
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
    let timeFormat = "dd/MM/yyyy";
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
    function getColorStatus(status: string) {
        if ((status) == "Pre-Open") {
            return "#1BB3E3"
        }
        else if ((status) == "Opening") {
            return "#00DB99"
        }
        else if ((status) == "Pre-Start") {
            return '#D31BE3'
        }
        else if ((status) == "Happening") {
            return "#E3931B"
        }
        else {
            return "#E31B1B"
        }
    }
    return <>{props.dataList.map((item) => {
        const cells = new Array();
        cells.push(<TableCell>{item.name}</TableCell>);
        cells.push(<TableCell>{item.type}</TableCell>);
        cells.push(<TableCell>{`${format(item.dateOpen, timeFormat)} - ${format(item.dateClose, timeFormat)}`}</TableCell>);
        cells.push(<TableCell>{`${format(item.dateStart, timeFormat)} - ${format(item.dateEnd, timeFormat)}`}</TableCell>);
        cells.push(<TableCell>
            <Box style={{ display: "flex" }}>
                <BorderLinearProgress style={{ margin: '3px', marginRight: "5", width: "50px" }} variant="determinate" value={(Number(item.countStudent / item.maxMember) * 100 == 0 ? 1 : Number(item.countStudent / item.maxMember) * 100)}></BorderLinearProgress>
                {`${item.countStudent}/${item.maxMember}`}
            </Box></TableCell>);
        cells.push(<TableCell>{formatNumber(item.price)}</TableCell>);
        cells.push(<TableCell>

            {getStatus(item)}


        </TableCell>);
        cells.push(<TableCell>
            <ItemMoreMenu
                data={item}
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
    })}
    </>
}


