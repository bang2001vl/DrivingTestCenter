import isBefore from 'date-fns/isBefore';
import isValid from 'date-fns/isValid';
import parseISO from 'date-fns/parseISO';
import { yupToFormErrors } from 'formik';
import readXlsxFile from 'read-excel-file';
import * as yup from 'yup';
import { appConfig } from '../../configs';
import { objectToFormData, validYupToArray, validYupToObject } from '../../_helper/helper';
import { APIService, MyResponse } from '../service';

export class ExamTestController {
    routeName: string;
    constructor() {
        this.routeName = "examTest";
    }

    getSchema() {
        return yup.object({
            name: yup.string().required("Tên không được để trống!"),
            location: yup.string().required("Phòng thi không được để trống!"),
            dateTimeStart: yup.string().required("Ngày bắt đầu không được để trống!"),
            dateTimeEnd: yup.string().required("Ngày kết thúc không được để trống!"),
            dateTimeStart2: yup.string().required("Ngày bắt đầu không được để trống!"),
            dateTimeEnd2: yup.string().required("Ngày kết thúc không được để trống!"),
            maxMember: yup.number().typeError("Bắt buộc nhập số!").required("Số lượng tối đa không được để trống!"),
        });
    }

    validate(data: any) {
        const errors = validYupToObject(data, this.getSchema());
        if (!isBefore(new Date(data.dateTimeStart), new Date(data.dateTimeEnd))) {
            errors.dateTimeStart = "Ngày bắt đầu không được lớn hơn ngày kết thúc!";
        }


        if (!isBefore(new Date(data.dateTimeStart2), new Date(data.dateTimeEnd2))) {
            errors.dateTimeStart2 = "Ngày bắt đầu không được lớn hơn ngày kết thúc!";
        }

        if (!isNaN(Number(data.examId))) {
            errors.examId = "Invalid examId";
        }
        return errors;
    }

    insertToDB(values: any, api?: APIService) {
        if (!api) {
            api = new APIService();
        }

        const data = {
            examId: values.examId,
            name: values.name,
            location: values.location,
            dateTimeStart: values.dateTimeStart,
            dateTimeEnd: values.dateTimeEnd,
            dateTimeStart2: values.dateTimeStart2,
            dateTimeEnd2: values.dateTimeEnd2,
            maxMember: values.maxMember,
        }

        return api.postWithToken(
            `${appConfig.backendUri}/${this.routeName}/insert`,
            data
        );
    }

    deleteFromDB(ids: number[], api?: APIService) {
        if (!api) {
            api = new APIService();
        }
        console.log("ids", ids);
        

        return api.deleteWithToken(
            `${appConfig.backendUri}/${this.routeName}/delete?keys=${ids.join(",")}`,
        )
    }

    loadFromDB(id: number){
        
    }
}