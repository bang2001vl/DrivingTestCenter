import { FC, useEffect, useState } from "react"
import { BasicEditSection } from "../../sections/CRUD/BasicEditSection"
import * as yup from "yup"
import { IFormIK } from "../../_interfaces/formik"
import { validYupToObject } from "../../_helper/helper"
import useAPI from "../../hooks/useApi"
import { appConfig } from "../../configs"
import { LoadingButton, LocalizationProvider } from "@mui/lab"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { Box, Button, MenuItem, Stack, Card } from "@mui/material"
import { FormIkTextField } from "../../components/FormIK/TextField"
import { EDIT_METHOD } from "../../_enums"
import { useNavigate, useSearchParams } from "react-router-dom"
import { MyResponse } from "../../api/service"
import { FormIkAvatar } from "../../components/FormIK/Avatar"
import { FormIkDatePicker } from "../../components/FormIK/DatePicker"
import { FormIkAddress } from "../../components/FormIK/Selectors/Address"
import { DialogHelper } from "../../singleton/dialogHelper"

interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
}
export const AccountManagerCreate: FC<IProps> = (props) => {
    const navigate = useNavigate();
    const api = useAPI();
    const [searchParams] = useSearchParams();
    const [initValue, setInitValue] = useState({
        username: "",
        password: "",
        fullname: "",
        birthday: new Date().toISOString(),
        gender: 1,
        email: "",
        phoneNumber: "",
        address: "",
        avatar: null,
    });

    const routeName = "account/manager";

    useEffect(() => {
        if (props.method === EDIT_METHOD.update) {
            const key = searchParams.get("id") && props.editKey;
            if (!key) {
                navigate("/", { replace: true });
                DialogHelper.showAlert("Not found id");
            }

            api.getWithToken(
                `${appConfig.backendUri}/${routeName}/select?${new URLSearchParams({
                    searchvalue: "",
                    searchby: "fullname",
                    orderby: "fullname",
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

    const schema = yup.object({
        username: yup.string().required(),
        password: yup.string().required(),
        birthday: yup.string().required(),
        gender: yup.number().positive().required(),
        email: yup.string().email().required(),
        phoneNumber: yup.string().required(),
        address: yup.string().required(),
    });

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);
        if (Object.keys(errors).length > 0) {
            formik.setErrors(errors);
            return errors;
        }
    }

    function handleSubmit(formik: IFormIK) {
        console.log("Handle submit formik values: ", formik.values);
        const formData = new FormData();

        Object.keys(formik.values).forEach(key => {
            if (formik.values[key]) {
                formData.append(key, formik.values[key])
            }
        });

        if (props.method === EDIT_METHOD.create) {
            return api.postWithToken(
                `${appConfig.backendUri}/${routeName}/insert`,
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            );
        }
        else {
            formData.delete("id");
            formData.append("key", formik.values.id);
            return api.putWithToken(
                `${appConfig.backendUri}/${routeName}/update`,
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
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

    return <BasicEditSection
        title="Tạo tài khoản"
        initValues={initValue}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        formComponent={(formik, cancel, isLoading) => {
            return (
                <Box style={{ width: "100%"}}>
                    <Card>
                        <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                            <Stack direction="row" spacing={5} alignItems="start" justifyContent="start" paddingTop={5} paddingBottom={5} paddingLeft={10} paddingRight={10}>
                                <FormIkAvatar formik={formik} fieldName="avatar"
                                    defaultValue={(() => { console.log(formik.values["avatarURI"]); return true })() && formik.values["avatarURI"]}
                                    label="Avatar"
                                    propFormControl={{
                                        style: {
                                            minWidth: 200
                                        }
                                    }}
                                />
                                <Stack spacing={2} sx={{flex: 1}}>
                                    <Box sx={{ width: "100%" }}>
                                        <FormIkTextField formik={formik} fieldName="username"
                                            label="Tên đăng nhập"
                                            fullWidth
                                        />

                                    </Box>
                                    <Box sx={{ width: "100%" }}>
                                        <FormIkTextField formik={formik} fieldName="password"
                                            label="Mật khẩu"
                                            type={"password"}
                                            fullWidth
                                        />
                                    </Box>

                                    <Box sx={{ width: "100%" }}>
                                        <FormIkTextField formik={formik} fieldName="fullname"
                                            label="Họ và tên"
                                            fullWidth
                                        />
                                    </Box>


                                    <Stack direction="row" spacing={2}>
                                     
                                            <FormIkDatePicker formik={formik} fieldName="birthday"
                                                label="Ngày sinh"

                                            />
                                        
                                        <Box sx={{ flex: 1}}>
                                            <FormIkTextField formik={formik} fieldName="gender"
                                                label="Giới tính"
                                                fullWidth
                                                select
                                            >
                                                {["Nữ", "Nam"].map((e, index) => (<MenuItem key={e} value={index}>{String(e)}</MenuItem>))}
                                            </FormIkTextField>
                                        </Box>
                                    </Stack>





                                    <FormIkTextField formik={formik} fieldName="email"
                                        label="Email"
                                        fullWidth
                                    >

                                    </FormIkTextField>

                                    <FormIkTextField formik={formik} fieldName="phoneNumber"
                                        label="Số điện thoại"
                                        fullWidth
                                    />

                                    <FormIkAddress formik={formik} fieldName="address"
                                        propsStack={{
                                            direction: "row",
                                            spacing: 2
                                        }}
                                        propsItem={{
                                            style: {
                                                minWidth: 200
                                            }
                                        }}
                                    />
                                    <Stack direction={"row"} spacing={20} style={{ alignSelf: "center", paddingTop: '20px'}}>
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
                            </Stack>
                        </LocalizationProvider>
                    </Card>
                </Box>
            )
        }}
    >

    </BasicEditSection>
}