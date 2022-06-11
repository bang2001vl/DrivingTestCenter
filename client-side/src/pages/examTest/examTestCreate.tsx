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
import { useNavigate } from "react-router-dom"
import { DialogHelper } from "../../singleton/dialogHelper"
import { FormIkNumberField } from "../../components/FormIK/NumberField"
import { FormIkDateTimePicker } from "../../components/FormIK/DateTimePicker"
import { FormIKExamSelector } from "../../components/FormIK/Selectors/examSelectors"
import isBefore from "date-fns/isBefore"
import addHours from "date-fns/addHours"
import { FormIkRoom } from "../../components/FormIK/Selectors/Rooms"
import { FormIkDatePicker } from "../../components/FormIK/DatePicker"
import { FormIkTimePicker } from "../../components/FormIK/TimePicker"
import parse from "date-fns/parse"

interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
    hideTitle?: boolean,
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
        dateTimeStart2: new Date().toISOString(),
        dateTimeEnd2: addHours(new Date(), 1).toISOString(),
        maxMember: "",
    };

    const loadOldData = (params: URLSearchParams) => {
        const key = params.get("id");
        if (!key) {
            navigate("/", { replace: true });
            DialogHelper.showError("Không tìm thấy id");
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
            if (res.result && res.data) {
                const exam = res.data[0].exam;
                res.data[0].examOption = { label: exam.name, value: exam }
            }
            return res;
        })
    }

    const schema = yup.object({
        name: yup.string().required("Tên không được để trống!"),
        location: yup.string().required("Phòng thi không được để trống!"),
        dateTimeStart: yup.string().required("Ngày bắt đầu không được để trống!"),
        dateTimeEnd: yup.string().required("Ngày kết thúc không được để trống!"),
        dateTimeStart2: yup.string().required("Ngày bắt đầu không được để trống!"),
        dateTimeEnd2: yup.string().required("Ngày kết thúc không được để trống!"),
        maxMember: yup.number().typeError("Bắt buộc nhập số!").required("Số lượng tối đa không được để trống!"),
    });

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);

        if (!isBefore(new Date(formik.values.dateTimeStart), new Date(formik.values.dateTimeEnd))) {
            errors.dateTimeStart = "Giờ bắt đầu không được lớn hơn ngày kết thúc!";
        }


        if (!isBefore(new Date(formik.values.dateTimeStart2), new Date(formik.values.dateTimeEnd2))) {
            errors.dateTimeStart2 = "Giờ bắt đầu không được lớn hơn ngày kết thúc!";
        }

        if (!formik.values.examOption) {
            errors.examOption = "Kì thi không được để trống!";
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
            dateTimeStart2: values.dateTimeStart2,
            dateTimeEnd2: values.dateTimeEnd2,
            maxMember: values.maxMember,
        }

        console.log("Final data: ", data);
        //return;

        if (props.method === EDIT_METHOD.create) {
            return api.postWithToken(
                `${appConfig.backendUri}/${routeName}/insert`,
                data,
            ).then(res => {
                if (res.errorCode === 102) {
                    DialogHelper.showError("Phòng đã có lịch vào khung giờ này");
                    res.errorMessage = undefined;
                }
                return res;
            });
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
        DialogHelper.showSuccess("Success");
        navigate(-1);
    }

    function handleClose() {
        navigate(-1);
    }

    const marginTop = 1;
    return <BasicEditSection
        title={props.hideTitle ? "" : (props.method === EDIT_METHOD.create ? "Tạo Ca Thi" : "Thông tin ca thi")}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        loadOldData={loadOldData}

        {...props}
        initValues={{ ...defaultInitValue, ...props.initValues }}
        formComponent={(formik, cancel, isLoading) => {
            return (
                <Card style={{ alignItems: "center", justifyContent: 'center', textAlign: "center", marginTop: '15px', padding: "5%" }} >
                    <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                        <Stack direction="row" spacing={2}>
                            <FormIkTextField formik={formik} fieldName="name"
                                fullWidth
                                label="Tên ca thi"

                            />

                            < Box sx={{ minWidth: "50%" }}>
                                <FormIKExamSelector formik={formik} fieldName="examOption"
                                    placeholder="Kì thi"
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
                                    label="Phòng thi"
                                    sx={{ marginTop, textAlign: "start" }}
                                />
                            </Box>
                            <Box sx={{ minWidth: "50%" }}>
                                <FormIkNumberField formik={formik} fieldName="maxMember"
                                    fullWidth
                                    label="Số lượng tối đa"
                                    sx={{ marginTop }}
                                />
                            </Box>

                        </Stack>

                        <Stack direction="row" spacing={2} paddingTop={2}>
                            <Box sx={{ width: "50%" }} >
                                <FormIkDatePicker formik={formik} fieldName="dateTimeStart"
                                    label="Ngày thi lý thuyết"
                                    minDate={new Date()}
                                    onChange={(date) => {
                                        if (date) {
                                            formik.setFieldValue("dateTimeStart", date.toISOString());
                                            const dateTimeEnd = new Date(formik.values["dateTimeEnd"]);
                                            formik.setFieldValue("dateTimeEnd", new Date(date.setTime(dateTimeEnd.getTime())).toISOString());
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ minWidth: "25%" }}>
                                <FormIkTimePicker formik={formik} fieldName="dateTimeStart"
                                    label="Giờ bắt đầu"
                                />
                            </Box>
                            <Box sx={{ minWidth: "25%" }}>
                                <FormIkTimePicker formik={formik} fieldName="dateTimeEnd"
                                    label="Giờ kết thúc"
                                />
                            </Box>

                        </Stack>

                        <Stack direction="row" spacing={2} paddingTop={2}>
                            <Box sx={{ width: "50%" }} >
                                <FormIkDatePicker formik={formik} fieldName="dateTimeStart2"
                                    label="Ngày thi thực hành"
                                    minDate={new Date()}
                                    onChange={(date) => {
                                        if (date) {
                                            formik.setFieldValue("dateTimeStart2", date.toISOString());
                                            const dateTimeEnd = new Date(formik.values["dateTimeEnd2"]);
                                            date.setTime(dateTimeEnd.getTime());
                                            formik.setFieldValue("dateTimeEnd2", date.toISOString());
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ minWidth: "25%" }}>
                                <FormIkTimePicker formik={formik} fieldName="dateTimeStart2"
                                    label="Giờ bắt đầu"
                                />
                            </Box>
                            <Box sx={{ minWidth: "25%" }}>
                                <FormIkTimePicker formik={formik} fieldName="dateTimeEnd2"
                                    label="Giờ kết thúc"
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
                                    Lưu
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
