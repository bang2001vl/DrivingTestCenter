import { Avatar, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { type } from "os";
import { FC } from "react";
import LabelCustom from "../../components/Label";
import SearchNotFound from "../../components/SearchNotFound";
import { appConfig } from "../../configs";
import { DataTableLayout, DataTableLayoutProps } from "../../sections/CRUD/BasicDataTable";
import DataListHead from "../../sections/user/DataListHead";
import ItemMoreMenu from "../../sections/user/ItemMoreMenu";
import { createBEPublicURI } from "../../_helper/helper";

interface IProps {
    dataList: IData[],
    onEdit?: (data: IData) => void,
    onDelete?: (data: IData) => void,
}

interface IData {
    id: number;
    username: string;
    roleId: number;
    fullname: string;
    birthday: string;
    gender: number;
    email: string;
    phoneNumber: string;
    address: string;
    createdAt: string;
    avatarURI?: string;
}

export type AccountManagerTableProps = IProps & Partial<DataTableLayoutProps>;

export const AccountManagerTable: FC<AccountManagerTableProps> = (props) => {
    function getGender(data: IData) {
        if (data.gender === 0) {
            return "Nữ";
        } else {
            return "Nam";
        }
    }
    function getRole(data: IData) {
        if (data.roleId === 0) {
            return {
                text: "Admin",
                color: "success"
            };
        } else if (data.roleId === 1) {
            return {
                text: "Học viên",
                color: "secondary"
            };
        } else {
            return {
                text: "Giảng viên",
                color: "warning"
            };
        }
    }

    function renderRow(item: IData) {
        let timeFormat = "dd/MM/yyyy";
        const role = getRole(item);
        const cells = new Array();
        cells.push(<TableCell>
            <Avatar src={item.avatarURI ? createBEPublicURI(item.avatarURI) : appConfig.defaultImageURI} style={{ width: 30, height: 30 }} />
        </TableCell>);
        cells.push(<TableCell>
            <Typography variant="subtitle2">
                {item.fullname}
            </Typography>
        </TableCell>);
        // cells.push(<TableCell>{getGender(item)}</TableCell>);
        cells.push(<TableCell>{item.email}</TableCell>);
        cells.push(<TableCell>{item.phoneNumber}</TableCell>);
        cells.push(<TableCell width='30%'>{item.address}</TableCell>);
        // cells.push(<TableCell>{format(parseISO(item.createdAt), timeFormat)}</TableCell>);
        cells.push(<TableCell>


            <LabelCustom variant="ghost" color={role.color}>
                {role.text}
            </LabelCustom>

        </TableCell>);
        cells.push(<TableCell>
            <ItemMoreMenu
                data={item}
                items={[
                     {
                        label: "Chỉnh sửa",
                        iconURI: "eva:edit-fill",
                        onClick: props.onEdit
                    },
                    {
                        label: "Xóa",
                        iconURI: "eva:trash-2-outline",
                        onClick: props.onDelete
                    },
                   
                ]}
            ></ItemMoreMenu>
        </TableCell>);
        return <TableRow hover={true}
        >{cells}
        </TableRow>;
    }

    return <DataTableLayout
        {...props}
    >
        {props.dataList.map(e => renderRow(e))}
    </DataTableLayout>
}