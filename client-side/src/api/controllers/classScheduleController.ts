import isBefore from 'date-fns/isBefore';
import isValid from 'date-fns/isValid';
import parseISO from 'date-fns/parseISO';
import { yupToFormErrors } from 'formik';
import readXlsxFile from 'read-excel-file';
import * as yup from 'yup';
import { appConfig } from '../../configs';
import { objectToFormData, validYupToArray, validYupToObject } from '../../_helper/helper';
import { APIService, MyResponse } from '../service';

export class ClassScheduleController {
    routeName: string;
    api: APIService;
    constructor(api: APIService){
        this.routeName="classSchedule";
        this.api = api;
    }

    getSchema(){
        return yup.object({
            classId: yup.number().required("ClassId is required"),
            location: yup.string().required("Phòng học không được để trống!"),
            dateTimeStart: yup.string().required("Ngày bắt đầu không được để trống!"),
            dateTimeEnd: yup.string().required("Ngày kết thúc không được để trống!"),
            notes: yup.string(),
        });
    }

    validate(data: any){
        const errors = validYupToObject(data, this.getSchema());
        if (!isBefore(new Date(data.dateTimeStart), new Date(data.dateTimeEnd))) {
            errors.dateTimeStart = "Ngày bắt đầu không được lớn hơn ngày kết thúc!";
        }
        return errors;
    }

    insertToDB(values: any){
        const data = {
            classId: values.classId,
            location: values.location,
            dateTimeStart: values.dateTimeStart,
            dateTimeEnd: values.dateTimeEnd,
            notes: values.notes,
        }

        return this.api.postWithToken(
            `${appConfig.backendUri}/${this.routeName}/insert`,
            data
        );
    }

    updateToDB(key: number, values: any){
        const data = {
            classId: values.classId,
            location: values.location,
            dateTimeStart: values.dateTimeStart,
            dateTimeEnd: values.dateTimeEnd,
            notes: values.notes,
        }

        return this.api.postWithToken(
            `${appConfig.backendUri}/${this.routeName}/insert`,
            {
                ...data,
                key,
            }
        );
    }

    loadFromDB(id: number){
        return this.api.getWithToken(
            `${appConfig.backendUri}/${this.routeName}/select?${new URLSearchParams({
                start: "0",
                count: "1",
                id: String(id),
            }).toString()}`
        )
    }

    deleteFromDB(ids: number[]){
        console.log("ids", ids);
        

        return this.api.deleteWithToken(
            `${appConfig.backendUri}/${this.routeName}/delete?keys=${ids.join(",")}`,
        )
    }
}