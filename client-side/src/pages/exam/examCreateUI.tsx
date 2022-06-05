import { DatePicker, DateRangePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, Card, Container, FormControl, Grid, Select, Stack, TableCell, TextField, Typography } from "@mui/material";
import { addDays, isAfter, isBefore } from "date-fns";
import { FormikConfig, useFormik, validateYupSchema } from "formik";
import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Page from "../../components/Page";
import { useRootDialog } from "../../hooks/rootDialog";
import DataTable3 from "../../sections/DataTable3";
import { ExamTestTable } from "../examTest/examTestTable";
import { ExamTestCreate } from "../examTest/examTestCreate";


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
interface ISessionData {
    id: number,
    examId: number,
    name: string,
    room: string,
    dateTimeStart: Date,
    dateTimeEnd: Date,
    maxMember: number,
    countStudent: number,
    exam: { type: string, name: string, },
}
const EXAM_TEST_HEAD_LABEL = [
    { id: 'name', label: 'Tên ca thi', alignRight: false },
    { id: 'exam', label: 'Kì thi', alignRight: false },
    { id: 'type', label: 'Loại bằng', alignRight: false },
    { id: 'time', label: 'Thời gian thi', alignRight: false },
    { id: 'date', label: 'Ngày thi', alignRight: false },
    { id: 'room', label: 'Địa chỉ', alignRight: false },
    { id: 'candidate', label: 'Thí sinh', alignRight: false },
    { id: 'sessionStatus', label: 'Trạng thái', alignRight: false },
    { id: '', label: '', alignRight: false },
]
const routeName = "exam";

export const ExamCreateUI: FC<IProps> = (props: IProps) => {
    const rootDialog = useRootDialog();

    const [sessionList, setSessionList] = useState<any[]>([]);
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
    const renderSessionTable = () => {
        return <ExamTestTable
            dataList={sessionList.map(e => ({
                ...e,
                dateTimeStart: new Date(e.dateTimeStart),
                dateTimeEnd: new Date(e.dateTimeEnd),
            }))}
            headLabels={EXAM_TEST_HEAD_LABEL}
            onEdit={()=>{}}
            onDelete={()=>{}}
            />
    }

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
    function getSessionStatus(data: ISessionData) {
        const now = new Date();
        if (isAfter(data.dateTimeStart, now)) {
            return "Coming"
        }
        else if (isAfter(data.dateTimeEnd, now)) {
            return "Happening"
        }
        else {
            return "Finish"
        }
    }
    const handleCreate = () => {
        rootDialog.openDialog({
            children: <ExamTestCreate
                method={EDIT_METHOD.create}
                onSuccess={() => {
                    rootDialog.closeDialog();
                    
                }}
                onClose={() => rootDialog.closeDialog()}
            />,
        });
    }

    const marginTop = 1;
    return (
        // @ts-ignore
        <Page title={getTitle(props.method)} >
            <Container>
                <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
                    {renderHeader(props.method)}
                </Typography>
                <CustomizedTabs listtab={['Information', "Exam sessions"]} children={[

                    <Card style={{ alignItems: "center", justifyContent: 'center', padding: "30px 80px", textAlign: "center", marginTop: '15px' }} >
                        <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>

                            <Stack direction="row" spacing={2} sx={{ p: 1 }}>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkTextField formik={formik} fieldName="name"
                                        fullWidth
                                        label="Name"
                                        style={{ marginTop }}
                                    />

                                </Box>
                                <Box sx={{ minWidth: "50%" }}>
                                    <FormIkTextField formik={formik} fieldName="type"
                                        fullWidth
                                        label="Type"
                                        style={{ marginTop }}
                                    />
                                </Box>

                            </Stack>
                            <Stack direction="row" spacing={2} sx={{ p: 1 }}>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkNumberField formik={formik} fieldName="price"
                                        fullWidth
                                        label="Fees"
                                        style={{ marginTop: 1 }}
                                    />
                                </Box>
                                <Box sx={{ minWidth: "50%" }}>
                                    <FormIkNumberField formik={formik} fieldName="maxMember"
                                        fullWidth
                                        label="Max Member"
                                        style={{ marginTop }}
                                    />
                                </Box>

                            </Stack>


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

                                    <LoadingButton
                                        variant="contained"
                                        onClick={() =>  formik.handleSubmit()}
                                        sx={{ width: "120px" }}
                                    >
                                        Create
                                    </LoadingButton>

                                    <Button
                                        variant="outlined"
                                        onClick={() => onClickCancel()}
                                        sx={{ width: "120px" }} >
                                        Cancel
                                    </Button>

                                </Stack>
                            </Box>


                        </LocalizationProvider>
                    </Card >,
               <DataTable3 
               searchbarText='Tìm ca thi'
                maxRow={10} 
                list={sessionList} 
                headLabels={EXAM_TEST_HEAD_LABEL}
                 handleCreate={(handleCreate)} 
                  onRenderItem={renderSessionTable} 
                  ></DataTable3>

                ]}></CustomizedTabs>
            </Container >
        </Page >
    );
}