import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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
import { AccountSingleton } from '../singleton/account';

// ----------------------------------------------------------------------

export interface ISearchProperty {
    key: string,
    label: string,
}
interface ISelectable<T = any> {
    label: string,
    value: T
}

export interface DataTable4Props {
    searchOptionList: ISelectable<any>[];
    orderOptionList: ISelectable[];
    searchbarText: string | undefined;
    title: string,
    textLabel: string,
    cardColor?: string,
    onRenderItem: (dataList: any[], select: () => void, emptyView?: JSX.Element) => void,
    select: (params: URLSearchParams) => Promise<MyResponse>,
    count: (params: URLSearchParams) => Promise<MyResponse>,
    onClickCreate?: (select: () => void) => void,
    onClickLoadExcel?: (select: () => void) => void,

    needReload?: boolean,
    isfull?: boolean,
}

export const DataTable4 = forwardRef((props: DataTable4Props, ref) => {
    console.log("REF", ref);

    useImperativeHandle(ref, () => ({
        select
    }))
    const isAdmin = AccountSingleton.instance.isAdmin;

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
            props.onClickCreate(select);
        }
    }
    const onRenderTable = () => {
        return (<>
            <MySearchBar
                hintText={props.searchbarText}
                searchOptionList={props.searchOptionList}
                orderOptionList={props.orderOptionList}
                onSubmit={(opt) => {
                    setOptions(opt);
                }}
            ></MySearchBar>
            {/*@ts-ignore*/}
            {props.onRenderItem(dataList, select, (
                dataList.length === 0
                    ? <Container>
                        <SearchNotFound searchQuery={options.searchvalue} />
                    </Container>
                    : undefined
            ))
            }

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
        </>
        )
    }

    return (
        // @ts-ignore
        <Page title={props.title} style={{ paddingLeft: "20px" }}>
            <Container style={{ maxWidth: '1920px' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
                        {props.textLabel}
                    </Typography>
                    {
                        props.isfull
                            ?
                            <Button
                                variant="contained"
                                disabled={true}
                                startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}
                            >
                                {"Đầy"}
                            </Button>
                            :
                            <Stack direction={"row"} spacing={2}>{
                                props.onClickLoadExcel && (
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            if (props.onClickLoadExcel) {
                                                props.onClickLoadExcel(select);
                                            }
                                        }}
                                        startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}
                                    >
                                        Import Excel
                                    </Button>
                                )
                            }
                                {(isAdmin) ?
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            if (props.onClickCreate) {
                                                console.log("SelectRaw0", select);

                                                props.onClickCreate(select);
                                            }
                                        }}
                                        startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}
                                    >
                                        {"Thêm mới"}
                                    </Button>
                                    : <></>}
                            </Stack>
                    }
                </Stack>
                {(props.cardColor === undefined) ? <Card>
                    {onRenderTable()}
                </Card> : onRenderTable()}
            </Container>
        </Page>
    );
})
