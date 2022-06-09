import { Label } from "@mui/icons-material";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format, isAfter, isBefore } from "date-fns";
import { FC } from "react";
import { BorderLinearProgress } from "../../components/LinearProgress";
import { DataTableLayout, DataTableLayoutProps } from "../../sections/CRUD/BasicDataTable";
import DataListHead from "../../sections/user/DataListHead";
import ItemMoreMenu from "../../sections/user/ItemMoreMenu";
import { formatNumber } from "../../_helper/helper";
interface IProps {
    dataList: IData[];
    onEdit?: (data: IData) => void,
    onDelete?: (data: IData) => void,
    onDetail?: (data: IData) => void,
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
export const ExamTable: FC<IProps & DataTableLayoutProps> = (props) => {
    function getStatus(data: IData) {
        const now = new Date();
        if (isAfter(data.dateOpen, now)) {
            return {
                text: "Chưa mở",
                color: "#1BB3E3",
            }
        }
        else if (isAfter(data.dateClose, now)) {
            return {
                text: "Đang mở",
                color: "#00DB99",
            };
        }
        else if (isAfter(data.dateStart, now)) {
            return {
                text: "Đã đóng",
                color: "#D31BE3",
            };
        }
        else if (isAfter(data.dateEnd, now)) {
            return {
                text: "Đang thi",
                color: "#E3931B",
            };
        }
        else {
            return {
                text: "Kết thúc",
                color: "#E31B1B",
            };
        }
    }

    function renderRow(item: IData) {
        let timeFormat = "dd/MM/yyyy";
        const status = getStatus(item);

        const cells = new Array();
        cells.push(<TableCell key={1}>
            <Typography variant="subtitle2">
                {item.name}
            </Typography>
        </TableCell>);
        cells.push(<TableCell key={2}>{item.type}</TableCell>);
        cells.push(<TableCell key={3}>{`${format(item.dateOpen, timeFormat)} - ${format(item.dateClose, timeFormat)}`}</TableCell>);
        cells.push(<TableCell key={4}>{`${format(item.dateStart, timeFormat)} - ${format(item.dateEnd, timeFormat)}`}</TableCell>);
        cells.push(
            <TableCell key={5}>
                <Box style={{ display: "flex" }}>
                    <BorderLinearProgress style={{ margin: '3px', marginRight: "5", width: "50px" }} variant="determinate" value={(Number(item.countStudent / item.maxMember) * 100 == 0 ? 1 : Number(item.countStudent / item.maxMember) * 100)}></BorderLinearProgress>
                    {`${item.countStudent}/${item.maxMember}`}
                </Box>
            </TableCell>
        );
        cells.push(<TableCell key={6}>{formatNumber(item.price)}</TableCell>);
        cells.push(
            <TableCell key={7}>
                {status.text}
            </TableCell>
        );
        cells.push(<TableCell key={8}>
            <ItemMoreMenu
                data={item}
                items={[
                    {
                        label: "Edit",
                        iconURI: "eva:edit-fill",
                        onClick: props.onEdit
                    },
                    {
                        label: "Detail",
                        iconURI: "eva:info-outline",
                        onClick: props.onDetail
                    },
                    {
                        label: "Delete",
                        iconURI: "eva:trash-2-outline",
                        onClick: props.onDelete
                    },
                ]}
            ></ItemMoreMenu>
        </TableCell>);
        return <TableRow key={item.id}>
            {cells}
        </TableRow>;
    }

    return <DataTableLayout
        {...props}
    >
        {props.dataList.map(e => renderRow(e))}
    </DataTableLayout>
}


