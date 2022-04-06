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

// ----------------------------------------------------------------------

function descendingComparator(a: any, b: any, orderBy: any) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: any, orderBy: any) {
    return order === 'desc'
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: any[], comparator: any, query: any) {
    const stabilizedThis: any[] = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

interface DataItem {
    name: string;
}

export interface ISearchProperty {
    key: string,
    label: string,
}

export interface IOrderOption {
    key: string,
    direction: string;
    label: string,
}

export interface ISearchOptions {
    orderType: string; // "ASC" | "DESC" ...
    orderBy: string; // "name" | "id" ...

    searchProperty: ISearchProperty; // "name" | "id" ...
    searchValue: string;

    filterOptions?: any;
}

interface TypeProps {
    title: string,
    atom: RecoilState<any[]>,
    actionListHook: () => IListAction,

    menuItems: {
        iconURI: string,
        label: string,
        onClick: (item: any) => void,
    }[],

    onClickCreate: any,

    headLabels: any,

    onRenderItem: (data: {
        row: any,
        isItemSelected: boolean
    }) => any,
}

export default function DataTable2(props: TypeProps) {
    const dataList = useRecoilValue(props.atom);
    const actions = props.actionListHook();
    const maxRow = 100;

    const [selected, setSelected] = useState<string[]>([]);

    const [pageNumber, setPageNumber] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchProperty, setSearchProperty] = useState<string>('name');
    const [searchValue, setSearchValue] = useState('');

    const [orderType, setOrderType] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');

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

    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && orderType === 'asc';
        const direction = isAsc ? 'desc' : 'asc';
        console.log(`Order by ${property}, direction ${direction}`);

        setOrderType(direction);
        setOrderBy(property);
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
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageNumber(0);
    };

    const handleSearchValueChanged = (event: any) => {
        const value = event.target.value;
        //console.log("Search value = " + value);

        setSearchValue(value);
        actions.select({
            property: searchProperty,
            value: value
        }, {
            property: orderBy,
            direction: orderType,
        }, {
            start: pageNumber > 0 ? (pageNumber - 1) * rowsPerPage : 0,
            count: rowsPerPage
        }, undefined);
    };

    const handleSearchPropertyChanged = (value: string) => {
        console.log("Search property = " + value);

        setSearchProperty(value);
    }

    const emptyRows = pageNumber > 0 ? Math.max(0, (1 + pageNumber) * rowsPerPage - dataList.length) : 0;
    console.log("Empty rows = " + emptyRows);

    // const filteredUsers = applySortFilter(dataList, getComparator(orderType, orderBy), searchValue);
    const filteredUsers = dataList;
    console.log("filteredUsers = ");
    console.log(filteredUsers);

    const isUserNotFound = filteredUsers.length === 0;
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
                                    {filteredUsers
                                        .map((row) => {
                                            const { id, name} = row;
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

                                                    <TableCell align="right">
                                                        <ItemMoreMenu
                                                            items={props.menuItems}
                                                            data={row}
                                                        ></ItemMoreMenu>
                                                    </TableCell>
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
