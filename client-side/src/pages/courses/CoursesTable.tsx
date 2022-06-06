import { Avatar, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { isAfter, isBefore } from "date-fns";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { FC } from "react";
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
    id: number,
    name: string,
    price: number,
    location: string,
    dateStart: Date,
    dateEnd: Date,
    maxMember: number,
}

export const CoursesTable: FC<IProps & DataTableLayoutProps> = (props) => {
    function getStatus(data: IData) {
        const now = new Date();
        if (isBefore(data.dateStart, now)) {
            return {
                text: "Sắp mở",
                color: "#1BB3E3",
            }
        }
        else if (isAfter(data.dateEnd, now)) {
            return {
                text: "Hoàn thành",
                color: "#00DB99",
            };
        }
        else {
            return {
                text: "Đang thực hiện",
                color: "#E31B1B",
            };
        }
    }

    function renderRow(item: IData) {
        //     let timeFormat = "dd/MM/yyyy";
        //     const role = getRole(item);
        //     const cells = new Array();
        //     cells.push(<TableCell>
        //         <Stack direction={"row"} alignItems={"center"} spacing={1}>
        //             <Avatar src={item.avatarURI ? createBEPublicURI(item.avatarURI) : appConfig.defaultImageURI} style={{ width: 25, height: 25 }} />

        //             <label>{item.fullname}</label>
        //         </Stack>
        //     </TableCell>);
        //     cells.push(<TableCell>{getGender(item)}</TableCell>);
        //     cells.push(<TableCell>{item.email}</TableCell>);
        //     cells.push(<TableCell>{item.phoneNumber}</TableCell>);
        //     cells.push(<TableCell>{item.address}</TableCell>);
        //     // cells.push(<TableCell>{format(parseISO(item.createdAt), timeFormat)}</TableCell>);
        //     cells.push(<TableCell>

        //         {role.text}


        //     </TableCell>);
        //     cells.push(<TableCell>
        //         <ItemMoreMenu
        //             data={item}
        //             items={[
        //                 {
        //                     label: "Delete",
        //                     iconURI: "eva:trash-2-outline",
        //                     onClick: props.onDelete
        //                 },
        //                 {
        //                     label: "Edit",
        //                     iconURI: "eva:edit-fill",
        //                     onClick: props.onEdit
        //                 },
        //             ]}
        //         ></ItemMoreMenu>
        //     </TableCell>);
        return <Grid key={item.id} item xs={12} sm={6} md={3}>
          
        </Grid>
    }

    return <DataTableLayout
        {...props}
    >
        <Grid container spacing={3}>
            {props.dataList.map(e => renderRow(e))}
        </Grid>
    </DataTableLayout>
}