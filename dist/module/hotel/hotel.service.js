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
exports.HotelService = void 0;
const common_1 = require("@nestjs/common");
const hotel_repo_1 = require("./hotel.repo");
let parseString = require('xml2js').parseString;
let md5 = require('md5');
const ResponseBuilder_1 = require("../..//utils/ResponseBuilder");
const underscore_1 = require("underscore");
const mailgun = require("mailgun-js");
let HotelService = class HotelService {
    constructor(hotelRepo) {
        this.hotelRepo = hotelRepo;
        this.deepCompare = (arg1, arg2) => {
            if (Object.prototype.toString.call(arg1) === Object.prototype.toString.call(arg2)) {
                if (Object.prototype.toString.call(arg1) === '[object Object]' || Object.prototype.toString.call(arg1) === '[object Array]') {
                    if (Object.keys(arg1).length !== Object.keys(arg2).length) {
                        return false;
                    }
                    return (Object.keys(arg1).every(function (key) {
                        return this.deepCompare(arg1[key], arg2[key]);
                    }));
                }
                return (arg1 === arg2);
            }
            return false;
        };
    }
    async emailBookingSend(template, to, subject, BookingConfirmation, CreateDate, HotelPropertyName, CheckInDate, CheckOutDate, Bookinglink, BookingDetailsURL, CancelBookingURL) {
        return new Promise(async (resolve) => {
            const DOMAIN = "marketing.ifancyahotel.com";
            const mg = mailgun({ apiKey: "403dca0d87cf2f18354079fa46d4f26b-15b35dee-f15a4d69", domain: DOMAIN });
            const data = {
                from: "ifancyahotel <postmaster@marketing.ifancyahotel.com>",
                to: to,
                subject: subject,
                template: template,
                "v:BookingConfirmation": BookingConfirmation,
                "v:CreateDate": CreateDate,
                "v:HotelPropertyName": HotelPropertyName,
                "v:CheckInDate": CheckInDate,
                "v:CheckOutDate": CheckOutDate,
                "v:Bookinglink": Bookinglink,
                "v:BookingDetailsURL": BookingDetailsURL,
                "v:CancelBookingURL": CancelBookingURL
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
            resolve(ResponseBuilder_1.ResponseBuilder.successResponse('message', 'Sent'));
        });
    }
    async emailBookingCancelSend(template, to, subject, BookingCancelation) {
        return new Promise(async (resolve) => {
            const DOMAIN = "marketing.ifancyahotel.com";
            const mg = mailgun({ apiKey: "403dca0d87cf2f18354079fa46d4f26b-15b35dee-f15a4d69", domain: DOMAIN });
            const data = {
                from: "ifancyahotel <postmaster@marketing.ifancyahotel.com>",
                to: to,
                subject: subject,
                template: template,
                "v:Cancelation": BookingCancelation,
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });
            resolve(ResponseBuilder_1.ResponseBuilder.successResponse('message', 'Sent'));
        });
    }
    async minRequestforHotelDetails(json_data) {
        return new Promise(async (resolve) => {
            let modifyCount = underscore_1._.groupBy(json_data, function (obj) { return obj.Adults; });
            let modifyCountlength = Object.keys(modifyCount);
            let finalRequest = [];
            for (let index = 0; index < modifyCountlength.length; index++) {
                let jsonRequest = modifyCount[modifyCountlength[index]];
                let roomCount = jsonRequest.length;
                let AdultsJson = underscore_1._.max(jsonRequest, function (o) { return o.Childrens; });
                AdultsJson['Rooms'] = roomCount;
                finalRequest.push(AdultsJson);
            }
            resolve(finalRequest);
        });
    }
    getHotelMoreAvailability(data) {
        let AdultsAndRooms = data.AdultsAndRooms;
        if (AdultsAndRooms === undefined || AdultsAndRooms === null) {
            data.Adults = 1;
            data.Rooms = 1;
            data.Childrens = 0;
        }
        else {
            let AdultsJson = underscore_1._.min(AdultsAndRooms, function (o) { return o.Adults; });
            data.Childrens = AdultsJson.Childrens;
            data.ChildrensAges = AdultsJson.ChildrensAges;
            let values = AdultsAndRooms.map(function (v) { return v.Adults; });
            let MinAdults = Math.min.apply(null, values);
            console.log(MinAdults);
            data.Adults = MinAdults;
            data.Rooms = 1;
        }
        let ChildrensCount = data.Childrens;
        let ageNode = "";
        if (ChildrensCount >= 1) {
            let ChildrensAgesArrayLength = data.ChildrensAges.length;
            for (let index = 0; index < ChildrensAgesArrayLength; index++) {
                ageNode += "<Age>" + data.ChildrensAges[index]['age'] + "</Age>";
            }
            data.Ages = '<NumberOfChildren Count="' + ChildrensCount + '">' + ageNode + '</NumberOfChildren>';
        }
        else {
            data.Ages = '';
        }
        let MaximumRating = data.MaximumRating || 5;
        let MinimumRating = data.MinimumRating || 0;
        console.log(MaximumRating);
        console.log(MinimumRating);
        if (data.MaximumRating || data.MinimumRating) {
            data.Rating = '<HotelRating RatingProvider="AAA"><RatingRange MaximumRating="' + MaximumRating + '" MinimumRating="' + MinimumRating + '"></RatingRange></HotelRating>';
        }
        else {
            data.Rating = '';
        }
        if (data.AvailableHotelsOnly === undefined || data.AvailableHotelsOnly === null) {
            data.AvailableHotelsOnly = true;
        }
        if (data.HotelLoc === undefined) {
            let TraceId = data.TraceId;
            let Base = data.Base;
            let Latitude = data.Latitude;
            let Longitude = data.Longitude;
            let NextResultReference = data.NextResultReference;
            let AvailableHotelsOnly = data.AvailableHotelsOnly;
            let To = data.To;
            let From = data.From;
            let MaximumRating = data.MaximumRating;
            let MinimumRating = data.MinimumRating;
            let Adults = data.Adults;
            let Childrens = data.Childrens;
            let Infants = data.Infants;
            let ChildrenAge = data.ChildrenAge;
            let InfantAge = data.InfantAge;
            let Rooms = data.Rooms;
            let Cribs = data.Cribs;
            let ReferencePoint = data.ReferencePoint;
            let RollawayBeds = data.RollawayBeds;
            let Ages = data.Ages;
            let Provider = data.Provider;
            let createHash = md5(TraceId + Base + Ages + AvailableHotelsOnly + MaximumRating + MinimumRating + Latitude + Longitude + NextResultReference + To + From + Adults + Childrens + Infants + ChildrenAge + InfantAge + Rooms + Cribs + ReferencePoint + RollawayBeds + Provider);
            let currentDate = new Date();
            let modiJson = {
                "text": {
                    "Latitude": Latitude,
                    "Longitude": Longitude
                },
                "mode": "latlng",
                "hash": createHash,
                "timeout": currentDate,
                "count": "0",
                "QueryData": data
            };
            return this.hotelRepo.moreHotelServiceAvailabilityRequest(data, modiJson);
        }
        else {
            let TraceId = data.TraceId;
            let Base = data.Base;
            let HotelLoc = data.HotelLoc;
            let NextResultReference = data.NextResultReference;
            let AvailableHotelsOnly = data.AvailableHotelsOnly;
            let To = data.To;
            let From = data.From;
            let MaximumRating = data.MaximumRating;
            let MinimumRating = data.MinimumRating;
            let Adults = data.Adults;
            let Childrens = data.Childrens;
            let Infants = data.Infants;
            let ChildrenAge = data.ChildrenAge;
            let InfantAge = data.InfantAge;
            let Rooms = data.Rooms;
            let Cribs = data.Cribs;
            let ReferencePoint = data.ReferencePoint;
            let RollawayBeds = data.RollawayBeds;
            let Provider = data.Provider;
            let Ages = data.Ages;
            let createHash = md5(TraceId + Ages + AvailableHotelsOnly + MaximumRating + MinimumRating + Base + HotelLoc + NextResultReference + To + From + Adults + Childrens + Infants + ChildrenAge + InfantAge + Rooms + Cribs + ReferencePoint + RollawayBeds + Provider);
            let currentDate = new Date();
            let modiJson = {
                "text": HotelLoc,
                "mode": "IATA",
                "hash": createHash,
                "timeout": currentDate,
                "count": "0",
                "QueryData": data
            };
            return this.hotelRepo.moreHotelServiceAvailabilityRequest(data, modiJson);
        }
    }
    async getMultiHotelMoreAvailability(data) {
        return new Promise(async (resolve) => {
            let AdultsAndRooms = data.AdultsAndRooms;
            let AdultsAndRoomsLength = AdultsAndRooms.length;
            let getHotelServiceAvailabilityData = [];
            for (let index = 0; index < AdultsAndRoomsLength; index++) {
                data['AdultsAndRooms'] = [];
                let element = AdultsAndRooms[index];
                data['NextResultReference'] = AdultsAndRooms[index]['NextResultReference'];
                data['AdultsAndRooms'][0] = element;
                let request = JSON.parse(JSON.stringify(data));
                let getHotelServiceAvailability = await this.getHotelMoreAvailability(request);
                let modi = {
                    Request: request,
                    AdultsAndRooms: AdultsAndRooms[index],
                    HotelServiceAvailability: getHotelServiceAvailability['Data']
                };
                console.log(getHotelServiceAvailability);
                getHotelServiceAvailabilityData.push(modi);
            }
            resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', getHotelServiceAvailabilityData));
        });
    }
    async getMultiHotelServiceAvailability(data) {
        return new Promise(async (resolve) => {
            let AdultsAndRooms = data.AdultsAndRooms;
            let AdultsAndRoomsLength = AdultsAndRooms.length;
            let getHotelServiceAvailabilityData = [];
            for (let index = 0; index < AdultsAndRoomsLength; index++) {
                data['AdultsAndRooms'] = [];
                let element = AdultsAndRooms[index];
                data['AdultsAndRooms'][0] = element;
                let request = JSON.parse(JSON.stringify(data));
                let getHotelServiceAvailability = await this.getHotelServiceAvailability(request);
                let modi = {
                    Request: request,
                    AdultsAndRooms: AdultsAndRooms[index],
                    HotelServiceAvailability: getHotelServiceAvailability['Data']
                };
                getHotelServiceAvailabilityData.push(modi);
            }
            resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', getHotelServiceAvailabilityData));
        });
    }
    async getMultiHotelMoreAvailabilityMobile(data) {
        return new Promise(async (resolve) => {
            let AdultsAndRooms = data.AdultsAndRooms;
            let AdultsAndRoomsLength = AdultsAndRooms.length;
            let getHotelServiceAvailabilityData = [];
            for (let index = 0; index < AdultsAndRoomsLength; index++) {
                data['AdultsAndRooms'] = [];
                let element = AdultsAndRooms[index];
                data['NextResultReference'] = AdultsAndRooms[index]['NextResultReference'];
                data['AdultsAndRooms'][0] = element;
                let request = JSON.parse(JSON.stringify(data));
                let getHotelServiceAvailability = await this.getHotelMoreAvailability(request);
                let hotelList = getHotelServiceAvailability['Data']['Hotels'];
                for (let index = 0; index < hotelList.length; index++) {
                    let dataElement = hotelList[index];
                    let mediaLinkChain = hotelList[index]['rawData']['HotelChain'];
                    let mediaLinkHotelCode = hotelList[index]['rawData']['HotelCode'];
                    let imageDataReq = { "TraceId": "8cd78dc5-9210-4195-mobile-121259edd188", "HotelChain": mediaLinkChain, "HotelCode": mediaLinkHotelCode };
                    let imagelinksData = await this.getHotelMediaLinks(imageDataReq);
                    if (imagelinksData['Data']) {
                        hotelList[index]['rawData']['MediaLinks'] = imagelinksData['Data']['MediaLinks'][5];
                    }
                    else {
                        hotelList[index]['rawData']['MediaLinks'] = [];
                    }
                }
                let modi = {
                    Request: request,
                    AdultsAndRooms: AdultsAndRooms[index],
                    HotelServiceAvailability: getHotelServiceAvailability['Data']
                };
                console.log(getHotelServiceAvailability);
                getHotelServiceAvailabilityData.push(modi);
            }
            resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', getHotelServiceAvailabilityData));
        });
    }
    async getHotelServiceAvailabilityMobile(data) {
        return new Promise(async (resolve) => {
            let AdultsAndRooms = data.AdultsAndRooms;
            let AdultsAndRoomsLength = AdultsAndRooms.length;
            let getHotelServiceAvailabilityData = [];
            for (let index = 0; index < AdultsAndRoomsLength; index++) {
                data['AdultsAndRooms'] = [];
                let element = AdultsAndRooms[index];
                data['AdultsAndRooms'][0] = element;
                let request = JSON.parse(JSON.stringify(data));
                let getHotelServiceAvailability = await this.getHotelServiceAvailability(request);
                let hotelList = getHotelServiceAvailability['Data']['Hotels'];
                for (let index = 0; index < hotelList.length; index++) {
                    let dataElement = hotelList[index];
                    let mediaLinkChain = hotelList[index]['rawData']['HotelChain'];
                    let mediaLinkHotelCode = hotelList[index]['rawData']['HotelCode'];
                    let imageDataReq = { "TraceId": "8cd78dc5-9210-4195-mobile-121259edd188", "HotelChain": mediaLinkChain, "HotelCode": mediaLinkHotelCode };
                    let imagelinksData = await this.getHotelMediaLinks(imageDataReq);
                    if (imagelinksData['Data']) {
                        hotelList[index]['rawData']['MediaLinks'] = imagelinksData['Data']['MediaLinks'][5];
                    }
                    else {
                        hotelList[index]['rawData']['MediaLinks'] = [];
                    }
                }
                console.log(getHotelServiceAvailabilityData);
                let modi = {
                    Request: request,
                    AdultsAndRooms: AdultsAndRooms[index],
                    HotelServiceAvailability: getHotelServiceAvailability['Data']
                };
                getHotelServiceAvailabilityData.push(modi);
            }
            resolve(ResponseBuilder_1.ResponseBuilder.successResponse('Data', getHotelServiceAvailabilityData));
        });
    }
    getHotelServiceAvailability(data) {
        let AdultsAndRooms = data.AdultsAndRooms;
        if (AdultsAndRooms === undefined || AdultsAndRooms === null) {
            data.Adults = 1;
            data.Rooms = 1;
            data.Childrens = 0;
        }
        else {
            let AdultsJson = underscore_1._.min(AdultsAndRooms, function (o) { return o.Adults; });
            data.Childrens = AdultsJson.Childrens;
            data.ChildrensAges = AdultsJson.ChildrensAges;
            let values = AdultsAndRooms.map(function (v) { return v.Adults; });
            let MinAdults = Math.min.apply(null, values);
            console.log(MinAdults);
            data.Adults = MinAdults;
            data.Rooms = 1;
        }
        let ChildrensCount = data.Childrens;
        let ageNode = "";
        if (ChildrensCount >= 1) {
            let ChildrensAgesArrayLength = data.ChildrensAges.length;
            for (let index = 0; index < ChildrensAgesArrayLength; index++) {
                ageNode += "<Age>" + data.ChildrensAges[index]['age'] + "</Age>";
            }
            data.Ages = '<NumberOfChildren Count="' + ChildrensCount + '">' + ageNode + '</NumberOfChildren>';
        }
        else {
            data.Ages = '';
        }
        let MaximumRating = data.MaximumRating || 5;
        let MinimumRating = data.MinimumRating || 0;
        console.log(MaximumRating);
        console.log(MinimumRating);
        if (data.MaximumRating || data.MinimumRating) {
            data.Rating = '<HotelRating RatingProvider="AAA"><RatingRange MaximumRating="' + MaximumRating + '" MinimumRating="' + MinimumRating + '"></RatingRange></HotelRating>';
        }
        else {
            data.Rating = '';
        }
        if (data.AvailableHotelsOnly === undefined || data.AvailableHotelsOnly === null) {
            data.AvailableHotelsOnly = true;
        }
        if (data.HotelLoc === undefined) {
            let TraceId = data.TraceId;
            let Base = data.Base;
            let Latitude = data.Latitude;
            let Longitude = data.Longitude;
            let AvailableHotelsOnly = data.AvailableHotelsOnly;
            let To = data.To;
            let From = data.From;
            let Adults = data.Adults;
            let Childrens = data.Childrens;
            let Infants = data.Infants;
            let ChildrenAge = data.ChildrenAge;
            let InfantAge = data.InfantAge;
            let Rooms = data.Rooms;
            let Cribs = data.Cribs;
            let ReferencePoint = data.ReferencePoint;
            let RollawayBeds = data.RollawayBeds;
            let Provider = data.Provider;
            let Ages = data.Ages;
            let createHash = md5(TraceId + Base + AvailableHotelsOnly + MaximumRating + MinimumRating + Ages + Latitude + Longitude + To + From + Adults + Childrens + Infants + ChildrenAge + InfantAge + Rooms + Cribs + ReferencePoint + RollawayBeds + Provider);
            let currentDate = new Date();
            let modiJson = {
                "text": {
                    "Latitude": Latitude,
                    "Longitude": Longitude
                },
                "mode": "latlng",
                "hash": createHash,
                "timeout": currentDate,
                "count": "0",
                "QueryData": data
            };
            console.log(AvailableHotelsOnly);
            return this.hotelRepo.hotelServiceAvailabilityRequest(data, modiJson);
        }
        else {
            let TraceId = data.TraceId;
            let Base = data.Base;
            let HotelLoc = data.HotelLoc;
            let To = data.To;
            let From = data.From;
            let AvailableHotelsOnly = data.AvailableHotelsOnly;
            let Adults = data.Adults;
            let MaximumRating = data.MaximumRating;
            let MinimumRating = data.MinimumRating;
            let Childrens = data.Childrens;
            let Infants = data.Infants;
            let ChildrenAge = data.ChildrenAge;
            let InfantAge = data.InfantAge;
            let Rooms = data.Rooms;
            let Cribs = data.Cribs;
            let ReferencePoint = data.ReferencePoint;
            let RollawayBeds = data.RollawayBeds;
            let Provider = data.Provider;
            let Ages = data.Ages;
            let createHash = md5(TraceId + AvailableHotelsOnly + MaximumRating + MinimumRating + Base + Ages + HotelLoc + To + From + Adults + Childrens + Infants + ChildrenAge + InfantAge + Rooms + Cribs + ReferencePoint + RollawayBeds + Provider);
            let currentDate = new Date();
            let modiJson = {
                "text": HotelLoc,
                "mode": "IATA",
                "hash": createHash,
                "timeout": currentDate,
                "count": "0",
                "QueryData": data
            };
            return this.hotelRepo.hotelServiceAvailabilityRequest(data, modiJson);
        }
    }
    getHotelDetailsAvailability(data) {
        return this.hotelRepo.multiSelectHotelDetails(data, 'web');
    }
    getHotelDetailsAvailabilityMobile(data) {
        return this.hotelRepo.multiSelectHotelDetails(data, 'Mobile');
    }
    keepBiggest(arr) {
        var hash = {};
        arr.forEach(function (o) {
            if (hash[o.name]) {
                if (hash[o.name].weight < o.weight)
                    hash[o.name] = o;
            }
            else
                hash[o.name] = o;
        });
        return Object.keys(hash).map(function (key) {
            return hash[key];
        });
    }
    removeDuplicates(obj) {
        Object.keys(obj).forEach(function (key) {
            obj[key] = this.keepBiggest(obj[key]);
        });
    }
    isEven(number) {
        return number % 2 === 0;
    }
    isOdd(number) {
        return number % 2 !== 0;
    }
    RequestExtarFlow(PlusRequest) {
        let PlusRequestData = JSON.parse(JSON.stringify(PlusRequest));
        let PlusRequestDataLength = PlusRequestData.length;
        console.log(PlusRequestDataLength);
        for (let index = 0; index < PlusRequestDataLength; index++) {
            console.log(PlusRequest[index]['Adults']);
            let AdultsTotalThree = Array();
            if (PlusRequest[index]['Adults'] == 3) {
                let PlusRequestDataThree = JSON.parse(JSON.stringify(PlusRequest));
                for (let index = 0; index < PlusRequestDataThree.length; index++) {
                    AdultsTotalThree.push(PlusRequestDataThree[index]['Adults']);
                }
                let containsone = underscore_1._.contains(AdultsTotalThree, 1);
                if (containsone == false) {
                    let JSON = [{ "Adults": 1, "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }];
                    PlusRequest.push(...JSON);
                }
                let containsTwo = underscore_1._.contains(AdultsTotalThree, 2);
                if (containsTwo == false) {
                    let JSON = [{ "Adults": 2, "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }];
                    PlusRequest.push(...JSON);
                }
            }
            let AdultsTotalFour = Array();
            if (PlusRequest[index]['Adults'] == 4) {
                let PlusRequestDataFour = JSON.parse(JSON.stringify(PlusRequest));
                for (let index = 0; index < PlusRequestDataFour.length; index++) {
                    AdultsTotalFour.push(PlusRequestDataFour[index]['Adults']);
                }
                let containsTwo = underscore_1._.contains(AdultsTotalFour, 2);
                if (containsTwo == false) {
                    let JSON = [{ "Adults": 2, "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }];
                    PlusRequest.push(...JSON);
                }
            }
            let AdultsTotalFive = Array();
            if (PlusRequest[index]['Adults'] == 5) {
                let PlusRequestDataFive = JSON.parse(JSON.stringify(PlusRequest));
                for (let index = 0; index < PlusRequestDataFive.length; index++) {
                    AdultsTotalFive.push(PlusRequestDataFive[index]['Adults']);
                }
                let containsTwo = underscore_1._.contains(AdultsTotalFive, 2);
                if (containsTwo == false) {
                    let JSON = [{ "Adults": 2, "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }];
                    PlusRequest.push(...JSON);
                }
                let containsThree = underscore_1._.contains(AdultsTotalFive, 3);
                if (containsThree == false) {
                    let JSON = [{ "Adults": 3, "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }];
                    PlusRequest.push(...JSON);
                }
            }
        }
        return PlusRequest;
    }
    async consoles(json_data, ParticipationLevel) {
        return new Promise(async (resolve) => {
            let jsonPlusRequestData = JSON.parse(JSON.stringify(json_data));
            let modifyCount = underscore_1._.groupBy(json_data, function (obj) { return obj.Adults; });
            let modifyCountlength = Object.keys(modifyCount);
            let PlusRequest = [];
            let jsonPlusRequestDataLength = jsonPlusRequestData.length;
            if (jsonPlusRequestDataLength == 1) {
                PlusRequest.push(jsonPlusRequestData[0]);
            }
            else {
                for (let index = 0; index < modifyCountlength.length; index++) {
                    let jsonRequest = modifyCount[modifyCountlength[index]];
                    let roomCount = jsonRequest.length;
                    let AdultsJson = underscore_1._.max(jsonRequest, function (o) { return o.Childrens; });
                    AdultsJson['Rooms'] = roomCount;
                    AdultsJson['length'] = roomCount;
                    PlusRequest.push(AdultsJson);
                }
            }
            let AdultsTotal = Array();
            let RoomsTotal = Array();
            let ChildrensTotal = Array();
            let ChildrensAges = [];
            jsonPlusRequestDataLength = jsonPlusRequestData.length;
            if (jsonPlusRequestDataLength > 1) {
                for (let index2 = 0; index2 < jsonPlusRequestData.length; index2++) {
                    AdultsTotal.push(jsonPlusRequestData[index2]['Adults']);
                    RoomsTotal.push(jsonPlusRequestData[index2]['Rooms']);
                    ChildrensTotal.push(jsonPlusRequestData[index2]['Childrens']);
                    ChildrensAges.push(...jsonPlusRequestData[index2]['ChildrensAges']);
                }
                let sumAdultsTotal = AdultsTotal.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0);
                let sumRoomsTotal = RoomsTotal.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0);
                let sumChildrensTotal = ChildrensTotal.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0);
                let totalChildrensAges = ChildrensAges.reduce((acc, item) => acc + item.Age, 0);
                let plus_JSON = [{
                        "Adults": sumAdultsTotal,
                        "Rooms": 1,
                        "Childrens": 1,
                        "ChildrensAges": {
                            "Age": totalChildrensAges
                        }
                    }];
                PlusRequest.push(...plus_JSON);
            }
            let RequestExtarFlow = await this.RequestExtarFlow(PlusRequest);
            console.log(RequestExtarFlow);
            PlusRequest.push(...RequestExtarFlow);
            let m = JSON.parse(JSON.stringify(json_data));
            PlusRequest.push(...m);
            let supportChildren = [];
            let supportChildrenData = JSON.parse(JSON.stringify(PlusRequest));
            let supportChildrenDataLength = supportChildrenData.length;
            for (let index = 0; index < supportChildrenDataLength; index++) {
                let Rooms = parseInt(supportChildrenData[index]['Rooms']);
                let Adults = parseInt(supportChildrenData[index]['Adults']);
                let Childrens = parseInt(supportChildrenData[index]['Childrens']);
                ParticipationLevel = parseInt(ParticipationLevel);
                if (ParticipationLevel == 3 || ParticipationLevel == 4) {
                    supportChildrenData[index]['ModifiedChildrens'] = false;
                    supportChildrenData[index]['ModifiedChildrensValue'] = Childrens;
                    supportChildrenData[index]['ModifiedAdultsValue'] = Adults;
                    supportChildren.push(...supportChildrenData);
                }
                else {
                    let sumAdultsTotal = Adults + Childrens;
                    let plus_JSON = [{
                            "Adults": sumAdultsTotal,
                            "Rooms": Rooms,
                            "Childrens": 0,
                            "ChildrensAges": [],
                            "ModifiedChildrens": true,
                            "ModifiedChildrensValue": Childrens,
                            "ModifiedAdultsValue": Adults
                        }];
                    supportChildren.push(...plus_JSON);
                }
            }
            let supportChildrens = supportChildren.filter((obj, index, self) => index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(obj)));
            resolve(supportChildrens);
        });
    }
    async getHotelMediaLinks(data) {
        let TargetBranch = data.TraceId;
        let HotelChain = data.HotelChain;
        let HotelCode = data.HotelCode;
        let createHash = md5(TargetBranch + HotelChain + HotelCode);
        let currentDate = new Date();
        let modiJson = {
            "hotelCode": HotelCode,
            "hash": createHash,
            "timeout": currentDate,
            "count": "0"
        };
        console.log(modiJson);
        return this.hotelRepo.hotelMediaLinks(data, modiJson);
    }
    async getTermsAndCondition(data) {
        let TraceId = data.TraceId;
        let HotelChain = data.HotelChain;
        let HotelCode = data.HotelCode;
        let HotelLoc = data.HotelLoc;
        let RatePlanType = data.RatePlanType;
        let Base = data.Base;
        let To = data.To;
        let From = data.From;
        let Adults = data.Adults;
        let Rooms = data.Rooms;
        let createHash = md5(TraceId + HotelChain + HotelCode + HotelLoc + RatePlanType + Base + To + From + Adults + Rooms);
        let currentDate = new Date();
        let modiJson = {
            "hotelCode": HotelCode,
            "hash": createHash,
            "timeout": currentDate,
            "count": "0"
        };
        return this.hotelRepo.hotelTermsAndCondition(data, modiJson);
    }
    async getMultiTermsAndCondition(body) {
        return this.hotelRepo.getMultiTermsAndCondition(body);
    }
    async getCityAutoComplete(body) {
        let Search = body.Search;
        return this.hotelRepo.cityAutoComplete(Search);
    }
    async getHotelFilters(body) {
        return this.hotelRepo.hotelFilters(body);
    }
    async popularDestinations(body, ip) {
        return this.hotelRepo.popularDestinations(body, ip);
    }
    async destinationsDeals(body, ip) {
        return this.hotelRepo.destinationsDeals(body, ip);
    }
    async blogs(body) {
        return this.hotelRepo.blogs(body);
    }
    async hotelMultiMediaLinks(body) {
        return this.hotelRepo.http_GetMultiMediaLinks(body);
    }
    async userCurrentlocation(body, ip) {
        return this.hotelRepo.userCurrentLocation(body, ip);
    }
    async multiHotelbooking(body) {
        return new Promise(async (resolve) => {
            if (body.BookingAsGuest == true) {
                let RoomsLength = body.Rooms.length;
                let timestamp = Date.now();
                let PairKey = md5(timestamp);
                let bookingArray = [];
                for (let index = 0; index < RoomsLength; index++) {
                    body['PairKey'] = PairKey;
                    body['HotelRateDetail'] = body.Rooms[index]['HotelRateDetail'];
                    body['GuestInformation'] = body.Rooms[index]['GuestInformation'];
                    let hotelRateDetailGuaranteeType = body.Rooms[index]['HotelRateDetail']['Guarantee']['Type'];
                    let hotelRateDetailGuaranteeKey = body.Rooms[index]['HotelRateDetail']['Guarantee']['Key'];
                    let CreditCardType = body['CreditCard']['Type'];
                    let CreditCardExpDate = body['CreditCard']['ExpDate'];
                    let CreditCardNumber = body['CreditCard']['Number'];
                    let ChildrensCount = body.Rooms[index]['GuestInformation']['NumberOfChildrenCount'];
                    let ChildrensAges = body.Rooms[index]['GuestInformation']['NumberOfChildAge'];
                    let ageNode = "";
                    if (ChildrensCount >= 1) {
                        let ChildrensAgesArrayLength = ChildrensAges.length;
                        for (let index = 0; index < ChildrensAgesArrayLength; index++) {
                            ageNode += "<hotel:Age>" + ChildrensAges[index]['age'] + "</hotel:Age>";
                        }
                        body['NumberOfChildren'] = '<hotel:NumberOfChildren Count="' + ChildrensCount + '">' + ageNode + '</hotel:NumberOfChildren>';
                    }
                    else {
                        body['NumberOfChildren'] = '';
                    }
                    body["Guarantee"] = {
                        "Type": hotelRateDetailGuaranteeType,
                        "Key": hotelRateDetailGuaranteeKey,
                        "CreditCard": {
                            "Type": CreditCardType,
                            "ExpDate": CreditCardExpDate,
                            "Number": CreditCardNumber
                        }
                    };
                    console.log(body);
                    let data_r = await this.hotelRepo.userBooking(body);
                    bookingArray.push(data_r);
                }
                let PerpareEmaildata = JSON.parse(JSON.stringify(bookingArray));
                let PerpareEmaildataLength = PerpareEmaildata.length;
                let BookingTravelerNameEmail = Array();
                let BookingConfirmation = Array();
                let HotelReservationCreateDate = Array();
                let HotelStayCheckinDate = Array();
                let HotelStayCheckoutDate = Array();
                let HotelPropertyName = Array();
                let BookingIds = Array();
                let HotelLocatorCode = Array();
                for (let index = 0; index < PerpareEmaildataLength; index++) {
                    let statusCode = PerpareEmaildata[index]['statusCode'];
                    let Data = PerpareEmaildata[index]['Data'];
                    if (statusCode == 200) {
                        let HotelReservationData = Data['HotelCreateReservationRsp']['HotelReservationData'];
                        let HotelLocatorCodeValue = Data['HotelCreateReservationRsp']['LocatorCode'];
                        let HotelReservationDataLength = HotelReservationData.length;
                        for (let index2 = 0; index2 < HotelReservationDataLength; index2++) {
                            let BookingConfirmationValue = HotelReservationData[index2]['HotelReservation']['BookingConfirmation'];
                            BookingConfirmation.push(BookingConfirmationValue);
                            let HotelPropertyNameValue = HotelReservationData[index2]['HotelProperty']['Name'];
                            ;
                            HotelPropertyName.push(HotelPropertyNameValue);
                            let CreateDateValue = HotelReservationData[index2]['HotelReservation']['CreateDate'];
                            HotelReservationCreateDate.push(CreateDateValue);
                            let CheckinDateValue = HotelReservationData[index2]['HotelStay']['hotel:CheckinDate'][0];
                            HotelStayCheckinDate.push(CheckinDateValue);
                            let CheckoutDateValue = HotelReservationData[index2]['HotelStay']['hotel:CheckoutDate'][0];
                            HotelStayCheckoutDate.push(CheckoutDateValue);
                        }
                        BookingTravelerNameEmail.push(Data['BookingTravelerName']['email']);
                        BookingIds.push(Data['_id']);
                        HotelLocatorCode.push(HotelLocatorCodeValue);
                    }
                    console.log(PerpareEmaildata[index]['Data']);
                }
                if (PerpareEmaildataLength >= 1) {
                    let BookingConfirmationString = BookingConfirmation.join(", ");
                    let BookingIdStrings = BookingIds.join("-");
                    let HotelLocatorCodeStrings = HotelLocatorCode.join("-");
                    await this.emailBookingSend('booking-email', BookingTravelerNameEmail[0], 'Booking Confirmation', BookingConfirmationString, HotelReservationCreateDate[0], HotelPropertyName[0], HotelStayCheckinDate[0], HotelStayCheckoutDate[0], 'http://54.210.36.120/booking-and-trip', 'http://54.210.36.120/email-booking-cancel?LocatorCode=' + HotelLocatorCodeStrings + '&ids=' + BookingIdStrings, 'http://54.210.36.120/email-booking-cancel?LocatorCode=' + HotelLocatorCodeStrings + '&ids=' + BookingIdStrings);
                }
                resolve(bookingArray);
            }
            else {
                if (body.UserID === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
                }
                else if (body.ActiveSession === undefined) {
                    resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
                }
                else {
                    let RoomsLength = body.Rooms.length;
                    let timestamp = Date.now();
                    let PairKey = md5(timestamp);
                    let bookingArray = [];
                    for (let index = 0; index < RoomsLength; index++) {
                        body['PairKey'] = PairKey;
                        body['HotelRateDetail'] = body.Rooms[index]['HotelRateDetail'];
                        body['GuestInformation'] = body.Rooms[index]['GuestInformation'];
                        let hotelRateDetailGuaranteeType = body.Rooms[index]['HotelRateDetail']['Guarantee']['Type'];
                        let hotelRateDetailGuaranteeKey = body.Rooms[index]['HotelRateDetail']['Guarantee']['Key'];
                        let CreditCardType = body['CreditCard']['Type'];
                        let CreditCardExpDate = body['CreditCard']['ExpDate'];
                        let CreditCardNumber = body['CreditCard']['Number'];
                        body["Guarantee"] = {
                            "Type": hotelRateDetailGuaranteeType,
                            "Key": hotelRateDetailGuaranteeKey,
                            "CreditCard": {
                                "Type": CreditCardType,
                                "ExpDate": CreditCardExpDate,
                                "Number": CreditCardNumber
                            }
                        };
                        console.log(body);
                        let data_r = await this.hotelRepo.userBooking(body);
                        bookingArray.push(data_r);
                    }
                    let PerpareEmaildata = JSON.parse(JSON.stringify(bookingArray));
                    let PerpareEmaildataLength = PerpareEmaildata.length;
                    let BookingTravelerNameEmail = Array();
                    let BookingConfirmation = Array();
                    let HotelReservationCreateDate = Array();
                    let HotelStayCheckinDate = Array();
                    let HotelStayCheckoutDate = Array();
                    let HotelPropertyName = Array();
                    let BookingIds = Array();
                    let HotelLocatorCode = Array();
                    for (let index = 0; index < PerpareEmaildataLength; index++) {
                        let statusCode = PerpareEmaildata[index]['statusCode'];
                        let Data = PerpareEmaildata[index]['Data'];
                        if (statusCode == 200) {
                            let HotelReservationData = Data['HotelCreateReservationRsp']['HotelReservationData'];
                            let HotelLocatorCodeValue = Data['HotelCreateReservationRsp']['LocatorCode'];
                            let HotelReservationDataLength = HotelReservationData.length;
                            for (let index2 = 0; index2 < HotelReservationDataLength; index2++) {
                                let BookingConfirmationValue = HotelReservationData[index2]['HotelReservation']['BookingConfirmation'];
                                BookingConfirmation.push(BookingConfirmationValue);
                                let HotelPropertyNameValue = HotelReservationData[index2]['HotelProperty']['Name'];
                                ;
                                HotelPropertyName.push(HotelPropertyNameValue);
                                let CreateDateValue = HotelReservationData[index2]['HotelReservation']['CreateDate'];
                                HotelReservationCreateDate.push(CreateDateValue);
                                let CheckinDateValue = HotelReservationData[index2]['HotelStay']['hotel:CheckinDate'][0];
                                HotelStayCheckinDate.push(CheckinDateValue);
                                let CheckoutDateValue = HotelReservationData[index2]['HotelStay']['hotel:CheckoutDate'][0];
                                HotelStayCheckoutDate.push(CheckoutDateValue);
                            }
                            BookingTravelerNameEmail.push(Data['BookingTravelerName']['email']);
                            BookingIds.push(Data['_id']);
                            HotelLocatorCode.push(HotelLocatorCodeValue);
                        }
                        console.log(PerpareEmaildata[index]['Data']);
                    }
                    if (PerpareEmaildataLength >= 1) {
                        let BookingConfirmationString = BookingConfirmation.join(", ");
                        let BookingIdStrings = BookingIds.join("-");
                        let HotelLocatorCodeStrings = HotelLocatorCode.join("-");
                        await this.emailBookingSend('booking-email', BookingTravelerNameEmail[0], 'Booking Confirmation', BookingConfirmationString, HotelReservationCreateDate[0], HotelPropertyName[0], HotelStayCheckinDate[0], HotelStayCheckoutDate[0], 'http://54.210.36.120/booking-and-trip', 'http://54.210.36.120/email-booking-detail?LocatorCode=' + HotelLocatorCodeStrings + '&ids=' + BookingIdStrings, 'http://54.210.36.120/email-booking-detail?LocatorCode=' + HotelLocatorCodeStrings + '&ids=' + BookingIdStrings);
                    }
                    resolve(bookingArray);
                }
            }
        });
    }
    async userBooking(body) {
        return new Promise(async (resolve) => {
            let timestamp = Date.now();
            let PairKey = md5(timestamp);
            body['PairKey'] = PairKey;
            if (body.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (body.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = await this.hotelRepo.userBooking(body);
                resolve(data_r);
            }
        });
    }
    async userReviews(body) {
        return this.hotelRepo.userReviews(body);
    }
    SearchByIataCode(body) {
        return new Promise(async (resolve) => {
            let data_r = await this.hotelRepo.SearchByIataCode(body);
            resolve(data_r);
        });
    }
    async multibookingcancel(body) {
        return new Promise(async (resolve) => {
            if (body.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (body.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let LocatorCodeList = body.LocatorCodeList.length;
                let data_r = [];
                for (let index = 0; index < LocatorCodeList; index++) {
                    let code = body.LocatorCodeList[index]['Code'];
                    body['LocatorCode'] = code;
                    let data = await this.hotelRepo.bookingCancel(body);
                    data_r.push(data);
                }
                let emailcancelData = JSON.parse(JSON.stringify(data_r));
                let emailcancelDataLength = emailcancelData.length;
                let emailcancelinfo = Array();
                let sendemail = false;
                console.log(emailcancelData);
                for (let index = 0; index < emailcancelDataLength; index++) {
                    if (emailcancelData[index]['statusCode'] == 400) {
                        sendemail = false;
                    }
                    else {
                        let RemarkData = emailcancelData[index]['Data']['GeneralRemark'];
                        sendemail = true;
                        for (let index2 = 0; index2 < RemarkData.length; index2++) {
                            let GeneralRemark = RemarkData[index2]['RemarkData'];
                            emailcancelinfo.push(GeneralRemark);
                        }
                    }
                }
                if (sendemail) {
                    let emailcancelinfoString = emailcancelinfo.join('\r\n');
                    await this.emailBookingCancelSend('booking-cancel', body.Email, 'Booking Cancelation Confirmation', emailcancelinfoString);
                }
                resolve(data_r);
            }
        });
    }
    async bookingCancel(body) {
        return new Promise(async (resolve) => {
            if (body.UserID === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'UserID is required.'));
            }
            else if (body.ActiveSession === undefined) {
                resolve(ResponseBuilder_1.ResponseBuilder.errorResponse('message', 'ActiveSession is required.'));
            }
            else {
                let data_r = this.hotelRepo.bookingCancel(body);
                resolve(data_r);
            }
        });
    }
    async userBookingDetails(body) {
        return new Promise(async (resolve) => {
            let data_r = this.hotelRepo.userBookingDetails(body);
            resolve(data_r);
        });
    }
    async SearchByfilters(body) {
        return new Promise(async (resolve) => {
            console.log('Filters');
            let data_r = this.hotelRepo.SearchByfilters(body);
            resolve(data_r);
        });
    }
    async Syncfilterdata(body) {
        return new Promise(async (resolve) => {
            let data_r = this.hotelRepo.Syncfilterdata(body);
            resolve(data_r);
        });
    }
};
HotelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hotel_repo_1.HotelRepo])
], HotelService);
exports.HotelService = HotelService;
//# sourceMappingURL=hotel.service.js.map