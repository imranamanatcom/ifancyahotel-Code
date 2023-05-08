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
exports.MongoDatabase = void 0;
const common_1 = require("@nestjs/common");
let MongoClient = require('mongodb').MongoClient;
let MongoDatabase = class MongoDatabase {
    constructor() {
        this.databaseName = "Ifancydat";
        this.cacheTable = "SearchCached";
        this.hotelsTable = "Hotels";
        this.hotelDetailsCached = "HotelDetailsCached";
        this.hotelDetailsTable = "HotelDetails";
        this.hotelMediaLinksCached = "HotelMediaLinksCached";
        this.hotelMediaLinks = "HotelMediaLinks";
        this.hotelTNCCached = "HotelTNCCached";
        this.hotelTNC = "HotelTNC";
        this.HotelRateDetailFilters = "HotelFilters";
        this.Booking = "Booking";
        this.CancelBooking = "CancelBooking";
        this.AccountUsers = "AccountUsers";
        this.CurrenciesManagement = "CurrenciesManagement";
        this.CommonCurrency = "CommonCurrency";
        this.Applicationlogged = "Applicationlogged";
        this.SyncLoadData = "syncLoadData";
        this.FiltersSettings = "FiltersSettings";
        let node_env = process.env.NODE_ENV;
        if (node_env == 'production') {
            this.MongoClientURL = process.env.MONGODB_Production;
        }
        else {
            this.MongoClientURL = process.env.MONGODB_Development;
        }
        console.log(node_env);
        console.log(this.MongoClientURL);
        this.db = new MongoClient(this.MongoClientURL);
    }
    ;
    async connect() {
        await this.db.connect(function (err) {
            if (err)
                throw err;
            console.log("Mongo DB connected");
        });
    }
    async disConnect() {
        await this.db.close(function (err) {
            if (err)
                throw err;
            console.log("Mongo DB disconnected");
        });
    }
    async newCacheDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.cacheTable).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateCacheDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.cacheTable).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findCacheDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.cacheTable).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newHotelDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelsTable).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateHotelDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelsTable).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findHotelDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelsTable).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findHotelDocumentWithSkipLimit(json, skip, limit) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelsTable).find(json).skip(skip).limit(limit).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findHotelDocumentCount() {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelsTable).estimatedDocumentCount({}, function (err, numOfDocs) {
                if (err)
                    throw err;
                resolve(numOfDocs);
            });
        });
    }
    async newHotelDetailsDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelDetailsTable).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateHotelDetailsDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelDetailsTable).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findHotelDetailsDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelDetailsTable).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newCacheHotelDetailsDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelDetailsCached).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateHotelCacheDetailsDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelDetailsCached).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findCacheHotelDetailsDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelDetailsCached).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newMediaLinkCacheDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelMediaLinksCached).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateMediaLinkCacheDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelMediaLinksCached).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findMediaLinkCacheDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelMediaLinksCached).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newMediaLinkDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelMediaLinks).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateMediaLinkDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelMediaLinks).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findMediaLinkDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelMediaLinks).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newHotelTNCCacheDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelTNCCached).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateHotelTNCCacheDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelTNCCached).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findHotelTNCCacheDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelTNCCached).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newHotelTNCDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelTNC).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateHotelTNCDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelTNC).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findHotelTNCDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.hotelTNC).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findLocations(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection('Locations').find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newHotelRateDetailFiltersDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.HotelRateDetailFilters).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateHotelRateDetailFiltersDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.HotelRateDetailFilters).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findHotelRateDetailFiltersDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.HotelRateDetailFilters).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newHotelBookingDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.Booking).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateHotelBookingDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.Booking).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findHotelBookingDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.Booking).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newAccountUsersDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.AccountUsers).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateAccountUsersDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.AccountUsers).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findAccountUsersDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.AccountUsers).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newCurrenciesManagementDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CurrenciesManagement).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateCurrenciesManagementDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CurrenciesManagement).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findCurrenciesManagementDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CurrenciesManagement).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newCommonCurrencyDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CommonCurrency).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateCommonCurrencyDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CommonCurrency).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findCommonCurrencyDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CommonCurrency).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async applicationloggedInsert(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.Applicationlogged).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async applicationloggedMultiInsert(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.Applicationlogged).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async applicationloggedFind(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.Applicationlogged).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async applicationloggedUpdate(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.Applicationlogged).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newCancelBooking(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CancelBooking).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newMutiCancelBooking(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CancelBooking).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateCancelBooking(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CancelBooking).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findCancelBooking(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.CancelBooking).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newSyncLoadDataDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.SyncLoadData).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateSyncLoadDataDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.SyncLoadData).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findSyncLoadDataDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.SyncLoadData).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async deleteSyncLoadDataDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.SyncLoadData).deleteOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async newFiltersSettingsManagementDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.FiltersSettings).insertOne(json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async updateFiltersSettingsManagementDocument(find, json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.FiltersSettings).updateOne(find, json, function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
    async findFiltersSettingsManagementDocument(json) {
        return await new Promise(async (resolve) => {
            await this.db.db(this.databaseName).collection(this.FiltersSettings).find(json).toArray(function (err, result) {
                if (err)
                    throw err;
                resolve(result);
            });
        });
    }
};
MongoDatabase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MongoDatabase);
exports.MongoDatabase = MongoDatabase;
//# sourceMappingURL=mongodb.js.map