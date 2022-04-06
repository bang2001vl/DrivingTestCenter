import { Avatar, Stack, TableCell, Typography } from "@mui/material";
import { sentenceCase } from "change-case";
import { useState } from "react";
import Label from "../components/Label";
import DataTable from "../sections/DataTable";
import DataListHead from "../sections/user/DataListHead";
import DataListToolbar from "../sections/user/DataListToolbar";
import ItemMoreMenu from "../sections/user/ItemMoreMenu";
import users from "../_mocks_/user";

const USER_HEAD_LABEL = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'company', label: 'Company2', alignRight: false },
    { id: 'role', label: 'Role2', alignRight: false },
    { id: 'isVerified', label: 'Verified2', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' }
]

const UserPage = () => {
    const onClickCreate = () => {
        window.alert("Clicked create");
    }
    const onClickEdit = (item: any) => {
        window.alert("Clicked edit on item = " + JSON.stringify(item, undefined, 4));
    }
    const onClickDelete = (item: any) => {
        window.alert("Clicked delete on item = " + JSON.stringify(item, undefined, 4));
    }

    return (
        <DataTable
            title="User | Homepage"
            dataList={users}

            onClickCreate={onClickCreate}
            
            menuItems={[
                {
                    label: "Delete",
                    iconURI: "eva:trash-2-outline",
                    onClick: onClickDelete
                },
                {
                    label: "Edit",
                    iconURI: "eva:edit-fill",
                    onClick: onClickEdit
                },
            ]}

            onRenderHeader={(data) => {
                return (
                    <DataListHead
                        {...data}
                        headLabel={USER_HEAD_LABEL}
                    ></DataListHead>
                )
            }}

            onRenderItem={(data) => {
                const { id, name, role, status, company, avatarUrl, isVerified } = data.row;
                const isItemSelected = data.isItemSelected;
                const cells = [];
                cells.push(<TableCell component="th" scope="row" padding="none">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={name} src={avatarUrl} />
                        <Typography variant="subtitle2" noWrap>
                            {name}
                        </Typography>
                    </Stack>
                </TableCell>);
                cells.push(<TableCell align="left">{company}</TableCell>);
                cells.push(<TableCell align="left">{role}</TableCell>);
                cells.push(<TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>);
                cells.push(<TableCell align="left">
                    <Label
                        variant="ghost"
                        color={(status === 'banned' && 'error') || 'success'}
                    >
                        {sentenceCase(status)}
                    </Label>
                </TableCell>);
                return cells;
            }}
        ></DataTable>
    )
}

export default UserPage;