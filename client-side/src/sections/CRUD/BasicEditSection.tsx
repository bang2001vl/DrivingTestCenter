import { Container } from "@mui/material";
import { FieldHelperProps, FieldInputProps, FieldMetaProps, FormikConfig, FormikErrors, FormikState, FormikTouched, FormikValues, useFormik } from "formik";
import { FC, useState } from "react";
import { JsxElement } from "typescript";
import Page from "../../components/Page";
import useAPI from "../../hooks/useApi";
import { EDIT_METHOD } from "../../_enums";
import yup from 'yup';
import { MyResponse } from "../../api/service";
import { appConfig } from "../../configs";
import { DialogHelper } from "../../singleton/dialogHelper";

interface IFormIK<Values extends FormikValues = FormikValues>{
    initialValues: Values;
    initialErrors: FormikErrors<unknown>;
    initialTouched: FormikTouched<unknown>;
    initialStatus: any;
    handleBlur: {
        (e: React.FocusEvent<any>): void;
        <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
    };
    handleChange: {
        (e: React.ChangeEvent<any>): void;
        <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
    };
    handleReset: (e: any) => void;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
    resetForm: (nextState?: Partial<FormikState<Values>> | undefined) => void;
    setErrors: (errors: FormikErrors<Values>) => void;
    setFormikState: (stateOrCb: FormikState<Values> | ((state: FormikState<Values>) => FormikState<Values>)) => void;
    setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean | undefined) => Promise<FormikErrors<Values>> | Promise<void>;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<FormikErrors<Values>> | Promise<void>;
    setFieldError: (field: string, value: string | undefined) => void;
    setStatus: (status: any) => void;
    setSubmitting: (isSubmitting: boolean) => void;
    setTouched: (touched: FormikTouched<Values>, shouldValidate?: boolean | undefined) => Promise<FormikErrors<Values>> | Promise<void>;
    setValues: (values: React.SetStateAction<Values>, shouldValidate?: boolean | undefined) => Promise<FormikErrors<Values>> | Promise<void>;
    submitForm: () => Promise<any>;
    validateForm: (values?: Values) => Promise<FormikErrors<Values>>;
    validateField: (name: string) => Promise<void> | Promise<string | undefined>;
    isValid: boolean;
    dirty: boolean;
    unregisterField: (name: string) => void;
    registerField: (name: string, { validate }: any) => void;
    getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
    getFieldMeta: (name: string) => FieldMetaProps<any>;
    getFieldHelpers: (name: string) => FieldHelperProps<any>;
    validateOnBlur: boolean;
    validateOnChange: boolean;
    validateOnMount: boolean;
    values: Values;
    errors: FormikErrors<Values>;
    touched: FormikTouched<Values>;
    isSubmitting: boolean;
    isValidating: boolean;
    status?: any;
    submitCount: number;
}

interface IProps<T extends FormikValues = FormikValues, OldDataType = any> {
    initValues: T,
    formComponent: (formik: IFormIK<T>, cancel: () => void, isLoading: boolean) => JsxElement,
    title: string,
    submit: (formik: IFormIK<T>)=>Promise<MyResponse>,
    validation?: (formik: IFormIK<T>) => any,
    oldData?: OldDataType,
    onSuccess?: () => void,
    onClose?: () => void,
}

export const BasicEditSection: FC<IProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: props.initValues,
        validate: (values)=>{

        },
        onSubmit: ()=>{
            handleSubmit();
        }, // Disable default handle
    });

    async function handleSubmit() {
        console.log("Insert to db with", formik.values);
        if (props.validation) {
            const errors = props.validation(formik);
            if (Object.keys(errors).length > 0) {
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
            DialogHelper.showAlert("Success");
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
                {props.children}
            </Container>
        </Page >
    );
}