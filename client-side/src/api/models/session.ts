export class MySession {
    token: string;
    roleId: number;
    constructor(token: string, roleId: number) {
        this.token = token;
        this.roleId = roleId;
    }

    static fromJson(json: any) {
        return new MySession(
            String(json.token),
            Number(json.roleId),
        );
    }
}