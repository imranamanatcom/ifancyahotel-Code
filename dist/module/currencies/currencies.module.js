"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrenciesModule = void 0;
const common_1 = require("@nestjs/common");
const currencies_controller_1 = require("./currencies.controller");
const currencies_service_1 = require("./currencies.service");
const currencies_repo_1 = require("./currencies.repo");
const mongodb_1 = require("../../database/mongodb");
let CurrenciesModule = class CurrenciesModule {
};
CurrenciesModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [currencies_controller_1.currenciesController],
        providers: [currencies_service_1.CurrenciesService, currencies_repo_1.CurrenciesRepo, mongodb_1.MongoDatabase],
    })
], CurrenciesModule);
exports.CurrenciesModule = CurrenciesModule;
//# sourceMappingURL=currencies.module.js.map