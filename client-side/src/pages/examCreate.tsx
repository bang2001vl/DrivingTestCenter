import { DatePicker, DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, FormControl, Stack, TextField } from "@mui/material";
import { vi, enUS } from "date-fns/locale";
import { useFormik } from "formik";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import * as yup from 'yup';
import Label from "../components/Label";
import Page from "../components/Page";
import { authAtom } from "../recoil/model/auth";
import { DialogHelper } from "../singleton/dialogHelper";
import { APIFetcher } from "../_helper/fetchAPI";
import { useAPIResultHandler } from "../_helper/responseHandle";

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
            .required(),
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
            maxMember: searchParams.get('maxMember') ? searchParams.get('maxMember') :0,
            rules: searchParams.get('rules') ? searchParams.get('rules') :"",
            price: searchParams.get('price') ? searchParams.get('price') :0,
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
        const label = method === EDIT_METHOD.create ? "CREATE EXAM" : "UPDATE EXAM";
        return (<h1 style={{ "textAlign": "center" }} >{label}</h1>)
    }

    return (
        // @ts-ignore
        <Page title={getTitle(props.method)} sx={{ display: "flex", "flex-direction":"column" }}>
            <Box sx={{ width: 600 }} alignSelf="center">
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