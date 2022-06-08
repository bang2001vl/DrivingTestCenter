import { FC, useEffect, useState } from "react"
import { BasicEditSection, BasicEditSectionProps } from "../../sections/CRUD/BasicEditSection"
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
import { useNavigate} from "react-router-dom"
import { DialogHelper } from "../../singleton/dialogHelper"
import { FormIkNumberField } from "../../components/FormIK/NumberField"
import { FormIkDateTimePicker } from "../../components/FormIK/DateTimePicker"
import { FormIKExamSelector } from "../../components/FormIK/Selectors/examSelectors"
import isBefore from "date-fns/isBefore"
import addHours from "date-fns/addHours"
import { FormIkRoom } from "../../components/FormIK/Selectors/Rooms"

interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
}

export const ExamTestCreate: FC<IProps & Partial<BasicEditSectionProps>> = (props) => {
    const routeName = "examtest";
    const navigate = useNavigate();
    const api = useAPI();
    const defaultInitValue = {
        examOption: null,
        name: "",
        location: "",
        dateTimeStart: new Date().toISOString(),
        dateTimeEnd: addHours(new Date(), 1).toISOString(),
        maxMember: "",
    };

    const loadOldData = (params: URLSearchParams)=>{
        const key = params.get("id");
        if (!key) {
            navigate("/", { replace: true });
            DialogHelper.showAlert("Not found id");
        }
        return api.getWithToken(
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
            if(res.result && res.data){
                const exam = res.data[0].exam;
                res.data[0].examOption = {label: exam.name, value:exam}
            }
            return res;
        })
    }

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
            data.key = String(formik.values.id);
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
        title={props.method === EDIT_METHOD.create ? "Tạo Ca Thi" : "Thông tin ca thi"}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        loadOldData={loadOldData}

        {...props}
        initValues={{...defaultInitValue, ...props.initValues}}
        formComponent={(formik, cancel, isLoading) => {
            return (
                <Card style={{ alignItems: "center", justifyContent: 'center', textAlign: "center", marginTop: '15px', padding: "5%" }} >
                    <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                        <Stack direction="row" spacing={2}>
                            <FormIkTextField formik={formik} fieldName="name"
                                fullWidth
                                label="Name"

                            />

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
                                    sx={{ width: "120px", height: "43px" }}
                                     >
                                    Hủy
                                </Button>
                            </Stack>
                        </Stack>
                    </LocalizationProvider>
                </Card >
            )
        }}
    >

    </BasicEditSection >
}
