import { MongoDatabase } from "../../database/mongodb";
export declare class UsersRepo {
    private readonly mongodb;
    constructor(mongodb: MongoDatabase);
    timeAgo(input: any): Promise<number>;
    isInThePast(date: any): Promise<boolean>;
    SignUp(data: any): Promise<any>;
    SignIn(data: any): Promise<unknown>;
    MyTrips(data: any): Promise<unknown>;
    MyTripsMobile(data: any): Promise<unknown>;
    mytripscancellation(data: any): Promise<unknown>;
    Preferences(body: any): Promise<unknown>;
    PersonalDetails(body: any): Promise<unknown>;
    PaymentDetails(body: any): Promise<unknown>;
    EmailSend(template: any, to: any, subject: any, Link: any): Promise<unknown>;
    UserReadyOnly(data: any): Promise<unknown>;
    UpdatePassword(data: any): Promise<unknown>;
    forgotPassword(body: any): Promise<unknown>;
    ForgotUpdatePassword(body: any): Promise<unknown>;
    verifyEmail(body: any): Promise<unknown>;
    Resetemailverify(body: any): Promise<unknown>;
}
