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
exports.HotelController = void 0;
const common_1 = require("@nestjs/common");
const hotel_service_1 = require("./hotel.service");
require('dotenv').config();
let HotelController = class HotelController {
    constructor(appService) {
        this.appService = appService;
    }
    soapHome(body) {
        return this.appService.consoles(body, 3);
    }
    async getHotelServiceAvailability(body) {
        return this.appService.getMultiHotelServiceAvailability(body);
    }
    async getHotelServiceAvailabilityMobile(body) {
        return this.appService.getHotelServiceAvailabilityMobile(body);
    }
    async getMoreHotelServiceAvailabilityMobile(body) {
        return this.appService.getMultiHotelMoreAvailabilityMobile(body);
    }
    async getMoreHotelServiceAvailability(body) {
        return this.appService.getMultiHotelMoreAvailability(body);
    }
    async getHotelDetailsAvailability(body) {
        return this.appService.getHotelDetailsAvailability(body);
    }
    async getHotelDetailsAvailabilityMobile(body) {
        return this.appService.getHotelDetailsAvailabilityMobile(body);
    }
    async getHotelMediaLinks(body) {
        return this.appService.getHotelMediaLinks(body);
    }
    async getTermsAndCondition(body) {
        return this.appService.getTermsAndCondition(body);
    }
    async getMultiTermsAndCondition(body) {
        return this.appService.getMultiTermsAndCondition(body);
    }
    async getCityAutoComplete(body) {
        return this.appService.getCityAutoComplete(body);
    }
    async getHotelFilters(body) {
        return this.appService.getHotelFilters(body);
    }
    async popularDestinations(body, ip) {
        return this.appService.popularDestinations(body, ip);
    }
    async destinationsDeals(body, ip) {
        return this.appService.destinationsDeals(body, ip);
    }
    async blogList(body) {
        return this.appService.blogs(body);
    }
    async userReviews(body) {
        return this.appService.userReviews(body);
    }
    async hotelMultiMediaLinks(body) {
        return this.appService.hotelMultiMediaLinks(body);
    }
    async userCurrentlocation(body, ip) {
        return this.appService.userCurrentlocation(body, ip);
    }
    async userBooking(body) {
        return this.appService.userBooking(body);
    }
    async userBookingDetails(body) {
        return this.appService.userBookingDetails(body);
    }
    async multiHotelbooking(body) {
        return this.appService.multiHotelbooking(body);
    }
    async multibookingcancel(body) {
        return this.appService.multibookingcancel(body);
    }
    async bookingCancel(body) {
        return this.appService.bookingCancel(body);
    }
    SearchByIataCode(body) {
        return this.appService.SearchByIataCode(body);
    }
    SearchByfilters(body) {
        return this.appService.SearchByfilters(body);
    }
    Syncfilterdata(body) {
        return this.appService.Syncfilterdata(body);
    }
};
__decorate([
    (0, common_1.Post)('/console'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "soapHome", null);
__decorate([
    (0, common_1.Post)('/hotelSearchAvailability'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getHotelServiceAvailability", null);
__decorate([
    (0, common_1.Post)('/hotelSearchAvailabilityMobile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getHotelServiceAvailabilityMobile", null);
__decorate([
    (0, common_1.Post)('/hotelMoreAvailabilityMobile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getMoreHotelServiceAvailabilityMobile", null);
__decorate([
    (0, common_1.Post)('/hotelMoreAvailability'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getMoreHotelServiceAvailability", null);
__decorate([
    (0, common_1.Post)('/hotelDetailsAvailability'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getHotelDetailsAvailability", null);
__decorate([
    (0, common_1.Post)('/hotelDetailsAvailabilityMobile'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getHotelDetailsAvailabilityMobile", null);
__decorate([
    (0, common_1.Post)('/hotelMediaLinks'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getHotelMediaLinks", null);
__decorate([
    (0, common_1.Post)('/hotelTermsAndCondition'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getTermsAndCondition", null);
__decorate([
    (0, common_1.Post)('/hotelMultiTermsAndCondition'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getMultiTermsAndCondition", null);
__decorate([
    (0, common_1.Post)('/hotelCityAutoComplete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getCityAutoComplete", null);
__decorate([
    (0, common_1.Post)('/hotelFilters'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "getHotelFilters", null);
__decorate([
    (0, common_1.Post)('/popularDestinations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "popularDestinations", null);
__decorate([
    (0, common_1.Post)('/destinationsDeals'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "destinationsDeals", null);
__decorate([
    (0, common_1.Post)('/blogList'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "blogList", null);
__decorate([
    (0, common_1.Post)('/reviews'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "userReviews", null);
__decorate([
    (0, common_1.Post)('/hotelMultiMediaLinks'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "hotelMultiMediaLinks", null);
__decorate([
    (0, common_1.Post)('/userCurrentlocation'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "userCurrentlocation", null);
__decorate([
    (0, common_1.Post)('/booking'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "userBooking", null);
__decorate([
    (0, common_1.Post)('/bookingdetails'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "userBookingDetails", null);
__decorate([
    (0, common_1.Post)('/multiHotelbooking'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "multiHotelbooking", null);
__decorate([
    (0, common_1.Post)('/multibookingcancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "multibookingcancel", null);
__decorate([
    (0, common_1.Post)('/bookingcancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "bookingCancel", null);
__decorate([
    (0, common_1.Post)('/searchbyiatacode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "SearchByIataCode", null);
__decorate([
    (0, common_1.Post)('/filters'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "SearchByfilters", null);
__decorate([
    (0, common_1.Post)('/syncfilterdata'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HotelController.prototype, "Syncfilterdata", null);
HotelController = __decorate([
    (0, common_1.Controller)('/hotel'),
    __metadata("design:paramtypes", [hotel_service_1.HotelService])
], HotelController);
exports.HotelController = HotelController;
//# sourceMappingURL=hotel.controller.js.map