import { DatePicker, DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, FormControl, Stack, TextField } from "@mui/material";
import { addDays } from "date-fns";
import { useFormik } from "formik";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from 'yup';
import { MyResponse } from "../api/service";
import Page from "../components/Page";
import { appConfig } from "../configs";
import useAPI from "../hooks/useApi";
import { DialogHelper } from "../singleton/dialogHelper";

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
            .required(),
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
        const label = method === EDIT_METHOD.create ? "CREATE EXAM" : "UPDATE EXAM";
        return (<h1 style={{ "textAlign": "center" }} >{label}</h1>)
    }

    return (
        // @ts-ignore
        <Page title={getTitle(props.method)} sx={{ display: "flex", "flex-direction":"column" }}>
            <Box sx={{ width: "70%" }} alignSelf="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <FormControl >
                        <Box sx={{ p: 1, width: "100%" }}>
                            {renderHeader(props.method)}
                        </Box>

                        <Box sx={{ p: 1 }}>
                            <TextField
                                fullWidth
                                name="name"
                                label="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Box>
                        <Box sx={{ p: 1 }}>
                            <TextField
                                fullWidth
                                name="type"
                                label="Type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                error={formik.touched.type && Boolean(formik.errors.type)}
                                helperText={formik.touched.type && formik.errors.type}
                            />
                        </Box>

                        <Box sx={{ p: 1 }}>
                            <TextField
                                fullWidth
                                name="maxMember"
                                label="Max Member"
                                value={formik.values.maxMember}
                                onChange={formik.handleChange}
                                error={formik.touched.maxMember && Boolean(formik.errors.maxMember)}
                                helperText={formik.touched.maxMember && formik.errors.maxMember}
                            />
                        </Box>

                        <Box sx={{ p: 1 }}>
                            <TextField
                                fullWidth
                                name="price"
                                label="Price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price}
                            />
                        </Box>

                        <Box>
                            <Stack direction="row">
                                <Box sx={{ p: 1, width: "50%" }}>
                                    <DatePicker
                                        label="Date Open"
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
                                        label="Date Close"
                                        value={formik.values.dateClose}
                                        onChange={(newDate) => formik.setFieldValue("dateClose", newDate)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Box>
                                <Box sx={{ p: 1, width: "50%" }}>
                                    <DatePicker
                                        label="Date Start"
                                        value={formik.values.dateStart}
                                        onChange={(newDate) => formik.setFieldValue("dateStart", newDate)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Box>

                                <Box sx={{ p: 1, width: "50%" }}>
                                    <DatePicker
                                        label="Date End"
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
                            <Stack direction="row">
                                <Box sx={{ p: 1, width: "50%" }}>
                                    <Button
                                        sx={{ width: "100%", fontSize: 20 }}
                                        onClick={() => formik.handleSubmit()}
                                    >
                                        Submit
                                    </Button>
                                </Box>

                                <Box sx={{ p: 1, width: "50%" }}>
                                    <Button
                                        sx={{ width: "100%", fontSize: 20 }}
                                        onClick={() => navigate("/dashboard/exam")}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>

                    </FormControl>
                </LocalizationProvider>
            </Box >
        </Page >
    );
}