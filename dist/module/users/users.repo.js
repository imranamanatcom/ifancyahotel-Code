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
exports.UsersRepo = void 0;
const common_1 = require("@nestjs/common");
const ResponseBuilder_1 = require("../../utils/ResponseBuilder");
let parseString = require('xml2js').parseString;
let fs = require('fs');
const mongodb_1 = require("../../database/mongodb");
const mongodb_2 = require("mongodb");
let md5 = require('md5');
const mailgun = require("mailgun-js");
const underscore_1 = require("underscore");
let UsersRepo = class UsersRepo {
    constructor(mongodb) {
        this.mongodb = mongodb;
    }
    async timeAgo(input) {
        const date = (input instanceof Date) ? input : new Date(input);
        const secondsElapsed = (date.getTime() - Date.now()) / 1000 / 60;
        let sE = Math.round(secondsElapsed);
        if (sE < 0) {
            sE = sE * -1;
        }
        return sE;
    }
    async isInThePast(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }
    async SignUp(data) {
        let dataValues = data;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            try {
                if (dataValues.AthuBy == "email") {
                    let accountFindData = await this.mongodb.findAccountUsersDocument({ "Email": { $eq: dataValues.Email }, "AthuBy": { $eq: dataValues.AthuBy } });
                    let accountFindDataLength = accountFindData.length;
                    if (accountFindDataLength == 0) {
                        dataValues['ActiveSession'] = md5(dataValues.Email);
                        await this.mongodb.newAccountUsersDocument(dataValues);
                        let accountFindData = await this.mongodb.findAccountUsersDocument({ "Email": { $eq: dataValues.Email }, "AthuBy": { $eq: dataValues.AthuBy } });
                        let _id = accountFindData[0]._id;
                        let ActiveSession = accountFindData[0].ActiveSession;
                        await this.EmailSend('ifanhomesignup', dataValues.Email, 'Welcome to Ifancyahotel', 'http://54.210.36.120/email-verify?id=' + _id + "&ActiveSession=" + ActiveSession);
                        resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', accountFindData[0]));
                    }
                    else {
                        resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "User with:" + dataValues.Email + " already exists"));
                    }
                }
                else if (dataValues.AthuBy == "facebook") {
                    let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
                    let accountFindDataLength = accountFindData.length;
                    if (accountFindDataLength == 0) {
                        dataValues['ActiveSession'] = md5(dataValues.hash);
                        await this.mongodb.newAccountUsersDocument(dataValues);
                        let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
                        resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', accountFindData[0]));
                    }
                    else {
                        resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "User with:" + dataValues.hash + " already exists"));
                    }
                }
                else if (dataValues.AthuBy == "google") {
                    let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
                    let accountFindDataLength = accountFindData.length;
                    if (accountFindDataLength == 0) {
                        dataValues['ActiveSession'] = md5(dataValues.hash);
                        await this.mongodb.newAccountUsersDocument(dataValues);
                        let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
                        resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', accountFindData[0]));
                    }
                    else {
                        resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "User with:" + dataValues.hash + " already exists"));
                    }
                }
            }
            catch (e) {
                console.log('Error:', e.stack);
            }
        });
    }
    async SignIn(data) {
        let dataValues = data;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            if (dataValues.AthuBy == "email") {
                let accountFindData = await this.mongodb.findAccountUsersDocument({ "Email": { $eq: dataValues.Email }, "Passwd": { $eq: dataValues.Passwd } });
                let accountFindDataLength = accountFindData.length;
                if (accountFindDataLength == 1) {
                    let ActiveSession = md5(dataValues.Email);
                    accountFindData[0]['ActiveSession'] = ActiveSession;
                    await this.mongodb.updateAccountUsersDocument({ "Email": { $eq: dataValues.Email } }, { $set: accountFindData[0] });
                    let accountFindData_1 = await this.mongodb.findAccountUsersDocument({ "Email": { $eq: dataValues.Email }, "Passwd": { $eq: dataValues.Passwd } });
                    resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', accountFindData_1[0]));
                }
                else {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Password not match. Check your Password"));
                }
            }
            else if (dataValues.AthuBy == "facebook") {
                let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
                let accountFindDataLength = accountFindData.length;
                if (accountFindDataLength == 1) {
                    let ActiveSession = md5(dataValues.hash);
                    accountFindData[0]['ActiveSession'] = ActiveSession;
                    await this.mongodb.updateAccountUsersDocument({ "hash": { $eq: dataValues.hash } }, { $set: accountFindData[0] });
                    let accountFindData_1 = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
                    resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', accountFindData_1[0]));
                }
                else {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "User with this facebook hash:" + dataValues.hash + "facebook not exists"));
                }
            }
            else if (dataValues.AthuBy == "google") {
                let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
                let accountFindDataLength = accountFindData.length;
                console.log(accountFindData);
                if (accountFindDataLength == 1) {
                    let ActiveSession = md5(dataValues.hash);
                    accountFindData[0]['ActiveSession'] = ActiveSession;
                    await this.mongodb.updateAccountUsersDocument({ "hash": { $eq: dataValues.hash } }, { $set: accountFindData[0] });
                    let accountFindData_1 = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
                    resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', accountFindData_1[0]));
                }
                else {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "User with this Google hash:" + dataValues.hash + "facebook not exists"));
                }
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "AthuBy parameter Missing"));
            }
        });
    }
    async MyTrips(data) {
        let dataValues = data;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                let allBookings = await this.mongodb.findHotelBookingDocument({ "UserID": { $eq: dataValues.UserID } });
                for (let index = 0; index < allBookings.length; index++) {
                    let BookingElement = allBookings[index];
                    BookingElement['_id'];
                    if (BookingElement['HotelCreateReservationRsp']['HotelReservationData']) {
                        let HotelReservationData = BookingElement['HotelCreateReservationRsp']['HotelReservationData'];
                        let HotelReservationDataLength = HotelReservationData.length;
                        if (HotelReservationDataLength <= 1) {
                            let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                            let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                            let checkoutDate = hotelCheckoutDate[0];
                            let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Active";
                            if (BookingIsInThePast) {
                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Completed";
                            }
                            let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                            let CancelBookingLength = CancelBooking.length;
                            if (CancelBookingLength == 1) {
                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Cancelled";
                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['CancelData'] = CancelBooking[0];
                            }
                        }
                        else {
                            for (let index = 0; index < HotelReservationDataLength; index++) {
                                let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['HotelStay']['hotel:CheckoutDate'];
                                let checkoutDate = hotelCheckoutDate[0];
                                let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Active";
                                if (BookingIsInThePast) {
                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Completed";
                                }
                                let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                let CancelBookingLength = CancelBooking.length;
                                if (CancelBookingLength == 1) {
                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Cancelled";
                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['CancelData'] = CancelBooking[0];
                                }
                            }
                        }
                    }
                    else {
                        let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                        let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                        let checkoutDate = hotelCheckoutDate[0];
                        let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                        BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Active";
                        if (BookingIsInThePast) {
                            BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                        }
                        let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                        let CancelBookingLength = CancelBooking.length;
                        if (CancelBookingLength == 1) {
                            BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                            BookingElement['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                        }
                    }
                }
                let PairData = [];
                let isPairData = [];
                for (let index = 0; index < allBookings.length; index++) {
                    let PairKey = allBookings[index]['PairKey'];
                    let contains = underscore_1._.contains(isPairData, PairKey);
                    if (contains == true) {
                    }
                    else {
                        if (PairKey) {
                            let pair = await this.mongodb.findHotelBookingDocument({ "PairKey": { $eq: PairKey } });
                            for (let index = 0; index < pair.length; index++) {
                                let BookingElement = pair[index];
                                BookingElement['_id'];
                                if (BookingElement['HotelCreateReservationRsp']['HotelReservationData']) {
                                    let HotelReservationData = BookingElement['HotelCreateReservationRsp']['HotelReservationData'];
                                    let HotelReservationDataLength = HotelReservationData.length;
                                    if (HotelReservationDataLength <= 1) {
                                        let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                        let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                                        let checkoutDate = hotelCheckoutDate[0];
                                        let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Active";
                                        if (BookingIsInThePast) {
                                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Completed";
                                        }
                                        let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                        let CancelBookingLength = CancelBooking.length;
                                        if (CancelBookingLength == 1) {
                                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Cancelled";
                                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['CancelData'] = CancelBooking[0];
                                        }
                                    }
                                    else {
                                        for (let index = 0; index < HotelReservationDataLength; index++) {
                                            let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                            let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['HotelStay']['hotel:CheckoutDate'];
                                            let checkoutDate = hotelCheckoutDate[0];
                                            let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Active";
                                            if (BookingIsInThePast) {
                                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Completed";
                                            }
                                            let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                            let CancelBookingLength = CancelBooking.length;
                                            if (CancelBookingLength == 1) {
                                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Cancelled";
                                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['CancelData'] = CancelBooking[0];
                                            }
                                        }
                                    }
                                }
                                else {
                                    let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                    let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                                    let checkoutDate = hotelCheckoutDate[0];
                                    let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                    BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Active";
                                    if (BookingIsInThePast) {
                                        BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                                    }
                                    let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                    let CancelBookingLength = CancelBooking.length;
                                    if (CancelBookingLength == 1) {
                                        BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                                        BookingElement['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                                    }
                                }
                            }
                            PairData.push({ pair });
                        }
                        else {
                            let pair = [];
                            pair[0] = allBookings[index];
                            PairData.push({ pair });
                        }
                    }
                }
                resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', PairData));
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async MyTripsMobile(data) {
        let dataValues = data;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let PairData = [];
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                if (data.Type == "Past") {
                    let allBookings = await this.mongodb.findHotelBookingDocument({ 'UserID': { $eq: data.UserID } });
                    for (let index = 0; index < allBookings.length; index++) {
                        let LocatorCode = allBookings[index]['HotelCreateReservationRsp']['LocatorCode'];
                        let hotelCheckoutDate;
                        if (allBookings[index]['HotelCreateReservationRsp']['HotelStay']) {
                            hotelCheckoutDate = allBookings[index]['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                        }
                        else {
                            hotelCheckoutDate = allBookings[index]['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                        }
                        let checkoutDate = hotelCheckoutDate[0];
                        let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                        allBookings[index]['HotelCreateReservationRsp']['StatsCode'] = "Active";
                        if (BookingIsInThePast) {
                            allBookings[index]['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                        }
                        let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                        let CancelBookingLength = CancelBooking.length;
                        if (CancelBookingLength == 1) {
                            allBookings[index]['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                            allBookings[index]['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                        }
                    }
                    resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', allBookings));
                }
                else if (data.Type == "Cancelled") {
                    let CancelBooking = await this.mongodb.findCancelBooking({ 'UserID': { $eq: data.UserID } });
                    for (let index = 0; index < CancelBooking.length; index++) {
                        let LocatorCode = CancelBooking[index]['LocatorCode'];
                        let allBookings = await this.mongodb.findHotelBookingDocument({ "HotelCreateReservationRsp.LocatorCode": LocatorCode });
                        CancelBooking[index]['Booking'] = allBookings[0];
                    }
                    resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', CancelBooking));
                }
                else {
                    let allBookings = await this.mongodb.findHotelBookingDocument({ "UserID": { $eq: dataValues.UserID } });
                    for (let index = 0; index < allBookings.length; index++) {
                        let BookingElement = allBookings[index];
                        BookingElement['_id'];
                        if (BookingElement['HotelCreateReservationRsp']['HotelReservationData']) {
                            let HotelReservationData = BookingElement['HotelCreateReservationRsp']['HotelReservationData'];
                            let HotelReservationDataLength = HotelReservationData.length;
                            if (HotelReservationDataLength <= 1) {
                                let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                                let checkoutDate = hotelCheckoutDate[0];
                                let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Active";
                                if (BookingIsInThePast) {
                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Completed";
                                }
                                let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                let CancelBookingLength = CancelBooking.length;
                                if (CancelBookingLength == 1) {
                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Cancelled";
                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['CancelData'] = CancelBooking[0];
                                }
                            }
                            else {
                                for (let index = 0; index < HotelReservationDataLength; index++) {
                                    let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                    let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['HotelStay']['hotel:CheckoutDate'];
                                    let checkoutDate = hotelCheckoutDate[0];
                                    let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Active";
                                    if (BookingIsInThePast) {
                                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Completed";
                                    }
                                    let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                    let CancelBookingLength = CancelBooking.length;
                                    if (CancelBookingLength == 1) {
                                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Cancelled";
                                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['CancelData'] = CancelBooking[0];
                                    }
                                }
                            }
                        }
                        else {
                            let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                            let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                            let checkoutDate = hotelCheckoutDate[0];
                            let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                            BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Active";
                            if (BookingIsInThePast) {
                                BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                            }
                            let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                            let CancelBookingLength = CancelBooking.length;
                            if (CancelBookingLength == 1) {
                                BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                                BookingElement['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                            }
                        }
                    }
                    let PairData = [];
                    let isPairData = [];
                    for (let index = 0; index < allBookings.length; index++) {
                        let PairKey = allBookings[index]['PairKey'];
                        let contains = underscore_1._.contains(isPairData, PairKey);
                        if (contains == true) {
                        }
                        else {
                            if (PairKey) {
                                let pair = await this.mongodb.findHotelBookingDocument({ "PairKey": { $eq: PairKey } });
                                for (let index = 0; index < pair.length; index++) {
                                    let BookingElement = pair[index];
                                    BookingElement['_id'];
                                    if (BookingElement['HotelCreateReservationRsp']['HotelReservationData']) {
                                        let HotelReservationData = BookingElement['HotelCreateReservationRsp']['HotelReservationData'];
                                        let HotelReservationDataLength = HotelReservationData.length;
                                        if (HotelReservationDataLength <= 1) {
                                            let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                            let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                                            let checkoutDate = hotelCheckoutDate[0];
                                            let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Active";
                                            if (BookingIsInThePast) {
                                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Completed";
                                            }
                                            let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                            let CancelBookingLength = CancelBooking.length;
                                            if (CancelBookingLength == 1) {
                                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Cancelled";
                                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['CancelData'] = CancelBooking[0];
                                            }
                                        }
                                        else {
                                            for (let index = 0; index < HotelReservationDataLength; index++) {
                                                let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                                let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['HotelStay']['hotel:CheckoutDate'];
                                                let checkoutDate = hotelCheckoutDate[0];
                                                let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Active";
                                                if (BookingIsInThePast) {
                                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Completed";
                                                }
                                                let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                                let CancelBookingLength = CancelBooking.length;
                                                if (CancelBookingLength == 1) {
                                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Cancelled";
                                                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['CancelData'] = CancelBooking[0];
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                                        let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                                        let checkoutDate = hotelCheckoutDate[0];
                                        let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                                        BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Active";
                                        if (BookingIsInThePast) {
                                            BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                                        }
                                        let CancelBooking = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                                        let CancelBookingLength = CancelBooking.length;
                                        if (CancelBookingLength == 1) {
                                            BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                                            BookingElement['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                                        }
                                    }
                                }
                                PairData.push({ pair });
                            }
                            else {
                                let pair = [];
                                pair[0] = allBookings[index];
                                PairData.push({ pair });
                            }
                        }
                    }
                    resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', PairData));
                }
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async mytripscancellation(data) {
        let dataValues = data;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                let allCancelBooking = await this.mongodb.findCancelBooking({ "UserID": { $eq: dataValues.UserID } });
                resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', allCancelBooking));
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async Preferences(body) {
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                accountFindData[0]['Preferences'] = body.Preferences;
                let userID = accountFindData[0]._id;
                await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(userID) } }, { $set: accountFindData[0] });
                let freshData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
                resolve(freshData[0]);
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async PersonalDetails(body) {
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                accountFindData[0]['PersonalDetails'] = body.PersonalDetails;
                let userID = accountFindData[0]._id;
                await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(userID) } }, { $set: accountFindData[0] });
                let freshData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
                resolve(freshData[0]);
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async PaymentDetails(body) {
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                accountFindData[0]['PaymentDetails'] = body.PaymentDetails;
                let userID = accountFindData[0]._id;
                await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(userID) } }, { $set: accountFindData[0] });
                let freshData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
                resolve(freshData[0]);
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async EmailSend(template, to, subject, Link) {
        return new Promise(async (resolve) => {
            const DOMAIN = "marketing.ifancyahotel.com";
            const mg = mailgun({ apiKey: "403dca0d87cf2f18354079fa46d4f26b-15b35dee-f15a4d69", domain: DOMAIN });
            const data = {
                from: "ifancyahotel <postmaster@marketing.ifancyahotel.com>",
                to: to,
                subject: subject,
                template: template,
                'v:email': to,
                'v:ConfirmLink': Link,
                'v:verify-email': Link
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
            resolve(ResponseBuilder_1.ResponseBuilder.successResponse('message', 'Sent'));
        });
    }
    async UserReadyOnly(data) {
        let dataValues = data;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', accountFindData[0]));
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async UpdatePassword(data) {
        let dataValues = data;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                let CurrentPassword = accountFindData[0].Passwd;
                if (CurrentPassword == data.CurrentPassword) {
                    accountFindData[0]['Passwd'] = data.NewPassword;
                    await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(data.UserID) } }, { $set: accountFindData[0] });
                    resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', accountFindData[0]));
                }
                else {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Current Password not Matched"));
                }
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async forgotPassword(body) {
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({
                "Email": { $eq: body.Email }
            });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                let _id = accountFindData[0]._id;
                let ActiveSession = accountFindData[0].ActiveSession;
                await this.EmailSend('verifyemail', body.Email, 'Verify your email address', 'http://54.210.36.120/reset-password?id=' + _id + "&ActiveSession=" + ActiveSession);
                resolve(ResponseBuilder_1.ResponseBuilder.successResponse('message', "Email Sent"));
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "No Account Found"));
            }
        });
    }
    async ForgotUpdatePassword(body) {
        let dataValues = body;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                accountFindData[0]['Passwd'] = body.NewPassword;
                await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(body.UserID) } }, { $set: accountFindData[0] });
                resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Message', 'Updated'));
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async verifyEmail(body) {
        let dataValues = body;
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                accountFindData[0]['verifyEmail'] = true;
                let userID = accountFindData[0]._id;
                await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(userID) } }, { $set: accountFindData[0] });
                await this.mongodb.findAccountUsersDocument({ _id: { $eq: new mongodb_2.ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
                resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Message', 'Updated'));
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }
        });
    }
    async Resetemailverify(body) {
        await this.mongodb.connect();
        return new Promise(async (resolve) => {
            let accountFindData = await this.mongodb.findAccountUsersDocument({
                "Email": { $eq: body.Email }
            });
            let accountFindDataLength = accountFindData.length;
            if (accountFindDataLength == 1) {
                let _id = accountFindData[0]._id;
                let ActiveSession = accountFindData[0].ActiveSession;
                await this.EmailSend('ifanhomesignup', body.Email, 'Welcome to ifancyahotel', 'http://54.210.36.120/email-verify?id=' + _id + "&ActiveSession=" + ActiveSession);
                resolve(ResponseBuilder_1.ResponseBuilder.successResponse('message', "Email Sent"));
            }
            else {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', "No Account Found"));
            }
        });
    }
};
UsersRepo = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mongodb_1.MongoDatabase])
], UsersRepo);
exports.UsersRepo = UsersRepo;
//# sourceMappingURL=users.repo.js.map