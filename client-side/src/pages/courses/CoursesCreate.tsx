import { FC, useEffect, useState } from "react"
import { BasicEditSection } from "../../sections/CRUD/BasicEditSection"
import * as yup from "yup"
import { IFormIK } from "../../_interfaces/formik"
import { validYupToObject } from "../../_helper/helper"
import useAPI from "../../hooks/useApi"
import { appConfig } from "../../configs"
import { LoadingButton, LocalizationProvider } from "@mui/lab"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { Box, Button, MenuItem, Stack } from "@mui/material"
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

interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
}

export const CoursesCreate: FC<IProps> = (props) => {
    const routeName = "course";
    const navigate = useNavigate();
    const api = useAPI();
    const [searchParams] = useSearchParams();
    const [initValue, setInitValue] = useState({
        examOption: null,
        name: "",
        location: "",
        dateStart: new Date().toISOString(),
        dateEnd: addDays(new Date(), 1).toISOString(),
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
        dateStart: yup.string().required(),
        dateEnd: yup.string().required(),
        maxMember: yup.number().typeError("Must be number").required(),
    });

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);

        if (!isBefore(new Date(formik.values.dateStart), new Date(formik.values.dateEnd))) {
            errors.dateClose = "Date time start must bigger than date time end";
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
        title="Create Account"
        initValues={initValue}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        formComponent={(formik, cancel, isLoading) => {
            return (
                <Box style={{ width: "100%", minWidth: 800 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                        <Stack spacing={2} alignItems="center" justifyContent="start" marginTop={5} marginBottom={5}>
                            <Stack direction="row" spacing={2}>

                                < Box sx={{ minWidth: "50%" }}>
                                    <FormIkTextField formik={formik} fieldName="name"
                                        fullWidth
                                        label="Tên lớp"

                                    />
                                </Box>

                                < Box sx={{ minWidth: "50%" }}>
                                    <FormIkNumberField formik={formik} fieldName="price"
                                        fullWidth
                                        label="Học phí"
                                    />
                                </Box>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkTextField formik={formik} fieldName="location"
                                        fullWidth
                                        label="Nơi học"
                                        sx={{ marginTop }}
                                    />
                                </Box>
                                <Box sx={{ minWidth: "50%" }}>
                                    <FormIkNumberField formik={formik} fieldName="maxMember"
                                        fullWidth
                                        label="Số lượng"
                                        sx={{ marginTop }}
                                    />
                                </Box>

                            </Stack>
                            <Stack direction="row" spacing={2} paddingTop={2}>
                                <Box sx={{ width: "50%" }}>
                                    <FormIkDatePicker formik={formik} fieldName="dateStart"
                                        label="Bắt đầu"
                                    />
                                </Box>
                                <Box sx={{ minWidth: "50%" }}>
                                    <FormIkDatePicker formik={formik} fieldName="dateEnd"
                                        label="Kết thúc"

                                    />
                                </Box>

                            </Stack>
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
                        </Stack>
                    </LocalizationProvider>
                </Box >
            )
        }}
    >

    </BasicEditSection >
}