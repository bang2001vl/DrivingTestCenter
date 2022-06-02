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
import { LoadingButton } from "../../components/Buttons/loading";
import { FormIkDatePicker } from "../../components/FormIK/DatePicker";
import { FormIkDateTimePicker } from "../../components/FormIK/DateTimePicker";
import { FormIkNumberField } from "../../components/FormIK/NumberField";
import { FormIKExamSelector } from "../../components/FormIK/Selectors/examSelectors";
import { FormIkTextField } from "../../components/FormIK/TextField";
import Page from "../../components/Page";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { EDIT_METHOD } from "../../_enums";

interface IProps {
    method: EDIT_METHOD,
    oldData?: { id: number, exam: any } & IData,
    onSuccess?: () => void,
    onClose?: () => void,
}

interface IData {
    id?: number,
    examOption?: any,
    name: string,
    location: string,
    dateTimeStart: string,
    dateTimeEnd: string,
    maxMember: number | string,
}

const routeName = "examtest";

export const ExamTestCreate: FC<IProps> = (props: IProps) => {
    const api = useAPI();
    const [isLoading, setIsLoading] = useState(false);

    const validSchema = yup.object({
        name: yup
            .string()
            .required("Name must not be null"),
        location: yup
            .string()
            .required(),
        dateTimeStart: yup
            .string()
            .required(),
        dateTimeEnd: yup
            .string()
            .required(),
        maxMember: yup
            .number().typeError("Must be number")
            .required(),
    });

    const formik = useFormik<IData>({
        initialValues: props.oldData ? {
            examOption: {label: props.oldData.exam.name, value: props.oldData.exam},
            name: props.oldData.name,
            location: props.oldData.location,
            dateTimeStart: props.oldData.dateTimeStart,
            dateTimeEnd: props.oldData.dateTimeEnd,
            maxMember: props.oldData.maxMember,
        } : {
            examOption: null,
            name: "",
            location: "",
            dateTimeStart: new Date().toISOString(),
            dateTimeEnd: addDays(new Date(), 1).toISOString(),
            maxMember: "",
        },
        validationSchema: validSchema,
        onSubmit: async (values) => {
            console.log("Create ExamTest with", values);
            console.log("Valid", validSchema.validateSync(values));
            const errors = customValid(values as IData);
            if (Object.keys(errors).length > 0) {
                console.log("Custom errors", errors);
                formik.setErrors(errors);
                return;
            }

            let examId = Number(values.examOption.value.id);
            delete values.examOption;
            // OK
            let data = {
                ...values,
                examId,
            }
            setIsLoading(true);
            let result: MyResponse;
            if (props.method === EDIT_METHOD.create) {
                result = await api.postWithToken(`${appConfig.backendUri}/${routeName}/insert`, data);
            }
            else {
                result = await api.putWithToken(`${appConfig.backendUri}/${routeName}/update`, {
                    ...data,
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

    function customValid(vals: IData) {
        let errors: any = {}
        if (!isBefore(new Date(vals.dateTimeStart), new Date(vals.dateTimeEnd))) {
            errors.dateClose = "Date time start must bigger than date time end";
        }
        if (!vals.examOption) {
            errors.examOption = "This field is required";
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

    const marginTop = 2;
    return (
        <Stack>
            <Box alignSelf="center">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ width: "100%" }}>
                        {renderHeader(props.method)}
                    </Box>
                    <FormIKExamSelector formik={formik} fieldName="examOption"
                        placeholder="Exam"
                        propFormControl={{
                            fullWidth: true,
                            sx:{marginTop, zIndex: 100000 }
                        }}
                    />

                    <FormIkTextField formik={formik} fieldName="name"
                        fullWidth
                        label="Name"
                        sx={{ marginTop}}
                    />

                    <FormIkTextField formik={formik} fieldName="location"
                        fullWidth
                        label="Location"
                        sx={{ marginTop}}
                    />
                    <Stack direction="row" justifyContent={"space-between"} sx={{ marginTop}}>
                        <Box sx={{ width: "48%" }}>
                            <FormIkDateTimePicker formik={formik} fieldName="dateTimeStart"
                                label="Date Time Start"
                            />
                        </Box>

                        <Box sx={{ width: "48%" }}>
                            <FormIkDateTimePicker formik={formik} fieldName="dateTimeEnd"
                                label="Date Time End"
                            />
                        </Box>
                    </Stack>

                    <FormIkNumberField formik={formik} fieldName="maxMember"
                        fullWidth
                        label="Max Member"
                        sx={{ marginTop}}
                    />

                    <Stack direction="row" justifyContent={"space-between"} margin={2}>
                        <Box sx={{ width: "45%" }}>
                            <LoadingButton
                                loading={isLoading}
                                sx={{ width: "100%", fontSize: 20 }}
                                onClick={() => formik.handleSubmit()}
                            >
                                Submit
                            </LoadingButton>
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
        </Stack >
    );
}