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
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const mongodb_1 = require("../database/mongodb");
const hotel_service_1 = require("../module/hotel/hotel.service");
const { Client } = require('@elastic/elasticsearch');
const mongodb_2 = require("mongodb");
let CronService = class CronService {
    constructor() {
        this.sleep = time => new Promise(res => setTimeout(res, time, "done sleeping"));
    }
    async runEveryMinute() {
    }
    async LoadMoreData() {
        let syncLoadDataDocument = await this.mongodb.findSyncLoadDataDocument({});
        let syncLoadDataDocumentLength = syncLoadDataDocument.length;
        for (let i = 0; i < syncLoadDataDocumentLength; i++) {
            let nextResultReference = syncLoadDataDocument[i]['nextResultReference'];
            let syncLoadDataId = syncLoadDataDocument[i]['_id'];
            if (nextResultReference == 'nomore') {
            }
            else {
                let page = syncLoadDataDocument[i]['Page'];
                if (page <= 3) {
                    page++;
                    syncLoadDataDocument[i]['Page'] = page;
                    syncLoadDataDocument[i]['QueryData']['SnycByCron'] = true;
                    syncLoadDataDocument[i]['QueryData']['Page'] = page;
                    syncLoadDataDocument[i]['QueryData']['NextResultReference'] = syncLoadDataDocument[i]['nextResultReference'];
                    let NextRows = syncLoadDataDocument[i]['QueryData'];
                    console.log(NextRows);
                    let getHotelMoreAvailability = await this.hotelService.getHotelMoreAvailability(NextRows);
                    console.log(getHotelMoreAvailability);
                    await this.mongodb.deleteSyncLoadDataDocument({ _id: new mongodb_2.ObjectId(syncLoadDataId) });
                }
                else {
                    await this.mongodb.deleteSyncLoadDataDocument({ _id: new mongodb_2.ObjectId(syncLoadDataId) });
                }
            }
        }
    }
    async elasticSyncHotelData() {
    }
};
__decorate([
    (0, common_1.Inject)(mongodb_1.MongoDatabase),
    __metadata("design:type", mongodb_1.MongoDatabase)
], CronService.prototype, "mongodb", void 0);
__decorate([
    (0, common_1.Inject)(hotel_service_1.HotelService),
    __metadata("design:type", hotel_service_1.HotelService)
], CronService.prototype, "hotelService", void 0);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_2_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "runEveryMinute", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_2_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "LoadMoreData", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_12_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "elasticSyncHotelData", null);
CronService = __decorate([
    (0, common_1.Injectable)()
], CronService);
exports.CronService = CronService;
//# sourceMappingURL=cron.service.js.map