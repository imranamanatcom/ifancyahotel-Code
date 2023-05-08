"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const soap_module_1 = require("./module/soap/soap.module");
const hotel_module_1 = require("./module/hotel/hotel.module");
const cron_service_1 = require("./cron/cron.service");
const schedule_1 = require("@nestjs/schedule");
const mongodb_1 = require("./database/mongodb");
const users_module_1 = require("./module/users/users.module");
const currencies_module_1 = require("./module/currencies/currencies.module");
const path_1 = require("path");
const serve_static_1 = require("@nestjs/serve-static");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [hotel_module_1.HotelModule, soap_module_1.SoapModule, users_module_1.UsersModule, currencies_module_1.CurrenciesModule, schedule_1.ScheduleModule.forRoot(), serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'views'),
                exclude: ['/api*'],
            })],
        controllers: [app_controller_1.mainController],
        providers: [app_service_1.mainService, cron_service_1.CronService, mongodb_1.MongoDatabase],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map