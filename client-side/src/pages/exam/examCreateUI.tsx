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
import { addDays, isAfter, isBefore } from "date-fns";
import { IFormIK } from "../../_interfaces/formik";
import { validYupToObject } from "../../_helper/helper";
import { BasicEditSection, BasicEditSectionProps } from "../../sections/CRUD/BasicEditSection";
import { MyResponse } from "../../api/service";


interface IProps {
    method: EDIT_METHOD,
    editKey?: number,
    hideTitle?: boolean,
}

export const ExamCreateUI: FC<IProps> = (props: IProps & Partial<BasicEditSectionProps>) => {
    const routeName = "exam";
    const navigate = useNavigate();
    const api = useAPI();
    const [searchParams] = useSearchParams();
    const defaultValue = {
        name: "",
        type: "",
        dateOpen: new Date().toISOString(),
        dateClose: addDays(new Date(), 1).toISOString(),
        dateStart: addDays(new Date(), 2).toISOString(),
        dateEnd: addDays(new Date(), 3).toISOString(),
        maxMember: "",
        rules: "",
        price: "",
    };

    useEffect(() => {
        if (props.method === EDIT_METHOD.update) {
            
        }
    }, [props.method, searchParams]);

    const loadOldData = (searchParams: URLSearchParams)=>{
        const key = searchParams.get("id");
            if (!key) {
                navigate("/", { replace: true });
                return Promise.resolve(new MyResponse(true, 1, "Not found id"));
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
        name: yup
            .string()
            .required("Name must not be null"),
        type: yup
            .string()
            .required(),
        dateOpen: yup
            .string()
            .required(),
        dateClose: yup
            .string()
            .required(),
        dateStart: yup
            .string()
            .required(),
        dateEnd: yup
            .string()
            .required(),
        maxMember: yup
            .number().typeError("Must be number")
            .required(),
        rules: yup
            .string()
            .required(),
        price: yup
            .number().typeError("Must be number")
            .required(),
    });

    function handleValidate(formik: IFormIK) {
        const errors = validYupToObject(formik.values, schema);

        if (!isBefore(new Date(formik.values.dateOpen), new Date(formik.values.dateClose))) {
            errors.dateClose = "Date close must bigger than date open";
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
            type: values.type,
            dateOpen: values.dateOpen,
            dateClose: values.dateClose,
            dateStart: values.dateStart,
            dateEnd: values.dateEnd,
            maxMember: values.maxMember,
            rules: values.rules,
            price: values.price,
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
        title={props.hideTitle ? "" : "Tạo Kì Thi"}
        onSuccess={handleSuccess}
        onClose={handleClose}
        validation={handleValidate}
        submit={handleSubmit}
        loadOldData={loadOldData}
        {...props}
        initValues={{...defaultValue, ...props.initValues}}
        formComponent={(formik, cancel, isLoading) => {
            return <Card style={{ alignItems: "center", justifyContent: 'center', textAlign: "center", marginTop: '15px', padding: "5%" }} >
                <LocalizationProvider dateAdapter={AdapterDateFns} style={{ alignItems: "center" }}>

                    <Stack direction="row" spacing={2} sx={{ p: 1 }}>
                        <Box sx={{ width: "50%" }}>
                            <FormIkTextField formik={formik} fieldName="name"
                                fullWidth
                                label="Name"
                                style={{ marginTop }}
                            />

                        </Box>
                        <Box sx={{ minWidth: "50%" }}>
                            <FormIkTextField formik={formik} fieldName="type"
                                fullWidth
                                label="Type"
                                style={{ marginTop }}
                            />
                        </Box>

                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ p: 1 }}>
                        <Box sx={{ width: "50%" }}>
                            <FormIkNumberField formik={formik} fieldName="price"
                                fullWidth
                                label="Fees"
                                style={{ marginTop: 1 }}
                            />
                        </Box>
                        <Box sx={{ minWidth: "50%" }}>
                            <FormIkNumberField formik={formik} fieldName="maxMember"
                                fullWidth
                                label="Max Member"
                                style={{ marginTop }}
                            />
                        </Box>

                    </Stack>


                    <Box>
                        <Stack direction="row">
                            <Box sx={{ p: 1, width: "50%" }}>
                                <FormIkDatePicker formik={formik} fieldName="dateOpen"
                                    label="Open Register"
                                />
                            </Box>

                            <Box sx={{ p: 1, width: "50%" }}>
                                <FormIkDatePicker formik={formik} fieldName="dateClose"
                                    label="Close Register"
                                />
                            </Box>
                            <Box sx={{ p: 1, width: "50%" }}>
                                <FormIkDatePicker formik={formik} fieldName="dateStart"
                                    label="Start Exam"
                                />
                            </Box>

                            <Box sx={{ p: 1, width: "50%" }}>
                                <FormIkDatePicker formik={formik} fieldName="dateEnd"
                                    label="End Exam"
                                />
                            </Box>
                        </Stack>
                    </Box>

                    <Box sx={{ p: 1 }}>
                        <FormIkTextField formik={formik} fieldName="rules"
                            fullWidth
                            multiline
                            minRows={3}
                            label="Description"
                        />
                    </Box>

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

                </LocalizationProvider>
            </Card >
        }}
    />
    

//                     <Box sx={{ p: 1 }}>
//                         <FormIkTextField formik={formik} fieldName="rules"
//                             fullWidth
//                             multiline
//                             minRows={3}
//                             label="Description"
//                         />
//                     </Box>
// >>>>>>> Stashed changes

//                     <Stack alignItems={"center"}>
//                         <Stack direction={"row"} spacing={20} style={{ alignSelf: "center", justifyContent: "space-around", marginTop: 20, maxWidth: 400 }}>
//                             <LoadingButton
//                                 variant="contained"
//                                 onClick={() => formik.handleSubmit()}
//                                 sx={{ width: "120px" }}
//                             >
//                                 Xác nhận
//                             </LoadingButton>

//                             <Button
//                                 variant="outlined"
//                                 onClick={() => cancel()}
//                                 sx={{ width: "120px" }} >
//                                 Hủy
//                             </Button>
//                         </Stack>
//                     </Stack>

//                 </LocalizationProvider>
//             </Card >
//         }}
//         {...props}
//     />
}
