import { FC, useEffect, useState } from "react"
import { BasicEditSection } from "../../sections/CRUD/BasicEditSection"
import * as yup from "yup"
import { IFormIK } from "../../_interfaces/formik"
import { validYupToObject } from "../../_helper/helper"
import useAPI from "../../hooks/useApi"
import { appConfig } from "../../configs"
import { LoadingButton, LocalizationProvider } from "@mui/lab"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { Box, Button, Card, MenuItem, Stack } from "@mui/material"
import { FormIkTextField } from "../../components/FormIK/TextField"
import { EDIT_METHOD } from "../../_enums"
import { useNavigate, useSearchParams } from "react-router-dom"
import { MyResponse } from "../../api/service"
import { FormIkAvatar } from "../../components/FormIK/Avatar"
import { FormIkDatePicker } from "../../components/FormIK/DatePicker"
import { FormIkAddress } from "../../components/FormIK/Selectors/Address"
import { DialogHelper } from "../../singleton/dialogHelper"
import { FormIkNumberField } from "../../components/FormIK/NumberField"
import { FormIkDateTimePicker } from "../../components/FormIK/DateTimePicker"
import { FormIKExamSelector } from "../../components/FormIK/Selectors/examSelectors"
import addDays from "date-fns/addDays"
import isBefore from "date-fns/isBefore"
import addHours from "date-fns/addHours"
import { FormIkRoom } from "../../components/FormIK/Selectors/Rooms"

interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
}

export const ExamTestCreate: FC<IProps> = (props) => {
    const routeName = "examtest";
    const navigate = useNavigate();
    const api = useAPI();
    const [searchParams] = useSearchParams();
    const [initValue, setInitValue] = useState({
        examOption: null,
        name: "",
        location: "",
        dateTimeStart: new Date().toISOString(),
        dateTimeEnd: addHours(new Date(), 1).toISOString(),
        maxMember: "",
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
        name: yup.string().required("Name must not be null"),
        location: yup.string().required(),
        dateTimeStart: yup.string().required(),
        dateTimeEnd: yup.string().required(),
        maxMember: yup.number().typeError("Must be number").required(),
    });

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);

        if (!isBefore(new Date(formik.values.dateTimeStart), new Date(formik.values.dateTimeEnd))) {
            errors.dateClose = "Date time start must bigger than date time end";
        }

        if (!formik.values.examOption) {
            errors.examOption = "This field is required";
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
            examId: formik.values.examOption.value.id,
            name: values.name,
            location: values.location,
            dateTimeStart: values.dateTimeStart,
            dateTimeEnd: values.dateTimeEnd,
            maxMember: values.maxMember,
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
        title="Tạo Ca Thi"
        initValues={initValue}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        formComponent={(formik, cancel, isLoading) => {
            return (
                <Card style={{ alignItems: "center", justifyContent: 'center', textAlign: "center", marginTop: '15px', padding: "5%" }} >
                    <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                        <Stack direction="row" spacing={2}>
                        < Box sx={{ minWidth: "50%" }}>
                        <FormIkTextField formik={formik} fieldName="name"
                                fullWidth
                                label="Name"

                            />
                                </Box>

                            < Box sx={{ minWidth: "50%" }}>
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
                            <Box sx={{ width: "50%" }}>
                                <FormIkRoom formik={formik} fieldName="location"
                                fullWidth
                                    label="Location"
                                    sx={{ marginTop, textAlign: "start" }}
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
                        <Stack direction={"row"} spacing={20} style={{ alignSelf: "center" }}>
                                <LoadingButton
                                    variant="contained"
                                    onClick={() => formik.handleSubmit()}
                                    sx={{ width: "120px" }}
                                >
                                    Xác nhận
                                </LoadingButton>

                                <Button
                                    variant="outlined"
                                    onClick={() => cancel()}
                                    sx={{ width: "120px" }} >
                                    Hủy
                                </Button>
                            </Stack>
                        </Box>
                    </LocalizationProvider>
                </Card >
            )
        }}
    >

    </BasicEditSection >
}

// interface IProps {
//     method: EDIT_METHOD,
//     oldData?: { id: number, exam: any } & IData,
//     onSuccess?: () => void,
//     onClose?: () => void,
//     onSubmit?: (value: IData) => void,
//     isExamCreate?: boolean,
// }

// interface IData {
//     id?: number,
//     examOption?: any,
//     name: string,
//     location: string,
//     dateTimeStart: string,
//     dateTimeEnd: string,
//     maxMember: number | string,
// }

// const routeName = "examtest";

// export const ExamTestCreate: FC<IProps> = (props: IProps) => {
//     const navigate = useNavigate();
//     const api = useAPI();
//     const [isLoading, setIsLoading] = useState(false);

//     const validSchema = yup.object();

//     const formik = useFormik<IData>({
//         initialValues: props.oldData ? {
//             examOption: { label: props.oldData.exam.name, value: props.oldData.exam },
//             name: props.oldData.name,
//             location: props.oldData.location,
//             dateTimeStart: props.oldData.dateTimeStart,
//             dateTimeEnd: props.oldData.dateTimeEnd,
//             maxMember: props.oldData.maxMember,
//         } : {
            
//         },
//         validationSchema: validSchema,
//         onSubmit: async (values) => {
//             console.log("Create ExamTest with", values);
//             console.log("Valid", validSchema.validateSync(values));
//             if (!props.isExamCreate) {
//                 const errors = customValid(values as IData);
//                 if (Object.keys(errors).length > 0) {
//                     console.log("Custom errors", errors);
//                     formik.setErrors(errors);
//                     return;
//                 }
//             }
//             if (props.onSubmit === undefined) {
//                 let examId = Number(values.examOption.value.id);
//                 delete values.examOption;
//                 // OK
//                 let data = {
//                     ...values,
//                     examId,
//                 }
//                 setIsLoading(true);
//                 let result: MyResponse;
//                 if (props.method === EDIT_METHOD.create) {
//                     result = await api.postWithToken(`${appConfig.backendUri}/${routeName}/insert`, data);
//                 }
//                 else {
//                     result = await api.putWithToken(`${appConfig.backendUri}/${routeName}/update`, {
//                         ...data,
//                         key: props.oldData!.id,
//                     });
//                 }
//                 setIsLoading(false)
//                 if (result.errorCode) {
//                     DialogHelper.showAlert(result.errorMessage);
//                 }
//                 else {
//                     DialogHelper.showAlert("Success");
//                     if (props.onSuccess) {
//                         props.onSuccess();
//                     }
//                 }
//             }
//             else {
//                 const fakeID: number = 999999;
//                 let data = {
//                     ...values,
//                     fakeID,
//                 };
//                 props.onSubmit(data);
//                 if (props.onClose) {
//                     props.onClose()
//                 }

//             };


//         }
//     });

//     const onClickCancel = () => {
//         //window.alert("Clicked delete on item = " + JSON.stringify(item, undefined, 4));
//         const result = DialogHelper.showConfirm("Bạn muốn hủy tạo ca thi này?");
//         if (result) {
//             (props.onClose) ? props.onClose() : navigate("/dashboard/session");
//         }
//     }
//     function customValid(vals: IData) {
//         let errors: any = {}
//         if (!isBefore(new Date(vals.dateTimeStart), new Date(vals.dateTimeEnd))) {
//             errors.dateClose = "Date time start must bigger than date time end";
//         }
//         if (!vals.examOption) {
//             errors.examOption = "This field is required";
//         }
//         return errors;
//     }

//     function getTitle(method: EDIT_METHOD) {
//         return method === EDIT_METHOD.create ? "Exam | Create" : "Exam | Update";
//     }

//     function renderHeader(method: EDIT_METHOD) {
//         const label = method === EDIT_METHOD.create ? "Tạo ca thi" : "Chỉnh sửa ca thi";
//         return label;
//     }

//     const marginTop = 2;
//     return (
//         // @ts-ignore
//         <Page title={getTitle(props.method)} >
//             <Container>
//                 <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
//                     {renderHeader(props.method)}
//                 </Typography>
                
//             </Container>
//         </Page >
//     );
// }