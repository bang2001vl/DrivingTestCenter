import isValid from 'date-fns/isValid';
import parseISO from 'date-fns/parseISO';
import { yupToFormErrors } from 'formik';
import readXlsxFile from 'read-excel-file';
import * as yup from 'yup';
import { appConfig } from '../../configs';
import { objectToFormData, validYupToArray, validYupToObject } from '../../_helper/helper';
import { APIService, MyResponse } from '../service';

export class AccountManagerController {
    routeName: string;
    constructor(){
        this.routeName="account/manager";
    }

    getSchema(){
        return yup.object({
            username: yup.string().required("Tên người dùng không được để trống!"),
            password: yup.string().required('Mật khẩu không được để trống!'),
            birthday: yup.string().required('Ngày sinh không được để trống!'),
            gender: yup.number().required('Giới tính không được để trống!'),
            roleId: yup.number().required('Vai trò không được để trống!'),
            email: yup.string().email().required('Email không được để trống!'),
            phoneNumber: yup.string().required('Số điện thoại không được để trống!'),
            address: yup.string().required('Địa chỉ không được để trống!'),
        });
    }

    validate(data: any){
        const errors = validYupToObject(data, this.getSchema());
        return errors;
    }

    insertToDB(values: any, api?: APIService){
        if(!api){
            api = new APIService();
        }

        const data = {
            username: values.username,
            password: values.password,
            fullname: values.fullname,
            email: values.email,
            phoneNumber: values.phoneNumber,
            address: values.address,
            birthday: values.birthday,
            gender: values.gender,
            roleId: values.roleId,
            avatar: values.avatar instanceof File ? values.avatar : undefined,
        }

        return api.postWithToken(
            `${appConfig.backendUri}/${this.routeName}/insert`,
            objectToFormData(data),
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        );
    }

    async insertFromExcelToDB(file: any, api?: APIService){
        if(!api){
            api = new APIService();
        }

        if(!file || ! (file instanceof File)){
            return new MyResponse(false, 1, `Incorrect file format`);
        }

        const reader = await readXlsxFile<any>(file, {schema: {
            'username': {prop: 'username', type: String, required: true},
            'password': {prop: 'password', type: String, required: true},
            'fullname': {prop: 'fullname', type: String, required: true},
            'birthday': {prop: 'birthday', type: Date, required: true},
            'gender': {prop: 'gender', type: Number, required: true},
            'email': {prop: 'email', type: String, required: true},
            'phoneNumber': {prop: 'phoneNumber', type: String, required: true},
            'roleId': {prop: 'roleId', type: Number, required: true},
        }});

        console.log("Reader", JSON.stringify(reader, null, 4));
        

        if(reader.errors.length > 0){
            const err = reader.errors[0];
            return new MyResponse(false, 1, `Incorrect data at row=${err.row}, column=${err.column}`);
        }

        for(let i = 0; i<reader.rows.length; i++){
            const row = {
                ...reader.rows[i],
                address: "tempAddress",
                birthday: reader.rows[i].birthday.toISOString(),
            };
            
            const errors = validYupToArray(row, this.getSchema());
            //console.log(errors);
            if(!parseISO(row.birthday) || !isValid(parseISO(row.birthday))){
                errors.push(`Incorrect birthday at row=${i+2}`)
            }
            if(errors.length > 0){
                return new MyResponse(false, 1, `${errors[0]}`);
            }

            reader.rows[i] = row;
        }

        const duplicateUserName = [];
        for(let i = 0; i<reader.rows.length; i++){
            const row = reader.rows[i];
            console.log("Row", row);
            
            const res = await this.insertToDB(row);
            if(!res.result){
                duplicateUserName.push(row['username']);
            }
        }

        if(duplicateUserName.length > 0){
            return new MyResponse(false, 1, `Duplicated username of [${duplicateUserName.join(', ')}]`);
        }  
        
        return new MyResponse(true);
    }
}