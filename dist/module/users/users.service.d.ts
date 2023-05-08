import { UsersRepo } from './users.repo';
export declare class UsersService {
    private readonly UsersRepo;
    constructor(UsersRepo: UsersRepo);
    SignUp(data: any): any;
    SignIn(data: any): any;
    MyTrips(data: any): Promise<unknown>;
    MyTripsMobile(data: any): Promise<unknown>;
    mytripscancellation(data: any): Promise<unknown>;
    Preferences(body: any): Promise<unknown>;
    PersonalDetails(body: any): Promise<unknown>;
    PaymentDetails(body: any): Promise<unknown>;
    paperboard(file: any): Promise<unknown>;
    EmailSend(body: any): Promise<unknown>;
    UserReadyOnly(data: any): Promise<unknown>;
    UpdatePassword(data: any): Promise<unknown>;
    ForgotPassword(body: any): Promise<unknown>;
    ForgotUpdatePassword(body: any): Promise<unknown>;
    verifyEmail(body: any): Promise<unknown>;
    Resetemailverify(body: any): Promise<unknown>;
}
