import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
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
    onDelete?: (data: IData) => void,
}
interface IData {
    id: number,
    totalPrice: number,
            reason: string,
            code: string,
            createdAt: string,
}
export type BillTableProps = IProps & DataTableLayoutProps;
export const BillTable: FC<BillTableProps> = (props) => {

    function renderRow(data: IData) {
        let dateTimeFormat = "HH:mm dd/MM/yyyy";

        const cells = [];
        cells.push(<TableCell key={0}>{data.code}</TableCell>);
        cells.push(<TableCell key={1}>{`${formatNumber(data.totalPrice)}VND`}</TableCell>);
        cells.push(<TableCell key={2}>{data.reason}</TableCell>);
        cells.push(<TableCell key={3}>{`${format(new Date(data.createdAt), dateTimeFormat)}`}</TableCell>);
        cells.push(<TableCell key={4}>
            <ItemMoreMenu
                data={data}
                items={buildActions()}
            ></ItemMoreMenu>
        </TableCell>);
        return <TableRow
        >{cells}
        </TableRow>;
    }

    const buildActions = ()=>{
        const actions = [];
        if (props.onDelete) {
            actions.push({
                label: "Hoàn tác",
                iconURI: "eva:trash-2-outline",
                onClick: props.onDelete
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