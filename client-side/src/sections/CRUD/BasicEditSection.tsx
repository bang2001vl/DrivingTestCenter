import { Container } from "@mui/material";
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

export interface BasicEditSectionProps<T extends FormikValues = FormikValues, OldDataType = any> {
    initValues: T,
    formComponent: (formik: IFormIK<T>, cancel: () => void, isLoading: boolean) => JSX.Element,
    title: string,
    submit: (formik: IFormIK<T>)=>Promise<MyResponse>,
    loadOldData?: (params: any)=>Promise<MyResponse>,
    validation?: (formik: IFormIK<T>) => any,
    oldData?: OldDataType,
    onSuccess?: () => void,
    onClose?: () => void,
}

export const BasicEditSection: FC<BasicEditSectionProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();    

    const formik = useFormik({
        initialValues: props.initValues,
        validate: (values)=>{

        },
        onSubmit: ()=>{
            handleSubmit();
        }, // Disable default handle
    });

    useEffect(()=>{
        if(props.loadOldData){
            let params = Object.fromEntries([...searchParams as any]);
            console.log("Search Params", params);
            props.loadOldData(params)
            .then(res =>{
                if(res.result && res.data){
                    Object.keys(res.data).forEach(key =>{
                        formik.setFieldValue(key, res.data[key]);
                    console.log(formik.values);
                    });
                }
                else{
                    DialogHelper.showAlert(res.errorMessage);
                }
            })
        }
    }, [])

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
            DialogHelper.showAlert(result.errorMessage);
        }
        else {
            //DialogHelper.showAlert("Success");
            if (props.onSuccess) {
                props.onSuccess();
            }
        }
    }

    const handleCancel = () => {
        if (props.onClose) {
            props.onClose();
        }
    }

    return (
        // @ts-ignore
        <Page title={props.title} >
            <Container>
                {props.formComponent(formik, handleCancel, isLoading)}
            </Container>
        </Page >
    );
}