import { Router } from "express";
import { myPrisma } from "../../../prisma";
import { FieldGetter } from "../../handler/FieldGetter";
import { RouteBuilder } from "../_default";

const tag = "Student";

export const StudentRoute = ()=>{
    const route = Router();
    const searchProps = ["fullname"];
    const orderProps = ["fullname", "createdAt"];

    route.get("/select",
        RouteBuilder.buildSelectInputParser(searchProps, orderProps, tag),
        RouteBuilder.buildSelectRoute(myPrisma.account, tag, customFilter)
    );

    route.post("/join/classes")

    return route;
}

function customFilter(input: any){
    const rs: any = {
        roleId: 1
    };
    if(input.classId){
        rs.studingClass = {
            some: {
                classId: FieldGetter.Number(input, "classId", true),
            }
        }
    }
    if(input.examTestId){
        rs.joingTest = {
            some: {
                examTestId: FieldGetter.Number(input, "examTestId", true),
            }
        }
    }
    return rs;
}