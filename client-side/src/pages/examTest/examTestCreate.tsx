import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, Card, Container, FormControl, Grid, Stack, TextField, TextFieldProps, Typography } from "@mui/material";
import { addDays, isBefore } from "date-fns";
import { useFormik } from "formik";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import { MyResponse } from "../../api/service";
import { FormIkDateTimePicker } from "../../components/FormIK/DateTimePicker";
import { FormIkNumberField } from "../../components/FormIK/NumberField";
import { FormIKExamSelector } from "../../components/FormIK/Selectors/examSelectors";
import { FormIkTextField } from "../../components/FormIK/TextField";
import Page from "../../components/Page";
import CustomizedTabs from "../../components/tabs";
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
    const navigate = useNavigate();
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
            examOption: { label: props.oldData.exam.name, value: props.oldData.exam },
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
    const onClickCancel = () => {
        //window.alert("Clicked delete on item = " + JSON.stringify(item, undefined, 4));
        const result = DialogHelper.showConfirm("Bạn muốn hủy tạo ca thi này?");
        if (result) {
            navigate("/dashboard/session");
        }
    }
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
        const label = method === EDIT_METHOD.create ? "Tạo ca thi" : "Chỉnh sửa ca thi";
        return label;
    }

    const marginTop = 2;
    return (
        // @ts-ignore
        <Page title={getTitle(props.method)} >
            <Container>
                <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
                    {renderHeader(props.method)}
                </Typography>
                <CustomizedTabs listtab={['Thông tin', "Thí sinh tham gia"]} children={[

                    <Card style={{ alignItems: "center", justifyContent: 'center', padding: "auto", textAlign: "center", marginTop: '15px' }} >
                        <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                            <FormControl style={{ width: '80%', alignSelf: "center", marginTop: "50px" }} >
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{  width: "50%" }}>
                                        <FormIkTextField formik={formik} fieldName="name"
                                            fullWidth
                                            label="Name"

                                        />
                                    </Box>
                                    <Box sx={{ minWidth: "50%" }}>
                                        <FormIKExamSelector formik={formik} fieldName="examOption"
                                            placeholder="Exam"
                                            propFormControl={{
                                                fullWidth: true,

                                                sx: { height: "100%" }
                                            }}
                                        />
                                    </Box>

                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{  width: "50%" }}>
                                    <FormIkTextField formik={formik} fieldName="location"
                                            fullWidth
                                            label="Location"
                                            sx={{ marginTop }}
                                        />
                                    </Box>
                                    <Box sx={{ minWidth: "50%" }}>
                                    <FormIkNumberField formik={formik} fieldName="maxMember"
                                            fullWidth
                                            label="Max Member"
                                            sx={{ marginTop }}
                                        />
                                    </Box>

                                </Stack>
                                <Stack direction="row" spacing={2} paddingTop={2}>
                                    <Box sx={{ width: "50%" }}>
                                    <FormIkDateTimePicker formik={formik} fieldName="dateTimeStart"
                                            label="Date Time Start"
                                        />
                                    </Box>
                                    <Box sx={{ minWidth: "50%" }}>
                                    <FormIkDateTimePicker formik={formik} fieldName="dateTimeEnd"
                                            label="Date Time End"
                                          
                                        />
                                    </Box>

                                </Stack>
                                

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
                ]}></CustomizedTabs>
            </Container>
        </Page >
    );
}