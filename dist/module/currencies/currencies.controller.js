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
exports.currenciesController = void 0;
const common_1 = require("@nestjs/common");
const currencies_service_1 = require("./currencies.service");
let currenciesController = class currenciesController {
    constructor(CurrenciesService) {
        this.CurrenciesService = CurrenciesService;
    }
    currenciesList(body) {
        return this.CurrenciesService.currenciesList(body);
    }
    currenciesBySymbols(body) {
        return this.CurrenciesService.currenciesBySymbols(body);
    }
    convertPriceToBase(body) {
        return this.CurrenciesService.convertPriceToBase(body);
    }
    commonCurrency(body) {
        return this.CurrenciesService.commonCurrency(body);
    }
};
__decorate([
    (0, common_1.Post)('/currenciesList'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], currenciesController.prototype, "currenciesList", null);
__decorate([
    (0, common_1.Post)('/currenciesBySymbols'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], currenciesController.prototype, "currenciesBySymbols", null);
__decorate([
    (0, common_1.Post)('/convertPriceToBase'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], currenciesController.prototype, "convertPriceToBase", null);
__decorate([
    (0, common_1.Post)('/commonCurrency'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], currenciesController.prototype, "commonCurrency", null);
currenciesController = __decorate([
    (0, common_1.Controller)('/currencies'),
    __metadata("design:paramtypes", [currencies_service_1.CurrenciesService])
], currenciesController);
exports.currenciesController = currenciesController;
//# sourceMappingURL=currencies.controller.js.map