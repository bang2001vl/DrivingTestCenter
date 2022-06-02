import { Icon } from "@iconify/react";
import { Box, Button, Container, Stack, TableCell, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { ISelectOption } from "../../api/_deafaultCRUD";
import { CommonButton } from "../../components/Buttons/common";
import { MySearchBar } from "../../components/MySearchBar.tsx/MySearchBar";
import Scrollbar from "../../components/Scrollbar";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { useRootDialog } from "../../hooks/rootDialog";
import { ExamCreateUI } from "./examCreateUI";
import { ExamTable } from "./examTable";
import { ExamController } from "../../api/controllers/examController";
import { ExamSelector } from "./examSelector";
import { EDIT_METHOD } from "../../_enums";

const searchOptionList = [{
    label: "Name",
    value: {
        searchby: "name"
    }
}];

const orderOptionList = [
    {
        label: "Name (A-Z)",
        value: {
            orderby: "name",
            orderdirection: "asc"
        }
    },
    {
        label: "Name (Z-A)",
        value: {
            orderby: "name",
            orderdirection: "desc"
        }
    }
];

const routeName = "exam";

export default function ExamPageUI() {
    const [isLoading, setIsLoading] = useState(false);
    const api = useAPI();
    const rootDialog = useRootDialog();

    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [options, setOptions] = useState({
        searchby: "name",
        searchvalue: "",
        orderby: "name",
        orderdirection: "asc",
    });
    const [maxCount, setMaxCount] = useState(0);
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

        const url = `${appConfig.backendUri}/${routeName}/select?${queryParams}`
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

        const url = `${appConfig.backendUri}/${routeName}/count?${queryParams}`
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

    const handleCreate = () => {
        rootDialog.openDialog({
            children: <ExamCreateUI
                method={EDIT_METHOD.create}
                onSuccess={() => {
                    rootDialog.closeDialog();
                    select();
                }}
                onClose={() => rootDialog.closeDialog()}
            />,
        });
    }

    const handleEdit = (data: any) => {
        rootDialog.openDialog({
            children: <ExamCreateUI
                method={EDIT_METHOD.update}
                oldData={data}
                onSuccess={() => {
                    rootDialog.closeDialog();
                    select();
                }}
                onClose={() => rootDialog.closeDialog()}
            />,
        });
    }

    const handleDelete = async (data: any) => {
        const id = data.id;
        setIsLoading(true);
        const res = await api.deleteWithToken(
            `${appConfig.backendUri}/${routeName}/delete?keys=${String(id)}`
        );;
        setIsLoading(false);
        if (res.result) {
            DialogHelper.showAlert("Success");
            select();
        }
        else {
            DialogHelper.showAlert(res.errorMessage);
        }
    }

    const renderTable = () => {
        return <ExamTable
            dataList={dataList.map(e => ({
                ...e,
                id: Number(e.id),
                countStudent: Number(e.countStudent),
                dateClose: new Date(e.dateClose),
                dateEnd: new Date(e.dateEnd),
                dateOpen: new Date(e.dateOpen),
                dateStart: new Date(e.dateStart),
                maxMember: Number(e.maxMember),
                name: e.name,
                price: Number(e.price),
                type: e.type,
            }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    }

    return (
        <Stack spacing={1}>
            <Stack direction={"row"} alignItems="center" justifyContent="space-between">
                <Stack direction={"row"}>
                    <label>Exam</label>
                    <label>&gt;</label>
                </Stack>
                <Stack direction={"row"}>
                    <CommonButton
                        onClick={() => {
                            rootDialog.openDialog({
                                title: <h2>Select Exam</h2>,
                                children: <ExamSelector
                                    onSubmit={(val) => {
                                        console.log("On select success", val);
                                    }}
                                    onClose={() => rootDialog.closeDialog()}
                                ></ExamSelector>,
                            });
                        }}
                    >Test</CommonButton>
                    <CommonButton
                        startIcon={<Icon icon="ant-design:plus-outlined" />}
                        onClick={handleCreate}
                    >Create</CommonButton>
                </Stack>
            </Stack>

            <MySearchBar
                searchOptionList={searchOptionList}
                orderOptionList={orderOptionList}
                onSubmit={(opt) => {
                    setOptions(opt);
                }}
            ></MySearchBar>

            <Box alignSelf={"center"} style={{ display: isLoading ? "inline" : "none" }}>
                <Icon icon="eos-icons:three-dots-loading" />
            </Box>

            <Scrollbar sx={undefined}>
                {renderTable()}
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
        </Stack>
    )
}