"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repo_1 = require("./users.repo");
const ResponseBuilder_1 = require("../../utils/ResponseBuilder");
let UsersService = class UsersService {
    constructor(UsersRepo) {
        this.UsersRepo = UsersRepo;
    }
    SignUp(data) {
        return new Promise(async (resolve) => {
            if (data.AthuBy === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'AthuBy is required.'));
            }
            else if (data.AthuBy == "email") {
                if (data.Email === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Email is required.'));
                }
                else if (data.Passwd === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Passwd is required.'));
                }
                else if (data.AthuBy === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'AthuBy is required.'));
                }
                else {
                    let data_r = await this.UsersRepo.SignUp(data);
                    resolve(data_r);
                }
            }
            else if (data.AthuBy == "facebook") {
                if (data.hash === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Email is required.'));
                }
                else {
                    let data_r = await this.UsersRepo.SignUp(data);
                    resolve(data_r);
                }
            }
            else if (data.AthuBy == "google") {
                if (data.hash === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Email is required.'));
                }
                else {
                    let data_r = await this.UsersRepo.SignUp(data);
                    resolve(data_r);
                }
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Something is Wrong.'));
            }
        });
    }
    SignIn(data) {
        return new Promise(async (resolve) => {
            if (data.AthuBy === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'AthuBy is required.'));
            }
            else if (data.AthuBy == "email") {
                if (data.Email === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Email is required.'));
                }
                else if (data.Passwd === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Passwd is required.'));
                }
                else {
                    let data_r = await this.UsersRepo.SignIn(data);
                    resolve(data_r);
                }
            }
            else if (data.AthuBy == "facebook") {
                if (data.hash === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Email is required.'));
                }
                else {
                    let data_r = await this.UsersRepo.SignIn(data);
                    resolve(data_r);
                }
            }
            else if (data.AthuBy == "google") {
                if (data.hash === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Email is required.'));
                }
                else {
                    let data_r = await this.UsersRepo.SignIn(data);
                    resolve(data_r);
                }
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Something is Wrong.'));
            }
        });
    }
    MyTrips(data) {
        return new Promise(async (resolve) => {
            if (data.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (data.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.UsersRepo.MyTrips(data);
                resolve(data_r);
            }
        });
    }
    MyTripsMobile(data) {
        return new Promise(async (resolve) => {
            if (data.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (data.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.UsersRepo.MyTripsMobile(data);
                resolve(data_r);
            }
        });
    }
    mytripscancellation(data) {
        return new Promise(async (resolve) => {
            if (data.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (data.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.UsersRepo.mytripscancellation(data);
                resolve(data_r);
            }
        });
    }
    Preferences(body) {
        return new Promise(async (resolve) => {
            if (body.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (body.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else if (body.Preferences === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Preferences is required.'));
            }
            else {
                let data_r = await this.UsersRepo.Preferences(body);
                resolve(data_r);
            }
        });
    }
    PersonalDetails(body) {
        return new Promise(async (resolve) => {
            if (body.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (body.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else if (body.PersonalDetails === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'PersonalDetails is required.'));
            }
            else {
                let data_r = await this.UsersRepo.PersonalDetails(body);
                resolve(data_r);
            }
        });
    }
    PaymentDetails(body) {
        return new Promise(async (resolve) => {
            if (body.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (body.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else if (body.PaymentDetails === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'PaymentDetails is required.'));
            }
            else {
                let data_r = await this.UsersRepo.PaymentDetails(body);
                resolve(data_r);
            }
        });
    }
    paperboard(file) {
        return new Promise(async (resolve) => {
            file['pathURL'] = 'http://54.152.204.39:3000/assets/uploads/' + file['filename'];
            resolve(file);
        });
    }
    EmailSend(body) {
        return new Promise(async (resolve) => {
            resolve(true);
        });
    }
    UserReadyOnly(data) {
        return new Promise(async (resolve) => {
            if (data.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (data.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.UsersRepo.UserReadyOnly(data);
                resolve(data_r);
            }
        });
    }
    UpdatePassword(data) {
        return new Promise(async (resolve) => {
            if (data.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (data.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.UsersRepo.UpdatePassword(data);
                resolve(data_r);
            }
        });
    }
    ForgotPassword(body) {
        return new Promise(async (resolve) => {
            if (body.Email === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Email is required.'));
            }
            else {
                let data_r = await this.UsersRepo.forgotPassword(body);
                resolve(data_r);
            }
        });
    }
    ForgotUpdatePassword(body) {
        return new Promise(async (resolve) => {
            if (body.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (body.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.UsersRepo.ForgotUpdatePassword(body);
                resolve(data_r);
            }
        });
    }
    verifyEmail(body) {
        return new Promise(async (resolve) => {
            if (body.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (body.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.UsersRepo.verifyEmail(body);
                resolve(data_r);
            }
        });
    }
    Resetemailverify(body) {
        return new Promise(async (resolve) => {
            if (body.Email === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'Email is required.'));
            }
            else {
                let data_r = await this.UsersRepo.Resetemailverify(body);
                resolve(data_r);
            }
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repo_1.UsersRepo])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map