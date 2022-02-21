import { Pool, RowDataPacket } from "mysql2/promise";
import { BasicRepository } from ".";

interface ExamAssignment {
    accountId: number;
    examId: number;
    permission: string;
}

interface ClassAssignment {
    accountId: number;
    classId: number;
    permission: string;
}

interface UserRole{
    roleName: string;
    assignment: string[];
}

interface Session extends RowDataPacket{
    id:number;
    createTime?: string;
    updateTime?: string;
    accountId?: number;
    deviceInfo?: string;
    userRole?: string;
    warning?: number;
}

export default class SessionRepository extends BasicRepository{
    constructor(pool: Pool){
        super(pool, "account");
    }

    async findById(id: number){
        return super.rawSelectById<Session>(id);
    }
}