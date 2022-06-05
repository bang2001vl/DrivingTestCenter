import React, { useEffect, useState } from 'react';
import { generatePath, useNavigate } from "react-router-dom";
// material
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Toolbar
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import DataListToolbar from './user/DataListToolbar';
import DataListHead from './user/DataListHead';
import { ISelectOption } from '../api/_deafaultCRUD';
import { MySearchBar } from '../components/MySearchBar.tsx/MySearchBar';
import useAPI from '../hooks/useApi';
import { DialogHelper } from '../singleton/dialogHelper';
import { appConfig } from '../configs';

// ----------------------------------------------------------------------

export interface ISearchProperty {
    key: string,
    label: string,
}
interface ISelectable<T = any> {
    label: string,
    value: T
}

interface TypeProps {
    searchOptionList: ISelectable<any>[];
    orderOptionList: ISelectable[];
    searchbarText: string | undefined;
    title: string,
    textLabel: string,
    maxRow: number,

    selectURL: string,
    createURL:string,


    headLabels: any,

    routeName: string,

    onRenderItem: (dataList: any[])=>void,
    //onSelect: () => void,

    needReload: boolean,
}

export default function DataTable4(props: TypeProps) {

    const [isLoading, setIsLoading] = useState(false);
    const api = useAPI();
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [options, setOptions] = useState({
        searchby: "name",
        searchvalue: "",
        orderby: "name",
        orderdirection: "asc",
    });
    const [maxCount, setMaxCount] = useState(10);
    const [dataList, setDataList] = useState<any[]>([]);
    useEffect(() => {
        countMax();
    }, [options.searchvalue]);

    useEffect(() => {
        select();
    }, [page, rowPerPage, options]);
    const select = () => {
        //console.log("onSelect");

        const queryParams = new URLSearchParams({
            ...options,
            start: rowPerPage * page,
            count: rowPerPage,
        } as any).toString();

        const url = `${appConfig.backendUri}/${props.routeName}/${props.selectURL}?${queryParams}`
        setIsLoading(true);
        api.get(url)
            .then(res => {
                setIsLoading(false);
                if (res.result) {
                    setDataList(res.data);
                }
                else {
                    DialogHelper.showAlert(res.errorMessage);
                }
            })
    }
    const countMax = () => {
        //console.log("onCountMax");

        const queryParams = new URLSearchParams({
            ...options,
            start: rowPerPage * page,
            count: rowPerPage,
        } as any).toString();

        const url = `${appConfig.backendUri}/${props.routeName}/count?${queryParams}`
        setIsLoading(true);
        api.get(url)
            .then(res => {
                setIsLoading(false);
                if (res.result) {
                    setMaxCount(res.data);
                }
                else {
                    DialogHelper.showAlert(res.errorMessage);
                }
            })
    }
    const emptyRows = rowPerPage - dataList.length;
    console.log("Empty rows = " + emptyRows);

    // const filteredUsers = applySortFilter(dataList, getComparator(orderType, orderBy), searchValue);

    const isUserNotFound = dataList.length === 0;
    console.log("isUserNotFound = " + isUserNotFound);
    const handleCreate = () => {
        // rootDialog.openDialog({
        //     children: <ExamCreateUI
        //         method={EDIT_METHOD.create}
        //         onSuccess={() => {
        //             rootDialog.closeDialog();
        //             select();
        //         }}
        //         onClose={() => rootDialog.closeDialog()}
        //     />,
        // });
        navigate(props.createURL, { replace: true });
    }

    return (
        // @ts-ignore
        <Page title={props.title} >
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
                        {props.textLabel}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => handleCreate()}
                        startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}
                    >
                        Create new
                    </Button>
                </Stack>

                <Card>
                    <MySearchBar
                        hintText={props.searchbarText}
                        searchOptionList={props.searchOptionList}
                        orderOptionList={props.orderOptionList}
                        onSubmit={(opt) => {
                            setOptions(opt);
                        }}
                    ></MySearchBar>
                    {/*@ts-ignore*/}
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <DataListHead
                                    headLabel={props.headLabels}
                                />

                                <TableBody>  {props.onRenderItem(dataList)}

                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 40 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={options.searchvalue} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={maxCount}
                        rowsPerPage={rowPerPage}
                        page={page}
                        onPageChange={(ev, newPage) => {
                            setPage(newPage);
                        }}
                        onRowsPerPageChange={(ev) => {
                            const newRowPerPage = ev.target.value;
                            setRowPerPage(parseInt(newRowPerPage, 10));
                            setPage(0);
                        }}
                    />
                </Card>
            </Container>
        </Page>
    );
}
