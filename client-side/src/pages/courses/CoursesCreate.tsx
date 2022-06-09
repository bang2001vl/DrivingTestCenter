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
import { useNavigate, useSearchParams } from "react-router-dom"
import { FormIkDatePicker } from "../../components/FormIK/DatePicker"
import { DialogHelper } from "../../singleton/dialogHelper"
import { FormIkNumberField } from "../../components/FormIK/NumberField"
import addDays from "date-fns/addDays"
import isBefore from "date-fns/isBefore"
import { FormIkRoom } from "../../components/FormIK/Selectors/Rooms"

interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
    hideTitle?: boolean,
}

export const CoursesCreate: FC<IProps & Partial<BasicEditSectionProps>> = (props) => {
    const routeName = "course";
    const navigate = useNavigate();
    const api = useAPI();
    const defaultValue = {
        name: "",
        location: "",
        dateStart: new Date().toISOString(),
        dateEnd: addDays(new Date(), 1).toISOString(),
        maxMember: "",
    };


    const loadOldData = (params: URLSearchParams)=>{
        const key = params.get("id");
            if (!key) {
                navigate("/", { replace: true });
                DialogHelper.showAlert("Không tìm thấy lớp học!");
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
            );
    }

    const schema = yup.object({
        name: yup.string().required("Tên lớp không được để trống!"),
        location: yup.string().required('Phòng học không được để trống!'),
        dateStart: yup.string().required('Ngày bắt đầu không được để trống!'),
        dateEnd: yup.string().required('Ngyà kết thúc không được để trống!'),
        maxMember: yup.number().typeError("Bắc buộc nhập số").required('Số lượng tối đa không được để trống!'),
    });

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);

        if (!isBefore(new Date(formik.values.dateStart), new Date(formik.values.dateEnd))) {
            errors.dateClose = "Ngày kết thúc phải lớn hơn ngày bắt đầu!";
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
            price: values.price,
            location: values.location,
            dateStart: values.dateStart,
            dateEnd: values.dateEnd,
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
        title={props.hideTitle ? "" : (props.method === EDIT_METHOD.create) ? "Tạo lớp Học" : "Cập nhật lớp học"}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        loadOldData={loadOldData}

        {...props}
        initValues={{...defaultValue, ...props.initValues}}
        formComponent={(formik, cancel, isLoading) => {
            return (
                <Card style={{ alignItems: "center", justifyContent: 'center', textAlign: "center", marginTop: '15px', padding: "5%" }} >
                    <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={2}>
                                < Box sx={{ width: "50%" }}>
                                    <FormIkTextField formik={formik} fieldName="name"
                                        fullWidth
                                        label="Tên lớp"

                                    />
                                </Box>

                                < Box sx={{ width: "50%" }}>
                                    <FormIkNumberField formik={formik} fieldName="price"
                                        fullWidth
                                        label="Học phí"
                                    />
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkRoom formik={formik} fieldName="location"
                                        fullWidth
                                        label="Nơi học"
                                        sx={{ marginTop }}
                                    />
                                </Box>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkNumberField formik={formik} fieldName="maxMember"
                                        fullWidth
                                        label="Số lượng tối đa"
                                        sx={{ marginTop }}
                                    />
                                </Box>

                            </Stack>
                            <Stack direction="row" spacing={2} paddingTop={2}>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkDatePicker formik={formik} fieldName="dateStart"
                                        label="Ngày bắt đầu"
                                        
                                    />
                                </Box>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkDatePicker formik={formik} fieldName="dateEnd"
                                        label="Ngày kết thúc"   
                                        
                                        />
                                </Box>

                            </Stack>
                            <Stack direction={"row"} spacing={20} style={{ alignSelf: "center", marginTop: "40px" }}>
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
                                    sx={{ width: "120px", height: "43px" }} >
                                    Hủy
                                </Button>
                            </Stack>
                        </Stack>
                    </LocalizationProvider>
                </Card>

            )
        }}
        {...props}
    >

    </BasicEditSection >
}