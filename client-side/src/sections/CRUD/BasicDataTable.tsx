import { TableContainer, Table, TableBody } from "@mui/material";
import { FC } from "react";
import DataListHead from "../user/DataListHead";

export interface DataTableLayoutProps<T = any> {
    headLabels?: any,
    emptyView?: JSX.Element,
}
export const DataTableLayout: FC<DataTableLayoutProps> = (props) => {
    return <TableContainer sx={{ minWidth: 800, minHeight: 400 }}>
        <Table>
            <DataListHead
                headLabel={props.headLabels}
            />
            <TableBody>
                {props.children}
            </TableBody>
        </Table>
        {props.emptyView}
    </TableContainer>
}