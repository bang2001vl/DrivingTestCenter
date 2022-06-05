import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
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
    InputAdornment,
    OutlinedInput,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { styled } from '@mui/material/styles';
import { customShadows } from '../theme/shadows';
import palette from '../theme/palette';
import DataListHead from './user/DataListHead';

// ----------------------------------------------------------------------
interface TypeProps {
    searchbarText: string | undefined;
    maxRow: number,
    list: any[],
    headLabels: any,
    handleCreate: () => void,
    onRenderItem: (dataList: any[]) => void,
    //onSelect: () => void,
}
const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 320,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': { width: 320, boxShadow: customShadows.z8 },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${palette.grey[500_32]} !important`
    }

}));
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

function applySortFilter(array: any[], comparator: any, query: string) {
    const stabilizedThis = array.map((el: any, index: any) => [el, index]);
    stabilizedThis.sort((a: any, b: any) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_item) => _item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function DataTable3(props: TypeProps) {
    const listData = props.list;
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const maxPage = props.maxRow <= rowsPerPage ? 1
        : (listData.length % rowsPerPage === 0 ? listData.length / rowsPerPage : listData.length / rowsPerPage + 1);



    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event: any) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listData.length) : 0;

    const filteredUsers = applySortFilter(listData, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Container>
            <Card style={{marginTop: 10}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between"  padding={3} >
                    <SearchStyle
                        value={filterName}
                        onChange={handleFilterByName}
                        placeholder={props.searchbarText}
                        startAdornment={
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                            </InputAdornment>
                        }
                    />
                    <Button
                        variant="contained"
                        onClick={props.handleCreate}
                        startIcon={<Iconify icon="eva:plus-fill" sx={undefined} />}
                    >
                        Create new
                    </Button>
                </Stack>
                {/*@ts-ignore*/}
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <DataListHead
                                headLabel={props.headLabels}
                            />
                            <TableBody>
                                {props.onRenderItem(listData)}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>

                            {isUserNotFound && (
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" colSpan={6} sx={{ py: 6 }}>
                                            {/* <SearchNotFound searchQuery={filterName} /> */}
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
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
