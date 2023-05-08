import { Injectable, Inject } from '@nestjs/common';
import { ResponseBuilder } from "../../utils/ResponseBuilder";
import axios from "axios";
import { replace } from 'replace-xml-text';
let  parseString = require('xml2js').parseString;
let fs = require('fs');
import { MongoDatabase } from "../../database/mongodb";
import { raw } from "express";
import { ObjectId } from "mongodb";
let  md5 = require('md5');
const mailgun = require("mailgun-js");
import { _ } from "underscore";

@Injectable()
export class UsersRepo {


  constructor(private readonly mongodb: MongoDatabase) {}

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

  public async SignUp(data): Promise<any> {

    let dataValues = data;
    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      try {

        if(dataValues.AthuBy == "email") {

          let accountFindData = await this.mongodb.findAccountUsersDocument({ "Email": { $eq: dataValues.Email },  "AthuBy": { $eq: dataValues.AthuBy }  });
          let accountFindDataLength = accountFindData.length

          if (accountFindDataLength == 0) {

            dataValues['ActiveSession'] = md5(dataValues.Email);

            await this.mongodb.newAccountUsersDocument(dataValues);

            let accountFindData = await this.mongodb.findAccountUsersDocument({ "Email": { $eq: dataValues.Email },  "AthuBy": { $eq: dataValues.AthuBy }  });

            let _id = accountFindData[0]._id
            let ActiveSession = accountFindData[0].ActiveSession

            // Email for Signup
            await this.EmailSend('ifanhomesignup', dataValues.Email, 'Welcome to Ifancyahotel', 'http://54.210.36.120/email-verify?id='+_id+"&ActiveSession="+ActiveSession);

            resolve(ResponseBuilder.successResponse('Data', accountFindData[0]));

          } else {
            resolve(ResponseBuilder.errorResponse('message', "User with:" + dataValues.Email + " already exists"));
          }

        }
        else if(dataValues.AthuBy == "facebook") {

          let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash },  "AthuBy": { $eq: dataValues.AthuBy }  });
          let accountFindDataLength = accountFindData.length

          if (accountFindDataLength == 0) {

            dataValues['ActiveSession'] = md5(dataValues.hash);

            await this.mongodb.newAccountUsersDocument(dataValues);

            let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash },  "AthuBy": { $eq: dataValues.AthuBy }  });

            resolve(ResponseBuilder.successResponse('Data', accountFindData[0]));

          } else {
            resolve(ResponseBuilder.errorResponse('message', "User with:" + dataValues.hash + " already exists"));
          }

        }
        else if(dataValues.AthuBy == "google") {

          let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash },  "AthuBy": { $eq: dataValues.AthuBy }  });
          let accountFindDataLength = accountFindData.length

          if (accountFindDataLength == 0) {

            dataValues['ActiveSession'] = md5(dataValues.hash);

            await this.mongodb.newAccountUsersDocument(dataValues);

            let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash },  "AthuBy": { $eq: dataValues.AthuBy }  });

            resolve(ResponseBuilder.successResponse('Data', accountFindData[0]));

          } else {
            resolve(ResponseBuilder.errorResponse('message', "User with:" + dataValues.hash + " already exists"));
          }

        }

      } catch (e) {
        console.log('Error:', e.stack);
      }

    });

  }

  async SignIn(data) {

    let dataValues = data;
    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      if(dataValues.AthuBy == "email"){

        let accountFindData = await this.mongodb.findAccountUsersDocument({ "Email": { $eq: dataValues.Email }, "Passwd": { $eq: dataValues.Passwd }});
        let accountFindDataLength = accountFindData.length

        if(accountFindDataLength == 1){

          let ActiveSession = md5(dataValues.Email);
          accountFindData[0]['ActiveSession'] = ActiveSession;
          await this.mongodb.updateAccountUsersDocument({ "Email": { $eq: dataValues.Email }}, { $set: accountFindData[0] });
          let accountFindData_1 = await this.mongodb.findAccountUsersDocument({ "Email": { $eq: dataValues.Email }, "Passwd": { $eq: dataValues.Passwd }});

          resolve(ResponseBuilder.successResponse('Data',  accountFindData_1[0]));

        }
        else {
          resolve(ResponseBuilder.errorResponse('message', "Password not match. Check your Password"));
        }

      }
      else if(dataValues.AthuBy == "facebook") {

        let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy } });
        let accountFindDataLength = accountFindData.length

        if(accountFindDataLength == 1){

          let ActiveSession = md5(dataValues.hash);
          accountFindData[0]['ActiveSession'] = ActiveSession;
          await this.mongodb.updateAccountUsersDocument({ "hash": { $eq: dataValues.hash }}, { $set: accountFindData[0] });
          let accountFindData_1 = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy} });

          resolve(ResponseBuilder.successResponse('Data',  accountFindData_1[0]));

        }
        else {
          resolve(ResponseBuilder.errorResponse('message', "User with this facebook hash:" + dataValues.hash + "facebook not exists"));
        }

      }
      else if(dataValues.AthuBy == "google") {

        let accountFindData = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy}});
        let accountFindDataLength = accountFindData.length

        console.log(accountFindData);

        if(accountFindDataLength == 1){

          let ActiveSession = md5(dataValues.hash);
          accountFindData[0]['ActiveSession'] = ActiveSession;
          await this.mongodb.updateAccountUsersDocument({ "hash": { $eq: dataValues.hash }}, { $set: accountFindData[0] });
          let accountFindData_1 = await this.mongodb.findAccountUsersDocument({ "hash": { $eq: dataValues.hash }, "AthuBy": { $eq: dataValues.AthuBy}});

          resolve(ResponseBuilder.successResponse('Data',  accountFindData_1[0]));

        }
        else {
          resolve(ResponseBuilder.errorResponse('message', "User with this Google hash:" + dataValues.hash + "facebook not exists"));
        }

      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "AthuBy parameter Missing"));
      }



    })

  }


  async MyTrips(data: any) {
    let dataValues = data;
    await this.mongodb.connect();
    return new Promise(async (resolve) => {
        let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
        let accountFindDataLength = accountFindData.length;
        if (accountFindDataLength == 1) {
            let allBookings = await this.mongodb.findHotelBookingDocument({ "UserID": { $eq: dataValues.UserID } });

          
            for (let index = 0; index < allBookings.length; index++) {

                let BookingElement = allBookings[index];
                
                BookingElement['_id'];

                if(BookingElement['HotelCreateReservationRsp']['HotelReservationData'])
                {

                  let HotelReservationData = BookingElement['HotelCreateReservationRsp']['HotelReservationData'];
                  let HotelReservationDataLength = HotelReservationData.length;

                  if(HotelReservationDataLength <= 1)
                  {
                    

                    let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                    let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                    let checkoutDate = hotelCheckoutDate[0];
                    let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                    BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Active";
                    if (BookingIsInThePast) {
                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Completed";
                    }
                    let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                    let CancelBookingLength = CancelBooking.length;
                    if (CancelBookingLength == 1) {
                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Cancelled";
                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['CancelData'] = CancelBooking[0];
                    }

                  }
                  else
                  {

                      for (let index = 0; index < HotelReservationDataLength; index++) {

                        let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                        let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['HotelStay']['hotel:CheckoutDate'];
                        let checkoutDate = hotelCheckoutDate[0];
                        let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Active";
                        if (BookingIsInThePast) {
                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Completed";
                        }
                        let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                        let CancelBookingLength = CancelBooking.length;
                        if (CancelBookingLength == 1) {
                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Cancelled";
                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['CancelData'] = CancelBooking[0];
                        }
                        
                      }

                  }



                }
                else
                {

                  let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                  let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                  let checkoutDate = hotelCheckoutDate[0];
                  let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                  BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Active";
                  if (BookingIsInThePast) {
                      BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                  }
                  let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                  let CancelBookingLength = CancelBooking.length;
                  if (CancelBookingLength == 1) {
                      BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                      BookingElement['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                  }
                  
                }

              }


              let PairData = [];
              let isPairData = []
              
              for (let index = 0; index < allBookings.length; index++) {

                //_.contains(['aaa', 'bbb', 'cfp', 'ddd'], 'bar')
                //_.find(buttons, function (button) { return 'join' in button })

                let PairKey = allBookings[index]['PairKey'];

                let contains = _.contains(isPairData, PairKey);
                
                if(contains == true){

                }
                else
                {

                  if(PairKey){

                    let pair = await this.mongodb.findHotelBookingDocument({ "PairKey": { $eq: PairKey } });


                    for (let index = 0; index < pair.length; index++) {

                      let BookingElement = pair[index];
                      
                      BookingElement['_id'];
      
                      if(BookingElement['HotelCreateReservationRsp']['HotelReservationData'])
                      {
      
                        let HotelReservationData = BookingElement['HotelCreateReservationRsp']['HotelReservationData'];
                        let HotelReservationDataLength = HotelReservationData.length;
      
                        if(HotelReservationDataLength <= 1)
                        {
                          
      
                          let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                          let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                          let checkoutDate = hotelCheckoutDate[0];
                          let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                          BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Active";
                          if (BookingIsInThePast) {
                              BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Completed";
                          }
                          let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                          let CancelBookingLength = CancelBooking.length;
                          if (CancelBookingLength == 1) {
                              BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Cancelled";
                              BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['CancelData'] = CancelBooking[0];
                          }
      
                        }
                        else
                        {
      
                            for (let index = 0; index < HotelReservationDataLength; index++) {
      
                              let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                              let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['HotelStay']['hotel:CheckoutDate'];
                              let checkoutDate = hotelCheckoutDate[0];
                              let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                              BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Active";
                              if (BookingIsInThePast) {
                                  BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Completed";
                              }
                              let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                              let CancelBookingLength = CancelBooking.length;
                              if (CancelBookingLength == 1) {
                                  BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Cancelled";
                                  BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['CancelData'] = CancelBooking[0];
                              }
                              
                            }
      
                        }
      
      
      
                      }
                      else
                      {
      
                        let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                        let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                        let checkoutDate = hotelCheckoutDate[0];
                        let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                        BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Active";
                        if (BookingIsInThePast) {
                            BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                        }
                        let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                        let CancelBookingLength = CancelBooking.length;
                        if (CancelBookingLength == 1) {
                            BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                            BookingElement['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                        }
                        
                      }
      
                    }
      
                    PairData.push({pair});

                  }
                  else
                  {
                    let pair = [];
                     pair[0] = allBookings[index];
                    PairData.push({pair});
                  
                  }

                }

                
                
              }






            resolve(ResponseBuilder.successResponse('Data', PairData));
        }
        else {
            resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
        }
    });
  }

  async MyTripsMobile(data: any) {
      let dataValues = data;
      await this.mongodb.connect();
      return new Promise(async (resolve) => {

          let PairData = [];
       

      let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
      let accountFindDataLength = accountFindData.length;
      if (accountFindDataLength == 1) {
        
      
          if(data.Type == "Past"){
          
            let allBookings = await this.mongodb.findHotelBookingDocument({ 'UserID': { $eq: data.UserID } });
          
            for (let index = 0; index < allBookings.length; index++) {


                let LocatorCode = allBookings[index]['HotelCreateReservationRsp']['LocatorCode'];

                let hotelCheckoutDate;
                if(allBookings[index]['HotelCreateReservationRsp']['HotelStay'])
                {
                  hotelCheckoutDate = allBookings[index]['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                }
                else
                {
                  hotelCheckoutDate = allBookings[index]['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                }


                let checkoutDate = hotelCheckoutDate[0];
                let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                allBookings[index]['HotelCreateReservationRsp']['StatsCode'] = "Active";
                if (BookingIsInThePast) {
                  allBookings[index]['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                }
                let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                let CancelBookingLength = CancelBooking.length;
                if (CancelBookingLength == 1) {
                  allBookings[index]['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                  allBookings[index]['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                }
            
            }

            resolve(ResponseBuilder.successResponse('Data', allBookings));
          
          }
          else if(data.Type == "Cancelled")
          {

            let CancelBooking: any = await this.mongodb.findCancelBooking({ 'UserID': { $eq: data.UserID } });

            for (let index = 0; index < CancelBooking.length; index++) {

              let LocatorCode = CancelBooking[index]['LocatorCode'];

              let allBookings = await this.mongodb.findHotelBookingDocument({ "HotelCreateReservationRsp.LocatorCode" : LocatorCode });
              CancelBooking[index]['Booking'] = allBookings[0]
            
            }

            resolve(ResponseBuilder.successResponse('Data', CancelBooking));

          }
          else {

            let allBookings = await this.mongodb.findHotelBookingDocument({ "UserID": { $eq: dataValues.UserID } });
            for (let index = 0; index < allBookings.length; index++) {

              let BookingElement = allBookings[index];
              
              BookingElement['_id'];

              if(BookingElement['HotelCreateReservationRsp']['HotelReservationData'])
              {

                let HotelReservationData = BookingElement['HotelCreateReservationRsp']['HotelReservationData'];
                let HotelReservationDataLength = HotelReservationData.length;

                if(HotelReservationDataLength <= 1)
                {
                  

                  let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                  let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                  let checkoutDate = hotelCheckoutDate[0];
                  let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                  BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Active";
                  if (BookingIsInThePast) {
                      BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Completed";
                  }
                  let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                  let CancelBookingLength = CancelBooking.length;
                  if (CancelBookingLength == 1) {
                      BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Cancelled";
                      BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['CancelData'] = CancelBooking[0];
                  }

                }
                else
                {

                    for (let index = 0; index < HotelReservationDataLength; index++) {

                      let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                      let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['HotelStay']['hotel:CheckoutDate'];
                      let checkoutDate = hotelCheckoutDate[0];
                      let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                      BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Active";
                      if (BookingIsInThePast) {
                          BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Completed";
                      }
                      let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                      let CancelBookingLength = CancelBooking.length;
                      if (CancelBookingLength == 1) {
                          BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Cancelled";
                          BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['CancelData'] = CancelBooking[0];
                      }
                      
                    }

                }



              }
              else
              {

                let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                let checkoutDate = hotelCheckoutDate[0];
                let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Active";
                if (BookingIsInThePast) {
                    BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                }
                let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                let CancelBookingLength = CancelBooking.length;
                if (CancelBookingLength == 1) {
                    BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                    BookingElement['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                }
                
              }

            }

            let PairData = [];
            let isPairData = []
          
            for (let index = 0; index < allBookings.length; index++) {

              //_.contains(['aaa', 'bbb', 'cfp', 'ddd'], 'bar')
              //_.find(buttons, function (button) { return 'join' in button })

              let PairKey = allBookings[index]['PairKey'];

              let contains = _.contains(isPairData, PairKey);
              
              if(contains == true){

              }
              else
              {

                if(PairKey){

                  let pair = await this.mongodb.findHotelBookingDocument({ "PairKey": { $eq: PairKey } });


                  for (let index = 0; index < pair.length; index++) {

                    let BookingElement = pair[index];
                    
                    BookingElement['_id'];

                    if(BookingElement['HotelCreateReservationRsp']['HotelReservationData'])
                    {

                      let HotelReservationData = BookingElement['HotelCreateReservationRsp']['HotelReservationData'];
                      let HotelReservationDataLength = HotelReservationData.length;

                      if(HotelReservationDataLength <= 1)
                      {
                        

                        let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                        let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['HotelStay']['hotel:CheckoutDate'];
                        let checkoutDate = hotelCheckoutDate[0];
                        let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                        BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Active";
                        if (BookingIsInThePast) {
                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Completed";
                        }
                        let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                        let CancelBookingLength = CancelBooking.length;
                        if (CancelBookingLength == 1) {
                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['StatsCode'] = "Cancelled";
                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][0]['CancelData'] = CancelBooking[0];
                        }

                      }
                      else
                      {

                          for (let index = 0; index < HotelReservationDataLength; index++) {

                            let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                            let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['HotelStay']['hotel:CheckoutDate'];
                            let checkoutDate = hotelCheckoutDate[0];
                            let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                            BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Active";
                            if (BookingIsInThePast) {
                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Completed";
                            }
                            let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                            let CancelBookingLength = CancelBooking.length;
                            if (CancelBookingLength == 1) {
                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['StatsCode'] = "Cancelled";
                                BookingElement['HotelCreateReservationRsp']['HotelReservationData'][index]['CancelData'] = CancelBooking[0];
                            }
                            
                          }

                      }



                    }
                    else
                    {

                      let LocatorCode = BookingElement['HotelCreateReservationRsp']['LocatorCode'];
                      let hotelCheckoutDate = BookingElement['HotelCreateReservationRsp']['HotelStay']['hotel:CheckoutDate'];
                      let checkoutDate = hotelCheckoutDate[0];
                      let BookingIsInThePast = await this.isInThePast(new Date(checkoutDate));
                      BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Active";
                      if (BookingIsInThePast) {
                          BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Completed";
                      }
                      let CancelBooking: any = await this.mongodb.findCancelBooking({ 'LocatorCode': { $eq: LocatorCode } });
                      let CancelBookingLength = CancelBooking.length;
                      if (CancelBookingLength == 1) {
                          BookingElement['HotelCreateReservationRsp']['StatsCode'] = "Cancelled";
                          BookingElement['HotelCreateReservationRsp']['CancelData'] = CancelBooking[0];
                      }
                      
                    }

                  }

                  PairData.push({pair});

                }
                else
                {
                  let pair = [];
                    pair[0] = allBookings[index];
                  PairData.push({pair});
                
                }

              }

              
              
            }

            resolve(ResponseBuilder.successResponse('Data', PairData));

          }

      }
      else 
      {
          resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
      }



    });
  }


  public async mytripscancellation(data) {
    let dataValues = data;
    await this.mongodb.connect();
    return new Promise(async (resolve) => {
        let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession } });
        let accountFindDataLength = accountFindData.length;
        if (accountFindDataLength == 1) {
            let allCancelBooking = await this.mongodb.findCancelBooking({ "UserID": { $eq: dataValues.UserID } });
            resolve(ResponseBuilder.successResponse('Data', allCancelBooking));
        }
        else {
            resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
        }
    });
}

  public async Preferences(body: any) {

    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession }});

      let accountFindDataLength = accountFindData.length

      if(accountFindDataLength == 1){

        accountFindData[0]['Preferences'] = body.Preferences;

        let userID = accountFindData[0]._id;
        await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new ObjectId(userID) }}, { $set: accountFindData[0] });
        let freshData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession }});

        resolve(freshData[0]);

      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
      }


    });

  }

  public async PersonalDetails(body: any) {

    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession }});

      let accountFindDataLength = accountFindData.length

      if(accountFindDataLength == 1){


        accountFindData[0]['PersonalDetails'] = body.PersonalDetails;

        let userID = accountFindData[0]._id;
        await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new ObjectId(userID) }}, { $set: accountFindData[0] });
        let freshData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession }});

        resolve(freshData[0]);

      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
      }



    });

  }

  public async PaymentDetails(body: any) {

    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession }});

      let accountFindDataLength = accountFindData.length

      if(accountFindDataLength == 1){

        accountFindData[0]['PaymentDetails'] = body.PaymentDetails;

        let userID = accountFindData[0]._id;
        await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new ObjectId(userID) }}, { $set: accountFindData[0] });
        let freshData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession }});

        resolve(freshData[0]);

      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
      }


    });

  }

  public async EmailSend(template, to, subject, Link) {
    return new Promise(async (resolve) => {


      const DOMAIN = "marketing.ifancyahotel.com";
      const mg = mailgun({apiKey: "403dca0d87cf2f18354079fa46d4f26b-15b35dee-f15a4d69", domain: DOMAIN});
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


      resolve(ResponseBuilder.successResponse('message', 'Sent' ));


      /*
      const DOMAIN = "sandbox546ce4ccab8146bfb2e0f05776916ca3.mailgun.org";
      const mg = mailgun({apiKey: "38d84e23f4bea8ed9b0262819875f811-48c092ba-132b0890", domain: DOMAIN});
      const data = {
        from: "Mailgun Sandbox <postmaster@sandbox546ce4ccab8146bfb2e0f05776916ca3.mailgun.org>",
        to: to,
        subject: subject,
        template: "ifanhomesignup",
        'h:X-Mailgun-Variables': {email: to, ConfirmLink: Link}
      };

      mg.messages().send(data, function (error, body) {
        console.log(body);
      });

      resolve(ResponseBuilder.successResponse('message', 'Sent' ));
      */

    })
  }

  public async UserReadyOnly(data: any) {
    let dataValues = data;
    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession }});

      let accountFindDataLength = accountFindData.length

      if(accountFindDataLength == 1){

        resolve(ResponseBuilder.successResponse('Data',  accountFindData[0]));
      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
      }


    })
  }


  async UpdatePassword(data: any) {
    let dataValues = data;
    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession }});

      let accountFindDataLength = accountFindData.length

      if(accountFindDataLength == 1){

        let CurrentPassword = accountFindData[0].Passwd

        if(CurrentPassword == data.CurrentPassword) {

          accountFindData[0]['Passwd'] = data.NewPassword;
          await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new ObjectId(data.UserID) } }, { $set: accountFindData[0] });
          resolve(ResponseBuilder.successResponse('Data', accountFindData[0]));
        }
        else
        {
          resolve(ResponseBuilder.errorResponse('message', "Current Password not Matched"));
        }


      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
      }

    })
  }

  async forgotPassword(body: any) {

    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({
        "Email": { $eq: body.Email }
      });

      let accountFindDataLength = accountFindData.length

      if (accountFindDataLength == 1) {

        let _id = accountFindData[0]._id
        let ActiveSession = accountFindData[0].ActiveSession

        // Email for Signup
        await this.EmailSend('verifyemail', body.Email, 'Verify your email address', 'http://54.210.36.120/reset-password?id='+_id+"&ActiveSession="+ActiveSession);

        resolve(ResponseBuilder.successResponse('message', "Email Sent"));

      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "No Account Found"));
      }

    });


  }

  async ForgotUpdatePassword(body: any) {
    let dataValues = body;
    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession }});

      let accountFindDataLength = accountFindData.length

      if(accountFindDataLength == 1){

        accountFindData[0]['Passwd'] = body.NewPassword;
        await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) } }, { $set: accountFindData[0] });
        resolve(ResponseBuilder.successResponse('Message', 'Updated'));

      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
      }

    })
  }

  async verifyEmail(body: any) {
    let dataValues = body;
    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(dataValues.UserID) }, "ActiveSession": { $eq: dataValues.ActiveSession }});

      let accountFindDataLength = accountFindData.length

      if(accountFindDataLength == 1){


        accountFindData[0]['verifyEmail'] = true;

        let userID = accountFindData[0]._id;
        await this.mongodb.updateAccountUsersDocument({ _id: { $eq: new ObjectId(userID) }}, { $set: accountFindData[0] });
        await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession }});

        resolve(ResponseBuilder.successResponse('Message', 'Updated'));

      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
      }


    })
  }

  async Resetemailverify(body: any) {
    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findAccountUsersDocument({
        "Email": { $eq: body.Email }
      });

      let accountFindDataLength = accountFindData.length

      if (accountFindDataLength == 1) {

        let _id = accountFindData[0]._id
        let ActiveSession = accountFindData[0].ActiveSession

        // Email for Signup
        await this.EmailSend('ifanhomesignup', body.Email, 'Welcome to ifancyahotel', 'http://54.210.36.120/email-verify?id='+_id+"&ActiveSession="+ActiveSession);

        resolve(ResponseBuilder.successResponse('message', "Email Sent"));

      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "No Account Found"));
      }

    });
  }
}
