import { LoadingButton, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, Card, Stack } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from 'yup';
import { FormIkDatePicker } from "../../components/FormIK/DatePicker";
import { FormIkNumberField } from "../../components/FormIK/NumberField";
import { FormIkTextField } from "../../components/FormIK/TextField";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { DialogHelper } from "../../singleton/dialogHelper";
import { EDIT_METHOD } from "../../_enums";
import { IFormIK } from "../../_interfaces/formik";
import { validYupToObject } from "../../_helper/helper";
import { BasicEditSection, BasicEditSectionProps } from "../../sections/CRUD/BasicEditSection";
import { FormIkSelect } from "../../components/FormIK/Select";


interface IProps {
    editKey?: number,
    hideTitle?: boolean,
}

export const BillCreate: FC<IProps> = (props: IProps & Partial<BasicEditSectionProps>) => {
    const routeName = "bill";
    const navigate = useNavigate();
    const api = useAPI();
    const [searchParams] = useSearchParams();
    const defaultValue = {
        reason: "",
        totalPrice: "",
    };

    const schema = yup.object({
        reason: yup.string().required("Reason not be null"),
        totalPrice: yup.number().positive().required(),
        type: yup.number().required(),
    });

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);

        console.log("Errors", errors);
        if (Object.keys(errors).length > 0) {
            formik.setErrors(errors);
            return errors;
        }
    }

    function handleSubmit(formik: IFormIK) {
        console.log("Handle submit formik values: ", formik.values);
        const values = formik.values;

        const data: any = {
            reason: values.reason,
            totalPrice: values.totalPrice * values.type,
        }

        return api.postWithToken(
            `${appConfig.backendUri}/${routeName}/insert`,
            data,
        );
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
        method={EDIT_METHOD.create}
        title={props.hideTitle ? "" : "Tạo Hóa Đơn"}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        loadOldData={undefined}
        {...props}
        initValues={{ ...defaultValue, ...props.initValues }}
        formComponent={(formik, cancel, isLoading) => {
            return <Card style={{ alignItems: "center", justifyContent: 'center', textAlign: "center", marginTop: '15px', padding: "5%" }} >
                <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>
                    <Stack spacing={2}>
<Stack direction={"row"} spacing={2}>
<FormIkSelect formik={formik} fieldName="type"
                        label="Loại hóa đơn"
                        options={[
                            { label: "Thu", value: 1 },
                            { label: "Chi", value: -1 },
                        ]}
                        style={{minWidth:"170px"}}
                    />

                    <FormIkNumberField formik={formik} fieldName="totalPrice"
                        label="Tổng tiền"
                        fullWidth
                    />
</Stack>

                    <FormIkTextField formik={formik} fieldName="reason"
                        label="Lý do"
                        multiline
                        minRows={4}
                    />

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
                    </Stack>

                </LocalizationProvider>
            </Card >
        }}
    />
}
