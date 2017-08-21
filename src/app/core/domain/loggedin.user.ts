export class LoggedInUser {
    constructor(
        access_token: string,
        username: string,
        fullName: string,
        email: string,
        avatar: string,
        roles: any,
        permissions: any,
        companyid: any,
        deptid: any,
        teamid: any,
        empid: any
    ) 
    {
        this.access_token = access_token;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.companyid = companyid;
        this.deptid = deptid;
        this.teamid = teamid;
        this.roles = roles;
        this.permissions = permissions;
        this.empid = empid;
    }

    public id: string;
    public access_token: string;
    public username: string;
    public fullName: string;
    public email: string;
    public avatar: string;
    public companyid: any;
    public deptid: any;
    public teamid: any;
    public permissions: any;
    public roles: any;
    public empid: any;
}