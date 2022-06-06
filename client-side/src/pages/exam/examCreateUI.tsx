import { LoadingButton, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, Card, Container, FormControl, Grid, Select, Stack, TableCell, TableRow, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { FC, useEffect, useState } from "react";
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
import Page from "../../components/Page";
import { useRootDialog } from "../../hooks/rootDialog";
import DataTable3 from "../../sections/DataTable3";
import { addDays, isAfter, isBefore } from "date-fns";
import { ExamTestCreate } from "../examTest/examTestCreate";
import { ExamSessionCreateTable } from "./examSessionCreateTable";
import { IFormIK } from "../../_interfaces/formik";
import { validYupToObject } from "../../_helper/helper";
import { BasicEditSection } from "../../sections/CRUD/BasicEditSection";


interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
    hideTitle?: boolean,
}
interface ISessionData {
    id?: number,
    examOption?: any,
    name: string,
    location: string,
    dateTimeStart: string,
    dateTimeEnd: string,
    maxMember: number | string,
}

export const ExamCreateUI: FC<IProps> = (props: IProps) => {
    const routeName = "exam";
    const navigate = useNavigate();
    const api = useAPI();
    const [searchParams] = useSearchParams();
    const [initValue, setInitValue] = useState({
        name: "",
        type: "",
        dateOpen: new Date().toISOString(),
        dateClose: addDays(new Date(), 1).toISOString(),
        dateStart: addDays(new Date(), 2).toISOString(),
        dateEnd: addDays(new Date(), 3).toISOString(),
        maxMember: "",
        rules: "",
        price: "",
    });

    useEffect(() => {
        if (props.method === EDIT_METHOD.update) {
            const key = getOldKey();
            if (!key) {
                navigate("/", { replace: true });
                DialogHelper.showAlert("Not found id");
            }

            api.getWithToken(
                `${appConfig.backendUri}/${routeName}/select?${new URLSearchParams({
                    searchvalue: "",
                    searchby: "name",
                    orderby: "name",
                    orderdirection: "asc",
                    start: "0",
                    count: "1",
                    id: String(key),
                }).toString()}`
            ).then(res => {
                if (res.result && res.data) {
                    setInitValue(res.data[0]);
                }
                else {
                    DialogHelper.showAlert(res.errorMessage);
                }
            });
        }
    }, [props.method, searchParams]);

    const getOldKey = () => (searchParams.get("id"));

    const schema = yup.object({
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

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);

        if (!isBefore(new Date(formik.values.dateOpen), new Date(formik.values.dateClose))) {
            errors.dateClose = "Date close must bigger than date open";
        }

        if (Object.keys(errors).length > 0) {
            formik.setErrors(errors);
            return errors;
        }
    }

    function handleSubmit(formik: IFormIK) {
        console.log("Handle submit formik values: ", formik.values);
        const values = formik.values;

        const data: any = {
            name: values.name,
            type: values.type,
            dateOpen: values.dateOpen,
            dateClose: values.dateClose,
            dateStart: values.dateStart,
            dateEnd: values.dateEnd,
            maxMember: values.maxMember,
            rules: values.rules,
            price: values.price,
        }

        if (props.method === EDIT_METHOD.create) {
            return api.postWithToken(
                `${appConfig.backendUri}/${routeName}/insert`,
                data,
            );
        }
        else {
            data.key = String(getOldKey());
            return api.putWithToken(
                `${appConfig.backendUri}/${routeName}/update`,
                data,
            );
        }
    }

    function handleSuccess() {
        DialogHelper.showAlert("Success");
        navigate(-1);
    }

    function handleClose() {
        navigate(-1);
    }

    const marginTop = 1;

    return <BasicEditSection
        title={props.hideTitle ? "" : "Tạo Kì Thi"}
        initValues={initValue}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        formComponent={(formik, cancel, isLoading) => {
            return <Card style={{ alignItems: "center", justifyContent: 'center', textAlign: "center", marginTop: '15px', padding: "5%" }} >

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
                        <FormIkTextField formik={formik} fieldName="rules"
                            fullWidth
                            multiline
                            minRows={3}
                            label="Description"
                        />
                    </Box>

                    <Stack alignItems={"center"}>
                        <Stack direction={"row"} spacing={20} style={{ alignSelf: "center", justifyContent: "space-around", marginTop: 20, maxWidth: 400 }}>
                            <LoadingButton
                                variant="contained"
                                onClick={() => formik.handleSubmit()}
                                sx={{ width: "120px", height: "43px" }}
                            >
                                Xác nhận
                            </LoadingButton>

                            <Button
                                variant="outlined"
                                onClick={() => cancel()}
                                sx={{ width: "120px", height: "43px" }}>
                                Hủy
                            </Button>
                        </Stack>
                    </Stack>

                </LocalizationProvider>
            </Card >
        }}
    />
    //

    // const validSchema = yup.object();

    // const formik = useFormik({
    //     initialValues: props.oldData ? {
    //         name: props.oldData.name,
    //         type: props.oldData.type,
    //         dateOpen: props.oldData.dateOpen,
    //         dateClose: props.oldData.dateClose,
    //         dateStart: props.oldData.dateStart,
    //         dateEnd: props.oldData.dateEnd,
    //         maxMember: props.oldData.maxMember,
    //         rules: props.oldData.rules,
    //         price: props.oldData.price,
    //     } : {
    //         name: "",
    //         type: "",
    //         dateOpen: new Date().toISOString(),
    //         dateClose: addDays(new Date(), 1).toISOString(),
    //         dateStart: addDays(new Date(), 2).toISOString(),
    //         dateEnd: addDays(new Date(), 3).toISOString(),
    //         maxMember: "",
    //         rules: "",
    //         price: "",
    //     },
    //     validationSchema: validSchema,
    //     onSubmit: async (values) => {
    //         console.log("Create Exam with", values);
    //         console.log("Valid", validSchema.validateSync(values));
    //         const errors = customValid(values);
    //         if (Object.keys(errors).length > 0) {
    //             console.log("Custom errors", errors);
    //             formik.setErrors(errors);
    //             return;
    //         }
    //         setIsLoading(true);
    //         let result: MyResponse;
    //         if (props.method === EDIT_METHOD.create) {
    //             result = await api.postWithToken(`${appConfig.backendUri}/${routeName}/insert`, values);
    //         }
    //         else {
    //             result = await api.putWithToken(`${appConfig.backendUri}/${routeName}/update`, {
    //                 ...values,
    //                 key: props.oldData!.id,
    //             });
    //         }
    //         setIsLoading(false)
    //         if (result.errorCode) {
    //             DialogHelper.showAlert(result.errorMessage);
    //         }
    //         else {
    //             DialogHelper.showAlert("Success");
    //             if (props.onSuccess) {
    //                 props.onSuccess();
    //             }
    //         }
    //     }
    // });

    // // const renderSessionTable = () => {
    // //    return <ExamSessionCreateTable
    // //    dataList={sessionList.map(e => ({
    // //        ...e,
    // //        dateTimeStart: new Date(e.dateTimeStart),
    // //        dateTimeEnd: new Date(e.dateTimeEnd),
    // //    }))}
    // //    onEdit={()=>{}}
    // //    onDelete={()=>{}}
    // //    />

    // // }

    // function customValid(vals: any) {
    //     let errors: any = {}
    //     if (!isBefore(new Date(vals.dateOpen), new Date(vals.dateClose))) {
    //         errors.dateClose = "Date close must bigger than date open";
    //     }
    //     return errors;
    // }

    // function getTitle(method: EDIT_METHOD) {
    //     return method === EDIT_METHOD.create ? "Exam | Create" : "Exam | Update";
    // }

    // function renderHeader(method: EDIT_METHOD) {
    //     const label = method === EDIT_METHOD.create ? "Create Exam" : "Create Exam";
    //     return label;
    // }
    // const onClickCancel = () => {
    //     //window.alert("Clicked delete on item = " + JSON.stringify(item, undefined, 4));
    //     const result = DialogHelper.showConfirm("Are you sure cancel the exam create?");
    //     if (result) {
    //         navigate("/dashboard/exam");
    //     }
    // }
    // // function getSessionStatus(data: any) {
    // //     const now = new Date();
    // //     if (isAfter(data.dateTimeStart, now)) {
    // //         return "Coming"
    // //     }
    // //     else if (isAfter(data.dateTimeEnd, now)) {
    // //         return "Happening"
    // //     }
    // //     else {
    // //         return "Finish"
    // //     }
    // // }
    // // const handleCreate = () => {
    // //     rootDialog.openDialog({
    // //         children: <ExamTestCreate
    // //             method={EDIT_METHOD.create}
    // //             onSuccess={() => {
    // //                 rootDialog.closeDialog();

    // //             }}
    // //             onSubmit={onSubmit}
    // //             onClose={() => rootDialog.closeDialog()}
    // //         />,
    // //     });
    // // }
    // const onSubmit = (data: any) => {
    //     sessionList.push(data);
    //     console.log(data.name, data.location, data.maxMember, data.dateTimeStart, data.dateTimeEnd);
    //     window.alert('success');

    // }
    // const marginTop = 1;
    // return (
    //     // @ts-ignore
    //     <Page title={getTitle(props.method)} >
    //         <Container>
    //             <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
    //                 {renderHeader(props.method)}
    //             </Typography>
    //             <CustomizedTabs listtab={['Information', "Exam sessions"]} children={[

    //                 <Card style={{ alignItems: "center", justifyContent: 'center', padding: "30px 80px", textAlign: "center", marginTop: '15px' }} >
    //                     <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>

    //                         <Stack direction="row" spacing={2} sx={{ p: 1 }}>
    //                             <Box sx={{ width: "50%" }}>
    //                                 <FormIkTextField formik={formik} fieldName="name"
    //                                     fullWidth
    //                                     label="Name"
    //                                     style={{ marginTop }}
    //                                 />

    //                             </Box>
    //                             <Box sx={{ minWidth: "50%" }}>
    //                                 <FormIkTextField formik={formik} fieldName="type"
    //                                     fullWidth
    //                                     label="Type"
    //                                     style={{ marginTop }}
    //                                 />
    //                             </Box>

    //                         </Stack>
    //                         <Stack direction="row" spacing={2} sx={{ p: 1 }}>
    //                             <Box sx={{ width: "50%" }}>
    //                                 <FormIkNumberField formik={formik} fieldName="price"
    //                                     fullWidth
    //                                     label="Fees"
    //                                     style={{ marginTop: 1 }}
    //                                 />
    //                             </Box>
    //                             <Box sx={{ minWidth: "50%" }}>
    //                                 <FormIkNumberField formik={formik} fieldName="maxMember"
    //                                     fullWidth
    //                                     label="Max Member"
    //                                     style={{ marginTop }}
    //                                 />
    //                             </Box>

    //                         </Stack>


    //                         <Box>
    //                             <Stack direction="row">
    //                                 <Box sx={{ p: 1, width: "50%" }}>
    //                                     <FormIkDatePicker formik={formik} fieldName="dateOpen"
    //                                         label="Open Register"
    //                                     />
    //                                 </Box>

    //                                 <Box sx={{ p: 1, width: "50%" }}>
    //                                     <FormIkDatePicker formik={formik} fieldName="dateClose"
    //                                         label="Close Register"
    //                                     />
    //                                 </Box>
    //                                 <Box sx={{ p: 1, width: "50%" }}>
    //                                     <FormIkDatePicker formik={formik} fieldName="dateStart"
    //                                         label="Start Exam"
    //                                     />
    //                                 </Box>

    //                                 <Box sx={{ p: 1, width: "50%" }}>
    //                                     <FormIkDatePicker formik={formik} fieldName="dateEnd"
    //                                         label="End Exam"
    //                                     />
    //                                 </Box>
    //                             </Stack>
    //                         </Box>

    //                         <Box sx={{ p: 1 }}>
    //                             <TextField
    //                                 fullWidth
    //                                 multiline
    //                                 minRows={3}
    //                                 name="rules"
    //                                 label="Description"
    //                                 value={formik.values.rules}
    //                                 onChange={formik.handleChange}
    //                                 error={formik.touched.rules && Boolean(formik.errors.rules)}
    //                                 helperText={formik.touched.rules && formik.errors.rules}
    //                             />
    //                         </Box>

    //                         <Box>
    //                             <Stack direction="row" spacing={20} alignItems="center" justifyContent="center" marginTop={5} marginBottom={5}>

    //                                 <LoadingButton
    //                                     variant="contained"
    //                                     onClick={() => formik.handleSubmit()}
    //                                     sx={{ width: "120px" }}
    //                                 >
    //                                     Create
    //                                 </LoadingButton>

    //                                 <Button
    //                                     variant="outlined"
    //                                     onClick={() => onClickCancel()}
    //                                     sx={{ width: "120px" }} >
    //                                     Cancel
    //                                 </Button>

    //                             </Stack>
    //                         </Box>


    //                     </LocalizationProvider>
    //                 </Card >,
    //                 // <DataTable3
    //                 //     searchbarText='Tìm ca thi'
    //                 //     maxRow={10}
    //                 //     list={sessionList}
    //                 //     handleCreate={(handleCreate)}
    //                 //     onRenderItem={renderSessionTable}
    //                 // ></DataTable3>

    //             ]}></CustomizedTabs>
    //         </Container >
    //     </Page >
    // );
}


