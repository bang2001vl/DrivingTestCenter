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
import { ClassScheduleController } from "../../api/controllers/classScheduleController"
import { FormIKClassSelector } from "../../components/FormIK/Selectors/classSelector"

interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
    hideTitle?: boolean,
}

export const ClassScheduleCreate: FC<IProps & Partial<BasicEditSectionProps>> = (props) => {
    const routeName = "classSchedule";
    const navigate = useNavigate();
    const api = useAPI();
    const defaultInitValue = {
        classOption: null,
        location: "",
        dateTimeStart: new Date().toISOString(),
        dateTimeEnd: addHours(new Date(), 1).toISOString(),
        notes: "",
    };

    const controller = new ClassScheduleController(api);

    const loadOldData = (params: URLSearchParams) => {
        const key = params.get("id");
        if (!key || isNaN(Number(key))) {
            navigate("/", { replace: true });
            DialogHelper.showError("Không tìm thấy id");
        }
        return controller.loadFromDB(Number(key)).then(res => {
            if (res.result && res.data) {
                const exam = res.data[0].exam;
                res.data[0].examOption = { label: exam.name, value: exam }
            }
            return res;
        })
    }

    function handleValidate(formik: IFormIK) {
        //formik.setFieldValue("classId", formik.values["classOption"].value.id);
        const errors = controller.validate(formik.values);

        if (Object.keys(errors).length > 0) {
            formik.setErrors(errors);
            return errors;
        }
    }

    function handleSubmit(formik: IFormIK) {
        console.log("Handle submit formik values: ", formik.values);
        const values = formik.values;

        if (props.method === EDIT_METHOD.create) {
            return controller.insertToDB(values).then(res => {
                if (res.errorCode === 102) {
                    DialogHelper.showError("Phòng đã có lịch vào khung giờ này");
                    res.errorMessage = undefined;
                }
                return res;
            });
        }
        else {
            return controller.updateToDB(values.key, values);
        }
    }

    function handleSuccess() {
        DialogHelper.showSuccess("Thành công");
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
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={2}>
                                <FormIKClassSelector formik={formik} fieldName="classOption" idFieldName="classId"
                                    placeholder="Lớp"
                                    propFormControl={{
                                        fullWidth: true,
                                        sx: { height: "100%" }
                                    }}
                                />

                                < Box sx={{ minWidth: "50%" }}>
                                    <FormIkTextField formik={formik} fieldName="notes"
                                        fullWidth
                                        label="Ghi chú"
                                    />
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkRoom formik={formik} fieldName="location"
                                        fullWidth
                                        label="Phòng học"
                                        sx={{ textAlign: "start" }}
                                    />
                                </Box>
                                <Box sx={{ minWidth: "50%" }}>
                                    <FormIkDatePicker formik={formik} fieldName="dateTimeStart"
                                        label="Ngày học"
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

                            </Stack>
                            <Stack direction="row" spacing={2} paddingTop={2}>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkTimePicker formik={formik} fieldName="dateTimeStart"
                                        label="Giờ bắt đầu"
                                    />
                                </Box>
                                <Box sx={{ minWidth: "50%" }}>
                                    <FormIkTimePicker formik={formik} fieldName="dateTimeEnd"
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
                        </Stack>
                    </LocalizationProvider>
                </Card >
            )
        }}
    >

    </BasicEditSection >
}
