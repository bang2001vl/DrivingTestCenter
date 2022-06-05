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
import { MyResponse } from '../api/service';

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

    onRenderItem: (dataList: any[], emptyView?: JSX.Element) => void,
    select: (params: URLSearchParams) => Promise<MyResponse>,
    count: (params: URLSearchParams) => Promise<MyResponse>,
    onClickCreate?: () => void,

    needReload: boolean,
}

export default function DataTable4(props: TypeProps) {

    const [isLoading, setIsLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [options, setOptions] = useState({
        searchby: props.searchOptionList[0].value.searchby,
        searchvalue: "",
        orderby: props.orderOptionList[0].value.orderby,
        orderdirection: props.orderOptionList[0].value.orderdirection,
    });
    const [maxCount, setMaxCount] = useState(10);
    const [dataList, setDataList] = useState<any[]>([]);
    useEffect(() => {
        countMax();
    }, [options.searchvalue, props.needReload]);

    useEffect(() => {
        select();
    }, [page, rowPerPage, options, props.needReload]);

    const select = () => {
        //console.log("onSelect");

        const queryParams = new URLSearchParams({
            ...options,
            start: rowPerPage * page,
            count: rowPerPage,
        } as any);

        setIsLoading(true);
        props.select(queryParams)
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
        } as any);

        setIsLoading(true);
        props.count(queryParams)
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
        if (props.onClickCreate) {
            props.onClickCreate();
        }
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
                        {/* <TableContainer sx={{ minWidth: 800 }}>
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
                        </TableContainer> */}
                        {props.onRenderItem(dataList, (
                            dataList.length === 0
                            ? <Container>
                                <SearchNotFound searchQuery={options.searchvalue} />
                            </Container>
                            : undefined
                        ))
                        }
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
