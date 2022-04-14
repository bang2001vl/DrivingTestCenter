import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import ItemMoreMenu from './user/ItemMoreMenu';
import DataListToolbar from './user/DataListToolbar';
import DataListHead from './user/DataListHead';
import { RecoilState, useRecoilValue } from 'recoil';
import { IListAction } from '../recoil/actions/_defaultListActions';
import { ISearchOptions } from './DataTable';
import { IOrderOptions, IPagingOption, ISearchOption, ISelectOption } from '../api/_deafaultCRUD';
import { styled } from '@mui/styles';

// ----------------------------------------------------------------------

export interface ISearchProperty {
    key: string,
    label: string,
}

// export interface ISearchOptions {
//     orderType: string; // "ASC" | "DESC" ...
//     orderBy: string; // "name" | "id" ...

//     searchProperty: ISearchProperty; // "name" | "id" ...
//     searchValue: string;

//     filterOptions?: any;
// }

interface TypeProps {
    title: string,

    list: any[],
    maxRow: number,

    onChangedSearch: (options: ISelectOption) => void,

    onClickCreate: any,

    headLabels: any,

    onRenderItem: (data: {
        row: any,
        isItemSelected: boolean
    }) => any,

    initSelectOption: ISelectOption,
}

const MyPage = styled(Page)(({ theme }) => ({
    fontFamily: "Arial"
  }));

export default function DataTable2(props: TypeProps) {
    const dataList = props.list;
    const maxRow = props.maxRow;

    const [selected, setSelected] = useState<string[]>([]);

    const [pageNumber, setPageNumber] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(props.initSelectOption.count);

    const [searchProperty, setSearchProperty] = useState(props.initSelectOption.searchby);
    const [searchValue, setSearchValue] = useState(props.initSelectOption.searchvalue);

    const [orderBy, setOrderBy] = useState(props.initSelectOption.orderby);
    const [orderType, setOrderType] = useState(props.initSelectOption.orderdirection);

    const searchProperties = [
        {
            key: "name",
            label: "By name"
        },
        {
            key: "id",
            label: "By id"
        }
    ];

    const getOptions = (presets: {
        searchProperty?: string
        , searchValue?: string
        , orderProperty?: string
        , orderDirection?: string
        , pageNumber?: number
        , rowsPerPage?: number
    }
    ) => {
        const _searchProperty = presets.searchProperty !== undefined ? presets.searchProperty : searchProperty;
        const _searchValue = presets.searchValue !== undefined ? presets.searchValue : searchValue;
        const _orderProperty = presets.orderProperty !== undefined ? presets.orderProperty : orderBy;
        const _orderDirection = presets.orderDirection !== undefined ? presets.orderDirection : orderType;
        const _pageNumber = presets.pageNumber !== undefined ? presets.pageNumber : pageNumber;
        const _rowsPerPage = presets.rowsPerPage !== undefined ? presets.rowsPerPage : rowsPerPage;
        return {
            searchby: _searchProperty,
            searchvalue: _searchValue,
            orderby: _orderProperty,
            orderdirection: _orderDirection,
            start: _pageNumber > 0 ? (_pageNumber - 1) * _rowsPerPage : 0,
            count: _rowsPerPage,
        }
    }

    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && orderType === 'asc';
        const direction = isAsc ? 'desc' : 'asc';
        console.log(`Order by ${property}, direction ${direction}`);

        // Change UI
        setOrderType(direction);
        setOrderBy(property);

        props.onChangedSearch(getOptions({
            orderDirection: direction,
            orderProperty: property,
        }));
    };

    const handleSelectAllClick = (event: any) => {
        if (event.target.checked) {
            const newSelecteds = dataList.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleCheckChanged = (event: any, itemName: string) => {
        const selectedIndex = selected.indexOf(itemName);
        let newSelected: string[] = [];
        if (selectedIndex === -1) {
            // Add if not selected yet
            newSelected = newSelected.concat(selected, itemName);
        } else {
            // deselect if already selected
            if (selectedIndex === 0) {
                newSelected = newSelected.concat(selected.slice(1));
            } else if (selectedIndex === selected.length - 1) {
                newSelected = newSelected.concat(selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selected.slice(0, selectedIndex),
                    selected.slice(selectedIndex + 1)
                );
            }
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: any, newPage: any) => {
        setPageNumber(newPage);

        props.onChangedSearch(getOptions({
            pageNumber: newPage,
        }));
    };

    const handleChangeRowsPerPage = (event: any) => {
        const newPageNumber = 0;
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPageNumber(newPageNumber);
        props.onChangedSearch(getOptions({
            pageNumber: newPageNumber,
            rowsPerPage: newRowsPerPage,
        }));
    };

    const handleSearchValueChanged = (event: any) => {
        const value = event.target.value;
        if(value)
        console.log("Search value = " + value);

        setSearchValue(value);

        props.onChangedSearch(getOptions({
            searchValue: value,
        }));
    };

    const handleSearchPropertyChanged = (value: string) => {
        console.log("Search property = " + value);

        setSearchProperty(value);

        props.onChangedSearch(getOptions({
            searchProperty: value,
        }));
    }

    const emptyRows = pageNumber > 0 ? Math.max(0, (1 + pageNumber) * rowsPerPage - dataList.length) : 0;
    console.log("Empty rows = " + emptyRows);

    // const filteredUsers = applySortFilter(dataList, getComparator(orderType, orderBy), searchValue);

    const isUserNotFound = dataList.length === 0;
    console.log("isUserNotFound = " + isUserNotFound);

    return (
        // @ts-ignore
        <Page title={props.title} >
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        User
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => props.onClickCreate()}
                        startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}
                    >
                        Create new
                    </Button>
                </Stack>

                <Card>
                    {DataListToolbar({
                        numSelected: selected.length,

                        searchValue: searchValue,
                        onSearchValueChanged: handleSearchValueChanged,

                        searchProperties: searchProperties,
                        searchProperty: searchProperty,
                        onSearchPropertyChanged: handleSearchPropertyChanged,
                    })}

                    <Scrollbar sx={undefined}>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <DataListHead
                                    order={orderType}
                                    orderBy={orderBy}
                                    headLabel={props.headLabels}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                    rowCount={maxRow}
                                />

                                <TableBody>
                                    {dataList
                                        .map((row) => {
                                            const { id, name } = row;
                                            const isItemSelected = selected.indexOf(name) !== -1;

                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            onChange={(event) => handleCheckChanged(event, name)}
                                                        />
                                                    </TableCell>

                                                    {props.onRenderItem({
                                                        row: row,
                                                        isItemSelected: isItemSelected,
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={searchValue} />
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
                        count={maxRow}
                        rowsPerPage={rowsPerPage}
                        page={pageNumber}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
}
