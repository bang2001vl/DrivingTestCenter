import React, { useEffect, useState } from 'react';
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
import DataListToolbar3 from './user/DataListToolBar3';
import DataListHead from './user/DataListHead';
import { ISelectOption } from '../api/_deafaultCRUD';

// ----------------------------------------------------------------------

export interface ISearchProperty {
    key: string,
    label: string,
}

interface TypeProps {
    searchbarText?: string,

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

export default function DataTable2(props: TypeProps) {
    const dataList = props.list;

    const [selected, setSelected] = useState<string[]>([]);

    const [pageNumber, setPageNumber] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(props.initSelectOption.count);

    const [searchProperty, setSearchProperty] = useState(props.initSelectOption.searchby);
    const [searchValue, setSearchValue] = useState(props.initSelectOption.searchvalue);

    const [orderBy, setOrderBy] = useState(props.initSelectOption.orderby);
    const [orderType, setOrderType] = useState(props.initSelectOption.orderdirection);

    const maxPage = props.maxRow <= rowsPerPage ? 1
        : (props.maxRow % rowsPerPage === 0 ? props.maxRow / rowsPerPage : props.maxRow / rowsPerPage + 1);

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
        if (value)
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

    //const emptyRows = pageNumber > 0 ? Math.max(0, (1 + pageNumber) * rowsPerPage - dataList.length) : 0;
    const emptyRows = rowsPerPage - dataList.length;
    console.log("Empty rows = " + emptyRows);

    // const filteredUsers = applySortFilter(dataList, getComparator(orderType, orderBy), searchValue);

    const isUserNotFound = dataList.length === 0;
    console.log("isUserNotFound = " + isUserNotFound);

    return (
        // @ts-ignore

            <Container style={{marginTop: '15px'}} >
                <Card>
                    <DataListToolbar3
                        numSelected={selected.length}
                        hintText={props.searchbarText}

                        searchValue={searchValue}
                        onSearchValueChanged={handleSearchValueChanged}
                        
                        createClick={()=>{}}
                        searchProperties={searchProperties}
                        searchProperty={searchProperty}
                        onSearchPropertyChanged={handleSearchPropertyChanged}
                    />
                    {/*@ts-ignore*/}
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <DataListHead
                                    order={orderType}
                                    orderBy={orderBy}
                                    headLabel={props.headLabels}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                    rowCount={maxPage}
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
                        count={maxPage}
                        rowsPerPage={rowsPerPage}
                        page={pageNumber}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
    );
}
