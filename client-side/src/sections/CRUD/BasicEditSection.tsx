import { Container, Typography } from "@mui/material";
import { FieldHelperProps, FieldInputProps, FieldMetaProps, FormikConfig, FormikErrors, FormikState, FormikTouched, FormikValues, useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { JsxElement } from "typescript";
import Page from "../../components/Page";
import useAPI from "../../hooks/useApi";
import { EDIT_METHOD } from "../../_enums";
import yup from 'yup';
import { MyResponse } from "../../api/service";
import { appConfig } from "../../configs";
import { DialogHelper } from "../../singleton/dialogHelper";
import { IFormIK } from "../../_interfaces/formik";
import { useSearchParams } from "react-router-dom";
import { BuildReportAlert } from "../../singleton/alertConfirm";

export interface BasicEditSectionProps<T extends FormikValues = FormikValues, OldDataType = any> {
    initValues: T,
    formComponent: (formik: IFormIK<T>, cancel: () => void, isLoading: boolean) => JSX.Element,
    title?: string,
    submit: (formik: IFormIK<T>) => Promise<MyResponse>,
    method: EDIT_METHOD,
    validation?: (formik: IFormIK<T>) => any,
    loadOldData?: (searchParams: URLSearchParams) => Promise<MyResponse<any[]>>,
    oldData?: OldDataType,
    onSuccess?: () => void,
    onClose?: () => void,
}

export const BasicEditSection: FC<BasicEditSectionProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: props.initValues,
        onSubmit: () => {
            handleSubmit();
        }, // Disable default handle
    });

    useEffect(() => {
        loadInitValue();
        if (props.method === EDIT_METHOD.update) {
            if (props.loadOldData) {
                props.loadOldData(searchParams)
                    .then(res => {
                        if (res.result && res.data) {
                            formik.setValues(res.data[0]);
                        }
                        else {
                            DialogHelper.showError(res.errorMessage);
                        }
                    });
            }
        }
    }, [props.initValues, searchParams]);

    const loadInitValue = () => {
        if (props.initValues) {
            Object.keys(props.initValues).forEach(key => {
                formik.setFieldValue(key, props.initValues[key]);
                //console.log(formik.values);
            });
        }
    }

    async function handleSubmit() {
        console.log("Insert to db with", formik.values);
        if (props.validation) {
            const errors = props.validation(formik);
            if (errors && Object.keys(errors).length > 0) {
                console.log("Invalid errors", errors);
                return;
            }
        }

        setIsLoading(true);
        let result = await props.submit(formik);
        setIsLoading(false)
        if (result.errorCode) {
            if(result.errorMessage){
                DialogHelper.showError(result.errorMessage);
            }
        }
        else {
         //   BuildReportAlert("error","Thành công", "Đã lưu kì thi thành công!" );
            //DialogHelper.showAlert("Success");
            if (props.onSuccess) {
                props.onSuccess();
            }
        }
    }

    const handleCancel = () => {
        const result = DialogHelper.showConfirm('Bạn chắc chắn muốn hủy thao tác?');
        if (result) {
            if (props.onClose) {
                props.onClose();
            }
        }
    }

    return (
        // @ts-ignore
        <Page  >
            <Container style={{ maxWidth: "1920px", margin:'0px', padding: "20px" }}>
                <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
                    {props.title}
                </Typography>
                {props.formComponent(formik, handleCancel, isLoading)}
            </Container>
        </Page >
    );
}