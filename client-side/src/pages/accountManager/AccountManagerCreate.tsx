import { FC, useEffect, useState } from "react"
import { BasicEditSection, BasicEditSectionProps } from "../../sections/CRUD/BasicEditSection"
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
import { FormIkRole } from "../../components/FormIK/Selectors/Role"
import { FormIkGender } from "../../components/FormIK/Selectors/Gender"

interface IProps {
    method: EDIT_METHOD,
}

export const AccountManagerCreate: FC<IProps & Partial<BasicEditSectionProps>> = (props) => {
    const navigate = useNavigate();
    const api = useAPI();

    const defaultValue = {
        username: "",
        password: "",
        fullname: "",
        birthday: new Date().toISOString(),
        gender: 1,
        roleId: 1,
        email: "",
        phoneNumber: "",
        address: "",
        avatar: null,
    };

    const routeName = "account/manager";

    function handleLoadOldData(searchParams: URLSearchParams) {
        const key = searchParams.get("id")
        if (!key) {
            navigate("/", { replace: true });
            return Promise.resolve(new MyResponse(false, -1, "Not found id"));
        }

        return api.getWithToken(
            `${appConfig.backendUri}/${routeName}/select?${new URLSearchParams({
                searchvalue: "",
                searchby: "fullname",
                orderby: "fullname",
                orderdirection: "asc",
                start: "0",
                count: "1",
                id: String(key),
            }).toString()}`
        )
    }

    const schema = yup.object({
        username: yup.string().required("Tên người dùng không được để trống!"),
        password: yup.string().required('Mật khẩu không được để trống!'),
        birthday: yup.string().required('Ngày sinh không được để trống!'),
        gender: yup.number().required('Giới tính không được để trống!'),
        roleId: yup.number().positive().required('Vai trò không được để trống!'),
        email: yup.string().email().required('Email không được để trống!'),
        phoneNumber: yup.string().required('Số điện thoại không được để trống!'),
        address: yup.string().required('Địa chỉ không được để trống!'),
    });

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);
        if(props.method === EDIT_METHOD.update){
            delete errors.password;
        }
        if (Object.keys(errors).length > 0) {
            formik.setErrors(errors);
            return errors;
        }
    }

    function handleSubmit(formik: IFormIK) {
        console.log("Handle submit formik values: ", formik.values);
        const data = {
            username: formik.values.username,
            password: formik.values.password,
            fullname: formik.values.fullname,
            email: formik.values.email,
            phoneNumber: formik.values.phoneNumber,
            address: formik.values.address,
            birthday: formik.values.birthday,
            gender: formik.values.gender,
            roleId: formik.values.roleId,
            avatar: formik.values.avatar instanceof File ? formik.values.avatar : undefined,
        }

        const formData = new FormData();
        Object.keys(data).forEach(key => {
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
        DialogHelper.showSuccess("Thành công");
        navigate(-1);
    }

    function handleClose() {
        navigate(-1);
    }

    return <BasicEditSection
        title={props.method === EDIT_METHOD.create ? "Tạo tài khoản" : "Cập nhật tài khoản"}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        loadOldData={handleLoadOldData}

        {...props}
        initValues={{ ...defaultValue, ...props.initValues }}
        formComponent={(formik, cancel, isLoading) => {
            return (
                <Box style={{ width: "100%" }}>
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
                                <Stack spacing={2} sx={{ flex: 1 }}>
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
                                        <Box sx={{ width: "25%" }}>
                                            <FormIkGender formik={formik} fieldName="gender"
                                                label="Giới tính"
                                                fullWidth
                                            />

                                        </Box>
                                        <Box sx={{ width: "25%" }}>
                                            <FormIkRole formik={formik} fieldName="roleId"
                                                label="Vai trò"
                                                fullWidth
                                            />

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
                                    <Stack direction={"row"} spacing={20} style={{ alignSelf: "center", paddingTop: '20px' }}>
                                        <LoadingButton
                                            variant="contained"
                                            onClick={() => formik.handleSubmit()}
                                            sx={{ width: "120px" }}
                                        >
                                            Lưu
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