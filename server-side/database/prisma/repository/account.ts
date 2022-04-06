import { myPrisma } from "..";
import { DefaultRepository } from "./default";
import helper from "../../../helper"

export class AccountRepository extends DefaultRepository {
    public async insert(data: any, selectedFields?: string[]): Promise<number> {
        helper.logger.traceWithTag("MYSQL, INSERT", "Start: Insert account");

        selectedFields = [
            "username",
            "password",
        ];
        const result = await super.insert(data, selectedFields);

        const newID = result.id;
        helper.logger.traceWithTag("MYSQL, INSERT", "Success: Inserted account with id = " + newID);
        return result;
    }

    async findById(id: number){
        const result = await myPrisma.account.findUnique({
            where: {
                id: id
            },
        });
        if (!result) {
            return null; // Not found
        }
        return result;
    }

    /**
     * 
     * @param username 
     * @param password 
     * @returns Return null if not found
     */
    async checkLogin(username: string, password: string) {
        const selectFields = [
            "id",
            "status",
            "username",
            "password",
            "userRole"
        ]
        const result = await myPrisma.account.findFirst({
            where:{
                username: username,
                password: password,
            },
        });

        if(!result){
            return null;
        }
        return result;
    }

    async comfirmEmail(username: string, password: string){
        const account = (await this.checkLogin(username, password));
        if(!account){
            return null;
        }

        const result = await myPrisma.account.update({
            where:{
                id: account.id
            },
            data : {
                status: 2
            },
        });

        return result;
    }
}