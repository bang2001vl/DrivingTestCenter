import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { appConfig } from "../../configs";
import useAPI from "../../hooks/useApi";
import { BasicEditSection } from "../../sections/CRUD/BasicEditSection";
import { EDIT_METHOD } from "../../_enums";
import { FormIKExamSelector } from "../FormIK/Selectors/examSelectors";
import { FormIkRoom } from "../FormIK/Selectors/Rooms";
import { BasicModelPicker, BasicModelPickerProps } from "./_modelPicker";

interface IProps {
    method: EDIT_METHOD,
    handledClose: any,
    handledSubmit: any,
    initValues?:any
    
}
export const AddClassSchedule: FC<IProps & Partial<BasicModelPickerProps>> = (props) => {
    const api = useAPI();
    return <></>;
    // return <BasicEditSection
    //     title={ (props.method === EDIT_METHOD.create) ? "Tạo lịch học" : "Cập nhật lịch học"}
    //     onSuccess={()=>{}}
    //     onClose={props.handledClose}
    //     validation={()=>{}}
    //     submit={props.handledSubmit}
    //     loadOldData={undefined}

    //     {...props}
    //     initValues={{ ...defaultValue, ...props.initValues }}
    //     formComponent={(formik, cancel, isLoading) => {
    //         return (
    //             <Stack style={{ minWidth: 600, minHeight: 1 }}>
    //                 <FormIKExamSelector formik={undefined} fieldName={""}></FormIKExamSelector>
    //                 <FormIkRoom formik={undefined} fieldName="location"
    //                     fullWidth
    //                     label="Phòng học"

    //                 />
    //             </Stack>
    //         )

    //     }}
    //     >
    //  </BasicEditSection >
}