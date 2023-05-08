import { UsersService } from './users.service';
export declare class usersController {
    private readonly appService;
    constructor(appService: UsersService);
    SignUp(body: any): string;
    SignIn(body: any): string;
    MyTrips(body: any): Promise<unknown>;
    MyTripsMobile(body: any): Promise<unknown>;
    mytripscancellation(body: any): Promise<unknown>;
    VerifyEmail(body: any): Promise<unknown>;
    preferences(body: any): Promise<unknown>;
    PersonalDetails(body: any): Promise<unknown>;
    EmailSend(body: any): Promise<unknown>;
    UserReadyOnly(body: any): Promise<unknown>;
    UpdatePassword(body: any): Promise<unknown>;
    ForgotPassword(body: any): Promise<unknown>;
    ForgotUpdatePassword(body: any): Promise<unknown>;
    Resetemailverify(body: any): Promise<unknown>;
    Upload(file: any): Promise<unknown>;
}
