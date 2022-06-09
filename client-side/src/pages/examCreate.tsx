import { DatePicker, DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, Card, Container, FormControl, Grid, Select, Stack, TextField, Typography } from "@mui/material";
import { addDays } from "date-fns";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from 'yup';
import { MyResponse } from "../api/service";
import Page from "../components/Page";
import { appConfig } from "../configs";
import useAPI from "../hooks/useApi";
import { DialogHelper } from "../singleton/dialogHelper";
import CustomizedTabs from "../components/tabs";

export enum EDIT_METHOD {
    create, update
}


interface IProps {
    method: EDIT_METHOD,
    oldData?: any,
}

interface IOutput {
    name: string,
    type: string,
    dateOpen: string,
    dateClose: string,
    dateStart: string,
    dateEnd: string,
    maxMember: number,
    rules: string,
    price: number,
}

export default function ExamCreate(props: IProps) {
    const navigate = useNavigate();
    const api = useAPI();
    const [searchParams, setSearchParams] = useSearchParams();

    const validSchema = yup.object({
        name: yup
            .string()
            .required("Name must not be null"),
        type: yup
            .string()
            .required(),
        dateOpen: yup
            .date().typeError("Must be date-time format")
            .required(),
        dateClose: yup
            .date().typeError("Must be date-time format")
            .required(),
        dateStart: yup
            .date().typeError("Must be date-time format")
            .required(),
        dateEnd: yup
            .date().typeError("Must be date-time format")
            .required(),
        maxMember: yup
            .number().typeError("Must be number")
            .required(),
        rules: yup
            .string()
            .required("Description must not be null"),
        price: yup
            .number().typeError("Must be number")
            .required(),
    });

    const formik = useFormik({
        initialValues: props.oldData ? {
            name: props.oldData.name,
            type: props.oldData.type,
            dateOpen: props.oldData.dateOpen,
            dateClose: props.oldData.dateClose,
            dateStart: props.oldData.dateStart,
            dateEnd: props.oldData.dateEnd,
            maxMember: props.oldData.maxMember,
            rules: props.oldData.rules,
            price: props.oldData.price,
        } : {
            name: undefined,
            type: "",
            dateOpen: new Date(),
            dateClose: addDays(new Date(), 1),
            dateStart: addDays(new Date(), 2),
            dateEnd: addDays(new Date(), 3),
            maxMember: 0,
            rules: "",
            price: 0,
        },
        validationSchema: validSchema,
        onSubmit: async (values) => {
            //window.alert(JSON.stringify(values, null, 2));
            console.log(values);

            let result: MyResponse;
            if (props.method === EDIT_METHOD.create) {
                result = await api.post(appConfig.backendUri + "/exam/create", { data: values });
            }
            else {
                result = await api.put(appConfig.backendUri + "/exam/update", { key: props.oldData!.id, data: values });
            }

            if (result.errorCode) {
                DialogHelper.showAlert(result.errorMessage);
            }
            else {
                DialogHelper.showAlert("Success");
                navigate("/dashboard/exam");
            }
        }
    });

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
                    // <SessionTable ></SessionTable>
                ]}></CustomizedTabs>
            </Container>
        </Page >
    );
}