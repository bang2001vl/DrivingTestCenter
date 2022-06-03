import { DatePicker, DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, Card, Container, FormControl, Grid, Select, Stack, TextField, Typography } from "@mui/material";
import { addDays, isBefore } from "date-fns";
import { FormikConfig, useFormik, validateYupSchema } from "formik";
import React, { FC, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from 'yup';
import { MyResponse } from "../../api/service";
import { FormIkDatePicker } from "../../components/FormIK/DatePicker";
import { FormIkNumberField } from "../../components/FormIK/NumberField";
import { FormIkTextField } from "../../components/FormIK/TextField";
import CustomizedTabs from "../../components/tabs";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { EDIT_METHOD } from "../../_enums";
import SessionTable from "../../sections/SessionTable";
import Page from "../../components/Page";

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

const routeName = "exam";

export const ExamCreateUI: FC<IProps> = (props: IProps) => {
    const api = useAPI();
    const navigate = useNavigate();
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
                result = await api.postWithToken(`${appConfig.backendUri}/${routeName}/insert`, values);
            }
            else {
                result = await api.putWithToken(`${appConfig.backendUri}/${routeName}/update`, {
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
    const marginTop = 1;
    return(
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
                                    <FormIkTextField formik={formik} fieldName="name"
                                        fullWidth
                                        label="Name"
                                        style={{ marginTop }}
                                    />

                                </Grid>
                                <Grid item md={3}>
                                    <FormIkTextField formik={formik} fieldName="type"
                                        fullWidth
                                        label="Type"
                                        style={{ marginTop }}
                                    />
                                </Grid>
                                <Grid item md={3}>
                                    <FormIkNumberField formik={formik} fieldName="price"
                                        fullWidth
                                        label="Fees"
                                        style={{ marginTop: 1 }}
                                    />


                                </Grid>
                            </Grid>


                            <Box>
                                <Stack direction="row">
                                    <Box sx={{ p: 1, width: "50%" }}>
                                        <FormIkDatePicker formik={formik} fieldName="dateOpen"
                                            label="Open Register"
                                        />
                                    </Box>

                                    <Box sx={{ p: 1, width: "50%" }}>
                                        <FormIkDatePicker formik={formik} fieldName="dateClose"
                                            label="Close Register"
                                        />
                                    </Box>
                                    <Box sx={{ p: 1, width: "50%" }}>
                                        <FormIkDatePicker formik={formik} fieldName="dateStart"
                                            label="Start Exam"
                                        />
                                    </Box>

                                    <Box sx={{ p: 1, width: "50%" }}>
                                        <FormIkDatePicker formik={formik} fieldName="dateEnd"
                                            label="End Exam"
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