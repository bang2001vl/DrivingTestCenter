import { DatePicker, DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, Card, Container, FormControl, Grid, MenuItem, Select, Stack, Tab, TableCell, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { format, parse } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import * as yup from 'yup';
import Page from "../components/Page";
import CustomizedTabs from "../components/tabs";
import { authAtom } from "../recoil/model/auth";
import DataTable3 from "../sections/DataTable3";
import ItemMoreMenu from "../sections/user/ItemMoreMenu";
import { DialogHelper } from "../singleton/dialogHelper";
import { APIFetcher } from "../_helper/fetchAPI";
import { useAPIResultHandler } from "../_helper/responseHandle";
import { BorderLinearProgress } from "../components/LinearProgress";
import { ISelectOption } from "../api/_deafaultCRUD";
import SessionTable from "../sections/SessionTable";

export enum EDIT_METHOD {
    create, update
}

interface IProps {
    method: EDIT_METHOD,
}

export default function ExamCreate(props: IProps) {
    const auth = useRecoilValue(authAtom);
    const resultHandler = useAPIResultHandler();
    const navigate = useNavigate();
    const [maxRow, setMaxRow] = useState(0);
    const [list, setList] = useState<any[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const validSchema = yup.object({
        name: yup
            .string()
            .required("Name must not be null"),
        type: yup
            .string()
            .required(),
        dateOpen: yup
            .date()
            .required(),
        dateClose: yup
            .date()
            .required(),
        dateStart: yup
            .date()
            .required(),
        dateEnd: yup
            .date()
            .required(),
        maxMember: yup
            .number()
            .required(),
        rules: yup
            .string()
            .required("Description must not be null"),
        price: yup
            .number()
            .required(),
    });

    const formik = useFormik({
        initialValues: {
            name: searchParams.get('name') ? searchParams.get('name') : "",
            type: searchParams.get('type') ? searchParams.get('type') : "",
            dateOpen: searchParams.get('dateOpen') ? searchParams.get('dateOpen') : new Date(),
            dateClose: searchParams.get('dateClose') ? searchParams.get('dateClose') : new Date(),
            dateStart: searchParams.get('dateStart') ? searchParams.get('dateStart') : new Date(),
            dateEnd: searchParams.get('dateEnd') ? searchParams.get('dateEnd') : new Date(),
            maxMember: searchParams.get('maxMember') ? searchParams.get('maxMember') : 0,
            rules: searchParams.get('rules') ? searchParams.get('rules') : "",
            price: searchParams.get('price') ? searchParams.get('price') : 0,
        },
        validationSchema: validSchema,
        onSubmit: async (values) => {
            //window.alert(JSON.stringify(values, null, 2));
            console.log(values);

            let result;
            if (props.method === EDIT_METHOD.create) {
                result = await APIFetcher.post("exam/create", { data: values }, auth?.token);
            }
            else {
                result = await APIFetcher.put("exam/update", { key: dataKey, data: values }, auth?.token);
            }

            const [error, data] = result;

            if (error) {
                if (!resultHandler.catchFatalError(error)) {
                    DialogHelper.showAlert(error.errorMessage);
                }
            }
            else {
                DialogHelper.showAlert("Success");
                navigate("/dashboard/exam");
            }
        }
    });

    const dataKey = searchParams.get("id");

    function getTitle(method: EDIT_METHOD) {
        return method === EDIT_METHOD.create ? "Exam | Create" : "Exam | Update";
    }

    function renderHeader(method: EDIT_METHOD) {
        const label = method === EDIT_METHOD.create ? "Create Exam" : "Create Exam";
        return label;
    }
    const onClickCancel = () => {
        //window.alert("Clicked delete on item = " + JSON.stringify(item, undefined, 4));
        const result = DialogHelper.showConfirm("Are you sure cancel the exam create?");
        if (result) {
            navigate("/dashboard/exam");
        }
    }

    const initSelectOption = {
        searchby: "name",
        searchvalue: "",
        orderby: "name",
        orderdirection: "asc",
        start: 0,
        count: 5,
    }



    return (
        // @ts-ignore
        <Page title={getTitle(props.method)} >
            <Container>
                <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
                    {renderHeader(props.method)}
                </Typography>
                <CustomizedTabs listtab={['Information', "Exam sessions"]} children={[

                    <Card style={{ alignItems: "center", justifyContent: 'center', padding: "auto", textAlign: "center", marginTop: '15px' }} >
                        <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                            <FormControl style={{ width: '80%', alignSelf: "center", marginTop: "50px" }} >
                                <Grid container spacing={2} sx={{ p: 1 }}>
                                    <Grid item md={6}>
                                        <TextField
                                            fullWidth
                                            name="name"
                                            label="Name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />

                                    </Grid>
                                    <Grid item md={3}>
                                        <Select
                                            fullWidth
                                            name="type"
                                            label="Type"
                                            value={formik.values.type}
                                            onChange={formik.handleChange}

                                        // error={formik.touched.type && Boolean(formik.errors.type)}
                                        // helperText={formik.touched.type && formik.errors.type}
                                        >
                                        </Select>
                                    </Grid>
                                    <Grid item md={3}>
                                        <TextField

                                            name="price"
                                            label="Fees"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            error={formik.touched.price && Boolean(formik.errors.price)}
                                            helperText={formik.touched.price && formik.errors.price}
                                        />

                                    </Grid>
                                    {/* <TextField
                                 style={{width: "25%"}}
                                    fullWidth
                                    name="maxMember"
                                    label="Max Member"
                                    value={formik.values.maxMember}
                                    onChange={formik.handleChange}
                                    error={formik.touched.maxMember && Boolean(formik.errors.maxMember)}
                                    helperText={formik.touched.maxMember && formik.errors.maxMember}
                                /> */}
                                </Grid>



                                <Box>
                                    <Stack direction="row">
                                        <Box sx={{ p: 1, width: "50%" }}>
                                            <DatePicker
                                                label="Open Register"
                                                value={formik.values.dateOpen}
                                                onChange={(newDate) => formik.setFieldValue("dateOpen", newDate)}
                                                renderInput={(params) => <TextField
                                                    {...params}
                                                    error={formik.touched.dateOpen && Boolean(formik.errors.dateOpen)}
                                                    helperText={formik.touched.dateOpen && formik.errors.dateOpen}
                                                />}
                                            />
                                        </Box>

                                        <Box sx={{ p: 1, width: "50%" }}>
                                            <DatePicker
                                                label="Close Register"
                                                value={formik.values.dateClose}
                                                onChange={(newDate) => formik.setFieldValue("dateClose", newDate)}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Box>
                                        <Box sx={{ p: 1, width: "50%" }}>
                                            <DatePicker
                                                label="Start Exam"
                                                value={formik.values.dateStart}
                                                onChange={(newDate) => formik.setFieldValue("dateStart", newDate)}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Box>

                                        <Box sx={{ p: 1, width: "50%" }}>
                                            <DatePicker
                                                label="End Exam"
                                                value={formik.values.dateEnd}
                                                onChange={(newDate) => formik.setFieldValue("dateEnd", newDate)}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </Box>
                                    </Stack>
                                </Box>

                                <Box sx={{ p: 1 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        name="rules"
                                        label="Description"
                                        value={formik.values.rules}
                                        onChange={formik.handleChange}
                                        error={formik.touched.rules && Boolean(formik.errors.rules)}
                                        helperText={formik.touched.rules && formik.errors.rules}
                                    />
                                </Box>

                                <Box>
                                    <Stack direction="row" spacing={20} alignItems="center" justifyContent="center" marginTop={5} marginBottom={5}>

                                        <Button
                                            variant="contained"
                                            onClick={() => formik.handleSubmit()}
                                            sx={{ width: "120px" }}
                                        >
                                            Create
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            onClick={() => onClickCancel()}
                                            sx={{ width: "120px" }} >
                                            Cancel
                                        </Button>

                                    </Stack>
                                </Box>

                            </FormControl>
                        </LocalizationProvider>
                    </Card >,
                    <SessionTable ></SessionTable>
                ]}></CustomizedTabs>
            </Container>
        </Page >
    );
}