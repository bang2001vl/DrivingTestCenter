import { DatePicker, DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, FormControl, Stack, TextField, TextFieldProps } from "@mui/material";
import { addDays, isBefore } from "date-fns";
import { FormikConfig, useFormik, validateYupSchema } from "formik";
import React, { FC, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from 'yup';
import { MyResponse } from "../../api/service";
import { CommonButton } from "../../components/Buttons/common";
import { FormIkDatePicker } from "../../components/FormIK/DatePicker";
import { FormIkNumberField } from "../../components/FormIK/NumberField";
import { FormIkTextField } from "../../components/FormIK/TextField";
import Page from "../../components/Page";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";

export enum EDIT_METHOD {
    create, update
}

interface IProps {
    method: EDIT_METHOD,
    oldData?: {
        id: number,
        name: string,
        type: string,
        dateOpen: string,
        dateClose: string,
        dateStart: string,
        dateEnd: string,
        maxMember: number,
        rules: string,
        price: number,
    },
    onSuccess?: () => void,
    onClose?: () => void,
}

export const ExamCreateUI: FC<IProps> = (props: IProps) => {
    const navigate = useNavigate();
    const api = useAPI();
    const [isLoading, setIsLoading] = useState(false);

    const validSchema = yup.object({
        name: yup
            .string()
            .required("Name must not be null"),
        type: yup
            .string()
            .required(),
        dateOpen: yup
            .string()
            .required(),
        dateClose: yup
            .string()
            .required(),
        dateStart: yup
            .string()
            .required(),
        dateEnd: yup
            .string()
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
            name: "",
            type: "",
            dateOpen: new Date().toISOString(),
            dateClose: addDays(new Date(), 1).toISOString(),
            dateStart: addDays(new Date(), 2).toISOString(),
            dateEnd: addDays(new Date(), 3).toISOString(),
            maxMember: "",
            rules: "",
            price: "",
        },
        validationSchema: validSchema,
        onSubmit: async (values) => {
            console.log("Create Exam with", values);
            console.log("Valid", validSchema.validateSync(values));
            const errors = customValid(values);
            if (Object.keys(errors).length > 0) {
                console.log("Custom errors", errors);
                formik.setErrors(errors);
                return;
            }
            setIsLoading(true);
            let result: MyResponse;
            if (props.method === EDIT_METHOD.create) {
                result = await api.postWithToken(appConfig.backendUri + "/exam/insert", values);
            }
            else {
                result = await api.putWithToken(appConfig.backendUri + "/exam/update", {
                    ...values,
                    key: props.oldData!.id,
                });
            }
            setIsLoading(false)
            if (result.errorCode) {
                DialogHelper.showAlert(result.errorMessage);
            }
            else {
                DialogHelper.showAlert("Success");
                if (props.onSuccess) {
                    props.onSuccess();
                }
            }
        }
    });

    function customValid(vals: any) {
        let errors: any = {}
        if (!isBefore(new Date(vals.dateOpen), new Date(vals.dateClose))) {
            errors.dateClose = "Date close must bigger than date open";
        }
        return errors;
    }

    function getTitle(method: EDIT_METHOD) {
        return method === EDIT_METHOD.create ? "Exam | Create" : "Exam | Update";
    }

    function renderHeader(method: EDIT_METHOD) {
        const label = method === EDIT_METHOD.create ? "CREATE EXAM" : "UPDATE EXAM";
        return (<h1 style={{ "textAlign": "center" }} >{label}</h1>)
    }

    return (
        // @ts-ignore
        <Page title={getTitle(props.method)} sx={{ display: "flex", "flex-direction": "column" }}>
            <Box sx={{ width: "70%" }} alignSelf="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>

                    <Box sx={{ width: "100%" }}>
                        {renderHeader(props.method)}
                    </Box>

                    <FormIkTextField formik={formik} fieldName="name"
                        fullWidth
                        label="Name"
                        sx={{ marginTop: 1 }}
                    />

                    <FormIkTextField formik={formik} fieldName="type"
                        fullWidth
                        label="Type"
                        sx={{ marginTop: 1 }}
                    />

                    <FormIkNumberField formik={formik} fieldName="maxMember"
                        fullWidth
                        label="Max Member"
                        sx={{ marginTop: 1 }}
                    />

                    <FormIkNumberField formik={formik} fieldName="price"
                        fullWidth
                        label="Price"
                        sx={{ marginTop: 1 }}
                    />

                    <Stack direction="row" justifyContent={"space-between"} sx={{ marginTop: 1 }}>
                        <Box sx={{ width: "48%" }}>
                            <FormIkDatePicker formik={formik} fieldName="dateOpen"
                                label="Date Open"
                            />
                        </Box>

                        <Box sx={{ width: "48%" }}>
                            <FormIkDatePicker formik={formik} fieldName="dateClose"
                                label="Date Close"
                            />
                        </Box>
                    </Stack>

                    <Stack direction="row" justifyContent={"space-between"} sx={{ marginTop: 1 }}>
                        <Box sx={{width: "48%" }}>
                            <FormIkDatePicker formik={formik} fieldName="dateStart"
                                label="Date Start"
                            />
                        </Box>

                        <Box sx={{width: "48%" }}>
                            <FormIkDatePicker formik={formik} fieldName="dateEnd"
                                label="Date End"
                            />
                        </Box>
                    </Stack>

                    <FormIkTextField formik={formik} fieldName="rules"
                        label="Description"
                        fullWidth
                        multiline
                        minRows={3}
                        sx={{ marginTop: 1 }}
                    />

                    <Stack direction="row" justifyContent={"space-between"} margin={2}>
                        <Box sx={{ width: "45%" }}>
                            <CommonButton
                                sx={{ width: "100%", fontSize: 20 }}
                                onClick={() => formik.handleSubmit()}
                            >
                                Submit
                            </CommonButton>
                        </Box>

                        <Box sx={{ width: "45%" }}>
                            <CommonButton
                                sx={{ width: "100%", fontSize: 20 }}
                                onClick={() => {
                                    if (props.onClose) {
                                        props.onClose();
                                    }
                                }}
                            >
                                Cancel
                            </CommonButton>
                        </Box>
                    </Stack>

                </LocalizationProvider>
            </Box >
        </Page >
    );
}