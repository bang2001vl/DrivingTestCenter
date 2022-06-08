import { FC, useState } from "react";
import { appConfig } from "../../configs";
import { BasicModelPicker, BasicModelPickerProps } from "./_modelPicker";

export const ExamPicker: FC<Partial<BasicModelPickerProps>> = (props) => {
    return <BasicModelPicker
        getURL={(input)=>`${appConfig.backendUri}/exam/select?searchvalue=${String(input)}&searchby=name&orderby=name&orderdirection=asc&start=0&count=10`}
        {...props}
    />
}