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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let usersController = class usersController {
    constructor(appService) {
        this.appService = appService;
    }
    SignUp(body) {
        return this.appService.SignUp(body);
    }
    SignIn(body) {
        return this.appService.SignIn(body);
    }
    MyTrips(body) {
        return this.appService.MyTrips(body);
    }
    MyTripsMobile(body) {
        return this.appService.MyTripsMobile(body);
    }
    mytripscancellation(body) {
        return this.appService.mytripscancellation(body);
    }
    VerifyEmail(body) {
        return this.appService.verifyEmail(body);
    }
    preferences(body) {
        return this.appService.Preferences(body);
    }
    PersonalDetails(body) {
        return this.appService.PersonalDetails(body);
    }
    EmailSend(body) {
        return this.appService.EmailSend(body);
    }
    UserReadyOnly(body) {
        return this.appService.UserReadyOnly(body);
    }
    UpdatePassword(body) {
        return this.appService.UpdatePassword(body);
    }
    ForgotPassword(body) {
        return this.appService.ForgotPassword(body);
    }
    ForgotUpdatePassword(body) {
        return this.appService.ForgotUpdatePassword(body);
    }
    Resetemailverify(body) {
        return this.appService.Resetemailverify(body);
    }
    Upload(file) {
        return this.appService.paperboard(file);
    }
};
__decorate([
    (0, common_1.Post)('/SignUp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], usersController.prototype, "SignUp", null);
__decorate([
    (0, common_1.Post)('/SignIn'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], usersController.prototype, "SignIn", null);
__decorate([
    (0, common_1.Post)('/MyTrips'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "MyTrips", null);
__decorate([
    (0, common_1.Post)('/MyTripsMobile'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "MyTripsMobile", null);
__decorate([
    (0, common_1.Post)('/verifyemail'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], usersController.prototype, "mytripscancellation", null);
__decorate([
    (0, common_1.Post)('/mytripscancellation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "VerifyEmail", null);
__decorate([
    (0, common_1.Post)('/preferences'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "preferences", null);
__decorate([
    (0, common_1.Post)('/personaldetails'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "PersonalDetails", null);
__decorate([
    (0, common_1.Post)('/emailsend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "EmailSend", null);
__decorate([
    (0, common_1.Post)('/userreadyonly'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "UserReadyOnly", null);
__decorate([
    (0, common_1.Post)('/updatepassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "UpdatePassword", null);
__decorate([
    (0, common_1.Post)('/forgotpassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "ForgotPassword", null);
__decorate([
    (0, common_1.Post)('/forgotupdatepassword'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "ForgotUpdatePassword", null);
__decorate([
    (0, common_1.Post)('/sendemailverify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "Resetemailverify", null);
__decorate([
    (0, common_1.Post)('/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './views/assets/uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersController.prototype, "Upload", null);
usersController = __decorate([
    (0, common_1.Controller)('/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], usersController);
exports.usersController = usersController;
//# sourceMappingURL=users.controller.js.map