import { Inject, Injectable } from "@nestjs/common";
import { MongoDatabase } from "../../database/mongodb";
let fs = require('fs')
import axios from "axios";
import { response } from "express";
let parseString = require('xml2js').parseString;
let path = require('path');
import { ResponseBuilder } from '../../utils/ResponseBuilder'
import { AmazonSDK } from "../../utils/amazon-sdk";
import { ObjectId } from "mongodb";
import { audit } from "rxjs";
import { resolve } from "path";
const mailgun = require("mailgun-js");
let md5 = require('md5');
var stringSimilarity = require("string-similarity");
import { _ } from "underscore";
import { emitKeypressEvents } from "readline";
import { AnyAaaaRecord } from "dns";
const { Client } = require('@elastic/elasticsearch')

@Injectable()
export class HotelRepo {

  @Inject(AmazonSDK)
  public amazon: AmazonSDK;

  public config: { get: (arg0: string) => any; }

  constructor(private readonly mongodb: MongoDatabase) {}


  async timeAgo(input): Promise<number> {

      const date = (input instanceof Date) ? input : new Date(input);
      const secondsElapsed = (date.getTime() - Date.now()) / 1000 / 60;
      let sE = Math.round(secondsElapsed);
      if (sE < 0) {
        sE = sE * -1;
      }
      return sE;

  }

  public async fillDatesTandC(HotelRateByDate){
    return new Promise(async (resolve) => {

      let HotelRateByDateLength = HotelRateByDate.length

      let HotelRateByDateLengthIndex = HotelRateByDateLength-1;
  
      let start_date = new Date(HotelRateByDate[0]['EffectiveDate']);
      let end_date = new Date(HotelRateByDate[HotelRateByDateLengthIndex]['ExpireDate']);
  
      let DifferenceInTime = end_date.getTime() - start_date.getTime();
      let DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
  
      let modifyData = [];
  
      console.log('imran');
      console.log(DifferenceInDays);
  
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
      for (let index = 0; index < DifferenceInDays; index++) {
        
        let start_date = new Date(HotelRateByDate[0]['EffectiveDate']);
        let start_todayDate = start_date.setDate(start_date.getDate() + index);      
        let start_toLocaleDateString = new Date(start_todayDate);
        let start_modify_date = days[start_toLocaleDateString.getDay()]+', '+start_toLocaleDateString.getDate()+' '+months[start_toLocaleDateString.getMonth()]+', '+start_toLocaleDateString.getFullYear();
  
        
        let month = start_toLocaleDateString.getMonth() + 1;
        let month_c
        if(month > 9){ month_c = month; } else { month_c = '0'+month; }
  
        let conditionCheckPoint = start_toLocaleDateString.getFullYear()+'-'+month_c+'-'+start_toLocaleDateString.getDate();
  
        //console.log(conditionCheckPoint);
  
        let end_date = new Date(start_todayDate);
        let end_todayDate = end_date.setDate(end_date.getDate() + 1);      
        let end_toLocaleDateString = new Date(end_todayDate);
        let end_modify_date = days[end_toLocaleDateString.getDay()]+', '+end_toLocaleDateString.getDate()+' '+months[end_toLocaleDateString.getMonth()]+', '+end_toLocaleDateString.getFullYear();
       
        let data = {
          "start_date": start_modify_date,
          "end_date": end_modify_date,
          "checkPoint": conditionCheckPoint,
        }
  
        modifyData.push(data)
      }
  
      let modifyDataLength = modifyData.length;
  
      console.log(modifyDataLength);
  
  
      let ProxesData = [];
      let keyvalue = {};
      let fillCleanArray = []
  
      for(let mainIndex = 0; mainIndex < HotelRateByDateLength; mainIndex++){
        
        let EffectiveDate = HotelRateByDate[mainIndex]['EffectiveDate'];
  
        let addIndex = mainIndex+1
        let EffectiveNextDate
  
        if(addIndex >= HotelRateByDateLength){
          EffectiveNextDate = 'nodate';
        }
        else
        {
          EffectiveNextDate = HotelRateByDate[mainIndex+1]['EffectiveDate'];
        }
  
        let Base = HotelRateByDate[mainIndex]['Base'];
  
        for (let index = 0; index < modifyDataLength; index++) {
  
          let start_date = modifyData[index]['start_date'];
          let end_date = modifyData[index]['end_date'];
          let checkPoint = modifyData[index]['checkPoint']
  
  
  
          console.log({checkPoint})
        
          if (EffectiveNextDate == 'nodate'){
            
            console.log('!= Index:'+index+' -- '+start_date+' -- '+end_date+' -- '+Base);
  
            let checkPointKeyValue =  keyvalue[checkPoint];
  
            if(checkPointKeyValue == undefined){
              keyvalue[checkPoint] = {
                "start_date": start_date,
                "end_date": end_date,
                "Base": Base,
              };
            }
  
          }
          else{
  
            if(EffectiveNextDate == checkPoint){
  
              Base = HotelRateByDate[mainIndex+1]['Base'];
  
              index = 99;
              console.log('Next Date');
              console.log('== EffectiveNextDate = checkPoint'+start_date+' -- '+end_date+' -- '+Base);
  
              let checkPointKeyValue =  keyvalue[checkPoint];
  
              if(checkPointKeyValue == undefined)
              {
                keyvalue[checkPoint] = {
                  "start_date": start_date,
                  "end_date": end_date,
                  "Base": Base,
                };
              }
            }
            else{
  
              console.log('!='+start_date+' -- '+end_date+' -- '+Base);
  
              let checkPointKeyValue =  keyvalue[checkPoint];
  
              if(checkPointKeyValue == undefined)
              {
                keyvalue[checkPoint] = {
                  "start_date": start_date,
                  "end_date": end_date,
                  "Base": Base,
                };
              }
  
            }
          }
        
        }
  
      }
  
      
        let ObjectsKeys =  Object.keys(keyvalue);
        for (let index = 0; index < ObjectsKeys.length; index++) {
  
          let ObjectsKeysName = ObjectsKeys[index];
          fillCleanArray.push(keyvalue[ObjectsKeysName]);
          
        }
     
        resolve(fillCleanArray);
    
    });
  }

  public async emailBookingSend(template,to, subject, BookingConfirmation, CreateDate, HotelPropertyName, CheckInDate, CheckOutDate, Bookinglink) {
    return new Promise(async (resolve) => {


      const DOMAIN = "marketing.ifancyahotel.com";
      const mg = mailgun({apiKey: "8cfab3b4b12f2e00a51cbc1f67067b8d-48c092ba-7d024b12", domain: DOMAIN});
      const data = {
        from: "ifancyahotel <postmaster@marketing.ifancyahotel.com>",
        to: to,
        subject: subject,
        template: template,
        "v:BookingConfirmation": BookingConfirmation,
        "v:CreateDate": CreateDate,
        "v:HotelPropertyName": HotelPropertyName,
        "v:CheckInDate": CheckInDate,
        "v:CheckOutDate":CheckOutDate,
        "v:Bookinglink":Bookinglink
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


  async captionImageMatchingRawData(requestResults_images_Json, requestResults_hotel_Json){
    return new Promise(async (resolve) => {


       // sync from Links names parsing  
       let e_requestResults_imagesLength = requestResults_images_Json[0]['MediaLinks'].length;
       let e_data_array = Array()

       for (let index = 0; index < e_requestResults_imagesLength; index++) { 

         let linkText = requestResults_images_Json[0]['MediaLinks'][index]['src'];
         var filename = linkText.substring(linkText.lastIndexOf('/')+1);

         //console.log(filename);
         let  ans = filename.replaceAll("_", " "); ans = ans.replaceAll("-", " ");
        
         e_data_array[index] = requestResults_images_Json[0]['MediaLinks'][index]['caption'];
       }  

       
       // Ml Caption Matching Raw Data  
       let requestResults_imagesLength = requestResults_images_Json[0]['MediaLinks'].length;
       let r_data_array = Array()

       for (let index = 0; index < requestResults_imagesLength; index++) {  
         r_data_array[index] = requestResults_images_Json[0]['MediaLinks'][index]['caption'];
       }  


       //parsing Words
       let HotelRateDetailLength = requestResults_hotel_Json[0]['HotelRateDetail'].length;
       
       for (let index = 0; index < HotelRateDetailLength; index++) {
         
         requestResults_hotel_Json[0]['HotelRateDetail'][index]['ML'] = []
         let RoomRateDescription = requestResults_hotel_Json[0]['HotelRateDetail'][index]['RoomRateDescription'];
         let Room = RoomRateDescription[0]['Room'];


         if(Room != undefined){
         //indexing Length
         let  RoomLength = Room.length
         let imagesObject = requestResults_hotel_Json[0]['HotelRateDetail'][index]['Images'] = []

         for (let indexa = 0; indexa < RoomLength; indexa++) {

          let roomword = Room[indexa];
          let firstTwoWords = roomword.match(/([\w+]+)/g);
          let firstTwoWord =  firstTwoWords[0]+' '+firstTwoWords[1];
          let firstWord =  firstTwoWords[0];

          requestResults_hotel_Json[0]['HotelRateDetail'][index]['ML'][indexa] = {
            "firstTwoWord": firstTwoWord,
            "fullText": roomword
          }


          let requestResults_images = requestResults_images_Json[0]['MediaLinks'];

          for (let i1 = 0; i1 < requestResults_images.length; i1++) {
            
            let imagesCaption = requestResults_images[i1]['caption'];

            let firstTwoWordStatus = imagesCaption.includes(firstWord);

            if(firstTwoWordStatus)
            {
              imagesObject.push(requestResults_images[i1]);
            }
            //console.log(images);

          }
          

          let imagesObjectReCheck1 = requestResults_hotel_Json[0]['HotelRateDetail'][index]['Images'];
          let requestResults_imagesLength1 = imagesObjectReCheck1.length;

          if(requestResults_imagesLength1 == 0){

            for (let i1 = 0; i1 < requestResults_images.length; i1++) {
              
              let imagesCaption = requestResults_images[i1]['caption'];

              let firstTwoWordStatus = imagesCaption.includes(firstTwoWord);


              if(firstTwoWordStatus)
              {
                imagesObject.push(requestResults_images[i1]);
              }
            

            }
      
          }

          // From Url
          let imagesObjectReCheck2 = requestResults_hotel_Json[0]['HotelRateDetail'][index]['Images'];
          let requestResults_imagesLength2 = imagesObjectReCheck2.length;

          if(requestResults_imagesLength2 == 0){

            let e_data_arrayLength = e_data_array.length
            for (let i2 = 0; i2 < e_data_arrayLength; i2++) {

              let imagesURLCaption = e_data_array[i2];

              let firstTwoWordStatus = imagesURLCaption.includes(firstTwoWord);

              if(firstTwoWordStatus){
                imagesObject.push(requestResults_images_Json[0]['MediaLinks'][i2])
              }
              else
              {

                let firstTwoWordStatus = imagesURLCaption.includes(firstWord);

                if(firstTwoWordStatus){
                  imagesObject.push(requestResults_images_Json[0]['MediaLinks'][i2])
                }

              }

            }

          }

          


          /*
          let imagesObject = requestResults_hotel_Json[0]['HotelRateDetail'][index]['Images'] = []
          let matches = stringSimilarity.findBestMatch(firstTwoWord, r_data_array);
          let matchesIndex = matches['bestMatchIndex'];

          console.log('-----------------------------------------------------------------------------------------------> Best Match from Caption');

          console.log(matches);

          if(matchesIndex == null || matchesIndex == undefined)
          {

            
            console.log('-----------------------------------------------------------------------------------------------> Best Match from Media Link');

            let e_data_array_value = stringSimilarity.findBestMatch(firstTwoWord, e_data_array);
            let e_data_array_bestMatchIndex = e_data_array_value['bestMatchIndex'];
            imagesObject.push(requestResults_images_Json[0]['MediaLinks'][e_data_array_bestMatchIndex]);

            console.log(e_data_array_value);
            
          }
          else
          {
            imagesObject.push(requestResults_images_Json[0]['MediaLinks'][matchesIndex]);
          }
          */

         }
        
         //console.log(requestResults_hotel_Json[0]['HotelRateDetail'][index]);
         
       }
      }

       for (let index = 0; index < requestResults_imagesLength; index++) {  
         r_data_array[index] = requestResults_images_Json[0]['MediaLinks'][index]['caption'];
       }  


       resolve(requestResults_hotel_Json);

    })
  }

  public isEven(number) {
    return number % 2 === 0;
  }

  public isOdd(number) {
    return number % 2 !== 0;
  }


  public RequestExtarFlow(PlusRequest){

    let PlusRequestData = JSON.parse(JSON.stringify(PlusRequest));
    let PlusRequestDataLength = PlusRequestData.length;
    

    console.log(PlusRequestDataLength);

    for (let index = 0; index < PlusRequestDataLength; index++) {
      
      console.log(PlusRequest[index]['Adults']);

      let AdultsTotalThree = Array();
      if (PlusRequest[index]['Adults'] == 3)
      {

        let PlusRequestDataThree = JSON.parse(JSON.stringify(PlusRequest));
        for (let index = 0; index < PlusRequestDataThree.length; index++) {
          AdultsTotalThree.push(PlusRequestDataThree[index]['Adults']);
        }

        let containsone = _.contains(AdultsTotalThree, 1);
        if(containsone == false)
        {
          let JSON = [{ "Adults":1,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]

          PlusRequest.push(...JSON)
        }

        let containsTwo = _.contains(AdultsTotalThree, 2);
        if(containsTwo == false)
        {
          let JSON = [{ "Adults":2,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]
          PlusRequest.push(...JSON)

        }

      }


      let AdultsTotalFour = Array();
      if (PlusRequest[index]['Adults'] == 4)
      {

        let PlusRequestDataFour = JSON.parse(JSON.stringify(PlusRequest));
        for (let index = 0; index < PlusRequestDataFour.length; index++) {
          AdultsTotalFour.push(PlusRequestDataFour[index]['Adults']);
        }

        let containsTwo = _.contains(AdultsTotalFour, 2);
        if(containsTwo == false)
        {
          let JSON = [{ "Adults":2,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]
          PlusRequest.push(...JSON)

        }

      }


      let AdultsTotalFive = Array();
      if (PlusRequest[index]['Adults'] == 5)
      {

        let PlusRequestDataFive = JSON.parse(JSON.stringify(PlusRequest));
        for (let index = 0; index < PlusRequestDataFive.length; index++) {
          AdultsTotalFive.push(PlusRequestDataFive[index]['Adults']);
        }

        let containsTwo = _.contains(AdultsTotalFive, 2);
        if(containsTwo == false)
        {
          let JSON = [{ "Adults":2,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]
          PlusRequest.push(...JSON)

        }

        let containsThree = _.contains(AdultsTotalFive, 3);
        if(containsThree == false)
        {
          let JSON = [{ "Adults":3,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]
          PlusRequest.push(...JSON)

        }
        
      }
    }


    return PlusRequest;

  }

  public DivionsAdults(data): Promise<any>{

    return new Promise(async (resolve) => {

    let DivionsJson = JSON.parse(JSON.stringify(data));
    let DivionsJsonLength = DivionsJson.length;
    // Divions Children Flow
    for (let index = 0; index < DivionsJsonLength; index++) {

      let DivionsJsonAdults = DivionsJson[index]['Adults'];
      let even = this.isEven(DivionsJsonAdults);
      
      if(even && DivionsJsonAdults > 3){

        console.log(DivionsJson[index]);
        let divionsAdults = DivionsJsonAdults / 2;
        DivionsJson[index]['Adults'] = divionsAdults;

      }
      else
      {

       let RequestExtarFlow = this.RequestExtarFlow(data);
       DivionsJson(...RequestExtarFlow);

      }

    }
    // Divions Children Flow End

    });

  }

  async ParticipationLevel(ParticipationLevel){

    ParticipationLevel = parseInt(ParticipationLevel);

    if(ParticipationLevel == 3 || ParticipationLevel == 4){
      
      return false;
    }
    else
    {
      return true;
    }

  }

  async minRequestforHotelDetailsUpdate(json_data, ParticipationLevel){
    return new Promise(async (resolve) => {

      let jsonPlusRequestData = JSON.parse(JSON.stringify(json_data));
      
      let jsonPlusRequestDataLength = jsonPlusRequestData.length
      if(jsonPlusRequestDataLength == 1){

        //let ParticipationLevelData = this.ParticipationLevel(ParticipationLevel);
        resolve(jsonPlusRequestData);

      }
      else
      {

      }

    });
  }
  
  async minRequestforHotelDetails(json_data, ParticipationLevel){

    return new Promise(async (resolve) => {

      let jsonPlusRequestData = JSON.parse(JSON.stringify(json_data));
      let modifyCount = _.groupBy(json_data, function(obj){ return obj.Adults });

      let modifyCountlength = Object.keys(modifyCount);
      let PlusRequest = []

      let jsonPlusRequestDataLength = jsonPlusRequestData.length
      if(jsonPlusRequestDataLength == 1){
        
        PlusRequest.push(jsonPlusRequestData[0]);
      }
      else
      {
        for (let index = 0; index < modifyCountlength.length; index++) {
        
          let jsonRequest = modifyCount[modifyCountlength[index]];
          let roomCount = jsonRequest.length;
          let AdultsJson = _.max(jsonRequest, function(o) { return o.Childrens; });
          AdultsJson['Rooms'] = roomCount
          AdultsJson['length'] = roomCount
          
          PlusRequest.push(AdultsJson);
    
        }
      }

      // Plus Start
      let AdultsTotal = Array();
      let RoomsTotal = Array();
      let ChildrensTotal = Array();
      let ChildrensAges = [];
      jsonPlusRequestDataLength = jsonPlusRequestData.length

      if(jsonPlusRequestDataLength > 1){
  
        for (let index2 = 0; index2 < jsonPlusRequestData.length; index2++) {
    
          AdultsTotal.push(jsonPlusRequestData[index2]['Adults']);
          RoomsTotal.push(jsonPlusRequestData[index2]['Rooms']);
          ChildrensTotal.push(jsonPlusRequestData[index2]['Childrens']);
          ChildrensAges.push(...jsonPlusRequestData[index2]['ChildrensAges'])
          
        }
    
        let sumAdultsTotal = AdultsTotal.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0);
        let sumRoomsTotal = RoomsTotal.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0);
        let sumChildrensTotal = ChildrensTotal.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0);
    
        let plus_JSON = [{   
          "Adults":sumAdultsTotal, 
          "Rooms": 1,
          "Childrens": sumChildrensTotal,
          "ChildrensAges": ChildrensAges
        }]
    
        PlusRequest.push(...plus_JSON);

      }
      // Plus end

      // AdultsDivisionData stat
      let PlusRequestData = JSON.parse(JSON.stringify(PlusRequest));
      let PlusRequestDataLength = PlusRequestData.length;
      let AdultsDivisionData = [] 
      
      for (let index = 0; index < PlusRequestDataLength; index++) {
      

        let AdultsTotalThree = Array();
        if (PlusRequest[index]['Adults'] == 3)
        {

          let PlusRequestDataThree = JSON.parse(JSON.stringify(PlusRequest));
          for (let index = 0; index < PlusRequestDataThree.length; index++) {
            AdultsTotalThree.push(PlusRequestDataThree[index]['Adults']);
          }

          let containsone = _.contains(AdultsTotalThree, 1);
          if(containsone == false)
          {
            let JSON = [{ "Adults":1,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]

            PlusRequest.push(...JSON)
          }

          let containsTwo = _.contains(AdultsTotalThree, 2);
          if(containsTwo == false)
          {
            let JSON = [{ "Adults":2,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]
            PlusRequest.push(...JSON)

          }

        }


        let AdultsTotalFour = Array();
        if (PlusRequest[index]['Adults'] == 4)
        {

          let PlusRequestDataFour = JSON.parse(JSON.stringify(PlusRequest));
          for (let index = 0; index < PlusRequestDataFour.length; index++) {
            AdultsTotalFour.push(PlusRequestDataFour[index]['Adults']);
          }

          let containsTwo = _.contains(AdultsTotalFour, 2);
          if(containsTwo == false)
          {
            let JSON = [{ "Adults":2,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]
            PlusRequest.push(...JSON)

          }

        }


        let AdultsTotalFive = Array();
        if (PlusRequest[index]['Adults'] == 5)
        {

          let PlusRequestDataFive = JSON.parse(JSON.stringify(PlusRequest));
          for (let index = 0; index < PlusRequestDataFive.length; index++) {
            AdultsTotalFive.push(PlusRequestDataFive[index]['Adults']);
          }

          let containsTwo = _.contains(AdultsTotalFive, 2);
          if(containsTwo == false)
          {
            let JSON = [{ "Adults":2,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]
            PlusRequest.push(...JSON)

          }

          let containsThree = _.contains(AdultsTotalFive, 3);
          if(containsTwo == false)
          {
            let JSON = [{ "Adults":3,  "Rooms": 1, "Childrens": 0, "ChildrensAges": [] }]
            PlusRequest.push(...JSON)

          }
          
        }
      }
      // AdultsDivisionData End
        
        
        // mrging 
        let m =JSON.parse(JSON.stringify(json_data));
        PlusRequest.push(...m);
    
        // supportChildren Start
        let supportChildren = [];
    
        let supportChildrenData = JSON.parse(JSON.stringify(PlusRequest));
        let supportChildrenDataLength = supportChildrenData.length;

        for (let index = 0; index < supportChildrenDataLength; index++) {
          
          let Rooms = parseInt(supportChildrenData[index]['Rooms']);
          let Adults = parseInt(supportChildrenData[index]['Adults']);
          let Childrens = parseInt(supportChildrenData[index]['Childrens']);

          ParticipationLevel = parseInt(ParticipationLevel);

          if(ParticipationLevel == 3 || ParticipationLevel == 4){
            
            supportChildrenData[index]['ModifiedChildrens'] = false;
            supportChildrenData[index]['ModifiedChildrensValue'] = Childrens;
            supportChildrenData[index]['ModifiedAdultsValue'] = Adults;

            supportChildren.push(...supportChildrenData);

          }
          else
          {

            let sumAdultsTotal = Adults + Childrens;

            let plus_JSON = [{   
              "Adults":sumAdultsTotal, 
              "Rooms": Rooms,
              "Childrens": 0,
              "ChildrensAges": supportChildrenData[index]['ChildrensAges'],
              "ModifiedChildrens": true,
              "ModifiedChildrensValue": Childrens,
              "ModifiedAdultsValue": Adults
            }]

            supportChildren.push(...plus_JSON);

          }

        }

        
        let supportChildrens = supportChildren.filter((obj, index, self) =>
        index === self.findIndex((t) =>
          JSON.stringify(t) === JSON.stringify(obj)
          )
        );
        //supportChildren End

        resolve(supportChildrens);

    });

  }

  async filterImage(size, data){
   
    console.log(data);

    let mediaItem = data[0]['MediaLinks'];

    console.log(mediaItem.length);

    let allMediaLinks = [];
    for (let i = 0; i < mediaItem.length; i++) {

      let sizeCode = mediaItem[i]['sizeCode'];
      let type = mediaItem[i]['type']

        let assets = {
            caption: mediaItem[i]['caption'],
            storage: 'local',
            height: mediaItem[i]['height'],
            width: mediaItem[i]['width'],
            src: mediaItem[i]['src'],
            type: mediaItem[i]['type'],
            sizeCode: mediaItem[i]['sizeCode'],
        };

        
        if(sizeCode == size){ 
          if(type == "ROOM" || type == "SUITE"){ allMediaLinks.push(assets); }
        }

    }

    data[0]['MediaLinks'] = allMediaLinks;

    return data;

  }


  async http_currenciesBySymbols(base: any) {
    return new Promise(async (resolve) => {

      var config = {
        method: 'get',
        url: 'https://api.apilayer.com/fixer/latest?base='+base,
        headers: {
          'apikey': 'YAIZvMz69eNEqHZASOZ4Hn2slPZ30FQ3'
        }
      };

      axios(config)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

    })
  }

  async convertPriceToBase(base: any, Price: any) {
    return new Promise(async (resolve) => {

      let CACHE_TIME : number = parseInt(process.env.Cache_Time);

      let priceBase = Price.slice(0, 3);
      let price = Price.slice(3, 10);

      let isCurrenciesAvb = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: priceBase } })
      let currenciesAvbLength = isCurrenciesAvb.length;

      if(currenciesAvbLength == 0){

        let http_data = await this.http_currenciesBySymbols(priceBase);

        http_data['lastModified'] = new Date();

        await this.mongodb.newCurrenciesManagementDocument(http_data);

        let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: priceBase } })

        let cur_priceBase = currencies[0]['rates'][base];
        let original = price * cur_priceBase

        let cur_data = {
          hotelPrice: price,
          from: priceBase,
          To: base,
          marketRate : cur_priceBase,
          price: original,
        }

        resolve(cur_data);
      }
      else{

        console.log(currenciesAvbLength);

        let timeAgo = await this.timeAgo(isCurrenciesAvb[0].lastModified);

        console.log(timeAgo);

        if (timeAgo >= CACHE_TIME){

          let http_data = await this.http_currenciesBySymbols(priceBase);
          http_data['lastModified'] = new Date();

          console.log(http_data);

          await this.mongodb.updateCurrenciesManagementDocument({ "base": priceBase }, { $set: http_data });

          let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: priceBase } })

          let cur_priceBase = currencies[0]['rates'][base];
          let original = price * cur_priceBase

          let cur_data = {
            hotelPrice: price,
            from: priceBase,
            To: base,
            marketRate : cur_priceBase,
            price: original,
          }

          resolve(cur_data);

        }
        else
        {


          let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: priceBase } })

          let cur_priceBase = currencies[0]['rates'][base];
          let original = price * cur_priceBase

          let cur_data = {
            hotelPrice: price,
            from: priceBase,
            To: base,
            marketRate : cur_priceBase,
            price: original,
          }

          resolve(cur_data);

        }


      }

    })
  }

  async http_HotelDetailsAvailability(data): Promise<any>{


    let node_env = process.env.NODE_ENV;
    let TARGET_BRANCH: string;
    let PROVIDER_CODE: string;
    let ACCEPT_ENCODING: string;
    let CONTENT_TYPE: string;
    let AUTHORIZATION: string;
    let HOTEL_SERVICE_URL: string;

    if(node_env == 'production'){

      HOTEL_SERVICE_URL = process.env.Production_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Production_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Production_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Production_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Production_CONTENT_TYPE;
      AUTHORIZATION = process.env.Production_AUTHORIZATION;
    
    }
    else
    {

      HOTEL_SERVICE_URL = process.env.Development_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Development_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Development_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Development_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Development_CONTENT_TYPE;
      AUTHORIZATION = process.env.Development_AUTHORIZATION;
    
    }

    let dataValues = data;

    console.log(dataValues);


    return new Promise(async (resolve)=> {

      try {

        let xmlData : string = fs.readFileSync(path.resolve(__dirname, './soapXML/getHotelDetail.xml'), 'utf-8');
        let _replace_data = xmlData.split('--TraceId--').join(dataValues.TraceId);
        _replace_data = _replace_data.split('--HotelChain--').join(dataValues.HotelChain);
        _replace_data = _replace_data.split('--Base--').join(dataValues.Base);
        _replace_data = _replace_data.split('--HotelCode--').join(dataValues.HotelCode);
        _replace_data = _replace_data.split('--HotelLoc--').join(dataValues.HotelLoc);
        _replace_data = _replace_data.split('--HotelName--').join(dataValues.HotelName);
        _replace_data = _replace_data.split('--HotelTransportation--').join(dataValues.HotelTransportation);
        _replace_data = _replace_data.split('--ReserveRequirement--').join(dataValues.ReserveRequirement);
        _replace_data = _replace_data.split('--ParticipationLevel--').join(dataValues.ParticipationLevel);
        _replace_data = _replace_data.split('--VendorLocationKey--').join(dataValues.VendorLocationKey);
        _replace_data = _replace_data.split('--Availability--').join(dataValues.Availability);
        _replace_data = _replace_data.split('--Address--').join(dataValues.Address);
        _replace_data = _replace_data.split('--Units--').join(dataValues.Units);
        _replace_data = _replace_data.split('--Value--').join(dataValues.Value);
        _replace_data = _replace_data.split('--Direction--').join(dataValues.Direction);
        _replace_data = _replace_data.split('--RateRuleDetail--').join(dataValues.RateRuleDetail);
        _replace_data = _replace_data.split('--Adults--').join(dataValues.Adults);
        _replace_data = _replace_data.split('--Rooms--').join(dataValues.Rooms);
        _replace_data = _replace_data.split('--Provider--').join(dataValues.Provider);
        _replace_data = _replace_data.split('--To--').join(dataValues.To);
        _replace_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);
        _replace_data = _replace_data.split('--NumberOfChildren--').join(dataValues.Ages);
        let _build_data = _replace_data.split('--From--').join(dataValues.From);
        //soap create request

        console.log(_build_data);

        let config = {
          method: 'post',
          url:HOTEL_SERVICE_URL,
          headers: {
            'TargetBranch': TARGET_BRANCH,
            'ProviderCode': PROVIDER_CODE,
            'Accept-Encoding': ACCEPT_ENCODING,
            'Content-Type': CONTENT_TYPE,
            'Authorization': AUTHORIZATION,
          },
          data : _build_data
        };


        let LogsDate = new Date();
        let hash = md5(LogsDate + dataValues.TraceId);
        let ApiDataLog = JSON.stringify(config);
        let logs = {
            TraceId: dataValues.TraceId,
            Hashpair: hash,
            TriggerHit: "Req Hotel Details Api",
            Date: LogsDate,
            Data: ApiDataLog
        };
        await this.mongodb.applicationloggedMultiInsert(logs);

        let responseData,status=200;

        //soap execute request
        let response = await axios(config)

        if(response.status == 200){


          let LogsDate = new Date();
          let ApiDataLog = JSON.stringify(response.data);
          let logs = {
              TraceId: dataValues.TraceId,
              Hashpair: hash,
              TriggerHit: "Res Hotel Details Api",
              Date: LogsDate,
              Data: ApiDataLog
          };
          await this.mongodb.applicationloggedMultiInsert(logs);

          parseString(response.data, function (err, result) {


            let requestResult = result['SOAP:Envelope']['SOAP:Body'][0]
            if(requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']){

              let status = 404;
              let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
              let faultcode = requestResult['SOAP:Fault'][0]['detail'][0]['common_v52_0:ErrorInfo'][0]['common_v52_0:Code'][0]
              let responseData :any = {"status":status, "faultcode": faultcode, "message":message}
              resolve(responseData);

            }
            else
            {

              let a = JSON.parse(JSON.stringify(requestResult));
              let HotelAlternateProperties = a['hotel:HotelDetailsRsp'][0]['hotel:HotelAlternateProperties']

              if(HotelAlternateProperties){


                let HotelProperty = HotelAlternateProperties[0]['hotel:HotelProperty'];
                let HotelPropertyLength = HotelProperty.length;

                let HotelAlternatePropertiesData = [];

                for (let index = 0; index < HotelPropertyLength; index++) {
                 
                  let HotelPropertyData = HotelProperty[index];
                 
                  let PropertyAddress = HotelPropertyData['hotel:PropertyAddress'][0]['hotel:Address'];
                  let Distance = HotelPropertyData['common_v52_0:Distance'][0];

                  let JSONData = {
                    HotelChain: HotelPropertyData['$']['HotelChain'],
                    HotelCode: HotelPropertyData['$']['HotelCode'],
                    HotelLocation: HotelPropertyData['$']['HotelLocation'],
                    Name: HotelPropertyData['$']['Name'],
                    PropertyAddress: PropertyAddress,
                    Distance: {
                      Units: Distance['$']['Units'],
                      Value: Distance['$']['Value'],
                      Direction: Distance['$']['Direction']
                    }
                  }
                  
                  console.log(JSONData);

                  HotelAlternatePropertiesData.push(JSONData)

                }


                let HotelProperties = {
                    HotelAlternateProperties: true,
                    HotelAlternatePropertiesData: HotelAlternatePropertiesData
                }

                resolve(HotelProperties);

              }
              else
              {


                let node = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['$'];
                let PropertyAddress = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['hotel:PropertyAddress'];
                let a_PropertyAddress = PropertyAddress[0]['hotel:Address'][0] + " " + PropertyAddress[0]['hotel:Address'][1] + " " + PropertyAddress[0]['hotel:Address'][2];
                let PropertyPhoneNumber = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:PhoneNumber'];
                let PhoneNumber = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:PhoneNumber'];
                let a_Distance = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:Distance'];
                let HotelDetailItem = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelDetailItem'];
                let hotelHotelType = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelType'];
                let HotelRateDetailArray = [];
                if (a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelRateDetail']) {
                    let hotelRateDetail = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelRateDetail'];
                    let hotelRateDetailLength = hotelRateDetail.length;
                    
                    for (let i = 0; i < hotelRateDetailLength; i++) {
                        let RoomRateDescription = hotelRateDetail[i]['hotel:RoomRateDescription'];
                        let HotelRateByDate = hotelRateDetail[i]['hotel:HotelRateByDate'];
                        let hotelRateByDateLength = HotelRateByDate.length;
                        let hotelRateDetailArray = [];
                        for (let a = 0; a < hotelRateByDateLength; a++) {
                            hotelRateDetailArray.push(HotelRateByDate[a]['$']);
                        }
                        let hotelCommission = hotelRateDetail[i]['hotel:Commission'];
                        let hotelCancelInfo = hotelRateDetail[i]['hotel:CancelInfo'];
                        let hotelGuaranteeInfo = hotelRateDetail[i]['hotel:GuaranteeInfo'];
                        let RateMatchIndicator = hotelRateDetail[i]['hotel:RateMatchIndicator'];

                        let RateMatchIndicatorArray = [];

                        if(RateMatchIndicator){

                          let RateMatchIndicatorLength = RateMatchIndicator.length;

                          for (let index = 0; index < RateMatchIndicatorLength; index++) {
                            
                            RateMatchIndicatorArray.push(RateMatchIndicator[index]['$']);
                          
                          }

                        }

                        let hotelInclusions = hotelRateDetail[i]['hotel:Inclusions'];
                        let hotelRateDetailData = {
                            RatePlanType: hotelRateDetail[i]['$']['RatePlanType'],
                            Base: hotelRateDetail[i]['$']['Base'],
                            Total: hotelRateDetail[i]['$']['Total'],
                            Tax: hotelRateDetail[i]['$']['Tax'],
                            ApproximateTotal: hotelRateDetail[i]['$']['ApproximateTotal'],
                            RateCategory: hotelRateDetail[i]['$']['RateCategory'],
                            Surcharge: hotelRateDetail[i]['$']['Surcharge'],
                            RateChangeIndicator: hotelRateDetail[i]['$']['RateChangeIndicator'],
                            ExtraFeesIncluded: hotelRateDetail[i]['$']['ExtraFeesIncluded'],
                            RoomRateDescription: [],
                            Price: hotelRateDetailArray,
                            RateMatchIndicator: RateMatchIndicatorArray,
                            Commission: {
                                Indicator: hotelCommission[0]['$']['Indicator'],
                                Percent: hotelCommission[0]['$']['Percent']
                            },
                            HotelType: {
                                SourceLink: hotelHotelType[0]['$']['SourceLink']
                            },
                            CancelInfo: {},
                            Inclusions: {
                                SmokingRoomIndicator: "",
                                BedTypesCode: "",
                                BedTypesQuantity: "",
                                MealPlansBreakfast: "",
                                MealPlansLunch: "",
                                MealPlansDinner: "",
                                RoomView: "",
                            }
                        };
                        if (RoomRateDescription[0]) {
                            hotelRateDetailData['RoomRateDescription'][0] = { [RoomRateDescription[0]['$']['Name']]: RoomRateDescription[0]['hotel:Text'] };
                        }
                        if (RoomRateDescription[1]) {
                            hotelRateDetailData['RoomRateDescription'][1] = { [RoomRateDescription[1]['$']['Name']]: RoomRateDescription[1]['hotel:Text'] };
                        }
                        if (hotelInclusions[0]['$']['SmokingRoomIndicator']) {
                            hotelRateDetailData['Inclusions']['SmokingRoomIndicator'] = hotelInclusions[0]['$']['SmokingRoomIndicator'];
                        }
                        if (hotelInclusions[0]['hotel:BedTypes']) {
                            hotelRateDetailData['Inclusions']['BedTypesCode'] = hotelInclusions[0]['hotel:BedTypes'][0]['$']['Code'];
                        }
                        if (hotelInclusions[0]['hotel:BedTypes']) {
                            hotelRateDetailData['Inclusions']['BedTypesQuantity'] = hotelInclusions[0]['hotel:BedTypes'][0]['$']['Quantity'];
                        }
                        if (hotelInclusions[0]['hotel:MealPlans']) {
                            hotelRateDetailData['Inclusions']['MealPlansBreakfast'] = hotelInclusions[0]['hotel:MealPlans'][0]['$']['Breakfast'];
                        }
                        if (hotelInclusions[0]['hotel:MealPlans']) {
                            hotelRateDetailData['Inclusions']['MealPlansLunch'] = hotelInclusions[0]['hotel:MealPlans'][0]['$']['Lunch'];
                        }
                        if (hotelInclusions[0]['hotel:MealPlans']) {
                            hotelRateDetailData['Inclusions']['MealPlansDinner'] = hotelInclusions[0]['hotel:MealPlans'][0]['$']['Dinner'];
                        }
                        if (hotelInclusions[0]['hotel:RoomView']) {
                            hotelRateDetailData['Inclusions']['RoomView'] = hotelInclusions[0]['hotel:RoomView'][0]['$']['Code'];
                        }
                        if (hotelCancelInfo) {
                            hotelRateDetailData['CancelInfo'] = {
                                NonRefundableStayIndicator: hotelCancelInfo[0]['$']['NonRefundableStayIndicator'],
                                CancelDeadline: hotelCancelInfo[0]['$']['CancelDeadline']
                            };
                        }

                        if(hotelGuaranteeInfo){
                          hotelRateDetailData['GuaranteeInfo'] = {
                            AbsoluteDeadline: hotelGuaranteeInfo[0]['$']['AbsoluteDeadline'],
                            CredentialsRequired: hotelGuaranteeInfo[0]['$']['CredentialsRequired'],
                            GuaranteeType: hotelGuaranteeInfo[0]['$']['GuaranteeType']
                          };
                        }

                        HotelRateDetailArray.push(hotelRateDetailData);
                    }
                }
                let ProviderCode = null;
                if (a['hotel:HotelDetailsRsp'][0]['common_v52_0:NextResultReference']) {
                    ProviderCode = a['hotel:HotelDetailsRsp'][0]['common_v52_0:NextResultReference'][0]['$']['ProviderCode'];
                }
                let JSONData = {
                    ProviderCode: ProviderCode,
                    HotelAlternateProperties: false,
                    HotelChain: node['HotelChain'],
                    HotelCode: node['HotelCode'],
                    HotelLocation: node['HotelLocation'],
                    Name: node['Name'],
                    PropertyPhoneNumber: [],
                    Distance: {
                        Units: "",
                        Value: "",
                        Direction: ""
                    },
                    ParticipationLevel: node['ParticipationLevel'],
                    MoreRates: node['MoreRates'],
                    PropertyAddress: PropertyAddress,
                    HotelDetailItem: {
                        [HotelDetailItem[0]['$']['Name']]: HotelDetailItem[0]['hotel:Text'][0],
                        [HotelDetailItem[1]['$']['Name']]: HotelDetailItem[1]['hotel:Text'][0]
                    },
                    HotelRateDetail: HotelRateDetailArray,
                };
                if (PropertyPhoneNumber[0]) {
                    JSONData['PropertyPhoneNumber'][0] = { [PropertyPhoneNumber[0]['$']['Type']]: PropertyPhoneNumber[0]['$']['Number'] };
                }
                if (PropertyPhoneNumber[1]) {
                    JSONData['PropertyPhoneNumber'][1] = { [PropertyPhoneNumber[1]['$']['Type']]: PropertyPhoneNumber[1]['$']['Number'] };
                }
                if (a_Distance = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:Distance']) {
                    JSONData['Distance']['Units'] = a_Distance[0]['$']['Units'];
                }
                if (a_Distance = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:Distance']) {
                    JSONData['Distance']['Value'] = a_Distance[0]['$']['Value'];
                }
                if (a_Distance = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:Distance']) {
                    JSONData['Distance']['Direction'] = a_Distance[0]['$']['Direction'];
                }
                resolve(JSONData);

              }

              
            }


          });

        }

      } catch(e) {
        console.log('Error:', e.stack);
      }

    });

  }


  async multiSelectHotelDetails(data, requestFrom): Promise<any>{
    return new Promise(async (resolve) => {

        //Adults And Rooms
        let AdultsAndRooms: any = await this.minRequestforHotelDetailsUpdate(data.AdultsAndRooms, data.ParticipationLevel);

        let TraceId = data.TraceId;
        let HotelChain = data.HotelChain;
        let HotelBase = data.Base;
        let HotelCode = data.HotelCode;
        let HotelLoc = data.HotelLoc;
        let HotelName = data.HotelName;
        let Children = data.Childrens;
        let Infants = data.Infants;
        let ChildrenAge = data.ChildrenAge;
        let InfantAge = data.InfantAge;
        let VendorLocationKey = data.VendorLocationKey;
        let HotelTransportation = data.HotelTransportation;
        let ReserveRequirement = data.ReserveRequirement;
        let ParticipationLevel = data.ParticipationLevel;
        let Availability = data.Availability;
        let Address = data.Address;
        let Units = data.Units;
        let Value = data.Value;
        let Direction = data.Direction;
        let RatingProvider = data.RatingProvider;
        let Rating = data.Rating;
        let RateRuleDetail = data.RateRuleDetail;
        let Adults = data.Adults;
        let Rooms = data.Rooms;
        let To = data.To;
        let From = data.From;
        let Ages = data.Ages;
        let Provider = data.Provider;
       

        let MultiHotelData = [];
        let hotelDetails: any = [];


        let minRequestforHotelDetails = JSON.parse(JSON.stringify(AdultsAndRooms));
        let minRequestforHotelDetailsLength = minRequestforHotelDetails.length;

        if(minRequestforHotelDetailsLength == 1)
        {
            
            let AdultsAndRooms_Adults = parseInt(AdultsAndRooms[0]['Adults']);

            let _Error = 0
            for (let index = 1; index < AdultsAndRooms_Adults; index++) {

              console.log('------- Start -------' + index);

              data.Adults = AdultsAndRooms_Adults - index;


              console.log('-------------------------');
              console.log(data.Adults);

              let RoomsPlus = parseInt(AdultsAndRooms[0]['Rooms']) + _Error;

              console.log('--------- Room ---------');
              console.log(RoomsPlus)

              // check Adults > Value
              let RoomValueChnage = AdultsAndRooms_Adults * _Error;


              if (RoomValueChnage <= AdultsAndRooms_Adults){
              
                data.Rooms = RoomsPlus;
                Adults = data.Adults
                Rooms = RoomsPlus;

                let ChildrensCount = AdultsAndRooms[0]['Childrens'];
                data.ChildrensAges = AdultsAndRooms[0]['ChildrensAges'];

                let ageNode = "" 
          
                if(ChildrensCount >= 1){
            
                  let ChildrensAgesArrayLength = data.ChildrensAges.length
            
                  for (let index = 0; index < ChildrensAgesArrayLength; index++) {
                    ageNode += "<hotel:Age>"+data.ChildrensAges[index]['age']+"</hotel:Age>";
                  }
            
                  data.Ages = '<hotel:NumberOfChildren Count="'+ChildrensCount+'">'+ageNode+'</hotel:NumberOfChildren>';
                }
                else
                {
                  data.Ages = '';
                }
                
                let createHash = md5(TraceId + Ages + HotelBase + HotelChain + HotelCode + HotelLoc + HotelName + Children + Infants + ChildrenAge + InfantAge + VendorLocationKey + HotelTransportation + ReserveRequirement + ParticipationLevel + Availability + Address + Units + Value + Direction + RatingProvider + Rating + RateRuleDetail + Adults + Rooms + To + From + Provider);
                let currentDate = new Date();
                let modiJson = {
                    "hotelCode": HotelCode,
                    "hash": createHash,
                    "timeout": currentDate,
                    "count": "12"
                };
      

                  let query =  {
                    "Rooms": RoomsPlus, 
                    "Adults": data.Adults,
                    "Childrens": AdultsAndRooms[0]['Childrens'],
                    "ChildrensAges": AdultsAndRooms[0]['ChildrensAges'],
                    "quantity": 1
                  }

                  AdultsAndRooms[index] = query;
                  hotelDetails = await this.hotelDetails(data, modiJson);

                  if(hotelDetails.statusCode == 400){
    
                    _Error = _Error + 1;
                    console.log('Error Plus');

                  }
                  else
                  {
                    AdultsAndRooms[0]['quantity'] = AdultsAndRooms[0]['Rooms'];
                    hotelDetails['Data']['sleeps'] = AdultsAndRooms[0];
                    MultiHotelData.push(hotelDetails['Data']);
                  }
              }
            
            }

        }
        else
        {

          /*
          for (let index = 0; index < AdultsAndRooms.length; index++) {
          
            data.Adults = AdultsAndRooms[index]['Adults'];
            data.Rooms = AdultsAndRooms[index]['Rooms'];
            Adults = AdultsAndRooms[index]['Adults'];
            Rooms = AdultsAndRooms[index]['Rooms'];
  
            let ChildrensCount = AdultsAndRooms[index]['Childrens'];
            data.ChildrensAges = AdultsAndRooms[index]['ChildrensAges'];
  
            let ageNode = "" 
        
            if(ChildrensCount >= 1){
        
              let ChildrensAgesArrayLength = data.ChildrensAges.length
        
              for (let index = 0; index < ChildrensAgesArrayLength; index++) {
                ageNode += "<hotel:Age>"+data.ChildrensAges[index]['age']+"</hotel:Age>";
              }
        
              data.Ages = '<hotel:NumberOfChildren Count="'+ChildrensCount+'">'+ageNode+'</hotel:NumberOfChildren>';
            }
            else
            {
              data.Ages = '';
            }
  
  
            let createHash = md5(TraceId + Ages + HotelBase + HotelChain + HotelCode + HotelLoc + HotelName + Children + Infants + ChildrenAge + InfantAge + VendorLocationKey + HotelTransportation + ReserveRequirement + ParticipationLevel + Availability + Address + Units + Value + Direction + RatingProvider + Rating + RateRuleDetail + Adults + Rooms + To + From + Provider);
            let currentDate = new Date();
            let modiJson = {
                "hotelCode": HotelCode,
                "hash": createHash,
                "timeout": currentDate,
                "count": "12"
            };
            
            hotelDetails = await this.hotelDetails(data, modiJson);
  
            //console.log(hotelDetails);
  
            if(hotelDetails.statusCode == 400){
  
  
                /*
                {
                  "Rooms": 1,
                  "Adults": 5,
                  "Childrens": 1,
                  "ChildrensAges": [
                    { "Age" : 1}
                ]
                  }
                
  
                  let DivionsAdultsData = [{
                    "Rooms": data.Rooms,
                    "Adults": data.Adults,
                    "Childrens": ChildrensCount,
                    "ChildrensAges": data.ChildrensAges,
                    "ModifiedChildrens": AdultsAndRooms[index]['ModifiedChildrens'],
                    "ModifiedChildrensValue": AdultsAndRooms[index]['ModifiedChildrensValue'],
                    "ModifiedAdultsValue": AdultsAndRooms[index]['ModifiedAdultsValue'],
                    }]
  
  
                  let DivionsAdults = this.DivionsAdults(DivionsAdultsData);
  
  
        
  
              /*
                AdultsAndRooms[index]['quantity'] = AdultsAndRooms[index]['Rooms'];
                AdultsAndRooms[index]['Rooms'] = 1;
                hotelDetails['sleeps'] = AdultsAndRooms[index];
                MultiHotelData.push(hotelDetails);
              */
  
              /*  
              console.log('---------- 400 --------- ')
              // recheck with 1
              data.Adults = AdultsAndRooms[index]['Adults'];
              data.Rooms = 1;
              Adults = AdultsAndRooms[index]['Adults'];
              Rooms = 1;
              let createHash = md5(TraceId + Ages + HotelBase + HotelChain + HotelCode + HotelLoc + HotelName + Children + Infants + ChildrenAge + InfantAge + VendorLocationKey + HotelTransportation + ReserveRequirement + ParticipationLevel + Availability + Address + Units + Value + Direction + RatingProvider + Rating + RateRuleDetail + Adults + Rooms + To + From + Provider);
              let currentDate = new Date();
              let modiJson = {
                  "hotelCode": HotelCode,
                  "hash": createHash,
                  "timeout": currentDate,
                  "count": "12"
              };
              hotelDetails = await this.hotelDetails(data, modiJson);
              
              if(hotelDetails.statusCode == 400){
              
              }
              else
              {
              
              }
              
  
  
            }
            else
            {
              AdultsAndRooms[index]['quantity'] = AdultsAndRooms[index]['Rooms'];
              hotelDetails['Data']['sleeps'] = AdultsAndRooms[index];
              MultiHotelData.push(hotelDetails['Data']);
  
            }
    
            
          }
          */
        }
        
        
        //Hotel Cleaning
        let MultiHotelDataLength = MultiHotelData.length
        let data_r = []
        
        for (let index = 0; index < MultiHotelDataLength; index++) {

          let dataRLength = data_r.length;

          if(dataRLength == 0){
            if(MultiHotelData[index]['HotelCode']){
              data_r[0] = MultiHotelData[index];
            }
          }

        }

        // Rate Details 
        let dataRLength = data_r.length;
        if(dataRLength == 1){

          data_r[0]['HotelRateDetailObject'] = [];

          


          for (let index = 0; index < MultiHotelData.length; index++) {


            console.log("-------------------------------------------------------------------------------------------------------");
            console.log("-------------------------------------------------------------------------------------------------Index Level--");
            console.log(index + '--- MultiHotelData:' + MultiHotelData.length + '--- AdultsAndRooms:' + AdultsAndRooms.length );
            console.log("----------------------------------------------------------------------------------------------------Index All ---");
            console.log(AdultsAndRooms);
            console.log("----------------------------------------------------------------------------------------------------Index Data---");
            console.log(AdultsAndRooms[index]);
            console.log("-------------------------------------------------------------------------------------------------------");


            if(MultiHotelData[index]['statusCode'] == 400)
            {
               data_r[0]['HotelRateDetailObject'][index] = {
                Sleeps: AdultsAndRooms[index+1],
                StatusCode: 404,
                Error: MultiHotelData[index]
               }


            }
            else
            {
              
              data_r[0]['HotelRateDetailObject'][index] = {
                Sleeps: AdultsAndRooms[index+1],
                StatusCode: 200,
                HotelAlternateProperties: MultiHotelData[index]['HotelAlternateProperties'],
                HotelAlternatePropertiesData: MultiHotelData[index]['HotelAlternatePropertiesData'],
                HotelRateDetail: MultiHotelData[index]['HotelRateDetail']
              }

            }
          
          }

          delete data_r[0]['HotelRateDetail'];
          delete data_r[0]['sleeps'];
        }

        let data_rLength = data_r.length;


        if(requestFrom == "Mobile"){


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
          
          let imagelinksData = await this.hotelMediaLinks(data, modiJson);;

          if(imagelinksData['Data']['MediaLinks']){
           
            data_r[0]['Images'] = imagelinksData['Data']['MediaLinks'];
          
          }
          else
          {
            data_r[0]['Images']  = [];
          }

          

        }

        


        if(data_rLength >= 1)
        {
          resolve(ResponseBuilder.successResponse('Data', data_r[0]));
        }
        else
        {
          resolve(ResponseBuilder.errorResponse('Data', hotelDetails));
        }
        console.log(data_r)
  
    })
  }

  async hotelDetails(data, modifyData): Promise<any>{

    return new Promise(async (resolve) => {
      await this.mongodb.connect();
      let CACHE_TIME : number = parseInt(process.env.Cache_Time);
      let findCacheDocument = await this.mongodb.findCacheHotelDetailsDocument({ "hash": { $eq: modifyData.hash } });
      let requestResults_hotel_Json: any = [];
      let requestResults_images_Json: any = [];

      if (findCacheDocument.length == 0) {

          console.log("from travelport");

          let hotelDetails = await this.http_HotelDetailsAvailability(data);

          if( hotelDetails.HotelAlternateProperties == true){

            resolve(ResponseBuilder.successResponse('Data', hotelDetails));

          }
          else
          {

          
          
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
          
          
          let requestResults_images =  await this.hotelMediaLinks(data, modiJson);
          requestResults_images_Json[0] = requestResults_images['Data']
         
          requestResults_images_Json = await this.filterImage('L',requestResults_images_Json);

          if (hotelDetails.status == 404) {
              resolve(ResponseBuilder.errorMultiResponse('message', hotelDetails['message'], 'faultcode', hotelDetails['faultcode']));
              
          }
          else {
              
              await this.mongodb.newCacheHotelDetailsDocument(modifyData);
              hotelDetails['hash'] = modifyData.hash;
              hotelDetails['AdultsAndRooms'] = data.AdultsAndRooms;
              hotelDetails['date'] = new Date();

              await this.mongodb.newHotelDetailsDocument(hotelDetails);
              
              let HotelDetails = await this.mongodb.findHotelDetailsDocument({ "HotelCode": { $eq: modifyData.hotelCode }, "hash": { $eq: modifyData.hash } });
              
              let ifancydat_hotel = await this.mongodb.findHotelDocument({ "HotelId": { $eq: modifyData.hotelCode } });
              
              HotelDetails[0]['Amenity'] = ifancydat_hotel[0]['rawData']['Amenity'];
              if (HotelDetails[0]['HotelRateDetail']) {
                  let HotelRateDetail = HotelDetails[0]['HotelRateDetail'];
                  let HotelRateDetailLength = HotelRateDetail.length;
                  for (let i = 0; i < HotelRateDetailLength; i++) {

                      HotelRateDetail[i]['currencies'] = {
                          Symbol: "",
                      };


                      let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                      HotelRateDetail[i]['currencies']['Symbol'] = Symbol;
                  }
              }


              let DistanceYardsUnits =  HotelDetails[0]['Distance']['Units'];
              let DistanceYardsValue = parseInt( HotelDetails[0]['Distance']['Value']);
              let DistanceYardsDirection =  HotelDetails[0]['Distance']['Direction'];
              
              let DistanceYardsValueSum = DistanceYardsValue*1760

              HotelDetails[0]['DistanceYards'] = {
                "Units": "YD",
                "Value": DistanceYardsValueSum,
                "Direction": DistanceYardsDirection
              }


              
              // mapping var with Json object
              requestResults_hotel_Json = HotelDetails

              let modifiedWithImagesData = await this.captionImageMatchingRawData(requestResults_images_Json, requestResults_hotel_Json);

              modifiedWithImagesData[0]['HotelId'] = modifiedWithImagesData[0]['HotelCode'];
             
              resolve(ResponseBuilder.successResponse('Data', modifiedWithImagesData[0]));

            }
          }
      
      }
      else {
        let timeAgo = await this.timeAgo(findCacheDocument[0].timeout);
        if (timeAgo >= CACHE_TIME) {

             

              let httpData = await this.http_HotelDetailsAvailability(data);

              if (httpData.status == 404) {
                  resolve(ResponseBuilder.errorMultiResponse('message', httpData['message'], 'faultcode', httpData['faultcode']));
              }
              else {

                if( httpData.HotelAlternateProperties == true){

                  resolve(ResponseBuilder.successResponse('Data', httpData));
      
                }
                else
                {



                let requestResults_hotel_Json: any = [];
                let requestResults_images_Json: any = [];

    
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
                  
                  
                  let requestResults_images =  await this.hotelMediaLinks(data, modiJson);
                  requestResults_images_Json[0] = requestResults_images['Data'];

                  requestResults_images_Json = await this.filterImage('L',requestResults_images_Json);

                  await this.mongodb.updateHotelCacheDetailsDocument({ "hash": modifyData.hash }, { $set: modifyData });
                  
                  httpData['hash'] = modifyData.hash;
                  httpData['AdultsAndRooms'] = data.AdultsAndRooms;
                  httpData['date'] = new Date();

                  await this.mongodb.updateHotelDetailsDocument({ "HotelCode": modifyData.hotelCode }, { $set: httpData });
                  let HotelDetails = await this.mongodb.findHotelDetailsDocument({ "HotelCode": { $eq: modifyData.hotelCode }, "hash": { $eq: modifyData.hash } });

                  console.log(HotelDetails.length);

                  let ifancydat_hotel = await this.mongodb.findHotelDocument({ "HotelId": { $eq: modifyData.hotelCode } });
                  HotelDetails[0]['Amenity'] = ifancydat_hotel[0]['rawData']['Amenity'];
                  if (HotelDetails[0]['HotelRateDetail']) {
                      let HotelRateDetail = HotelDetails[0]['HotelRateDetail'];
                      let HotelRateDetailLength = HotelRateDetail.length;
                      for (let i = 0; i < HotelRateDetailLength; i++) {

                          HotelRateDetail[i]['currencies'] = {
                              Symbol: "",
                          };
                          
                          let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                          HotelRateDetail[i]['currencies']['Symbol'] = Symbol;
                      }
                  }


                  let DistanceYardsUnits =  HotelDetails[0]['Distance']['Units'];
                  let DistanceYardsValue = parseInt( HotelDetails[0]['Distance']['Value']);
                  let DistanceYardsDirection =  HotelDetails[0]['Distance']['Direction'];
                  
                  let DistanceYardsValueSum = DistanceYardsValue*1760

                  HotelDetails[0]['DistanceYards'] = {
                    "Units": "YD",
                    "Value": DistanceYardsValueSum,
                    "Direction": DistanceYardsDirection
                  }

                  // mapping var with Json object
                  requestResults_hotel_Json = HotelDetails

                  let modifiedWithImagesData = await this.captionImageMatchingRawData(requestResults_images_Json, requestResults_hotel_Json);
                  modifiedWithImagesData[0]['HotelId'] = modifiedWithImagesData[0]['HotelCode'];

                  resolve(ResponseBuilder.successResponse('Data', modifiedWithImagesData[0]));

                }

              }
          }
          else {

              console.log("From Database");
              let requestResults_hotel_Json: any = [];
              let requestResults_images_Json: any = [];

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
              
              let requestResults_images =  await this.hotelMediaLinks(data, modiJson);
              requestResults_images_Json[0] = requestResults_images['Data'];

              requestResults_images_Json = await this.filterImage('L',requestResults_images_Json);
              
              let HotelDetails = await this.mongodb.findHotelDetailsDocument({ "HotelCode": { $eq: modifyData.hotelCode }, "hash": { $eq: modifyData.hash } });
              let ifancydat_hotel = await this.mongodb.findHotelDocument({ "HotelId": { $eq: modifyData.hotelCode } });
              HotelDetails[0]['Amenity'] = ifancydat_hotel[0]['rawData']['Amenity'];
              if (HotelDetails[0]['HotelRateDetail']) {
                  let HotelRateDetail = HotelDetails[0]['HotelRateDetail'];
                  let HotelRateDetailLength = HotelRateDetail.length;
                  for (let i = 0; i < HotelRateDetailLength; i++) {

                      HotelRateDetail[i]['currencies'] = {
                        Symbol: "",
                      };

                      let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                      HotelRateDetail[i]['currencies']['Symbol'] = Symbol;
                  }
              }


              let DistanceYardsUnits =  HotelDetails[0]['Distance']['Units'];
              let DistanceYardsValue = parseInt( HotelDetails[0]['Distance']['Value']);
              let DistanceYardsDirection =  HotelDetails[0]['Distance']['Direction'];
              
              let DistanceYardsValueSum = DistanceYardsValue*1760

              HotelDetails[0]['DistanceYards'] = {
                "Units": "YD",
                "Value": DistanceYardsValueSum,
                "Direction": DistanceYardsDirection
              }

              // mapping var with Json object
              requestResults_hotel_Json = HotelDetails

              let modifiedWithImagesData = await this.captionImageMatchingRawData(requestResults_images_Json, requestResults_hotel_Json);
              modifiedWithImagesData[0]['HotelId'] = modifiedWithImagesData[0]['HotelCode'];

              resolve(ResponseBuilder.successResponse('Data', modifiedWithImagesData[0]));
          }
      }
    });
  }

  async http_moreHotelSearchingAvailability(data, modifyData): Promise<any>{


    let node_env = process.env.NODE_ENV;
    let TARGET_BRANCH: string;
    let PROVIDER_CODE: string;
    let ACCEPT_ENCODING: string;
    let CONTENT_TYPE: string;
    let AUTHORIZATION: string;
    let HOTEL_SERVICE_URL: string;

    if(node_env == 'production'){

      HOTEL_SERVICE_URL = process.env.Production_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Production_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Production_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Production_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Production_CONTENT_TYPE;
      AUTHORIZATION = process.env.Production_AUTHORIZATION;
    
    }
    else
    {

      HOTEL_SERVICE_URL = process.env.Development_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Development_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Development_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Development_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Development_CONTENT_TYPE;
      AUTHORIZATION = process.env.Development_AUTHORIZATION;
    
    }

    let dataValues = data;

    return new Promise(async (resolve)=> {

      try {

        let _build_data;
       

        if(modifyData.mode == "latlng") {

          let xmlData: string = fs.readFileSync(path.resolve(__dirname, './soapXML/moreHotelSearchLatLog.xml',), 'utf-8');
          let _replace_data = xmlData.split('--TraceId--').join(dataValues.TraceId);
          _replace_data = _replace_data.split('--NextResultReference--').join(dataValues.NextResultReference);
          _replace_data = _replace_data.split('--latitude--').join(dataValues.Latitude);
          _replace_data = _replace_data.split('--longitude--').join(dataValues.Longitude);
          _replace_data = _replace_data.split('--ReferencePoint--').join(dataValues.ReferencePoint);
          _replace_data = _replace_data.split('--AvailableHotelsOnly--').join(dataValues.AvailableHotelsOnly);
          _replace_data = _replace_data.split('--Adults--').join(dataValues.Adults);
          _replace_data = _replace_data.split('--Rooms--').join(dataValues.Rooms);
          _replace_data = _replace_data.split('--Provider--').join(dataValues.Provider);
          _replace_data = _replace_data.split('--To--').join(dataValues.To);
          _replace_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);
          _replace_data = _replace_data.split('--From--').join(dataValues.From);
          _replace_data = _replace_data.split('--NumberOfChildren--').join(dataValues.Ages);
          _replace_data = _replace_data.split('--HotelRatingRange--').join(dataValues.Rating);
          _build_data = _replace_data.split('--Base--').join(dataValues.Base);

        }
        else
        {

          let xmlData: string = fs.readFileSync(path.resolve(__dirname, './soapXML/hotelSearch.xml',), 'utf-8');
          let _replace_data = xmlData.split('--TraceId--').join(dataValues.TraceId);
          _replace_data = _replace_data.split('--HotelLoc--').join(dataValues.HotelLoc);
          _replace_data = _replace_data.split('--ReferencePoint--').join(dataValues.ReferencePoint);
          _replace_data = _replace_data.split('--Adults--').join(dataValues.Adults);
          _replace_data = _replace_data.split('--Rooms--').join(dataValues.Rooms);
          _replace_data = _replace_data.split('--Provider--').join(dataValues.Provider);
          _replace_data = _replace_data.split('--To--').join(dataValues.To);
          _replace_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);
          _replace_data = _replace_data.split('--From--').join(dataValues.From);
          _replace_data = _replace_data.split('--NumberOfChildren--').join(dataValues.Ages);
          _replace_data = _replace_data.split('--HotelRatingRange--').join(dataValues.Rating);
          _build_data = _replace_data.split('--Base--').join(dataValues.Base);

        }



        console.log(_build_data);


        //soap create request
        let config = {
          method: 'post',
          url:HOTEL_SERVICE_URL,
          headers: {
            'TargetBranch': TARGET_BRANCH,
            'ProviderCode': PROVIDER_CODE,
            'Accept-Encoding': ACCEPT_ENCODING,
            'Content-Type': CONTENT_TYPE,
            'Authorization': AUTHORIZATION,
          },
          data : _build_data
        };


        let LogsDate = new Date();
        let hash = md5(LogsDate + dataValues.TraceId);
        let ApiDataLog = JSON.stringify(config);
        let logs = {
            TraceId: dataValues.TraceId,
            Hashpair: hash,
            TriggerHit: "Req More Hotel Searching Availability Api",
            Date: LogsDate,
            Data: ApiDataLog
        };
        await this.mongodb.applicationloggedMultiInsert(logs);

        let responseData,status=200;

        //soap execute request
        let response = await axios(config);

        if(response.status == 200){

          let LogsDate = new Date();
          let ApiDataLog = JSON.stringify(response.data);
          let logs = {
              TraceId: dataValues.TraceId,
              Hashpair: hash,
              TriggerHit: "Res More Hotel Searching Availability Api",
              Date: LogsDate,
              Data: ApiDataLog
          };
          await this.mongodb.applicationloggedMultiInsert(logs);

          parseString(response.data, function (err, result) {

            let requestResult
            requestResult = result['SOAP:Envelope']['SOAP:Body'][0]



            if(requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']){

              let status = 404;
              let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
              let faultcode = requestResult['SOAP:Fault'][0]['detail'][0]['common_v52_0:ErrorInfo'][0]['common_v52_0:Code'][0]
              let responseData :any = {"status":status, "faultcode": faultcode, "message":message}
              resolve(responseData);
            }
            else {

              let tempData = [];
              let a = JSON.parse(JSON.stringify(requestResult));
              let hotelSearchResult = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'];
              let hotelSearchResultLength = hotelSearchResult.length;
              let NextResultReference = "";
              if (a['hotel:HotelSearchAvailabilityRsp'][0]['common_v52_0:NextResultReference']) {
                  NextResultReference = a['hotel:HotelSearchAvailabilityRsp'][0]['common_v52_0:NextResultReference'][0]['_'];
              }
              else {
                  NextResultReference = "nomore";
              }
              console.log('--checking NextResultReference');
              console.log(NextResultReference);
              for (let i = 0; i < hotelSearchResultLength; i++) {
                  let distanceList = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['common_v52_0:Distance'];
                  let hotelRatingList = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:HotelRating'];
                  let rateInfoList = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:RateInfo'];
                  let JSONData = {
                      ProviderCode: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['common_v52_0:VendorLocation'][0]['$']['ProviderCode'],
                      VendorCode: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['common_v52_0:VendorLocation'][0]['$']['VendorCode'],
                      VendorLocationID: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['common_v52_0:VendorLocation'][0]['$']['VendorLocationID'],
                      HotelChain: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelChain'],
                      HotelCode: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelCode'],
                      HotelLocation: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelLocation'],
                      Name: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['Name'],
                      HotelTransportation: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelTransportation'],
                      ReserveRequirement: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['ReserveRequirement'],
                      ParticipationLevel: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['ParticipationLevel'],
                      Availability: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['Availability'],
                      Address: [{
                              Name: ""
                          }],
                      Distance: {
                          Units: distanceList[0]['$']['Units'],
                          Value: distanceList[0]['$']['Value'],
                          Direction: distanceList[0]['$']['Direction'],
                      },
                      HotelRating: {
                          RatingProvider: "",
                          Rating: "",
                      },
                      Amenity: [],
                      RateInfo: {
                          MinimumAmount: rateInfoList[0]['$']['MinimumAmount'],
                          MaximumAmount: rateInfoList[0]['$']['MaximumAmount'],
                          ApproximateMinimumAmount: rateInfoList[0]['$']['ApproximateMinimumAmount'],
                          ApproximateMaximumAmount: rateInfoList[0]['$']['ApproximateMaximumAmount'],
                          MinAmountRateChanged: rateInfoList[0]['$']['MinAmountRateChanged'],
                          MaxAmountRateChanged: rateInfoList[0]['$']['MaxAmountRateChanged'],
                      }
                  };
                  if (a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:Amenities']) {
                      let hotelAmenities = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:Amenities'];
                      let Amenity = hotelAmenities[0]['hotel:Amenity'];
                      let hotelAmenitiesLength = Amenity.length;
                      let hotelAmenities_data = [];
                      for (let d = 0; d < hotelAmenitiesLength; d++) {
                          let hotelAmenities_xdata = {
                              'Code': Amenity[d]['$']['Code'],
                              'AmenityType': Amenity[d]['$']['AmenityType'],
                          };
                          hotelAmenities_data.push(hotelAmenities_xdata);
                      }
                      JSONData['Amenity'] = hotelAmenities_data;
                  }
                  if (a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:HotelRating']) {
                      JSONData['HotelRating']['RatingProvider'] = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:HotelRating'][0]['$']['RatingProvider'];
                      JSONData['HotelRating']['Rating'] = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:HotelRating'][0]['$']['MaximumAmount'];
                  }
                  if (a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:PropertyAddress']) {
                      JSONData['Address'][0]['Name'] = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:PropertyAddress'][0]['hotel:Address'][0];
                  }
                  data = {
                      HotelId: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelCode'],
                      IataCode: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelLocation'],
                      rawData: JSONData
                  };
                  tempData.push(data);
              }
              data = {
                  "NextResultReference": NextResultReference,
                  "Hotels": tempData
              };
              resolve(data);

            }

          });

        }
      } catch(e) {
        console.log('Error:', e.stack);
      }

    });
  }

  async http_HotelSearchingAvailability(data, modifyData): Promise<any>{


    let node_env = process.env.NODE_ENV;
    let TARGET_BRANCH: string;
    let PROVIDER_CODE: string;
    let ACCEPT_ENCODING: string;
    let CONTENT_TYPE: string;
    let AUTHORIZATION: string;
    let HOTEL_SERVICE_URL: string;

    if(node_env == 'production'){

      HOTEL_SERVICE_URL = process.env.Production_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Production_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Production_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Production_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Production_CONTENT_TYPE;
      AUTHORIZATION = process.env.Production_AUTHORIZATION;
    
    }
    else
    {

      HOTEL_SERVICE_URL = process.env.Development_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Development_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Development_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Development_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Development_CONTENT_TYPE;
      AUTHORIZATION = process.env.Development_AUTHORIZATION;
    
    }


    let dataValues = data;
    return new Promise(async (resolve)=> {

      try {

        let _build_data;

        if(modifyData.mode == "latlng") {

          let xmlData: string = fs.readFileSync(path.resolve(__dirname, './soapXML/hotelSearchLatLog.xml',), 'utf-8');
          let _replace_data = xmlData.split('--TraceId--').join(dataValues.TraceId);
          _replace_data = _replace_data.split('--latitude--').join(dataValues.Latitude);
          _replace_data = _replace_data.split('--Base--').join(dataValues.Base);
          _replace_data = _replace_data.split('--AvailableHotelsOnly--').join(dataValues.AvailableHotelsOnly);
          _replace_data = _replace_data.split('--longitude--').join(dataValues.Longitude);
          _replace_data = _replace_data.split('--ReferencePoint--').join(dataValues.ReferencePoint);
          _replace_data = _replace_data.split('--Adults--').join(dataValues.Adults);
          _replace_data = _replace_data.split('--Rooms--').join(dataValues.Rooms);
          _replace_data = _replace_data.split('--Provider--').join(dataValues.Provider);
          _replace_data = _replace_data.split('--To--').join(dataValues.To);
          _replace_data = _replace_data.split('--From--').join(dataValues.From);
          _replace_data = _replace_data.split('--NumberOfChildren--').join(dataValues.Ages);
          _replace_data = _replace_data.split('--HotelRatingRange--').join(dataValues.Rating);
          _build_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);

          

        }
        else
        {

          let xmlData: string = fs.readFileSync(path.resolve(__dirname, './soapXML/hotelSearch.xml',), 'utf-8');
          let _replace_data = xmlData.split('--TraceId--').join(dataValues.TraceId);
          _replace_data = _replace_data.split('--HotelLoc--').join(dataValues.HotelLoc);
          _replace_data = _replace_data.split('--Base--').join(dataValues.Base);
          _replace_data = _replace_data.split('--AvailableHotelsOnly--').join(dataValues.AvailableHotelsOnly)
          _replace_data = _replace_data.split('--ReferencePoint--').join(dataValues.ReferencePoint);
          _replace_data = _replace_data.split('--Adults--').join(dataValues.Adults);
          _replace_data = _replace_data.split('--Rooms--').join(dataValues.Rooms);
          _replace_data = _replace_data.split('--Provider--').join(dataValues.Provider);
          _replace_data = _replace_data.split('--To--').join(dataValues.To);
          _replace_data = _replace_data.split('--From--').join(dataValues.From);
          _replace_data = _replace_data.split('--NumberOfChildren--').join(dataValues.Ages);
          _replace_data = _replace_data.split('--HotelRatingRange--').join(dataValues.Rating);
          _build_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);

        }


        console.log(_build_data);

        //soap create request
        let config = {
          method: 'post',
          url:HOTEL_SERVICE_URL,
          headers: {
            'TargetBranch': TARGET_BRANCH,
            'ProviderCode': PROVIDER_CODE,
            'Accept-Encoding': ACCEPT_ENCODING,
            'Content-Type': CONTENT_TYPE,
            'Authorization': AUTHORIZATION,
          },
          data : _build_data
        };

        let LogsDate = new Date();
        let hash = md5(LogsDate + dataValues.TraceId);
        let ApiDataLog = JSON.stringify(config);
        let logs = {
            TraceId: dataValues.TraceId,
            Hashpair: hash,
            TriggerHit: "Req Searching Availability Api",
            Date: LogsDate,
            Data: ApiDataLog
        };
        await this.mongodb.applicationloggedMultiInsert(logs);

        let responseData,status=200;

        //soap execute request
        let response = await axios(config);

        if(response.status == 200){

          let LogsDate = new Date();
          let ApiDataLog = JSON.stringify(response.data);
          let logs = {
              TraceId: dataValues.TraceId,
              Hashpair: hash,
              TriggerHit: "Res Searching Availability Api",
              Date: LogsDate,
              Data: ApiDataLog
          };
          await this.mongodb.applicationloggedMultiInsert(logs);

          parseString(response.data, function (err, result) {

            let requestResult
            requestResult = result['SOAP:Envelope']['SOAP:Body'][0]



            if(requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']){

              let status = 404;
              let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
              let faultcode = requestResult['SOAP:Fault'][0]['detail'][0]['common_v52_0:ErrorInfo'][0]['common_v52_0:Code'][0]
              let responseData :any = {"status":status, "faultcode": faultcode, "message":message}
              resolve(responseData);
            }
            else {

              let tempData = [];
              let a = JSON.parse(JSON.stringify(requestResult));
              let hotelSearchResult = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'];
              let hotelSearchResultLength = hotelSearchResult.length;
              let NextResultReference = "";
              if (a['hotel:HotelSearchAvailabilityRsp'][0]['common_v52_0:NextResultReference']) {
                  NextResultReference = a['hotel:HotelSearchAvailabilityRsp'][0]['common_v52_0:NextResultReference'][0]['_'];
              }
              else {
                  NextResultReference = "nomore";
              }
              for (let i = 0; i < hotelSearchResultLength; i++) {
                  let distanceList = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['common_v52_0:Distance'];
                  let hotelRatingList = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:HotelRating'];
                  let rateInfoList = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:RateInfo'];
                  let JSONData = {
                      ProviderCode: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['common_v52_0:VendorLocation'][0]['$']['ProviderCode'],
                      VendorCode: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['common_v52_0:VendorLocation'][0]['$']['VendorCode'],
                      VendorLocationID: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['common_v52_0:VendorLocation'][0]['$']['VendorLocationID'],
                      HotelChain: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelChain'],
                      HotelCode: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelCode'],
                      HotelLocation: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelLocation'],
                      Name: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['Name'],
                      HotelTransportation: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelTransportation'],
                      ReserveRequirement: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['ReserveRequirement'],
                      ParticipationLevel: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['ParticipationLevel'],
                      Availability: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['Availability'],
                      Address: [{
                              Name: ""
                          }],
                      Distance: {
                          Units: distanceList[0]['$']['Units'],
                          Value: distanceList[0]['$']['Value'],
                          Direction: distanceList[0]['$']['Direction'],
                      },
                      HotelRating: {
                          RatingProvider: "",
                          Rating: "",
                      },
                      Amenity: [],
                      RateInfo: {}
                  };


                  if(rateInfoList){
                    JSONData['RateInfo'] = {
                      MinimumAmount: rateInfoList[0]['$']['MinimumAmount'],
                      MaximumAmount: rateInfoList[0]['$']['MaximumAmount'],
                      ApproximateMinimumAmount: rateInfoList[0]['$']['ApproximateMinimumAmount'],
                      ApproximateMaximumAmount: rateInfoList[0]['$']['ApproximateMaximumAmount'],
                      MinAmountRateChanged: rateInfoList[0]['$']['MinAmountRateChanged'],
                      MaxAmountRateChanged: rateInfoList[0]['$']['MaxAmountRateChanged'],
                    }
                  }


                  if (a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:Amenities']) {
                      let hotelAmenities = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:Amenities'];
                      let Amenity = hotelAmenities[0]['hotel:Amenity'];
                      let hotelAmenitiesLength = Amenity.length;
                      let hotelAmenities_data = [];
                      for (let d = 0; d < hotelAmenitiesLength; d++) {
                          let hotelAmenities_xdata = {
                              'Code': Amenity[d]['$']['Code'],
                              'AmenityType': Amenity[d]['$']['AmenityType'],
                          };
                          hotelAmenities_data.push(hotelAmenities_xdata);
                      }
                      JSONData['Amenity'] = hotelAmenities_data;
                  }
                  if (a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:HotelRating']) {
                      JSONData['HotelRating']['RatingProvider'] = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:HotelRating'][0]['$']['RatingProvider'];
                      JSONData['HotelRating']['Rating'] = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:HotelRating'][0]['$']['MaximumAmount'];
                  }
                  if (a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:PropertyAddress']) {
                      JSONData['Address'][0]['Name'] = a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['hotel:PropertyAddress'][0]['hotel:Address'][0];
                  }
                  data = {
                      HotelId: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelCode'],
                      IataCode: a['hotel:HotelSearchAvailabilityRsp'][0]['hotel:HotelSearchResult'][i]['hotel:HotelProperty'][0]['$']['HotelLocation'],
                      rawData: JSONData
                  };
                  tempData.push(data);
              }
              data = {
                  "NextResultReference": NextResultReference,
                  "Hotels": tempData
              };
              resolve(data);

            }

          });

        }
      } catch(e) {
        console.log('Error:', e.stack);
      }

    });
  }

  async moreHotelServiceAvailabilityRequest(data, modifyData): Promise<any> {

    

    return new Promise(async (resolve) => {
      await this.mongodb.connect();
      let CACHE_TIME : number = parseInt(process.env.Cache_Time);
      let findCacheDocument = await this.mongodb.findCacheDocument({ "hash": { $eq: modifyData.hash } });

      if (findCacheDocument.length == 0) {
      
          console.log('from Travelport');
          let hotelList = await this.http_moreHotelSearchingAvailability(data, modifyData);
          let parentHotelId = [];
          let httpStatus = hotelList['status'];
          if (httpStatus == 404) {
   
              resolve(ResponseBuilder.errorMultiResponse('message', hotelList['message'], 'faultcode', hotelList['faultcode']));
          }
          else {
              for (let i = 0; i < hotelList['Hotels'].length; i++) {
                  let findHotelDocument = await this.mongodb.findHotelDocument({ "HotelId": { $eq: hotelList['Hotels'][i].HotelId } });
                  if (findHotelDocument.length >= 1) {

                      let Latitude = data.Latitude;
                      let Longitude = data.Longitude;

                      hotelList['Hotels'][i]['elastic'] = true;
                      hotelList['Hotels'][i]['search_Latitude'] = Latitude;
                      hotelList['Hotels'][i]['search_Longitude'] = Longitude;
                      hotelList['Hotels'][i]['date'] = new Date();

                      await this.mongodb.updateHotelDocument({ "HotelId": hotelList['Hotels'][i].HotelId }, { $set: hotelList['Hotels'][i] });
                  }
                  else {

                      let Latitude = data.Latitude;
                      let Longitude = data.Longitude;

                      hotelList['Hotels'][i]['elastic'] = false;
                      hotelList['Hotels'][i]['search_Latitude'] = Latitude;
                      hotelList['Hotels'][i]['search_Longitude'] = Longitude;
                      hotelList['Hotels'][i]['date'] = new Date();

                      await this.mongodb.newHotelDocument(hotelList['Hotels'][i]);
                  }
                  parentHotelId.push({ "hotelCode": hotelList['Hotels'][i].HotelId });
              }
              modifyData['nextResultReference'] = hotelList.NextResultReference;
              modifyData['parent'] = parentHotelId;
              
              modifyData['QueryData'] = JSON.parse(JSON.stringify(data));

              let SnycByCron = data.SnycByCron
              let PageNumber = data.Page

              console.log(PageNumber);

              if(SnycByCron)
              {
                if(PageNumber <= 4){

                  modifyData['Page'] = data.Page
                  await this.mongodb.newSyncLoadDataDocument(modifyData)
                }
              }

              await this.mongodb.newCacheDocument(modifyData);

              let Res = await this.mongodb.findCacheDocument({ "hash": { $eq: modifyData.hash } });
              let parents = Res[0].parent;
              let resData = [];
              let parentsLength = parents.length;
              for (let a = 0; a < parentsLength; a++) {
                  let HotelRaw = await this.mongodb.findHotelDocument({ "HotelId": { $eq: parents[a].hotelCode } });
                  let ApproximateMaximumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMaximumAmount'];
                  let ApproximateMinimumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMinimumAmount'];
                  let MaxAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MaxAmountRateChanged'];
                  let MinAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MinAmountRateChanged'];
                  
                  HotelRaw[0]['rawData']['currencies'] = {
                      MinimumAmount: ApproximateMinimumAmount,
                      MaximumAmount: ApproximateMaximumAmount,
                      MaxAmountRateChanged: MaxAmountRateChanged,
                      MinAmountRateChanged: MinAmountRateChanged,
                      Symbol: ""
                  };

                  let DistanceYardsUnits = HotelRaw[0]['rawData']['Distance']['Units'];
                  let DistanceYardsValue = parseInt(HotelRaw[0]['rawData']['Distance']['Value']);
                  let DistanceYardsDirection = HotelRaw[0]['rawData']['Distance']['Direction'];

                  let DistanceYardsValueSum = DistanceYardsValue*1760

                  HotelRaw[0]['rawData']['DistanceYards'] = {
                    "Units": "YD",
                    "Value": DistanceYardsValueSum,
                    "Direction": DistanceYardsDirection
                  }


                  let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                  HotelRaw[0]['rawData']['currencies']['Symbol'] = Symbol;
                  resData.push(HotelRaw[0]);
              
              }
              let data_r = {
                  NextResultReference: hotelList.NextResultReference,
                  Hotels: resData
              };
              resolve(ResponseBuilder.successResponse('Data', data_r));
          }
      }
      else {
          let timeAgo = await this.timeAgo(findCacheDocument[0].timeout);
          if (timeAgo >= CACHE_TIME) {

              console.log('from travelport');
              let hotelList = await this.http_moreHotelSearchingAvailability(data, modifyData);
              let parentHotelId = [];
              let httpStatus = hotelList['status'];
              if (httpStatus == 404) {
               
                resolve(ResponseBuilder.errorMultiResponse('message', hotelList['message'], 'faultcode', hotelList['faultcode']));
              }
              else {
                  for (let i = 0; i < hotelList['Hotels'].length; i++) {
                      let findHotelDocument = await this.mongodb.findHotelDocument({ "HotelId": { $eq: hotelList['Hotels'][i].HotelId } });
                      if (findHotelDocument.length >= 1) {

                          let Latitude = data.Latitude;
                          let Longitude = data.Longitude;
      
                          hotelList['Hotels'][i]['elastic'] = true;
                          hotelList['Hotels'][i]['search_Latitude'] = Latitude;
                          hotelList['Hotels'][i]['search_Longitude'] = Longitude;
                          hotelList['Hotels'][i]['date'] = new Date();

                          await this.mongodb.updateHotelDocument({ "HotelId": hotelList['Hotels'][i].HotelId }, { $set: hotelList['Hotels'][i] });
                      }
                      else {

                          let Latitude = data.Latitude;
                          let Longitude = data.Longitude;
      
                          hotelList['Hotels'][i]['elastic'] = false;
                          hotelList['Hotels'][i]['search_Latitude'] = Latitude;
                          hotelList['Hotels'][i]['search_Longitude'] = Longitude;
                          hotelList['Hotels'][i]['date'] = new Date();


                          let SnycByCron = data.SnycByCron
                          let PageNumber = data.Page
            
                          console.log(PageNumber);

                          if(SnycByCron)
                          {
                            if(PageNumber <= 4){

                              modifyData['Page'] = data.Page
                              await this.mongodb.newSyncLoadDataDocument(modifyData);

                            }
                          }

                         
                          await this.mongodb.newHotelDocument(hotelList['Hotels'][i]);
                      }
                      parentHotelId.push({ "hotelCode": hotelList['Hotels'][i].HotelId });
                  }
                  modifyData['nextResultReference'] = hotelList.NextResultReference;
                  modifyData['parent'] = parentHotelId;
                  
                  modifyData['QueryData'] = JSON.parse(JSON.stringify(data));

                  await this.mongodb.updateCacheDocument({ "hash": modifyData.hash }, { $set: modifyData });
                  await this.mongodb.updateSyncLoadDataDocument({ "hash": modifyData.hash }, { $set: modifyData });

                  let Res = await this.mongodb.findCacheDocument({ "hash": { $eq: modifyData.hash } });
                  let parents = Res[0].parent;
                  let resData = [];
                  let parentsLength = parents.length;
                  for (let a = 0; a < parentsLength; a++) {
                      
                    let HotelRaw = await this.mongodb.findHotelDocument({ "HotelId": { $eq: parents[a].hotelCode } });
                      let ApproximateMaximumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMaximumAmount'];
                      let ApproximateMinimumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMinimumAmount'];
                      let MaxAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MaxAmountRateChanged'];
                      let MinAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MinAmountRateChanged'];
                      
                      HotelRaw[0]['rawData']['currencies'] = {
                          MinimumAmount: ApproximateMinimumAmount,
                          MaximumAmount: ApproximateMaximumAmount,
                          MaxAmountRateChanged: MaxAmountRateChanged,
                          MinAmountRateChanged: MinAmountRateChanged,
                          Symbol: ""
                      };
                      
                      let DistanceYardsUnits = HotelRaw[0]['rawData']['Distance']['Units'];
                      let DistanceYardsValue = parseInt(HotelRaw[0]['rawData']['Distance']['Value']);
                      let DistanceYardsDirection = HotelRaw[0]['rawData']['Distance']['Direction'];
    
                      let DistanceYardsValueSum = DistanceYardsValue*1760
    
                      HotelRaw[0]['rawData']['DistanceYards'] = {
                        "Units": "YD",
                        "Value": DistanceYardsValueSum,
                        "Direction": DistanceYardsDirection
                      }
                      
                      let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                      HotelRaw[0]['rawData']['currencies']['Symbol'] = Symbol;
                      resData.push(HotelRaw[0]);
                  
                  }
                  let data_r = {
                      NextResultReference: hotelList.NextResultReference,
                      Hotels: resData
                  };
                  resolve(ResponseBuilder.successResponse('Data', data_r));
              }
          }
          else {

              console.log('from database');
              let parents = findCacheDocument[0].parent;
              let resData = [];
              let parentsLength = parents.length;
              for (let a = 0; a < parentsLength; a++) {
                  let HotelRaw = await this.mongodb.findHotelDocument({ "HotelId": { $eq: parents[a].hotelCode } });
                  let ApproximateMaximumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMaximumAmount'];
                  let ApproximateMinimumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMinimumAmount'];
                  let MaxAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MaxAmountRateChanged'];
                  let MinAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MinAmountRateChanged'];
                  
                  HotelRaw[0]['rawData']['currencies'] = {
                      MinimumAmount: ApproximateMinimumAmount,
                      MaximumAmount: ApproximateMaximumAmount,
                      MaxAmountRateChanged: MaxAmountRateChanged,
                      MinAmountRateChanged: MinAmountRateChanged,
                      Symbol: ""
                  };


                  let DistanceYardsUnits = HotelRaw[0]['rawData']['Distance']['Units'];
                  let DistanceYardsValue = parseInt(HotelRaw[0]['rawData']['Distance']['Value']);
                  let DistanceYardsDirection = HotelRaw[0]['rawData']['Distance']['Direction'];

                  let DistanceYardsValueSum = DistanceYardsValue*1760

                  HotelRaw[0]['rawData']['DistanceYards'] = {
                    "Units": "YD",
                    "Value": DistanceYardsValueSum,
                    "Direction": DistanceYardsDirection
                  }

                  let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                  HotelRaw[0]['rawData']['currencies']['Symbol'] = Symbol;
                  resData.push(HotelRaw[0]);
              }


              let data_r = {
                  NextResultReference: findCacheDocument[0]['nextResultReference'],
                  Hotels: resData
              };
              
              resolve(ResponseBuilder.successResponse('Data', data_r));
          }
      }
  });


  }

  async hotelServiceAvailabilityRequest(data, modifyData): Promise<any> {

    return new Promise(async (resolve) => {
      await this.mongodb.connect();
      let CACHE_TIME : number = parseInt(process.env.Cache_Time);
      let findCacheDocument = await this.mongodb.findCacheDocument({ "hash": { $eq: modifyData.hash } });
      console.log(modifyData);
      console.log(findCacheDocument);

      if (findCacheDocument.length == 0) {

          console.log('From Travelport');
          let hotelList = await this.http_HotelSearchingAvailability(data, modifyData);

          console.log(hotelList);

          let parentHotelId = [];
          let httpStatus = hotelList['status'];
          if (httpStatus == 404) {
          
            resolve(ResponseBuilder.errorMultiResponse('message', httpStatus['message'], 'faultcode', httpStatus['faultcode']));
          }
          else {
              for (let i = 0; i < hotelList['Hotels'].length; i++) {
                  let findHotelDocument = await this.mongodb.findHotelDocument({ "HotelId": { $eq: hotelList['Hotels'][i].HotelId } });
                  if (findHotelDocument.length >= 1) {

                    let Latitude = data.Latitude;
                    let Longitude = data.Longitude;

                    hotelList['Hotels'][i]['elastic'] = true;
                    hotelList['Hotels'][i]['search_Latitude'] = Latitude;
                    hotelList['Hotels'][i]['search_Longitude'] = Longitude;
                    hotelList['Hotels'][i]['date'] = new Date();

                    await this.mongodb.updateHotelDocument({ "HotelId": hotelList['Hotels'][i].HotelId }, { $set: hotelList['Hotels'][i] });

                  }
                  else {

                    let Latitude = data.Latitude;
                    let Longitude = data.Longitude;

                    hotelList['Hotels'][i]['elastic'] = false;
                    hotelList['Hotels'][i]['search_Latitude'] = Latitude;
                    hotelList['Hotels'][i]['search_Longitude'] = Longitude;
                    hotelList['Hotels'][i]['date'] = new Date();

                    await this.mongodb.newHotelDocument(hotelList['Hotels'][i]);

                  }
                  parentHotelId.push({ "hotelCode": hotelList['Hotels'][i].HotelId });
              }
              modifyData['nextResultReference'] = hotelList.NextResultReference;
              modifyData['parent'] = parentHotelId;
              modifyData['Page'] = 1;
              modifyData['QueryData'] = JSON.parse(JSON.stringify(data));


              await this.mongodb.newCacheDocument(modifyData);
              await this.mongodb.newSyncLoadDataDocument(modifyData)

              let Res = await this.mongodb.findCacheDocument({ "hash": { $eq: modifyData.hash } });
              let parents = Res[0].parent;
              let resData = [];
              let parentsLength = parents.length;
              for (let a = 0; a < parentsLength; a++) {
                  let HotelRaw = await this.mongodb.findHotelDocument({ "HotelId": { $eq: parents[a].hotelCode } });
                  let ApproximateMaximumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMaximumAmount'];
                  let ApproximateMinimumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMinimumAmount'];
                  let MaxAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MaxAmountRateChanged'];
                  let MinAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MinAmountRateChanged'];
                  
                  HotelRaw[0]['rawData']['currencies'] = {
                      MinimumAmount: ApproximateMinimumAmount,
                      MaximumAmount: ApproximateMaximumAmount,
                      MaxAmountRateChanged: MaxAmountRateChanged,
                      MinAmountRateChanged: MinAmountRateChanged,
                      Symbol: ""
                  };

                  let DistanceYardsUnits = HotelRaw[0]['rawData']['Distance']['Units'];
                  let DistanceYardsValue = parseInt(HotelRaw[0]['rawData']['Distance']['Value']);
                  let DistanceYardsDirection = HotelRaw[0]['rawData']['Distance']['Direction'];

                  let DistanceYardsValueSum = DistanceYardsValue*1760

                  HotelRaw[0]['rawData']['DistanceYards'] = {
                    "Units": "YD",
                    "Value": DistanceYardsValueSum,
                    "Direction": DistanceYardsDirection
                  }
                  
                  let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                  HotelRaw[0]['rawData']['currencies']['Symbol'] = Symbol;
                  resData.push(HotelRaw[0]);
              
              
              }
              
              let data_r = {
                  NextResultReference: hotelList.NextResultReference,
                  Hotels: resData
              };

              resolve(ResponseBuilder.successResponse('Data', data_r));
          }
      }
      else {


          let timeAgo = await this.timeAgo(findCacheDocument[0].timeout);
          if (timeAgo >= CACHE_TIME) {

              console.log('From Travelport');
              let hotelList = await this.http_HotelSearchingAvailability(data, modifyData);
              let parentHotelId = [];
              let httpStatus = hotelList['status'];
              if (httpStatus == 404) {
                resolve(ResponseBuilder.errorMultiResponse('message', hotelList['message'], 'faultcode', hotelList['faultcode']));
              }
              else {
                  for (let i = 0; i < hotelList['Hotels'].length; i++) {
                      let findHotelDocument = await this.mongodb.findHotelDocument({ "HotelId": { $eq: hotelList['Hotels'][i].HotelId } });
                      if (findHotelDocument.length >= 1) {

                          let Latitude = data.Latitude;
                          let Longitude = data.Longitude;
    
                          hotelList['Hotels'][i]['elastic'] = true;
                          hotelList['Hotels'][i]['search_Latitude'] = Latitude;
                          hotelList['Hotels'][i]['search_Longitude'] = Longitude;
                          hotelList['Hotels'][i]['date'] = new Date();

                          await this.mongodb.updateHotelDocument({ "HotelId": hotelList['Hotels'][i].HotelId }, { $set: hotelList['Hotels'][i] });
                      }
                      else {

                        let Latitude = data.Latitude;
                        let Longitude = data.Longitude;
    
                          hotelList['Hotels'][i]['elastic'] = false;
                          hotelList['Hotels'][i]['search_Latitude'] = Latitude;
                          hotelList['Hotels'][i]['search_Longitude'] = Longitude;
                          hotelList['Hotels'][i]['date'] = new Date();

                          await this.mongodb.newHotelDocument(hotelList['Hotels'][i]);
                      }
                      parentHotelId.push({ "hotelCode": hotelList['Hotels'][i].HotelId });
                  }
                  modifyData['nextResultReference'] = hotelList.NextResultReference;
                  modifyData['parent'] = parentHotelId;
                  modifyData['Page'] = 1;
                  modifyData['QueryData'] = JSON.parse(JSON.stringify(data));

                  await this.mongodb.updateCacheDocument({ "hash": modifyData.hash }, { $set: modifyData });
                  await this.mongodb.updateSyncLoadDataDocument({ "hash": modifyData.hash }, { $set: modifyData })

                  let Res = await this.mongodb.findCacheDocument({ "hash": { $eq: modifyData.hash } });
                  let parents = Res[0].parent;
                  let resData = [];
                  let parentsLength = parents.length;
                  for (let a = 0; a < parentsLength; a++) {
                      let HotelRaw = await this.mongodb.findHotelDocument({ "HotelId": { $eq: parents[a].hotelCode } });
                      let ApproximateMaximumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMaximumAmount'];
                      let ApproximateMinimumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMinimumAmount'];
                      let MaxAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MaxAmountRateChanged'];
                      let MinAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MinAmountRateChanged'];
                      
                      HotelRaw[0]['rawData']['currencies'] = {
                          MinimumAmount: ApproximateMinimumAmount,
                          MaximumAmount: ApproximateMaximumAmount,
                          MaxAmountRateChanged: MaxAmountRateChanged,
                          MinAmountRateChanged: MinAmountRateChanged,
                          Symbol: ""
                      };

                      let DistanceYardsUnits = HotelRaw[0]['rawData']['Distance']['Units'];
                      let DistanceYardsValue = parseInt(HotelRaw[0]['rawData']['Distance']['Value']);
                      let DistanceYardsDirection = HotelRaw[0]['rawData']['Distance']['Direction'];
    
                      let DistanceYardsValueSum = DistanceYardsValue*1760
    
                      HotelRaw[0]['rawData']['DistanceYards'] = {
                        "Units": "YD",
                        "Value": DistanceYardsValueSum,
                        "Direction": DistanceYardsDirection
                      }

                      let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                      HotelRaw[0]['rawData']['currencies']['Symbol'] = Symbol;
                      resData.push(HotelRaw[0]);

                  }
                  let data_r = {
                      NextResultReference: hotelList.NextResultReference,
                      Hotels: resData
                  };
                  resolve(ResponseBuilder.successResponse('Data', data_r));
              }
          }
          else {

              console.log('From Database');
              let parents = findCacheDocument[0].parent;
              let resData = [];
              let parentsLength = parents.length;
              for (let a = 0; a < parentsLength; a++) {
                  let HotelRaw = await this.mongodb.findHotelDocument({ "HotelId": { $eq: parents[a].hotelCode } });
                  let ApproximateMaximumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMaximumAmount'];
                  let ApproximateMinimumAmount = HotelRaw[0]['rawData']['RateInfo']['ApproximateMinimumAmount'];
                  let MaxAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MaxAmountRateChanged'];
                  let MinAmountRateChanged = HotelRaw[0]['rawData']['RateInfo']['MinAmountRateChanged'];

                  HotelRaw[0]['rawData']['currencies'] = {
                      MinimumAmount: ApproximateMinimumAmount,
                      MaximumAmount: ApproximateMaximumAmount,
                      MaxAmountRateChanged: MaxAmountRateChanged,
                      MinAmountRateChanged: MinAmountRateChanged,
                      Symbol: ""
                  };


                  let DistanceYardsUnits = HotelRaw[0]['rawData']['Distance']['Units'];
                  let DistanceYardsValue = parseInt(HotelRaw[0]['rawData']['Distance']['Value']);
                  let DistanceYardsDirection = HotelRaw[0]['rawData']['Distance']['Direction'];

                  let DistanceYardsValueSum = DistanceYardsValue*1760

                  HotelRaw[0]['rawData']['DistanceYards'] = {
                    "Units": "YD",
                    "Value": DistanceYardsValueSum,
                    "Direction": DistanceYardsDirection
                  }

                  let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.Base } });
                  HotelRaw[0]['rawData']['currencies']['Symbol'] = Symbol;
                  resData.push(HotelRaw[0]);
              }
              let data_r = {
                  NextResultReference: findCacheDocument[0]['nextResultReference'],
                  Hotels: resData
              };
              resolve(ResponseBuilder.successResponse('Data', data_r));
          }
      }
  });


  }

  async http_GetMediaLinks(data:any): Promise<any>{

    let node_env = process.env.NODE_ENV;
    let TARGET_BRANCH: string;
    let PROVIDER_CODE: string;
    let ACCEPT_ENCODING: string;
    let CONTENT_TYPE: string;
    let AUTHORIZATION: string;
    let HOTEL_SERVICE_URL: string;

    if(node_env == 'production'){

      HOTEL_SERVICE_URL = process.env.Production_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Production_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Production_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Production_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Production_CONTENT_TYPE;
      AUTHORIZATION = process.env.Production_AUTHORIZATION;
    
    }
    else
    {

      HOTEL_SERVICE_URL = process.env.Development_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Development_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Development_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Development_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Development_CONTENT_TYPE;
      AUTHORIZATION = process.env.Development_AUTHORIZATION;
    
    }

    let dataValues = data;
    return new Promise(async (resolve)=> {

      try {


        let xmlData : string = fs.readFileSync(path.resolve(__dirname, './soapXML/getMediaLinks.xml'), 'utf8')
        let _replace_data = xmlData.split('--TraceId--').join(dataValues.TraceId);
        _replace_data = _replace_data.split('--HotelChain--').join(dataValues.HotelChain);
        _replace_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);
        let _build_data =   _replace_data.split('--HotelCode--').join(dataValues.HotelCode);

        console.log(_build_data);

        //soap create request
        let config = {
          method: 'post',
          url:HOTEL_SERVICE_URL,
          headers: {
            'TargetBranch': TARGET_BRANCH,
            'ProviderCode': PROVIDER_CODE,
            'Accept-Encoding': ACCEPT_ENCODING,
            'Content-Type': CONTENT_TYPE,
            'Authorization': AUTHORIZATION,
          },
          data : _build_data
        };

        let LogsDate = new Date();
        let hash = md5(LogsDate + dataValues.TraceId);
        let ApiDataLog = JSON.stringify(config);
        let logs = {
            TraceId: dataValues.TraceId,
            Hashpair: hash,
            TriggerHit: "Req Get Media Links Api",
            Date: LogsDate,
            Data: ApiDataLog
        };
        await this.mongodb.applicationloggedMultiInsert(logs);

        let responseData,status=200;

        //soap execute request

        let response = await axios(config)
        if(response.status == 200){

          let LogsDate = new Date();
          let ApiDataLog = JSON.stringify(response.data);
          let logs = {
              TraceId: dataValues.TraceId,
              Hashpair: hash,
              TriggerHit: "Res Get Media Links Api",
              Date: LogsDate,
              Data: ApiDataLog
          };
          await this.mongodb.applicationloggedMultiInsert(logs);

          parseString(response.data, async function(err, result) {

            let requestResult
            requestResult = result['SOAP:Envelope']['SOAP:Body'][0]

            if (requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']) {

              let status = 404;
              let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
              let faultcode = requestResult['SOAP:Fault'][0]['detail'][0]['common_v52_0:ErrorInfo'][0]['common_v52_0:Code'][0]
              let responseData :any = {"status":status, "faultcode": faultcode, "message":message}
              resolve(responseData);

            }
            else {

              let hotelProperty = requestResult['hotel:HotelMediaLinksRsp'][0]['hotel:HotelPropertyWithMediaItems'][0]['hotel:HotelProperty'];
              let mediaItem = requestResult['hotel:HotelMediaLinksRsp'][0]['hotel:HotelPropertyWithMediaItems'][0]['common_v52_0:MediaItem'];
              try {
                  let mediaItemLength = mediaItem.length;
                  let allMediaLinks = [];
                  for (let i = 0; i < mediaItemLength; i++) {
                      let assets = {
                          caption: mediaItem[i]['$']['caption'],
                          storage: 'live',
                          height: mediaItem[i]['$']['height'],
                          width: mediaItem[i]['$']['width'],
                          src: mediaItem[i]['$']['url'],
                          type: mediaItem[i]['$']['type'],
                          sizeCode: mediaItem[i]['$']['sizeCode'],
                      };
                      allMediaLinks.push(assets);
                  }
                  let rdata = {
                      HotelChain: hotelProperty[0]['$']['HotelChain'],
                      HotelCode: hotelProperty[0]['$']['HotelCode'],
                      MediaLinks: allMediaLinks
                  };
                  resolve(rdata);
              }
              catch (e) {
                  status = 404;
                  responseData = { "status": status, "message": 'Invalid Hotel Code' };
                  resolve(responseData);
              }



            }

          });

        }
      } catch(e) {
        console.log('Error:', e.stack);
      }

    });

  }

  async hotelMediaLinks(data, modifyData) {


    return new Promise(async (resolve) => {

      await this.mongodb.connect();
      let CACHE_TIME : number = parseInt(process.env.Cache_Time);
      let findMediaLinkDocument = await this.mongodb.findMediaLinkCacheDocument({ "hash": { $eq: modifyData.hash } });
      if (findMediaLinkDocument.length == 0) {

          console.log('from tavelport');
          let reData = await this.http_GetMediaLinks(data);
          let httpStatus = reData['status'];
          if (httpStatus == 404) {
            
            resolve(ResponseBuilder.errorMultiResponse('message', reData['message'], 'faultcode', reData['faultcode']));
          }
          else {
              await this.mongodb.newMediaLinkCacheDocument(modifyData);
              await this.mongodb.newMediaLinkDocument(reData);
              let databaseData = await this.mongodb.findMediaLinkDocument({ "HotelCode": { $eq: reData.HotelCode } });

              resolve(ResponseBuilder.successResponse('Data', databaseData[0]));
          }
      }
      else {
          let timeAgo = await this.timeAgo(findMediaLinkDocument[0].timeout);
          if (timeAgo >= CACHE_TIME) {

              console.log('from travelport');
              let reData = await this.http_GetMediaLinks(data);
              let httpStatus = reData['status'];
              if (httpStatus == 404) {
     
                resolve(ResponseBuilder.errorMultiResponse('message', reData['message'], 'faultcode', reData['faultcode']));
              }
              else {
                  await this.mongodb.updateMediaLinkCacheDocument({ "hash": modifyData.hash }, { $set: modifyData });
                  await this.mongodb.updateMediaLinkDocument({ "HotelCode": reData.HotelCode }, { $set: reData });
                  let databaseData = await this.mongodb.findMediaLinkDocument({ "HotelCode": { $eq: reData.HotelCode } });

                  resolve(ResponseBuilder.successResponse('Data', databaseData[0]));
              }
          }
          else {

              console.log('from database');
              let databaseData = await this.mongodb.findMediaLinkDocument({ "HotelCode": { $eq: modifyData.hotelCode } });
              resolve(ResponseBuilder.successResponse('Data', databaseData[0]));

          }
      }
  });



  }

  async http_HotelTermsAndCondition(data:any) {

    let node_env = process.env.NODE_ENV;
    let TARGET_BRANCH: string;
    let PROVIDER_CODE: string;
    let ACCEPT_ENCODING: string;
    let CONTENT_TYPE: string;
    let AUTHORIZATION: string;
    let HOTEL_SERVICE_URL: string;

    if(node_env == 'production'){

      HOTEL_SERVICE_URL = process.env.Production_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Production_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Production_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Production_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Production_CONTENT_TYPE;
      AUTHORIZATION = process.env.Production_AUTHORIZATION;
    
    }
    else
    {

      HOTEL_SERVICE_URL = process.env.Development_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Development_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Development_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Development_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Development_CONTENT_TYPE;
      AUTHORIZATION = process.env.Development_AUTHORIZATION;
    
    }

    let dataValues = data;

    
    return new Promise(async (resolve)=> {

      try {

        let xmlData : string = fs.readFileSync(path.resolve(__dirname, './soapXML/hotelTermsAndCondition.xml',), 'utf-8');
        let _replace_data = xmlData.split('--HotelChain--').join(dataValues.HotelChain);
        _replace_data = _replace_data.split('--HotelCode--').join(dataValues.HotelCode);
        _replace_data = _replace_data.split('--TraceId--').join(dataValues.TraceId);
        _replace_data = _replace_data.split('--HotelLoc--').join(dataValues.HotelLoc);
        _replace_data = _replace_data.split('--RatePlanType--').join(dataValues.RatePlanType);
        _replace_data = _replace_data.split('--Base--').join(dataValues.Base);
        _replace_data = _replace_data.split('--To--').join(dataValues.To);
        _replace_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);
        _replace_data = _replace_data.split('--NumberOfAdults--').join(dataValues.Adults);
        _replace_data = _replace_data.split('--NumberOfRooms--').join(dataValues.Rooms);
        _replace_data = _replace_data.split('--NumberOfChildren--').join(dataValues.NumberOfChildren);
        let _build_data =   _replace_data.split('--From--').join(dataValues.From);

        console.log(_build_data);

        //soap create request
        let config = {
          method: 'post',
          url:HOTEL_SERVICE_URL,
          headers: {
            'TargetBranch': TARGET_BRANCH,
            'ProviderCode': PROVIDER_CODE,
            'Accept-Encoding': ACCEPT_ENCODING,
            'Content-Type': CONTENT_TYPE,
            'Authorization': AUTHORIZATION,
          },
          data : _build_data
        };

        let LogsDate = new Date();
        let hash = md5(LogsDate + dataValues.TraceId);
        let ApiDataLog = JSON.stringify(config);
        let logs = {
            TraceId: dataValues.TraceId,
            Hashpair: hash,
            TriggerHit: "Req Terms And Condition Api",
            Date: LogsDate,
            Data: ApiDataLog
        };

        let responseData,status=200;
        await this.mongodb.applicationloggedMultiInsert(logs);
        //soap execute request

        let response = await axios(config)

        if(response.status == 200){

          let LogsDate = new Date();
          let ApiDataLog = JSON.stringify(response.data);
          let logs = {
              TraceId: dataValues.TraceId,
              Hashpair: hash,
              TriggerHit: "Res Terms And Condition Api",
              Date: LogsDate,
              Data: ApiDataLog
          };
          await this.mongodb.applicationloggedMultiInsert(logs);

          parseString(response.data, function (err, result) {

            let requestResult = result['SOAP:Envelope']['SOAP:Body'][0]

            // Error Message
            if(requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']){

              let status = 404;
              let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
              let faultcode = requestResult['SOAP:Fault'][0]['detail'][0]['common_v52_0:ErrorInfo'][0]['common_v52_0:Code'][0]
              let responseData :any = {"status":status, "faultcode": faultcode, "message":message}
              resolve(responseData);

            }
            else if (requestResult['hotel:HotelRulesRsp'][0]['common_v52_0:ResponseMessage']){

              status = 404;
              let message = requestResult['hotel:HotelRulesRsp'][0]['common_v52_0:ResponseMessage'][0]['_'];
              let faultcode = message.split(" ");
              responseData={"status":status, "faultcode": faultcode[0], "message":message}
              resolve(responseData);

            }
            else
            {

              let RoomRateDescription = requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['hotel:RoomRateDescription'];
              let RoomRateDescriptionLength = RoomRateDescription.length;
              let RoomRateDescriptionArray = [];
              for (let i = 0; i < RoomRateDescriptionLength; i++) {
                  let Name = RoomRateDescription[i]['$']['Name'];
                  let Text = RoomRateDescription[i]['hotel:Text'];
                  let a = { [Name]: Text };
                  RoomRateDescriptionArray.push(a);
              }
              let HotelRateByDate = requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['hotel:HotelRateByDate'];
              let HotelRateByDateLength = HotelRateByDate.length;
              let HotelRateByDateArray = [];
              for (let q = 0; q < HotelRateByDateLength; q++) {
                  let a = {
                      EffectiveDate: HotelRateByDate[q]['$']['EffectiveDate'],
                      ExpireDate: HotelRateByDate[q]['$']['ExpireDate'],
                      Base: HotelRateByDate[q]['$']['Base'],
                      ApproximateBase: HotelRateByDate[q]['$']['ApproximateBase'],
                  };
                  HotelRateByDateArray.push(a);
              }
              let HotelRuleItem = requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRuleItem'];
              let HotelRuleItemLength = HotelRuleItem.length;
              let HotelRuleItemArray = [];
              for (let f = 0; f < HotelRuleItemLength; f++) {
                  let a = { [HotelRuleItem[f]['$']['Name']]: HotelRuleItem[f]['hotel:Text'] };
                  HotelRuleItemArray.push(a);
              }
              let HotelCommission = requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['hotel:Commission'];
              let HotelCancelInfo = requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['hotel:CancelInfo'];
              let HotelInclusions = requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['hotel:Inclusions'];
              let HotelType = requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelType'];
              let data = {
                  RatePlanType: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['RatePlanType'],
                  Base: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['Base'],
                  Tax: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['Tax'],
                  Total: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['Total'],
                  Surcharge: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['Surcharge'],
                  ApproximateBase: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['ApproximateBase'],
                  ApproximateSurcharge: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['ApproximateSurcharge'],
                  ApproximateTax: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['ApproximateTax'],
                  ApproximateTotal: requestResult['hotel:HotelRulesRsp'][0]['hotel:HotelRateDetail'][0]['$']['ApproximateTotal'],
                  RoomRateDescription: RoomRateDescriptionArray,
                  HotelRateByDate: HotelRateByDateArray,
                  HotelCommission: {
                      Indicator: HotelCommission[0]['$']['Indicator'],
                      Percent: HotelCommission[0]['$']['Percent'],
                  },
                  HotelCancelInfo: {
                      "NonRefundableStayIndicator": "",
                      "CancelDeadline": "",
                  },
                  HotelInclusions: {
                      SmokingRoomIndicator: HotelInclusions[0]['$']['SmokingRoomIndicator'],
                      BedTypes: {
                          Code: HotelInclusions[0]['hotel:BedTypes'][0]['$']['Code'],
                          Quantity: HotelInclusions[0]['hotel:BedTypes'][0]['$']['Quantity']
                      },
                      MealPlans: {
                          "Breakfast": HotelInclusions[0]['hotel:MealPlans'][0]['$']['Breakfast'],
                          "Lunch": HotelInclusions[0]['hotel:MealPlans'][0]['$']['Lunch'],
                          "Dinner": HotelInclusions[0]['hotel:MealPlans'][0]['$']['Dinner']
                      }
                  },
                  HotelRuleItem: HotelRuleItemArray,
                  HotelType: HotelType[0]['$']['SourceLink']
              };


              if(HotelCancelInfo){
                data['HotelCancelInfo']['NonRefundableStayIndicator'] = HotelCancelInfo[0]['$']['NonRefundableStayIndicator'];
                data['HotelCancelInfo']['CancelDeadline'] = HotelCancelInfo[0]['$']['CancelDeadline'];
              }

              resolve(data);

            }

          });

        }
      } catch(e) {
        console.log('Error:', e.stack);
      }

    });

  }

  async getMultiTermsAndCondition(data){

    return new Promise(async (resolve) => {

      let TraceId = data.TraceId;
      let HotelChain = data.HotelChain;
      let HotelCode = data.HotelCode;
      let HotelLoc = data.HotelLoc;
      let RatePlan = data.RatePlan;
      let To = data.To;
      let From = data.From;

      let data_r = []

      for (let index = 0; index < RatePlan.length; index++) {

        data.Base = RatePlan[index]['Base'];
        data.RatePlanType = RatePlan[index]['RatePlanType'];
        data.Adults = RatePlan[index]['Adults'];
        data.Rooms = RatePlan[index]['Rooms'];

        let Base = data.Base;
        let RatePlanType = data.RatePlanType;
        let Adults = data.Adults;
        let Rooms = data.Rooms;
       
        let createHash = md5(TraceId + HotelChain + HotelCode + HotelLoc + RatePlanType + Base + To + From + Adults + Rooms);
        let currentDate = new Date();
        let modifyData = {
            "hotelCode": HotelCode,
            "hash": createHash,
            "timeout": currentDate,
            "count": "0"
        };

        let ChildrensCount = RatePlan[index]['NumberOfChildrenCount'];
        let ChildrensAges = RatePlan[index]['NumberOfChildAge'];

        let ageNode = "" 

        if(ChildrensCount >= 1){

          let ChildrensAgesArrayLength = ChildrensAges.length

          for (let index = 0; index < ChildrensAgesArrayLength; index++) {
            ageNode += "<hotel:Age>"+ChildrensAges[index]['age']+"</hotel:Age>";
          }

          data['NumberOfChildren'] = '<hotel:NumberOfChildren Count="'+ChildrensCount+'">'+ageNode+'</hotel:NumberOfChildren>';
        }
        else
        {
          data['NumberOfChildren'] = '';
        }

        let data_c = await this.hotelTermsAndCondition(data, modifyData);

        console.log(data_c);

        if(data_c['statusCode'] == 400)
        {
          data_r.push({
            "RatePlanType": RatePlanType,
            "statusCode": 404,
            "Data": data_c,
          });
        }
        else
        {
          data_r.push({
            "RatePlanType": RatePlanType,
            "statusCode": 200,
            "Data": data_c['Data'],
          });
        }

      }

      resolve(ResponseBuilder.successResponse('Data', data_r));

    })
  
  }

  async hotelTermsAndCondition(data, modifyData){

    return new Promise(async (resolve) => {
        console.log(modifyData.hash);
        
        await this.mongodb.connect();
        let CACHE_TIME : number = parseInt(process.env.Cache_Time);
        let findHotelTNCCacheDocument = await this.mongodb.findHotelTNCCacheDocument({ "hash": { $eq: modifyData.hash } });
        if (findHotelTNCCacheDocument.length == 0) {

            console.log('from travelport');
            let httpData = await this.http_HotelTermsAndCondition(data);
            let httpStatus = httpData['status'];
            if (httpStatus == 404) {
      
              resolve(ResponseBuilder.errorMultiResponse('message', httpData['message'], 'faultcode', httpData['faultcode']));
            }
            else {
                await this.mongodb.newHotelTNCCacheDocument(modifyData);
                httpData['HotelCode'] = data['HotelCode'];
                httpData['hash'] = modifyData.hash;

                let HotelRateByDates = httpData['HotelRateByDate'];

                console.log(HotelRateByDates)

                let fillUpAllDates = await this.fillDatesTandC(HotelRateByDates);

                console.log(fillUpAllDates);
                
                httpData['fillUpAllDates'] = fillUpAllDates;
                httpData['date'] = new Date();

                await this.mongodb.newHotelTNCDocument(httpData);
                let databaseData = await this.mongodb.findHotelTNCDocument({ "HotelCode": { $eq: modifyData.hotelCode }, "hash": { $eq: modifyData.hash } });
                let indexLevel = 0;

                databaseData[indexLevel]['Symbol'] = [];

                let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.CurrencyBase } });
                databaseData[indexLevel]['Symbol'] = Symbol[0];

      
                let HotelRateByDate = databaseData[indexLevel].HotelRateByDate
                let HotelRateByDateLength = HotelRateByDate.length

                for (let f = 0; f < HotelRateByDateLength; f++) {

                
                  databaseData[indexLevel].HotelRateByDate[f]['Symbol'] = [];
      
                  let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.CurrencyBase } })
                   databaseData[indexLevel].HotelRateByDate[f]['Symbol'] = Symbol[0];
      
                }


                databaseData[indexLevel]['To'] = data.To
                databaseData[indexLevel]['From'] = data.From

                databaseData[indexLevel]['HotelCommission'] = {
                    Indicator: "",
                    Percent: ""
                };
                resolve(ResponseBuilder.successResponse('Data', databaseData[indexLevel]));
            }
        }
        else {
            let timeAgo = await this.timeAgo(findHotelTNCCacheDocument[0].timeout);
            if (timeAgo >= CACHE_TIME) {

                console.log('from travelport');
                let httpData = await this.http_HotelTermsAndCondition(data);
                let httpStatus = httpData['status'];
                if (httpStatus == 404) {
                  resolve(ResponseBuilder.errorMultiResponse('message', httpData['message'], 'faultcode', httpData['faultcode']));
                }
                else {
                    await this.mongodb.updateHotelTNCCacheDocument({ "hash": modifyData.hash }, { $set: modifyData });
                    
                    httpData['HotelCode'] = data['HotelCode'];
                    httpData['date'] = new Date();

                    await this.mongodb.updateHotelTNCDocument({ "hash": modifyData.hash }, { $set: httpData });
                    let databaseData = await this.mongodb.findHotelTNCDocument({ "HotelCode": { $eq: modifyData.hotelCode }, "hash": { $eq: modifyData.hash } });
                    
                    let HotelRateByDates = httpData['HotelRateByDate'];
                    let fillUpAllDates = await this.fillDatesTandC(HotelRateByDates);
                    httpData['fillUpAllDates'] = fillUpAllDates; 

                    databaseData[0]['Symbol'] = [];

                    let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.CurrencyBase} })
                    databaseData[0]['Symbol'] = Symbol[0];
                
                    let HotelRateByDate = databaseData[0].HotelRateByDate
                    let HotelRateByDateLength = HotelRateByDate.length
        
                    for (let f = 0; f < HotelRateByDateLength; f++) {
        
                      databaseData[0].HotelRateByDate[f]['Symbol'] = [];
        
                      let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.CurrencyBase } })
                       databaseData[0].HotelRateByDate[f]['Symbol'] = Symbol[0];
        
                    }

                    databaseData[0]['To'] = data.To
                    databaseData[0]['From'] = data.From
    
                    databaseData[0]['HotelCommission'] = {
                        Indicator: "",
                        Percent: ""
                    };

                    resolve(ResponseBuilder.successResponse('Data', databaseData[0]));
                }
            }
            else {


                console.log('from database');
                let databaseData = await this.mongodb.findHotelTNCDocument({ "HotelCode": { $eq: modifyData.hotelCode }, "hash": { $eq: modifyData.hash } });
                
                databaseData[0]['Symbol'] = [];
                      
              
                let HotelRateByDate = databaseData[0].HotelRateByDate
                let HotelRateByDateLength = HotelRateByDate.length
      
                for (let f = 0; f < HotelRateByDateLength; f++) {
      
      
                  databaseData[0].HotelRateByDate[f]['Symbol'] = [];
      
                  let Symbol = await this.mongodb.findCommonCurrencyDocument({ "code": { $eq: data.CurrencyBase } })
                   databaseData[0].HotelRateByDate[f]['Symbol'] = Symbol[0];
      
                }
      
                databaseData[0]['To'] = data.To
                databaseData[0]['From'] = data.From

                databaseData[0]['HotelCommission'] = {
                    Indicator: "",
                    Percent: ""
                };

                resolve(ResponseBuilder.successResponse('Data', databaseData[0]));
            }
        }
    });


  }


  async adultsAndRooms(body) {

    return new Promise(async (resolve) => {
    
    });

  }
  

  async testing(body) {

    return new Promise(async (resolve) => {
    
      try {


        let requestResults_hotel: string = fs.readFileSync(path.resolve(__dirname, './soapXML/hotel-d.xml'), 'utf-8');
        let requestResults_images: string = fs.readFileSync(path.resolve(__dirname, './soapXML/images-d.xml'), 'utf-8');
        let requestResults_hotel_Json: any = [];
        let requestResults_images_Json: any = [];

        parseString(requestResults_images, async function(err, result) {

          let requestResult
          requestResult = result['SOAP:Envelope']['SOAP:Body'][0]

          if (requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']) {

            let status = 404;
            let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
            let faultcode = message.split(" ");
            let responseData :any = {"status":status, "faultcode": faultcode[0], "message":message}
            requestResults_images_Json.push(responseData);

          }
          else {

            let hotelProperty = requestResult['hotel:HotelMediaLinksRsp'][0]['hotel:HotelPropertyWithMediaItems'][0]['hotel:HotelProperty'];
            let mediaItem = requestResult['hotel:HotelMediaLinksRsp'][0]['hotel:HotelPropertyWithMediaItems'][0]['common_v52_0:MediaItem'];
            try {
                let mediaItemLength = mediaItem.length;
                let allMediaLinks = [];
                for (let i = 0; i < mediaItemLength; i++) {

                  
                    let assets = {
                        caption: mediaItem[i]['$']['caption'],
                        storage: 'live',
                        height: mediaItem[i]['$']['height'],
                        width: mediaItem[i]['$']['width'],
                        src: mediaItem[i]['$']['url'],
                        type: mediaItem[i]['$']['type'],
                        sizeCode: mediaItem[i]['$']['sizeCode'],
                    };

                  allMediaLinks.push(assets);

                }
                let rdata: any = {
                    HotelChain: hotelProperty[0]['$']['HotelChain'],
                    HotelCode: hotelProperty[0]['$']['HotelCode'],
                    MediaLinks: allMediaLinks
                };
                
                requestResults_images_Json.push(rdata)
                
            }
            catch (e) {
                let status = 404;
                let responseData: any = { "status": status, "message": 'Invalid Hotel Code' };
                requestResults_images_Json.push(responseData)
            }



          }

        });
        

        
        parseString(requestResults_hotel, function (err, result) {


            let requestResult = result['SOAP:Envelope']['SOAP:Body'][0]
            if(requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']){

              let status = 404;
              let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
              let responseData={"status":status,"message":message}
              requestResults_hotel_Json.push(responseData);

            }
            else
            {

              let a = JSON.parse(JSON.stringify(requestResult));
              let node = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['$'];
              let PropertyAddress = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['hotel:PropertyAddress'];
              let a_PropertyAddress = PropertyAddress[0]['hotel:Address'][0] + " " + PropertyAddress[0]['hotel:Address'][1] + " " + PropertyAddress[0]['hotel:Address'][2];
              let PropertyPhoneNumber = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:PhoneNumber'];
              let PhoneNumber = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:PhoneNumber'];
              let a_Distance = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:Distance'];
              let HotelDetailItem = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelDetailItem'];
              let hotelHotelType = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelType'];
              let HotelRateDetailArray = [];
              if (a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelRateDetail']) {
                  let hotelRateDetail = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelRateDetail'];
                  let hotelRateDetailLength = hotelRateDetail.length;
                  for (let i = 0; i < hotelRateDetailLength; i++) {
                      let RoomRateDescription = hotelRateDetail[i]['hotel:RoomRateDescription'];
                      let HotelRateByDate = hotelRateDetail[i]['hotel:HotelRateByDate'];
                      let hotelRateByDateLength = HotelRateByDate.length;
                      let hotelRateDetailArray = [];
                      for (let a = 0; a < hotelRateByDateLength; a++) {
                          hotelRateDetailArray.push(HotelRateByDate[a]['$']);
                      }
                      let hotelCommission = hotelRateDetail[i]['hotel:Commission'];
                      let hotelCancelInfo = hotelRateDetail[i]['hotel:CancelInfo'];
                      console.log(JSON.stringify(hotelCancelInfo));
                      let hotelInclusions = hotelRateDetail[i]['hotel:Inclusions'];
                      let hotelRateDetailData = {
                          RatePlanType: hotelRateDetail[i]['$']['RatePlanType'],
                          Base: hotelRateDetail[i]['$']['Base'],
                          Total: hotelRateDetail[i]['$']['Total'],
                          RateChangeIndicator: hotelRateDetail[i]['$']['RateChangeIndicator'],
                          ExtraFeesIncluded: hotelRateDetail[i]['$']['ExtraFeesIncluded'],
                          RoomRateDescription: [],
                          Price: hotelRateDetailArray,
                          Commission: {
                              Indicator: hotelCommission[0]['$']['Indicator'],
                              Percent: hotelCommission[0]['$']['Percent']
                          },
                          HotelType: {
                              SourceLink: hotelHotelType[0]['$']['SourceLink']
                          },
                          CancelInfo: {},
                          Inclusions: {
                              SmokingRoomIndicator: "",
                              BedTypesCode: "",
                              BedTypesQuantity: "",
                              MealPlansBreakfast: "",
                              MealPlansLunch: "",
                              MealPlansDinner: "",
                              RoomView: "",
                          }
                      };
                      if (RoomRateDescription[0]) {
                          hotelRateDetailData['RoomRateDescription'][0] = { [RoomRateDescription[0]['$']['Name']]: RoomRateDescription[0]['hotel:Text'] };
                      }
                      if (RoomRateDescription[1]) {
                          hotelRateDetailData['RoomRateDescription'][1] = { [RoomRateDescription[1]['$']['Name']]: RoomRateDescription[1]['hotel:Text'] };
                      }
                      if (hotelInclusions[0]['$']['SmokingRoomIndicator']) {
                          hotelRateDetailData['Inclusions']['SmokingRoomIndicator'] = hotelInclusions[0]['$']['SmokingRoomIndicator'];
                      }
                      if (hotelInclusions[0]['hotel:BedTypes']) {
                          hotelRateDetailData['Inclusions']['BedTypesCode'] = hotelInclusions[0]['hotel:BedTypes'][0]['$']['Code'];
                      }
                      if (hotelInclusions[0]['hotel:BedTypes']) {
                          hotelRateDetailData['Inclusions']['BedTypesQuantity'] = hotelInclusions[0]['hotel:BedTypes'][0]['$']['Quantity'];
                      }
                      if (hotelInclusions[0]['hotel:MealPlans']) {
                          hotelRateDetailData['Inclusions']['MealPlansBreakfast'] = hotelInclusions[0]['hotel:MealPlans'][0]['$']['Breakfast'];
                      }
                      if (hotelInclusions[0]['hotel:MealPlans']) {
                          hotelRateDetailData['Inclusions']['MealPlansLunch'] = hotelInclusions[0]['hotel:MealPlans'][0]['$']['Lunch'];
                      }
                      if (hotelInclusions[0]['hotel:MealPlans']) {
                          hotelRateDetailData['Inclusions']['MealPlansDinner'] = hotelInclusions[0]['hotel:MealPlans'][0]['$']['Dinner'];
                      }
                      if (hotelInclusions[0]['hotel:RoomView']) {
                          hotelRateDetailData['Inclusions']['RoomView'] = hotelInclusions[0]['hotel:RoomView'][0]['$']['Code'];
                      }
                      if (hotelCancelInfo) {
                          hotelRateDetailData['CancelInfo'] = {
                              NonRefundableStayIndicator: hotelCancelInfo[0]['$']['NonRefundableStayIndicator'],
                              CancelDeadline: hotelCancelInfo[0]['$']['CancelDeadline']
                          };
                      }
                      HotelRateDetailArray.push(hotelRateDetailData);
                  }
              }
              let ProviderCode = null;
              if (a['hotel:HotelDetailsRsp'][0]['common_v52_0:NextResultReference']) {
                  ProviderCode = a['hotel:HotelDetailsRsp'][0]['common_v52_0:NextResultReference'][0]['$']['ProviderCode'];
              }
              let JSONData = {
                  ProviderCode: ProviderCode,
                  HotelChain: node['HotelChain'],
                  HotelCode: node['HotelCode'],
                  HotelLocation: node['HotelLocation'],
                  Name: node['Name'],
                  PropertyPhoneNumber: [],
                  Distance: {
                      Units: "",
                      Value: "",
                      Direction: ""
                  },
                  ParticipationLevel: node['ParticipationLevel'],
                  MoreRates: node['MoreRates'],
                  PropertyAddress: PropertyAddress,
                  HotelDetailItem: {
                      [HotelDetailItem[0]['$']['Name']]: HotelDetailItem[0]['hotel:Text'][0],
                      [HotelDetailItem[1]['$']['Name']]: HotelDetailItem[1]['hotel:Text'][0]
                  },
                  HotelRateDetail: HotelRateDetailArray,
              };
              if (PropertyPhoneNumber[0]) {
                  JSONData['PropertyPhoneNumber'][0] = { [PropertyPhoneNumber[0]['$']['Type']]: PropertyPhoneNumber[0]['$']['Number'] };
              }
              if (PropertyPhoneNumber[1]) {
                  JSONData['PropertyPhoneNumber'][1] = { [PropertyPhoneNumber[1]['$']['Type']]: PropertyPhoneNumber[1]['$']['Number'] };
              }
              if (a_Distance = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:Distance']) {
                  JSONData['Distance']['Units'] = a_Distance[0]['$']['Units'];
              }
              if (a_Distance = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:Distance']) {
                  JSONData['Distance']['Value'] = a_Distance[0]['$']['Value'];
              }
              if (a_Distance = a['hotel:HotelDetailsRsp'][0]['hotel:RequestedHotelDetails'][0]['hotel:HotelProperty'][0]['common_v52_0:Distance']) {
                  JSONData['Distance']['Direction'] = a_Distance[0]['$']['Direction'];
              }
              
              requestResults_hotel_Json.push(JSONData);

            }


          });

        console.log(requestResults_images_Json);

        requestResults_images_Json = await this.filterImage('L',requestResults_images_Json); 
      
        console.log(requestResults_images_Json);
        
        // sync from Links names parsing  
        let e_requestResults_imagesLength = requestResults_images_Json[0]['MediaLinks'].length;
        let e_data_array = Array()

        for (let index = 0; index < e_requestResults_imagesLength; index++) { 

          let linkText = requestResults_images_Json[0]['MediaLinks'][index]['src'];
          var filename = linkText.substring(linkText.lastIndexOf('/')+1);

          //console.log(filename);
          let  ans = filename.replaceAll("_", " "); ans = ans.replaceAll("-", " ");
          console.log(ans);

          e_data_array[index] = requestResults_images_Json[0]['MediaLinks'][index]['caption'];
        }  

        
        // Ml Caption Matching Raw Data  
        let requestResults_imagesLength = requestResults_images_Json[0]['MediaLinks'].length;
        let r_data_array = Array()

        for (let index = 0; index < requestResults_imagesLength; index++) {  
          r_data_array[index] = requestResults_images_Json[0]['MediaLinks'][index]['caption'];
        }  


        //parsing Words
        let HotelRateDetailLength = requestResults_hotel_Json[0]['HotelRateDetail'].length;
        
        for (let index = 0; index < HotelRateDetailLength; index++) {
          
          requestResults_hotel_Json[0]['HotelRateDetail'][index]['ML'] = []
          let RoomRateDescription = requestResults_hotel_Json[0]['HotelRateDetail'][index]['RoomRateDescription'];
          let Room = RoomRateDescription[0]['Room'];

          //indexing Length
          let  RoomLength = Room.length

          let imagesObject = requestResults_hotel_Json[0]['HotelRateDetail'][index]['Images'] = []
          
          for (let indexa = 0; indexa < RoomLength; indexa++) {

            let roomword = Room[indexa];
            let firstTwoWords = roomword.match(/([\w+]+)/g);
            let firstTwoWord =  firstTwoWords[0]+' '+firstTwoWords[1];
            let firstWord =  firstTwoWords[0];

            requestResults_hotel_Json[0]['HotelRateDetail'][index]['ML'][indexa] = {
              "firstTwoWord": firstTwoWord,
              "fullText": roomword
            }

          
            console.log('-----------------------------------------------------------------------------------------------> Room Changed');


            console.log(requestResults_hotel_Json[0]['HotelRateDetail'][index]['ML']);

            let requestResults_images = requestResults_images_Json[0]['MediaLinks'];
            
        
            for (let i1 = 0; i1 < requestResults_images.length; i1++) {
            
              let imagesCaption = requestResults_images[i1]['caption'];
  
              let firstTwoWordStatus = imagesCaption.includes(firstWord);
  
              if(firstTwoWordStatus)
              {
                imagesObject.push(requestResults_images[i1]);
              }
             
  
            }


            let imagesObjectReCheck1 = requestResults_hotel_Json[0]['HotelRateDetail'][index]['Images'];
            let requestResults_imagesLength1 = imagesObjectReCheck1.length;

            if(requestResults_imagesLength1 == 0){

              for (let i1 = 0; i1 < requestResults_images.length; i1++) {
                
                let imagesCaption = requestResults_images[i1]['caption'];

                let firstTwoWordStatus = imagesCaption.includes(firstTwoWord);


                if(firstTwoWordStatus)
                {
                  imagesObject.push(requestResults_images[i1]);
                }
              

              }
        
            }

            // From Url
            let imagesObjectReCheck2 = requestResults_hotel_Json[0]['HotelRateDetail'][index]['Images'];
            let requestResults_imagesLength2 = imagesObjectReCheck2.length;

            if(requestResults_imagesLength2 == 0){

              let e_data_arrayLength = e_data_array.length
              for (let i2 = 0; i2 < e_data_arrayLength; i2++) {

                let imagesURLCaption = e_data_array[i2];

                let firstTwoWordStatus = imagesURLCaption.includes(firstTwoWord);

                if(firstTwoWordStatus){
                  imagesObject.push(requestResults_images_Json[0]['MediaLinks'][i2])
                }
                else
                {

                  let firstTwoWordStatus = imagesURLCaption.includes(firstWord);

                  if(firstTwoWordStatus){
                    imagesObject.push(requestResults_images_Json[0]['MediaLinks'][i2])
                  }

                }

              }

            }



            /*
            let imagesObject = requestResults_hotel_Json[0]['HotelRateDetail'][index]['Images'] = []
            let matches = stringSimilarity.findBestMatch(firstTwoWord, r_data_array);
            let matchesIndex = matches['bestMatchIndex'];

            console.log('-----------------------------------------------------------------------------------------------> Best Match from Caption');

            console.log(matches);

            if(matchesIndex == null || matchesIndex == undefined)
            {

              
              console.log('-----------------------------------------------------------------------------------------------> Best Match from Media Link');

              let e_data_array_value = stringSimilarity.findBestMatch(firstTwoWord, e_data_array);
              let e_data_array_bestMatchIndex = e_data_array_value['bestMatchIndex'];
              imagesObject.push(requestResults_images_Json[0]['MediaLinks'][e_data_array_bestMatchIndex]);

              console.log(e_data_array_value);
              
            }
            else
            {
              imagesObject.push(requestResults_images_Json[0]['MediaLinks'][matchesIndex]);
            }
            */

            //console.log(requestResults_hotel_Json[0]['HotelRateDetail'][index]);
            
          }

          //console.log(requestResults_hotel_Json[0]['HotelRateDetail'][index]);
          
        }


        for (let index = 0; index < requestResults_imagesLength; index++) {  
          r_data_array[index] = requestResults_images_Json[0]['MediaLinks'][index]['caption'];
        }  


        resolve(requestResults_hotel_Json);
        

      } catch(e) {
        console.log('Error:', e.stack);
      }

    });

  }

  async cityAutoComplete(data: any) {

    return new Promise(async (resolve) => {
      let string = [];
      string[0] = new RegExp(data, "i");
      let iata = await this.mongodb.findLocations({ "iata": { $exists: true, $ne: "" }, city: { $in: string } });
      let iataLength = iata.length;
      if (iataLength == 0) {
          resolve(ResponseBuilder.errorResponse('message', 'No Data Found'));
      }
      else {
          resolve(ResponseBuilder.successResponse('Data', iata));
      }
  });

  }

  async HotelRateDetailForFilters(hotelRateDetail: any) {

    let hotelRateDetailLength = 0;
    hotelRateDetailLength = hotelRateDetail.length;
    if (hotelRateDetailLength > 0) {
        for (let i = 0; i < hotelRateDetailLength; i++) {
            let HotelCode = hotelRateDetail[i].HotelCode;
            let HotelLocation = hotelRateDetail[i].HotelLocation;
            let Distance_Units = hotelRateDetail[i].Distance.Units;
            let Distance_Value = hotelRateDetail[i].Distance.Value;
            let Distance_Direction = hotelRateDetail[i].Distance.Direction;
            let HotelRateDetail = hotelRateDetail[i].HotelRateDetail;
            let RatePlanLength = HotelRateDetail.length;
            for (let b = 0; b < RatePlanLength; b++) {
                HotelRateDetail[b]['HotelCode'] = HotelCode;
                HotelRateDetail[b]['HotelLocation'] = HotelLocation;
                HotelRateDetail[b]['Distance_Units'] = Distance_Units;
                HotelRateDetail[b]['Distance_Value'] = Distance_Value;
                HotelRateDetail[b]['Distance_Direction'] = Distance_Direction;
                let RatePlanType = HotelRateDetail[b].RatePlanType;
                let databaseData = await this.mongodb.findHotelRateDetailFiltersDocument({ "HotelCode": { $eq: HotelCode }, "RatePlanType": { $eq: RatePlanType } });
                if (databaseData.length == 0) { }
            }
        }
    }

  }

  async hotelFilters(filterbody: any) {

    return new Promise(async (resolve) => {
      let filter = {};
      if (filterbody.HotelLocation) {
          filter['HotelLocation'] = { $eq: filterbody.HotelLocation };
      }
      if (filterbody.ParticipationLevel) {
          filter['ParticipationLevel'] = { $eq: filterbody.ParticipationLevel };
      }
      let filter_r = await this.mongodb.findHotelDetailsDocument(filter);
      resolve(filter_r);
    });

  }

  async popularDestinations(body: any, ip: any) {

    return new Promise(async (resolve)=> {

      console.log(ip);

      let ip_data = await axios.get('http://ip-api.com/json/'+ip).then(function (response) {
        console.log(response.data);
        return  JSON.parse(JSON.stringify(response.data));
      })

      let countryCode = ip_data['countryCode'];
      if (countryCode == "GB") {
          resolve([
              {
                  "city": "London",
                  "properties": "43 properties",
                  "hash": "12341234324123413342124",
                  "image": "https://media.tacdn.com/media/attractions-splice-spp-674x446/09/93/6a/89.jpg",
                  "lat": "51.5072",
                  "long": "-0.1276"
              },
              {
                  "city": "Edinburgh",
                  "properties": "3 properties",
                  "hash": "3463456345616846874684416",
                  "image": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/47/db/ac/caption.jpg?w=700&h=-1&s=1",
                  "lat": "55.9533",
                  "long": "-3.1883"
              },
              {
                  "city": "Manchester",
                  "properties": "13 properties",
                  "hash": "987984654653121321564654",
                  "image": "https://www.centreforcities.org/wp-content/uploads/2014/08/Manchester_x1650-1630x899.jpg",
                  "lat": "53.4808",
                  "long": "-2.2426"
              },
              {
                  "city": "Blackpool",
                  "properties": "24 properties",
                  "hash": "1686468974651683516543543545",
                  "image": "https://a.cdn-hotels.com/gdcs/production192/d1938/72523330-59c1-11e8-982b-0242ac11000d.jpg?impolicy=fcrop&w=800&h=533&q=medium",
                  "lat": "53.8167",
                  "long": "-3.0370"
              },
              {
                  "city": "York",
                  "properties": "50 properties",
                  "hash": "9841868463164546353153151315",
                  "image": "https://cdn.britannica.com/95/100095-050-E52E4376/View-York-Minster-Eng.jpg",
                  "lat": "53.9614",
                  "long": "-1.0739"
              },
              {
                  "city": "Lake District",
                  "properties": "48 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://i0.wp.com/www.worth.com/wp-content/uploads/2021/06/LakeDistrict-scaled.jpg?fit=2048%2C1355&ssl=1",
                  "lat": "54.5812",
                  "long": "-2.7942"
              },
              {
                  "city": "Birmingham",
                  "properties": "13 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/explorer_city/1680x560/15338.webp?k=888b8cf2a8974fb506b57efe0658f884f2d194a01980b1d8e658600d21c13dc7&o=",
                  "lat": "52.4973492",
                  "long": "-1.8636315"
              },
              {
                  "city": "Bradford",
                  "properties": "14 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/city/1680x560/850057.webp?k=38f9f1053754c530b6d026f0d39b83aad6b51cda09585cc894fff374c66ba659&o=",
                  "lat": "53.7969966",
                  "long": "-1.7543604"
              },
              {
                  "city": "Exeter",
                  "properties": "18 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/city/1680x560/968030.webp?k=c3af1a0e1e9a22dc6bb7c8c1b22f0bae7e60e387c56459232f24fb696f621893&o=",
                  "lat": "50.7226363",
                  "long": "-3.508391"
              },
              {
                  "city": "Norwich",
                  "properties": "199 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/city/1680x560/968055.webp?k=95cb1dd15c5f88dd3224a6c8f3afb3d6412d149a97a697cc2cddde3edecb3f1b&o=",
                  "lat": "52.6407907",
                  "long": "-1.276582"
              },
              {
                  "city": "Kingston-upon-Hull",
                  "properties": "178 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/city/1680x560/968133.webp?k=0f2601593ec9dfb658a1294be9edb7f35c03f9d73babc6f0797816e665d5befd&o=",
                  "lat": "53.7657979",
                  "long": "-0.3413207"
              },
              {
                  "city": "Plymouth",
                  "properties": "178 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/city/1680x560/968058.webp?k=fd48e7e34efb3f66b5a1b04cebb919adddb3532b9ed77281d15ba8e071e909b9&o=",
                  "lat": "50.3977305",
                  "long": "-4.1340925"
              },
              {
                  "city": "Southampton",
                  "properties": "178 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/city/1680x560/967985.webp?k=7fdc322f97035a5cdde23c7be98544640c36a0fc92c46e6d179703bba8897b2c&o=",
                  "lat": "50.9167228",
                  "long": "-1.3935829"
              },
              {
                  "city": "Westminster",
                  "properties": "178 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/explorer_district/1680x560/3895.webp?k=02f358cf8300730c2abdafa1b4d2289d96e5514c9b00551f52f5aed113ad83a2&o=",
                  "lat": "51.4973969",
                  "long": "-0.15132"
              },
              {
                  "city": "Armagh",
                  "properties": "178 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/city/1680x560/846013.webp?k=e1d2159e9b549f3b7ae0fe377a79e2754f2d8f51a384e89f9110c53ca09de962&o=",
                  "lat": "54.3550567",
                  "long": "-6.9703286"
              },
              {
                  "city": "Belfast",
                  "properties": "178 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://cf.bstatic.com/xdata/images/explorer_city/1680x560/21811.webp?k=4240b00c0208e66579afd6ebc8df7e6806d061bc8b8483bd63d367dbe76492e1&o=",
                  "lat": "54.5929363",
                  "long": "-5.92653"
              }
          ]);
      }
      else if (countryCode == "PK") {
          resolve([
              {
                  "city": "Lahore",
                  "properties": "43 properties",
                  "hash": "12341234324123413342124",
                  "image": "https://zameen-strapi-live.s3.eu-west-1.amazonaws.com/medium_image_01_034427838e.jpg",
                  "lat": "31.5204",
                  "long": "74.3587"
              },
              {
                  "city": "Islamabad",
                  "properties": "3 properties",
                  "hash": "3463456345616846874684416",
                  "image": "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0a/c6/d5/48.jpg",
                  "lat": "33.6844",
                  "long": "73.0479"
              },
              {
                  "city": "Karachi",
                  "properties": "13 properties",
                  "hash": "987984654653121321564654",
                  "image": "https://idsb.tmgrup.com.tr/ly/uploads/images/2022/06/07/210627.jpg",
                  "lat": "24.8607",
                  "long": "67.0011"
              },
              {
                  "city": "Murree",
                  "properties": "24 properties",
                  "hash": "1686468974651683516543543545",
                  "image": "https://pix10.agoda.net/geo/city/705308/1_705308_02.jpg?ca=6&ce=1&s=1920x822",
                  "lat": "33.9070",
                  "long": "73.3943"
              },
              {
                  "city": "Rawalpindi",
                  "properties": "50 properties",
                  "hash": "9841868463164546353153151315",
                  "image": "https://pakiholic.com/wp-content/uploads/2017/06/A-Wonderful-Aerial-View-of-Rawalpindi-Cricket-Stadium.jpg",
                  "lat": "33.5651",
                  "long": "73.0169"
              },
              {
                  "city": "Faisalabad",
                  "properties": "64 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://minutemirror.com.pk//wp-content/uploads/2021/11/Faisalabad-1.jpg",
                  "lat": "31.4504",
                  "long": "73.1350"
              }
          ]);
      }
      else {
          resolve([
              {
                  "city": "Lahore",
                  "properties": "43 properties",
                  "hash": "12341234324123413342124",
                  "image": "https://zameen-strapi-live.s3.eu-west-1.amazonaws.com/medium_image_01_034427838e.jpg",
                  "lat": "31.5204",
                  "long": "74.3587"
              },
              {
                  "city": "Islamabad",
                  "properties": "3 properties",
                  "hash": "3463456345616846874684416",
                  "image": "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0a/c6/d5/48.jpg",
                  "lat": "33.6844",
                  "long": "73.0479"
              },
              {
                  "city": "Karachi",
                  "properties": "13 properties",
                  "hash": "987984654653121321564654",
                  "image": "https://idsb.tmgrup.com.tr/ly/uploads/images/2022/06/07/210627.jpg",
                  "lat": "24.8607",
                  "long": "67.0011"
              },
              {
                  "city": "Murree",
                  "properties": "24 properties",
                  "hash": "1686468974651683516543543545",
                  "image": "https://pix10.agoda.net/geo/city/705308/1_705308_02.jpg?ca=6&ce=1&s=1920x822",
                  "lat": "33.9070",
                  "long": "73.3943"
              },
              {
                  "city": "Rawalpindi",
                  "properties": "50 properties",
                  "hash": "9841868463164546353153151315",
                  "image": "https://pakiholic.com/wp-content/uploads/2017/06/A-Wonderful-Aerial-View-of-Rawalpindi-Cricket-Stadium.jpg",
                  "lat": "33.5651",
                  "long": "73.0169"
              },
              {
                  "city": "Faisalabad",
                  "properties": "64 properties",
                  "hash": "284683469841516351545315331",
                  "image": "https://minutemirror.com.pk//wp-content/uploads/2021/11/Faisalabad-1.jpg",
                  "lat": "31.4504",
                  "long": "73.1350"
              }
          ]);
      }

    });

  }

  async destinationsDeals(body: any, ip: any) {

    return new Promise(async (resolve)=> {

          let data = {

            "destinationsDeals": [
              {
                  "city": "Sri Lanka",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "https://static01.nyt.com/images/2019/02/03/travel/03frugal-srilanka01/merlin_148552275_74c0d250-949c-46e0-b8a1-e6d499e992cf-superJumbo.jpg",
                  "lat": "6.9282",
                  "long": "79.8619"
              },
              {
                  "city": "Canada",
                  "marketing": "10% Off on hotel Booking",
                  "hash": "3463456345616846874684416",
                  "image": "https://www.planetware.com/wpimages/2020/03/canada-best-cities-toronto-ontario.jpg",
                  "lat": "45.2820",
                  "long": "-75.7241"
              },
              {
                  "city": "Germany",
                  "marketing": "05% Off on hotel Booking",
                  "hash": "987984654653121321564654",
                  "image": "https://www.studying-in-germany.org/wp-content/uploads/2018/07/German-Culture-and-Traditions.jpg",
                  "lat": "52.4982",
                  "long": "13.3943"
              },
              {
                  "city": "Azerbaijan",
                  "marketing": "20% Off on hotel Booking",
                  "hash": "1686468974651683516543543545",
                  "image": "https://cdn.britannica.com/21/195821-050-7860049D/Baku-blend-Azerbaijan-skyscrapers-buildings.jpg",
                  "lat": "40.3894",
                  "long": "49.8517"
              },
              {
                  "city": "Oman",
                  "marketing": "4% Off on hotel Booking",
                  "hash": "9841868463164546353153151315",
                  "image": "https://deih43ym53wif.cloudfront.net/balad_sayt_oman_shutterstock_1052991938_dc6d3c1f88.jpg",
                  "lat": "23.5884",
                  "long": "58.4074"
              },
              {
                  "city": "Qatar",
                  "marketing": "10% Off on hotel Booking",
                  "hash": "284683469841516351545315331",
                  "image": "https://www.timeoutdoha.com/cloud/timeoutdoha/2022/04/17/Qatar-stock.jpg",
                  "lat": "25.2924",
                  "long": "51.4921"
              },
              {
                "city": "Netherlands",
                "marketing": "10% Off on hotel Booking",
                "hash": "284683469841516351545315331",
                "image": "https://s27363.pcdn.co/wp-content/uploads/2020/05/One-Day-in-Utrecht.jpg.optimal.jpg",
                "lat": "52.3622",
                "long": "4.9040"
              }
            ],
            "exploreEurope": [
                {
                  "city": "Copenhagen, Denmark",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "https://www.travelandleisure.com/thmb/G5hwSYQUTvgGQISOXymFUYYr-Iw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/copenhagen-dk-COPENHAGENTG0721-4a481cb6025b43d1a781b1571b144f46.jpg",
                  "lat": "55.6966",
                  "long": "12.5583"
                },
                {
                  "city": "Stockholm, Sweden",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "https://trinitytravel.gr/wp-content/uploads/2020/10/STOCKHOLM-1-1200x675.jpg",
                  "lat": "59.3415",
                  "long": "18.0437"
                },
                {
                  "city": "Barcelona, Spain",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "https://res.cloudinary.com/sagacity/image/upload/c_crop,h_770,w_1000,x_0,y_0/c_limit,f_auto,fl_lossy,q_80,w_1080/shutterstock_174454670_gicbgy.jpg",
                  "lat": "41.3946",
                  "long": "2.1498"
                },
                {
                  "city": "Istanbul, Turkey",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "https://www.travelandleisure.com/thmb/UXNrwYTm3z1CAEBl8z_sTxnyGEw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/istanbul-turkey-ISTANBULTG0721-a987bb021e5e4b42b069ba2518cde276.jpg",
                  "lat": "41.0441",
                  "long": "28.9145"
                },
                {
                  "city": "Munich, Germany",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "https://i0.wp.com/handluggageonly.co.uk/wp-content/uploads/2016/10/Hand-Luggage-Only-2-1.jpg?w=1600&ssl=1",
                  "lat": "48.1358",
                  "long": "11.5529"
                },
                {
                  "city": "Florence, Italy",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "https://assets3.thrillist.com/v1/image/3079347/1200x600/scale;",
                  "lat": "43.7835",
                  "long": "11.2433"
                },
                {
                  "city": "Palma, Spain",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "https://content.r9cdn.net/rimg/dimg/2d/ae/ab5e7a69-city-12458-163db0877ad.jpg?width=1366&height=768&xhint=1533&yhint=888&crop=true",
                  "lat": "39.5797",
                  "long": "2.6623"
                },
                {
                  "city": "Rome, Italy",
                  "marketing": "50% Off on hotel Booking",
                  "hash": "12341234324123413342124",
                  "image": "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcQc5AlEw5MPfZNzZ5ZZzMRVsC-JYMNCXvQt-HfmZIev3pgjtOvOgnFW-8U5vhaZuxCd",
                  "lat": "41.8772",
                  "long": "12.4930"
                }

            ]

          }

          resolve(data);
      
    });

  }

  async blogs(body: any) {
    return new Promise(async (resolve)=> {

      resolve([
        {
          "title": "The world’s top 10 places to celebrate Halloween",
          "content": "<div class=\"trt-article__content\" itemprop=\"articleBody\" data-component=\"traveltips/article\">\n<p>For Halloween enthusiasts or indeed anyone who relishes the spooky, Gothic and macabre, these 10 places around the world will not disappoint. Promising mythology, culture and eerie festivities, this selection of destinations offers something for every type of Halloween celebration.</p>\n<h3 id=\"bra-ov-romania\">Braşov, Romania</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/137826074.jpg?k=d9a26732b2e7b2281b1903cf13b8c37c0546c40a504a39d3b058f9e7d6190452&amp;o=?size=S\" alt=\"The hauntingly beautiful Bran Castle in Braşov\"><p class=\"travel-article-image-desc\">The hauntingly beautiful Bran Castle in Braşov</p></div>\n<p>The town of <a href=\"https://www.booking.com/country/ro.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Braşov</a> can be found deep in the historic region of Transylvania, and is the home of legendary fictional character, Count Dracula. This mysterious land is best known for its medieval towns, mountainous borders and Gothic castles. <a href=\"https://www.booking.com/attractions/ro/prwrghlz3ycm-guided-bran-castle-tour.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Tour Bran Castle</a> to hear tales of Vlad the Impaler, thought to be the inspiration behind Bram Stoker's spooky Dracula. Or book a <a href=\"https://www.booking.com/attractions/ro/prt2lyu24bbx-halloween-at-draculas-castle.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">night tour</a> and spend the evening celebrating Halloween in the castle. Located in the medieval heart of Braşov, the boutique <a href=\"https://www.booking.com/hotel/ro/vila-katharina.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Vila Katharina hotel</a> is an 18th-century architectural jewel, exuding elegance and sophistication. Guests can enjoy various activities nearby including a <a href=\"https://www.booking.com/attractions/ro/pr9sr3e5iuwe-fortified-churches-half-day-tour.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">historical church tour</a> and scenic hiking.</p>\n<h3 id=\"paris-france\">Paris, France</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/137826295.jpg?k=5c153ce08a894d7d8af845cfb656aa08048aeaadc523a3679bac1d89fd7d4005&amp;o=?size=S\" alt=\"Take a walking tour past spooky sights like the flamboyant, Gothic Saint-Jacques Tower\"><p class=\"travel-article-image-desc\">Take a walking tour past spooky sights like the flamboyant, Gothic Saint-Jacques Tower</p></div>\n<p>Whether you’re looking for a trick or a treat, <a href=\"https://www.booking.com/country/fr.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Paris</a> has it all; from extravagant Halloween displays at <a href=\"https://www.booking.com/attractions/fr/prgifpkmd9dp-disneyland-paris-halloween-party-admission-ticket.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Disneyland® Paris</a> to <a href=\"https://www.booking.com/attractions/fr/prcsspfinljq-hidden-paris-guided-walking-tour.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">ghostly tours</a> that take in the city's spooky sights (like the 4th arrondissement's flamboyant, Gothic Saint-Jacques Tower). Spend the night at the 19th-century <a href=\"https://www.booking.com/hotel/fr/brighton.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hôtel Brighton</a>, situated in the heart of Paris just opposite the Louvre and the Jardin des Tuileries (beautiful, manicured gardens). The property is beautifully furnished with antique Parisian furniture and chandeliers, and has rooms that feature picturesque views of the courtyard, the Eiffel Tower or the Jardin des Tuileries.</p>\n<h3 id=\"new-orleans-usa\">New Orleans, USA</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/137826357.jpg?k=73f8b9ccf201224a0494b8e25fb0cfb7acc1c9c6a627398bb4cf0e8ec85cad9e&amp;o=?size=S\" alt=\"New Orleans' famous Krewe of Boo street party\"><p class=\"travel-article-image-desc\">New Orleans' famous Krewe of Boo street party</p></div>\n<p><a href=\"https://www.booking.com/country/us.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">New Orleans</a> is largely known for its eccentric carnival celebrations. But when it comes to Halloween, the city is almost as fabulous as during Mardi Gras. New Orleans is also known for its rich history, with ample haunted stories and legends. Experience a spooky <a href=\"https://www.booking.com/attractions/us/pr9hfvxbnxvd-halloween-special-evening-tour-of-the-french-quarter.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">guided tour of the French Quarter</a>, voodoo shops and street parties such as the famous Krewe of Boo. <a href=\"https://www.booking.com/hotel/us/peter-and-paul.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hotel Peter and Paul</a> is a former 19th-century schoolhouse, rectory, church and convent restored and repurposed as a unique hotel. Only a short distance from St Louis Cemetery No 1 and based in the heart of the city, each building of the hotel tells its own story, with no two rooms exactly the same.</p>\n<h3 id=\"oaxaca-mexico\">Oaxaca, Mexico</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/137826459.jpg?k=d33694e6bbf86feea8e6debca522fc8a35c8b7f4ca9b4e59b02c81b7f334cdac&amp;o=?size=S\" alt=\"Mexico's colourful Day of the Dead celebration\"><p class=\"travel-article-image-desc\">Mexico's colourful Day of the Dead celebration</p></div>\n<p>Although celebrated a little later than Halloween, The <a href=\"https://www.booking.com/attractions/mx/prfkbvwp3qsz-santa-cruz-xoxocotlan-day-of-the-dead-tour.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Day of the Dead</a> makes <a href=\"https://www.booking.com/country/mx.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Mexico</a> a number one destination for Halloween-lovers. Día de los Muertos is held on the 2nd November, featuring sugar skulls that are decorated with colourful patterns. A famous Mexican tradition, it is a celebration of departed souls returning to earth to visit their loved ones. Candles, flowers and favourite foods are presented to graveyards and people dress up in imaginative costumes to parade through the streets. Part of the old convent of San Pablo, the hotel <a href=\"https://www.booking.com/hotel/mx/boutique-casa-antonieta.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Casa Antonieta</a> is one of the first buildings to be built in Oaxaca and served as a parish for the indigenous population that lived across the city. Located in the Oaxaca Historic Centre and a short walk from the cathedral, this hotel offers a luxurious and convenient stay with a courtyard that provides a peaceful place to relax.</p>\n<h3 id=\"sleepy-hollow-usa\">Sleepy Hollow, USA</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/172522688.jpg?k=0b3913a8e0626ae4893e226838ad308114ec1f058bb24bd1a3e629235a3f5bdd&amp;o=?size=S\" alt=\"Sleepy Hollow revels in the legend of the headless horseman\"><p class=\"travel-article-image-desc\">Sleepy Hollow revels in the legend of the headless horseman</p></div>\n<p>Visit the infamous village of Sleepy Hollow to revel in the legend of the headless horseman from Washington Irving’s eerie novella. Experience haunted hayrides, Gothic mansions, attractions include Sleepy Hollow cemetery tours and street parades in this ghoulish, historic town. Stay at the suitably spooky <a href=\"https://www.booking.com/hotel/us/castle-on-the-husdon.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Castle Hotel &amp; Spa</a>, set in a 19th-century, Norman-style castle overlooking the Hudson River. Washington Irving’s estate and other historic sites like the infamous Sleepy Hollow Cemetery are located just a short drive from the hotel.</p>\n<h3 id=\"londonderry-northern-ireland\">Londonderry, Northern Ireland</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/137886930.jpg?k=3465366f131da21ea841837acb08773df4bd9cedd73b1d608c7fd58f630e2593&amp;o=?size=S\" alt=\"Fireworks light up Londonderry during its enrapturing Halloween festival\"><p class=\"travel-article-image-desc\">Fireworks light up Londonderry during its enrapturing Halloween festival</p></div>\n<p>Halloween in Northern Ireland is quite the affair, thanks to the city of <a href=\"https://www.booking.com/country/gb.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Londonderry</a>'s bewitching Halloween festival. Deemed the biggest Halloween parade in Europe, it's a devilish week of firework displays, street parades and mythical mayhem. Stay in town amid all the spooky action at the <a href=\"https://www.booking.com/hotel/gb/palace-street-apartments.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Palace Street Apartments</a>, or check yourself into a rural retreat just outside the city at <a href=\"https://www.booking.com/hotel/gb/larchmount-house.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Larchmount House B&amp;B</a>.</p>\n<h3 id=\"salem-usa\">Salem, USA</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/172522670.jpg?k=70c15837a535bd863c507875f85161ab92d0c20bfd7a7d6adb55917660867d77&amp;o=?size=S\" alt=\"Salem became famous in the 17th century for the Salem Witch Trials\"><p class=\"travel-article-image-desc\">Salem became famous in the 17th century for the Salem Witch Trials</p></div>\n<p>Another North American town with a powerful, haunted history, <a href=\"https://www.booking.com/city/us/salem-massachusetts.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Salem</a> in Massachusetts became famous in the 17th century for the Salem Witch Trials. It served as inspiration for American playwright, Arthur Miller, in writing his seminal play, The Crucible. Today, the town is full of museums and memorials to the women who lost their lives during the witch hunts. But there is also a more lighthearted side to the town’s celebrations, as the Annual Psychic Fair and Witchcraft Expo runs throughout October and finishes with the Salem Witches’ Halloween Ball at the <a href=\"https://www.booking.com/hotel/us/hawthorne.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hawthorne Hotel</a>. Both the Expo and the Ball are a great opportunity to meet modern day Wiccans, mediums, psychics and crystal ball readers.</p>\n<h3 id=\"edinburgh-scotland\">Edinburgh, Scotland</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/172522745.jpg?k=f79dd357436c7a896810d0d8ded0e15af7d584e8b736e7f4c7cde2eb8ded74f5&amp;o=?size=S\" alt=\"Edinburgh's gothic architecture is the perfect Halloween setting\"><p class=\"travel-article-image-desc\">Edinburgh's gothic architecture is the perfect Halloween setting</p></div>\n<p>The 13th-century <a href=\"https://www.booking.com/hotel/gb/dalhousiecastleandspa.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Dalhousie Castle Hotel</a> (a half-hour drive from <a href=\"https://www.booking.com/accommodation/city/gb/edinburgh.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Edinburgh</a>) has so many ghosts – including Hollywood favourite, the Grey Lady – that the current day owners have set up their own <a href=\"https://www.booking.com/attractions/gb/pr4cpy5psisg-ghost-tour.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">ghost tours</a> (a Halloween edition will be particularly thrilling), in a bid to make sure that visitors don’t miss any opportunities for spirit-spotting. Another of the famous deceased residents (and a highlight of the ghost tour) is Sir Alexander Ramsay, who was reportedly starved to death in 1342 by the castle’s then-owner. However, visitors don’t have to join the official tour to meet Sir Ramsay or the Grey Lady, with many guests reporting incidents of moving furniture, ghostly hands, unsettling noises and unexplained footsteps while exploring.</p>\n<h3 id=\"prague-czech-republic\">Prague, Czech Republic</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/172522682.jpg?k=ddc573450987a9cdec2ce5653d29cd2798457701821f451312f7c9622f507bb1&amp;o=?size=S\" alt=\"Take a spooky stroll across the Charles Bridge for a view of the Vltava River\"><p class=\"travel-article-image-desc\">Take a spooky stroll across the Charles Bridge for a view of the Vltava River</p></div>\n<p>Halloween isn’t a huge celebration in the Czech capital but the extraordinary Gothic architecture that defines the city really lends itself to an eerie holiday. Also known as The City of a Hundred Spires, <a href=\"https://www.booking.com/city/cz/prague.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Prague</a>’s cityscape is marked with looming towers, a 9th-century castle, and cathedrals adorned with macabre gargoyles. Wander the winding medieval lanes of the Old Town, take a pensive walk around the atmospheric Old Jewish Cemetery, and stroll across the Charles Bridge for a view of the Vltava River (hopefully shrouded in spooky mist, come October) . Complete your Gothic fairytale staying in the Old Town Square at <a href=\"https://www.booking.com/hotel/cz/cerna-liska.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hotel Lippert</a>.</p>\n<h3 id=\"las-vegas-usa\">Las Vegas, USA</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/172522852.jpg?k=7e8cc9bed7c5d274a725e711cb65ad638f2afd76f39e2a985fdf457a8bf356ea&amp;o=?size=S\" alt=\"Sin City's lavish costumes stand out from the crowd\"><p class=\"travel-article-image-desc\">Sin City's lavish costumes stand out from the crowd</p></div>\n<p>For wild Halloween celebrations and lavish costumes, you can’t do much better than Sin City. Stop by one of <a href=\"https://www.booking.com/accommodation/city/us/las-vegas.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Las Vegas</a>’ numerous fancy dress shops and pick up an elaborate Elvis or Marilyn outfit before hitting one of the countless parties held for Halloween (fancy dress enthusiasts take note; all over The Strip, nightclubs and casinos hold costume contests with considerable cash prizes). In addition to themed parties, there are also festivals, parades, haunted houses, fantastic cocktails and fine dining, and plenty of spine-chilling free entertainment. Stay just a 15-minute walk from The Strip at <a href=\"https://www.booking.com/hotel/us/marriott-s-grand-chateau-1-las-vegas.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Marriott's Grand Chateau</a>.</p>\n<p>Get in the mood for your ghostly getaway with these <a href=\"https://open.spotify.com/playlist/3glnJ3tpKQgRF6QSfhKOuZ\">Halloween hits</a>. </p>\n<iframe style=\"border-radius:12px\" src=\"https://open.spotify.com/embed/playlist/3glnJ3tpKQgRF6QSfhKOuZ?utm_source=generator&amp;theme=0\" width=\"100%\" height=\"380\" frameborder=\"0\" allowfullscreen=\"\" allow=\"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture\" loading=\"lazy\"></iframe>\n<div data-component=\"traveltips/article-view-ga-track\" data-component-action=\"\" data-component-label=\"article_bottom\"></div>\n<div class=\"\nbui-u-text-center\ntravel-tips-social\n\">\n<a target=\"_blank\" href=\"https://twitter.com/intent/tweet?text=https%3A%2F%2Fwww.booking.com%2Farticles%2Fghostly-getaways-halloween.en-gb.html\" aria-label=\"Share article on Twitter\"><svg class=\"bk-icon -streamline-logo_twitter\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M106.9 33a23.4 23.4 0 0 0 10-12.7 47.496 47.496 0 0 1-14.7 5.4 22.6 22.6 0 0 0-16.5-7c-12.702-.11-23.09 10.096-23.2 22.798v.002c.005 1.73.275 3.45.8 5.1a64.6 64.6 0 0 1-47.5-23.9c-6.188 10.469-3.115 23.949 7 30.7a24 24 0 0 1-10.2-3v.3c-.079 10.991 7.63 20.502 18.4 22.7a24.002 24.002 0 0 1-6.1.7 11.1 11.1 0 0 1-4.1-.5 23 23 0 0 0 21.4 16 46.3 46.3 0 0 1-28.5 9.8c-1.869.057-3.74-.01-5.6-.2a64.5 64.5 0 0 0 35.3 10.2c35.787.277 65.023-28.51 65.3-64.296.003-.335.003-.67 0-1.004v-2.9A52.695 52.695 0 0 0 120 29.3a57.395 57.395 0 0 1-13.1 3.7z\"></path></svg></a>\n<a target=\"_blank\" href=\"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.booking.com%2Farticles%2Fghostly-getaways-halloween.en-gb.html\" aria-label=\"Share article on Facebook\"><svg class=\"bk-icon -streamline-logo_facebook_box\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M120 16v96a8 8 0 0 1-8 8H85V77h15l2-17H85V49c0-5 2-8 9-8h9V26a112.691 112.691 0 0 0-14-1c-13 0-21 7.5-21 22v13H53v17h15v43H16a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8z\"></path></svg></a>\n</div>\n</div>",
          "hash": "12341234324123413342124",
          "date": "Sun, 16 Oct 2022 19:32:05 GMT"
        },
        {
          "title": "Japan’s 7 most stunning national parks",
          "content": "<div class=\"trt-article__content\" itemprop=\"articleBody\" data-component=\"traveltips/article\">\n<p>Venture outside sprawling cityscapes like Tokyo and you’ll discover the wild and otherworldly beauty of Japan’s national parks. These protected landscapes boast incredible natural diversity, from fluttering pink cherry blossom petals in spring, to autumnal, maple forest-cloaked valleys glowing crimson and gold. </p>\n<p>In summer, expect camping in Japanese beech forests, hiking ancient volcanic calderas, and swimming with dolphins. In winter, discover frozen waterfalls, onsens with mountain views and rare, red-crowned cranes stalking gracefully through the snow.</p>\n<h3 id=\"akan-mashu-national-park-hokkaido\">Akan Mashu National Park, Hokkaido</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/176187720.jpg?k=ffe92366f9a4032c5d779822c811fca4032db88e815cb0d05c2e656781835635&amp;o=?size=S\" alt=\"Akan Mashu National Park, Hokkaido\"><p class=\"travel-article-image-desc\">Akan Mashu National Park, Hokkaido</p></div>\n<p>Sparsely populated <a href=\"https://www.booking.com/region/jp/hokkaido.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hokkaido</a> is a natural paradise, with six national parks on the island and endlessly spectacular, wild scenery. Come between June and August to hike volcanic calderas for panoramas of lakes shrouded in mist and fringed by forest and marimo (appearing as clusters of mystical moss balls on the shores of Hokkaido’s Lake Akan, this nearly extinct algae can only be found in a few places around the world). The park is also home to Japan’s biggest Ainu community (the indigenous people of Hokkaido). The Ainu featured in popular manga series, <em>Golden Kamuy</em>; fans should visit Lake Mashū (‘the lake of the gods’ in Ainu) if visiting in summer. Between December and February, the park is best for onsens and superb snow sports (cold fronts from Siberia bring some of the world’s best powder to the island). Keep a lookout for Tanchou (aka the Japanese crane and a national treasure) too, as many can be seen in the area in winter. Stay on the shores of Lake Akan at <a href=\"https://www.booking.com/hotel/jp/akan-yukyuno-sato-tsuruga.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Akan Yuku no Sato Tsuruga</a>.</p>\n<h3 id=\"towada-hachimantai-national-park-aomori-iwate-akita\">Towada-Hachimantai National Park, Aomori/Iwate/Akita</h3>\n<div class=\"travel-article-image travel-article-image-M\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/176192863.jpg?k=236eedb097a647fcd46494501642ae849be2c64aad02db3c8866248a4a1458f6&amp;o=?size=M\" alt=\"Towada-Hachimantai National Park, Aomori/Iwate/Akita\"><p class=\"travel-article-image-desc\">Towada-Hachimantai National Park, Aomori/Iwate/Akita</p></div>\n<p>The mountainous Towada-Hachimantai National Park can be found in northern Japan, straddling the Aomori, Iwate, and Akita Prefectures. Natural landmarks here include <a href=\"https://www.booking.com/landmark/jp/lake-towada.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Lake Towada</a>, Hakkoda Mountain and Oirase River (the river has a boardwalk that you can walk along). The park is known to peak in autumn (October especially), when the virgin forest glows golden with falling leaves. But in winter, the frozen waterfalls and snow-covered trees look equally majestic (and are often illuminated to magical effect). Skiing, snowboarding, hiking, cycling, canoeing and onsen (geothermal hot springs) bathing can all be enjoyed here, as can warming winter regional dishes like Kiritanpo (pounded rice wrapped around a stick of cedarwood and roasted) and Inaniwa udon (flavourful udon with thinner noodles than usual). Stay at <a href=\"https://www.booking.com/hotel/jp/deng-lu-you-xing-wen-hua-cai-nosu-yamanixian-you-guan.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Historical Ryokan SENYUKAN</a>, just a half-hour drive from the park. </p>\n<h3 id=\"nikko-national-park-tochigi-gunma-fukushima\">Nikko National Park, Tochigi/Gunma/Fukushima</h3>\n<div class=\"travel-article-image travel-article-image-M\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/176192744.jpg?k=ebffcac1be503d9de8b83827382abe79c0f9ec4bd9485394799d2d545d876a29&amp;o=?size=M\" alt=\"Nikko National Park, Tochigi/Gunma/Fukushima\"><p class=\"travel-article-image-desc\">Nikko National Park, Tochigi/Gunma/Fukushima</p></div>\n<p>You may well visit <a href=\"https://www.booking.com/region/jp/nikko-national-park.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Nikko National Park</a> to admire its surreal natural beauty. But it’s the exquisite, historic Shinto shrines, Buddhist temples and pagodas peeping through the trees that really elevate the scenery. Must-sees include the ornately carved, golden rooftop of Nikkō Tōshō-gū shrine, the gleaming red walls of Rinno-ji temple matching the crimson-coloured forest in autumn, and the wistful Shinkyo Bridge, originally used exclusively by the emperor. Also spread across three prefectures, the park is about a 2-hour train ride or 3-hour drive from Tokyo. The activities available vary widely depending on the season, too; you can hike, canyon through crystalline creeks and camp amid rhododendrons and daylilies during the summer months. Or even partake in a sacred waterfall meditation (check out the popular Kegon Falls, in particular). In winter, a variety of adventurous snowsports await (from snowshoeing to climbing ice walls) but you can also opt for a relaxing onsen soak and a stroll through the photogenic, snow-blanketed surroundings. Enjoy open-air natural spring baths with mountain views while staying at <a href=\"https://www.booking.com/hotel/jp/asaya.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Asaya</a>.</p>\n<h3 id=\"showa-kinen-park-tokyo\">Showa Kinen Park, Tokyo</h3>\n<div class=\"travel-article-image travel-article-image-M\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/176192656.jpg?k=5a3737bfcadde87f4e0565b0fe068ac89002dd3ab0d3a1b724b639187fbef9a5&amp;o=?size=M\" alt=\"Showa Kinen Park, Tokyo\"><p class=\"travel-article-image-desc\">Showa Kinen Park, Tokyo</p></div>\n<p>For a taste of Japan’s sublime nature without having to leave Tokyo, Showa Kinen Park is a veritable oasis in the western suburbs. Just a 30-minute train ride from the city centre, you can hire bikes to cycle along woodland trails and around manicured flower beds of vibrant tulips. Or hire a paddle boat and explore the park’s pretty ponds and ginkgo tree-lined canals. It’s a delightful escape from the crowded metropolis at any time but it’s particularly popular in spring and autumn. Check out the Cherry Blossom Garden for a seasonal sakura spectacle and participate in hanami under the blooming trees. Or visit the Japanese garden filled with maple trees for a warm, autumnal scene. In December, the park is illuminated with festive lighting. In summer, you can come and have a barbecue (barbecuing is permitted in the park) and check out the Tachikawa Festival fireworks display. Stay at <a href=\"https://www.booking.com/hotel/jp/kikusuitei.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Kikusuitei</a> in the west of Tokyo.</p>\n<h3 id=\"fuji-hakone-izu-national-park-kanagawa-shizuoka-tokyo-yamanashi\">Fuji Hakone Izu National Park, Kanagawa/Shizuoka/Tokyo/Yamanashi</h3>\n<div class=\"travel-article-image travel-article-image-M\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/176192672.jpg?k=3eb8ca136acb1b219a3bbbc999f396eb18c9960ad467c893528b80a5f8f94242&amp;o=?size=M\" alt=\"Fuji Hakone Izu National Park, Kanagawa/Shizuoka/Tokyo/Yamanashi\"><p class=\"travel-article-image-desc\">Fuji Hakone Izu National Park, Kanagawa/Shizuoka/Tokyo/Yamanashi</p></div>\n<p>Home to the mighty mount Fuji and in close proximity to <a href=\"https://www.booking.com/accommodation/city/jp/tokyo.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Tokyo</a>, Fuji Hakone Izu is Japan’s most-visited national park. You can climb the slopes of the sacred volcano in summer, or revel in its soulful, snow-capped beauty from afar in winter. The Fuji Five Lakes (with Lake Kawaguchiko being the most accessible and therefore popular) serve as great vantage points for admiring the view of Mount Fuji. But it’s the park’s natural diversity that makes it endlessly exciting, from the soothing, romantic beauty of the Sengokuhara grass field, to eerie lava caves and the stunning volcanic Izu islands in the south (where you can swim with dolphins). After a day spent hiking Japanese beech forests past a series of waterfalls, refresh your legs bathing in healing geothermal springs in the Hakone region’s ‘great boiling valley’. <a href=\"https://www.booking.com/hotel/jp/gesutohaususekino.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Guest house SEKINO</a> offers accommodation within a charming, traditional Japanese house.</p>\n<h3 id=\"setonaikai-national-park-shikoku-seto-inland-sea-\">Setonaikai National Park, Shikoku (Seto Inland Sea)</h3>\n<div class=\"travel-article-image travel-article-image-M\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/176192660.jpg?k=be78dfbe17ca991cbb3169f6c2c38a36edc1905a3db0f8b1567e09bdda3daa8f&amp;o=?size=M\" alt=\"Setonaikai National Park, Shikoku (Seto Inland Sea)\"><p class=\"travel-article-image-desc\">Setonaikai National Park, Shikoku (Seto Inland Sea)</p></div>\n<p><a href=\"https://www.booking.com/landmark/jp/setonaikai-kokuritsukoen.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Setonaikai</a> was Japan’s first national park and is also its largest (spanning a whopping 9000 square kilometres and 11 prefectures). Aside from cultural attractions like the renowned Benesse Art Site Naoshima art project and the Setouchi Triennale art festival, the park possesses an array of activities from hiking and cycling to sea kayaking. But best of all is the range of landscapes; the park comprises a collection of about three thousand rugged, mountainous islands floating in the Seto Inland Sea. It’s also home to the small island of Miyajima, most famous for its beautiful torii gate that appears to float on the water at high tide. Tour Setonaikai’s magical fishing villages (like Tomonoura, famous as the setting of Studio Ghibli’s <em>Ponyo</em>) and visit white sand beaches lined with pine trees. Or hike past terraced rice fields and take a cable car to the top of Mount Rokko for far-reaching views of Osaka Bay. There’s also the unmissable sight of the Naruto whirlpools – a phenomenon formed by currents meeting in the Naruto Strait where circling torrents of ocean can span up to 20 metres wide. Wake up to ocean views at the highly rated <a href=\"https://www.booking.com/hotel/jp/wakka-jin-zhi-shi.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Wakka</a>.</p>\n<h3 id=\"aso-kuj-national-park-kumamoto-oita\">Aso Kujū National Park, Kumamoto/Oita</h3>\n<div class=\"travel-article-image travel-article-image-M\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/176192852.jpg?k=7a9d7c12965980b03b8185b062aa841c4e68d85b6f7607808001ff635adcf93a&amp;o=?size=M\" alt=\"Aso Kujū National Park, Kumamoto/Oita\"><p class=\"travel-article-image-desc\">Aso Kujū National Park, Kumamoto/Oita</p></div>\n<p>Home to the Kuju Mountains and Aso Mountain – the largest active volcano in Japan – <a href=\"https://www.booking.com/city/jp/kuju.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Aso Kuju National Park</a> is famous for its dramatic landscapes. It’s also one of Japan’s oldest national parks, with an established network of hiking trails and the hallowed Aso-shrine, one of the oldest shrines in the country. <a href=\"https://www.booking.com/cars/index.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hire a car</a> and embark on a scenic road trip. Or walk verdant valleys and take a look inside Mount Aso’s huge, ancient but active crater, before taking a dip in one of the local hot springs. You’ll find some of Japan’s best onsen towns in the vicinity, including Kurokawa, Yufuin and Beppu. Stay at <a href=\"https://www.booking.com/hotel/jp/minshuku-asogen.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Minshuku Asogen</a>, a ryokan with its own onsen, just a few kilometres from Mount Aso.</p>\n<div data-component=\"traveltips/article-view-ga-track\" data-component-action=\"\" data-component-label=\"article_bottom\"></div>\n<div class=\"\nbui-u-text-center\ntravel-tips-social\n\">\n<a target=\"_blank\" href=\"https://twitter.com/intent/tweet?text=https%3A%2F%2Fwww.booking.com%2Farticles%2Fjapan-national-parks.en-gb.html\" aria-label=\"Share article on Twitter\"><svg class=\"bk-icon -streamline-logo_twitter\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M106.9 33a23.4 23.4 0 0 0 10-12.7 47.496 47.496 0 0 1-14.7 5.4 22.6 22.6 0 0 0-16.5-7c-12.702-.11-23.09 10.096-23.2 22.798v.002c.005 1.73.275 3.45.8 5.1a64.6 64.6 0 0 1-47.5-23.9c-6.188 10.469-3.115 23.949 7 30.7a24 24 0 0 1-10.2-3v.3c-.079 10.991 7.63 20.502 18.4 22.7a24.002 24.002 0 0 1-6.1.7 11.1 11.1 0 0 1-4.1-.5 23 23 0 0 0 21.4 16 46.3 46.3 0 0 1-28.5 9.8c-1.869.057-3.74-.01-5.6-.2a64.5 64.5 0 0 0 35.3 10.2c35.787.277 65.023-28.51 65.3-64.296.003-.335.003-.67 0-1.004v-2.9A52.695 52.695 0 0 0 120 29.3a57.395 57.395 0 0 1-13.1 3.7z\"></path></svg></a>\n<a target=\"_blank\" href=\"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.booking.com%2Farticles%2Fjapan-national-parks.en-gb.html\" aria-label=\"Share article on Facebook\"><svg class=\"bk-icon -streamline-logo_facebook_box\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M120 16v96a8 8 0 0 1-8 8H85V77h15l2-17H85V49c0-5 2-8 9-8h9V26a112.691 112.691 0 0 0-14-1c-13 0-21 7.5-21 22v13H53v17h15v43H16a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8z\"></path></svg></a>\n</div>\n</div>",
          "hash": "12341234324123413342124",
          "date": "Sun, 14 Oct 2022 19:32:05 GMT"
        },
        {
          "title": "48 hours in New York City",
          "content": "<div class=\"trt-article__content\" itemprop=\"articleBody\" data-component=\"traveltips/article\">\n<p>Two days in the Big Apple may only be enough to scratch the surface. But with this concise and fun-packed 48-hour itinerary, you’ll make the most of the time you have and get a real taste of the city. Ranging from cultural landmarks to comedy shows and some classic must-see sights, here is the best of NYC to cover in two days.</p>\n<h2 id=\"day-1\">Day 1</h2>\n<h3 id=\"zucker-s-bagels\">Zucker’s Bagels</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173724610.jpg?k=c12266fd37cac622ac2b30a2b9c402d842e478926f82c91896233f8d5c062bb0&amp;o=?size=S\" alt=\"\"></div>\n<p>You may have to queue a bit at the weekend for the popular Zucker’s Bagels (there are several branches in Manhattan). But once you step inside the subway-tiled, downtown delicatessen interior, and check out the menu – you’ll understand why. The hand-rolled, kettle-boiled and generously filled bagels feature mouthwatering combinations of fillings or ‘schmears’. Tuck into toasted bagels overflowing with chopped tomatoes and creamy guacamole, egg yolk and crispy bacon, or cream cheese with a variety of smoked fish. Locals love the Nova Scotia on pumpernickel. </p>\n<h3 id=\"statue-of-liberty\">Statue of Liberty</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723273.jpg?k=b8816b4f6e9b2f9b787052cb59a1ea7b203a6698c5e3c181ea2de15f0041a48f&amp;o=?size=S\" alt=\"\"></div>\n<p>This colossal copper <a href=\"https://www.booking.com/attractions/us/pra9cpr9593z-skip-the-line-ticket-to-ellis-island-and-the-statue-of-liberty.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">statue</a> of a torch-bearing woman was gifted by the French in 1886 and has since come to symbolise freedom. Climb 354 steps to the crown for stunning views across New York Harbour, then visit the museum located within the pedestal.</p>\n<h3 id=\"brooklyn-bridge\">Brooklyn Bridge</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723260.jpg?k=721af7bc34e8764b0a17db23f0eda16f64f6a3106f4265e1d4da88816581020d&amp;o=?size=S\" alt=\"\"></div>\n<p>This beloved and much-<a href=\"https://www.booking.com/attractions/us/prezdgsyhkci-brooklyn-bridge-photo-session.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">photographed</a> cable-stayed suspension bridge is an even more captivating sight in the flesh. Walk across this National Historic Landmark at sunrise to beat the crowds or at sunset to snag classic souvenirs from gathering street vendors.</p>\n<h3 id=\"brooklyn-museum\">Brooklyn Museum</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723278.jpg?k=c20c1ea253605f942d636783312c5981a6453d9c07fd655546a2183eedbc0a9b&amp;o=?size=S\" alt=\"\"></div>\n<p>This internationally renowned gallery is a cultural treasure trove, housing 1.5 million works of art and artefacts. Ponder Judy Chicago's famed feminist installation, The Dinner Party, then attend a pop-up concert or salsa dancing class.</p>\n<h3 id=\"brooklyn-burgers-beer\">Brooklyn Burgers &amp; Beer</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723926.jpg?k=39a8bbc950fe01e21de6ca2839d620dc87de52e880a359b1d0179269484c6fad&amp;o=?size=S\" alt=\"\"></div>\n<p>For quality burgers and craft beer, this inconspicuous burger bar in Park Slope has proven a hit with locals and tourists alike. Whether it’s grass-fed beef, cage-free chicken or vegan cheese, every seasonal ingredient is sourced locally and sustainably. You can even build your own burger, served with loaded fries and delicious slaw.</p>\n<h3 id=\"lips-drag-queen-show-palace-restaurant-bar\">Lips Drag Queen Show Palace Restaurant &amp; Bar</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723284.jpg?k=a8cd96ef6ec4e402acfb2bd6be2e17d64bdffd9398e37873c5bcc81e8e89d3d0&amp;o=?size=S\" alt=\"\"></div>\n<p>Offering nightly drag shows and glamorous dining experiences, this glitzy venue guarantees a great night out on the town back in Manhattan. There are themed nights with celebrity impersonators and games of Bitchy Bingo, three-course dining specials and a ‘Boozy Brunch’ with unlimited bloody marys and mimosas on Sundays.</p>\n<h2 id=\"day-2\">Day 2</h2>\n<h3 id=\"la-bonbonniere\">La Bonbonniere</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723326.jpg?k=a1f4cf0597c47e4c9f999d90c05f5ba42cc58750f865dfd9cdca33f724418fa0&amp;o=?size=S\" alt=\"\"></div>\n<p>While other breakfast spots compete for the most photogenic dishes or most fashionable interiors, this down-to-earth diner keeps things pure and simple. Think hearty stacks of pancakes, fluffy French toast and eggs cooked just how you like them. Not to mention bottomless coffee, crispy bacon and homemade and fresh-out-of-the-fryer chips for a proper diner feast.</p>\n<h3 id=\"metropolitan-museum-of-art\">Metropolitan Museum of Art</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723261.jpg?k=c9e3127c20cddb9ad0d7d702bf8a33ea865382ce0677df4fe530519237f56c07&amp;o=?size=S\" alt=\"\"></div>\n<p>The <a href=\"https://www.booking.com/attractions/us/prhxkta7igpb-metropolitan-museum-of-art-guided-tour.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Met</a> invites you to explore more than 5,000 years of art from across the globe. Gaze at sculptures from ancient Rome, then view masterpieces by Leonardo da Vinci. Before you head out, stop by the rooftop to check out its art installations and exceptional view of the city.</p>\n<h3 id=\"what-goes-around-comes-around\">What Goes Around Comes Around</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723327.jpg?k=58fbdb245befb6af0784c1c1926da9fcf78ea2ccdbcf777463d50bf93898d94a&amp;o=?size=S\" alt=\"\"></div>\n<p>This clothes shop is fully stocked with everything from retro Americana outfits to vintage workwear. There’s also a huge range of Chanel handbags, Victorian dresses and silk scarves. Even if you’re just browsing, the items are so carefully curated that you’ll feel like you’re wandering through a museum.</p>\n<h3 id=\"the-mall-central-park\">The Mall, Central Park</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723256.jpg?k=094242d65ed4781b95b9408a2a2cbb368b8a14bbd21551bc45c5444bfe786ce5&amp;o=?size=S\" alt=\"\"></div>\n<p>Not to be confused with a shopping mall, The Mall is an American elm-lined walkway cutting through the middle of Central Park. It was originally designed to allow horse carriages to easily pass through but today it’s more of an open-air corridor for walkers, skateboarders, rollerbladers and street performers.</p>\n<h3 id=\"corner-slice\">Corner Slice</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723263.jpg?k=057bfffc90b3ed827c3aab0f9d858410c405979c01695693d47856a6730a1ad1&amp;o=?size=S\" alt=\"\"></div>\n<p>At Corner Slice, pizza is cut into large, doughy squares and served on paper plates in true NYC-style. Championing affordable eats in the enticing food hall that is Gotham West Market, this pizzeria is a testament to the power of the New York pizza slice. But this isn’t the only draw – you can also get meatball sandwiches, cinnamon buns and ice-cold root beer.</p>\n<h3 id=\"otto-s-shrunken-head\">Otto’s Shrunken Head</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723316.jpg?k=f393283c2dee801074df4073d7be17b74de87261d33d14c9a8691d2204186622&amp;o=?size=S\" alt=\"\"></div>\n<p>This rock-n-roll tiki bar makes for a lively night out, with an ever-eclectic mix of bands, DJs and cultural events on the agenda and strong tropical-inspired drinks. The kitsch décor adds to the cool dive bar atmosphere.</p>\n<h3 id=\"caroline-s-on-broadway\">Caroline’s on Broadway</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/173723257.jpg?k=49527dbdf1d4613e8d4d88dab6ec95a89dd19b3c20b6db3a43cd177dbb0a47d1&amp;o=?size=S\" alt=\"\"></div>\n<p>A venue that’s known as a favourite testing ground for popular comedians trying out new material. Beware; front row audience members are likely to be targeted. Score the best seats by going for the dinner plus a show package (note the package has a two-drink minimum).</p>\n<h2 id=\"getting-there\">Getting there</h2>\n<p>NYC is served by JFK, LaGuardia and Newark <a href=\"https://www.booking.com/flights/index.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">airports</a>, each of which is served by a variety of transport routes. For JFK, there’s the AirTrain, the subway, the Long Island Railroad or LIRR, and various buses. For Laguardia (the closest airport to Midtown Manhattan), a combination of bus and subway is your best bet. And for Newark, you can choose between AirTrain and New Jersey Transit train, or bus. All airports are served by <a href=\"https://www.booking.com/taxi/index.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">taxis</a> – though if travelling during rush hour, do factor in extra transit time for traffic.</p>\n<h2 id=\"where-to-stay\">Where to stay</h2>\n<p><a href=\"https://www.booking.com/hotel/us/the-bowery.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">The Bowery</a>: treat yourself to some East Village grandeur with a suite at this revered, 5-star NYC establishment.</p>\n<p><a href=\"https://www.booking.com/hotel/us/concorde-new-york.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Concorde Hotel New York</a>: find a place to crash just a few minutes’ walk from the Lips Drag Queen Show Palace; a stylish and minimal suite at the highly rated Concorde Hotel. </p>\n<p><a href=\"https://www.booking.com/hotel/us/n-brooklyn-new-york.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">NU Hotel</a>: base yourself in Brooklyn after visiting the famous bridge and having a local burger, with a stay at the slick and modern Nu Hotel near Park Slope.</p>\n<h2 id=\"listen\">Listen</h2>\n<p>Get yourself ready for your city break with the ultimate <a href=\"https://open.spotify.com/playlist/2pxdj2XPg599IZQBpI0eDm?si=72b0de98f16946c0\">NYC playlist</a>.</p>\n<iframe style=\"border-radius:12px\" src=\"https://open.spotify.com/embed/playlist/2pxdj2XPg599IZQBpI0eDm?utm_source=generator&amp;theme=0\" width=\"100%\" height=\"380\" frameborder=\"0\" allowfullscreen=\"\" allow=\"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture\" loading=\"lazy\"></iframe>\n<div data-component=\"traveltips/article-view-ga-track\" data-component-action=\"\" data-component-label=\"article_bottom\"></div>\n<div class=\"\nbui-u-text-center\ntravel-tips-social\n\">\n<a target=\"_blank\" href=\"https://twitter.com/intent/tweet?text=https%3A%2F%2Fwww.booking.com%2Farticles%2F48-hours-new-york.en-gb.html\" aria-label=\"Share article on Twitter\"><svg class=\"bk-icon -streamline-logo_twitter\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M106.9 33a23.4 23.4 0 0 0 10-12.7 47.496 47.496 0 0 1-14.7 5.4 22.6 22.6 0 0 0-16.5-7c-12.702-.11-23.09 10.096-23.2 22.798v.002c.005 1.73.275 3.45.8 5.1a64.6 64.6 0 0 1-47.5-23.9c-6.188 10.469-3.115 23.949 7 30.7a24 24 0 0 1-10.2-3v.3c-.079 10.991 7.63 20.502 18.4 22.7a24.002 24.002 0 0 1-6.1.7 11.1 11.1 0 0 1-4.1-.5 23 23 0 0 0 21.4 16 46.3 46.3 0 0 1-28.5 9.8c-1.869.057-3.74-.01-5.6-.2a64.5 64.5 0 0 0 35.3 10.2c35.787.277 65.023-28.51 65.3-64.296.003-.335.003-.67 0-1.004v-2.9A52.695 52.695 0 0 0 120 29.3a57.395 57.395 0 0 1-13.1 3.7z\"></path></svg></a>\n<a target=\"_blank\" href=\"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.booking.com%2Farticles%2F48-hours-new-york.en-gb.html\" aria-label=\"Share article on Facebook\"><svg class=\"bk-icon -streamline-logo_facebook_box\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M120 16v96a8 8 0 0 1-8 8H85V77h15l2-17H85V49c0-5 2-8 9-8h9V26a112.691 112.691 0 0 0-14-1c-13 0-21 7.5-21 22v13H53v17h15v43H16a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8z\"></path></svg></a>\n</div>\n</div>",
          "hash": "987984654653121321564654",
          "date": "Sun, 17 Oct 2022 19:00:05 GMT"
        },
        {
          "title": "7 unique stays for your next Australia holiday",
          "content": "<div class=\"trt-article__content\" itemprop=\"articleBody\" data-component=\"traveltips/article\">\n<p>The diversity and scale of <a href=\"https://www.booking.com/articles/best-australia-natural-beauty.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Australia’s natural splendour</a> is breathtaking. From humblingly huge desert and otherworldly rock formations to gnarled, ancient rainforest and the world’s largest coral reef, the range of sights to see is vast. As is the range of accommodation you can book. </p>\n<p>For an unforgettable trip, try glamping in a remote part of the Outback, enjoy an authentic Aussie station (farm or ranch) experience or spend the night in a grand, historic Melbourne hotel.</p>\n<h3 id=\"a-glampsite-in-the-outback-karijini-national-park\">A glampsite in the Outback, Karijini National Park</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/170335341.jpg?k=4d95afd5a003c6f1ee976ac685a922ecec2e3d2b9bab29501b127d79bb5a74fd&amp;o=?size=S\" alt=\"A glampsite in the Outback, Karijini National Park, Western Australia\"><p class=\"travel-article-image-desc\">A glampsite in the Outback, Karijini National Park, Western Australia</p></div>\n<p>Found deep within <a href=\"https://www.booking.com/landmark/au/karijini-national-park-2.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Karijini National Park</a>, <a href=\"https://www.booking.com/hotel/au/karijini-eco-retreat.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Karijini Eco Retreat</a> provides a luxury experience while immersed in the sublime natural beauty of the Outback. Just a short hike from your glamping tent, you’ll find the rich red rock of Joffre Gorge, a natural amphitheatre with a pool of water and a pebbled rock island in the middle. Other park highlights include the stunning, year-round Fortescue Falls and Mount Bruce, whose summit trail rewards you with breathtaking views of the majestic and empty, arid landscape. Camping in the Bush also offers almost unparalleled stargazing, so be sure to pull up a pew on your tent’s private deck when the sun goes down. The sound of dingos and owls howling and hooting in the distance as you fall asleep in the comfort of your big double bed, adds to the element of adventure. </p>\n<h3 id=\"a-beachfront-villa-byron-bay\">A beachfront villa, Byron Bay</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/170337488.jpg?k=31d563f5290019b23270056769b39eaaf6dcf27b9b29ec5cb0166b2e8d967f97&amp;o=?size=S\" alt=\"A beachfront villa, Byron Bay, New South Wales\"><p class=\"travel-article-image-desc\">A beachfront villa, Byron Bay, New South Wales</p></div>\n<p>For laid-back Aussie beach life with a touch of luxury, plenty of privacy and your very own swimming pool, <a href=\"https://www.booking.com/hotel/au/fat-frog-beach-houses.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Fat Frog Beach Houses</a> is the perfect choice. The holiday home is located just a short walk from the captivating beach in <a href=\"https://www.booking.com/city/au/byron-bay.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Byron Bay</a>, the mellow surf town that’s long been known for its surfer and hippie communities. If the novelty of fantastic waves and sunning yourself on the sand wears off, hike up to Cape Byron Lighthouse to touch the most easterly point of Australia.</p>\n<h3 id=\"a-harbourside-apartment-sydney\">A harbourside apartment, Sydney</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/170337672.jpg?k=2856e7291a35938cac4e8b7759a66873b02056c612c700d9363dcc4e5daf5c0a&amp;o=?size=S\" alt=\"A harbourside apartment, Sydney, New South Wales\"><p class=\"travel-article-image-desc\">A harbourside apartment, Sydney, New South Wales</p></div>\n<p>For those who want a taste of city life Down Under, a stay beside <a href=\"https://www.booking.com/landmark/au/harbour-bridge.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Sydney</a>’s spectacular harbour is a great place to start. At <a href=\"https://www.booking.com/hotel/au/milson-executive-apartments.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Milson Serviced Apartments</a>, some apartments have sweeping views of the Harbour Bridge, Lavender Bay and the city’s stunning skyline. You’ll also be in close proximity to many key sights, including the <a href=\"https://www.booking.com/attractions/au/prwifqz0fa7c-sydney-opera-house-official-guided-walking-tour.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Opera House</a> and the Royal Botanic Garden.</p>\n<h3 id=\"a-historic-shearer-s-quarters-derwent-valley\">A historic shearer’s quarters, Derwent Valley</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/170337838.jpg?k=ca2f26ffa37789c72253b0f4a5156ea995d3da87840357a5cf7e8204c927f22f&amp;o=?size=S\" alt=\"A historic shearer’s quarters, Derwent Valley, Tasmania\"><p class=\"travel-article-image-desc\">A historic shearer’s quarters, Derwent Valley, Tasmania</p></div>\n<p>One of Australia’s most famous and historic paintings – ‘Shearing the Rams’ by Tom Roberts – depicts daily life in a timber shearing shed. The wool industry has been a huge economic and social force in Australia over the years, and guests can now stay within the confines of one of Tasmania’s most historic homesteads. Just under an hour’s drive from Hobart (the capital of Australia’s scenic and stunning Tasmania island state), the Georgian Rathmore House and its <a href=\"https://www.booking.com/hotel/au/shearers-39-quarters-rathmore.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Shearers’ Quarters Rathmore</a> boast a range of accommodation. From stylishly revamped and minimal self-catered rooms in the old shearer’s quarters, to beautifully restored suites in the main homestead where you’ll be served sumptuous meals, a stay here will give you a glorious glimpse into 19th-century rural Tasmania. Spend your days spotting platypus in the Dew Rivulet, going fishing for trout, and admiring the resident black swans, peacocks and wombats. And while away your afternoons and evenings sipping a cup of tea on your terrace, or local wines and toasting marshmallows on the campfire.</p>\n<h3 id=\"a-historic-hotel-melbourne\">A historic hotel, Melbourne</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/170337927.jpg?k=6e5b1fc3530b01eaebd09c840ccb92486fc83a3f30b7c6dec85e150be77517b5&amp;o=?size=S\" alt=\"A historic hotel, Melbourne, Victoria\"><p class=\"travel-article-image-desc\">A historic hotel, Melbourne, Victoria</p></div>\n<p>Australia has its fair share of fascinating <a href=\"https://www.booking.com/articles/australia-most-historic-hotels.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">historic hotels</a> – from a Frank Lloyd-Wright-style building in Canberra that’s been the site of much political skulduggery over the years, to a 19th-century quarantine station that’s now a working hotel (with ghost tours available). But it’s afternoon tea at the grandiose <a href=\"https://www.booking.com/hotel/au/the-windsor.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hotel Windsor</a> that will most impress history-lovers. It’s the oldest hotel in Australia, was the place where the Constitution of Australia was drafted in 1898, and has hosted guests including Sir Laurence Olivier and Vivien Leigh. Admire the Renaissance Revival facade that makes it a Melbourne landmark, still proudly standing opposite the Gold Rush-era Parliament House and Treasury. Then step inside and behold its burgundy carpeted-, antique-filled lobby, to be met with a level of tradition and grace that brings to life the hotel’s grand Victorian history. And if a stay here feels a little too extravagant, there’s always the renowned afternoon tea with classical music and opulent floral arrangements in the 1920s dining room.</p>\n<h3 id=\"a-remote-outback-station-adelaide-river\">A remote Outback station, Adelaide River</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/170338045.jpg?k=57afc2c545ca9069f5532fdd6b57dcf1d1b86331fd955aa8559672e8fe8c7a7d&amp;o=?size=S\" alt=\"A remote Outback station, Adelaide River, Northern Territory\"><p class=\"travel-article-image-desc\">A remote Outback station, Adelaide River, Northern Territory</p></div>\n<p>To explore the Outback and enjoy as close to an authentic Aussie station experience as possible, the historic <a href=\"https://www.booking.com/hotel/au/mt-bundy-station.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Mt Bundy Station</a> is a great bet. Located on the banks of the <a href=\"https://www.booking.com/city/au/adelaide-river.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Adelaide River</a>, room types range from glamping to homestead suites and self-contained cottages. Guests get to see the station’s resident livestock, wild wallabies, frogs and maybe the odd crocodile peppering the landscape. It’s a rustic experience, with outdoor bathroom amenities that add to the authentic nature of the stay. But you’ll also get plenty of creature comforts like the property’s Outback Bar and Pizza nights, and luxe perks like the outdoor pool with a splendid panoramic view across the fields.</p>\n<h3 id=\"a-secluded-mountain-lodge-woodbridge\">A secluded mountain lodge, Woodbridge</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/170338114.jpg?k=d55fab213b6b3e949a5b8ecbc515af67240ba8f082569ccb08ee65a15991d69e&amp;o=?size=S\" alt=\"A secluded mountain lodge, Woodbridge, Tasmania\"><p class=\"travel-article-image-desc\">A secluded mountain lodge, Woodbridge, Tasmania</p></div>\n<p>Nestled high up in the hills of <a href=\"https://www.booking.com/lodges/region/au/tasmania.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Tasmania</a>, <a href=\"https://www.booking.com/hotel/au/woodbridge-hill-hideaway.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Woodbridge Hill Hideaway</a> is a mountain lodge retreat that gazes out onto Bruny Island’s Great Bay and the native forests below. Each private bungalow features a bathtub overlooking the gum trees and a beautiful balcony. Enjoy a peaceful morning soaking in the tub while watching the sunrise before tucking into the lodge’s exemplary bacon and eggs breakfast. Days can be spent exploring Tasmania’s ancient forests, wild swimming and enjoying barbecue dinners in summer. Or in winter, take a dip in the lodge’s heated swimming pool before cosying up by your bungalow’s private fireplace.</p>\n<div data-component=\"traveltips/article-view-ga-track\" data-component-action=\"\" data-component-label=\"article_bottom\"></div>\n<div class=\"\nbui-u-text-center\ntravel-tips-social\n\">\n<a target=\"_blank\" href=\"https://twitter.com/intent/tweet?text=https%3A%2F%2Fwww.booking.com%2Farticles%2Funique-stays-australia.en-gb.html\" aria-label=\"Share article on Twitter\"><svg class=\"bk-icon -streamline-logo_twitter\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M106.9 33a23.4 23.4 0 0 0 10-12.7 47.496 47.496 0 0 1-14.7 5.4 22.6 22.6 0 0 0-16.5-7c-12.702-.11-23.09 10.096-23.2 22.798v.002c.005 1.73.275 3.45.8 5.1a64.6 64.6 0 0 1-47.5-23.9c-6.188 10.469-3.115 23.949 7 30.7a24 24 0 0 1-10.2-3v.3c-.079 10.991 7.63 20.502 18.4 22.7a24.002 24.002 0 0 1-6.1.7 11.1 11.1 0 0 1-4.1-.5 23 23 0 0 0 21.4 16 46.3 46.3 0 0 1-28.5 9.8c-1.869.057-3.74-.01-5.6-.2a64.5 64.5 0 0 0 35.3 10.2c35.787.277 65.023-28.51 65.3-64.296.003-.335.003-.67 0-1.004v-2.9A52.695 52.695 0 0 0 120 29.3a57.395 57.395 0 0 1-13.1 3.7z\"></path></svg></a>\n<a target=\"_blank\" href=\"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.booking.com%2Farticles%2Funique-stays-australia.en-gb.html\" aria-label=\"Share article on Facebook\"><svg class=\"bk-icon -streamline-logo_facebook_box\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M120 16v96a8 8 0 0 1-8 8H85V77h15l2-17H85V49c0-5 2-8 9-8h9V26a112.691 112.691 0 0 0-14-1c-13 0-21 7.5-21 22v13H53v17h15v43H16a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8z\"></path></svg></a>\n</div>\n</div>",
          "hash": "1686468974651683516543543545",
          "date": "Sun, 05 Oct 2022 19:00:05 GMT"
        },
        {
          "title": "48 hours in Paris, France",
          "content": "<div class=\"trt-article__content\" itemprop=\"articleBody\" data-component=\"traveltips/article\">\n<p>Two days in Paris may not feel like enough. But for those blessed with 48 hours in The City of Light, we’ve curated the perfect itinerary that looks beyond the more obvious sights of the Eiffel Tower and Arc De Triomphe. From iconic Parisian cabaret, the Moulin Rouge, to pretty pâtisseries and boulangeries serving treats like pistachio croissants – here is the best of Paris to cover in two days. </p>\n<h2 id=\"day-1\">Day 1</h2>\n<h3 id=\"au-petit-versailles-du-marais\">Au petit Versailles du Marais</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587865.jpg?k=ecf783389694a02f748095d0ea27f5b63b3dfe602583457f10852a5c2a0d8298&amp;o=?size=S\" alt=\"Au petit Versailles du Marais, Paris\"><p class=\"travel-article-image-desc\">Au petit Versailles du Marais, Paris</p></div>\n<p>Step back in time with a visit to this quintessentially Parisian and historic boulangerie, pâtisserie and salon de thé (tearoom). Housed within a shop that dates back to 1850, its ceilings are adorned with beautiful tiles and grand chandeliers, while the delectable treats are equally eye-catching. Don’t miss the traditional baguette or – if you’d prefer something sweet – the pistachio croissant, the chocolate éclair or the creamy and light Paris-Brest (choux pastry filled with praline cream).</p>\n<h3 id=\"national-museum-of-natural-history\">National Museum of Natural History</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587839.jpg?k=13f408dd54b30a3cd4eb0f47b2f731d2afed8ccbdbc89cd72ac07eddda624ebf&amp;o=?size=S\" alt=\"National Museum of Natural History, Paris\"><p class=\"travel-article-image-desc\">National Museum of Natural History, Paris</p></div>\n<p>This museum is actually split across a number of different buildings and institutions across France. Here, at the birthplace of the museum, you can walk among life-size skeletons, examine fossils and admire natural crystals and gemstones. The 7,000 animal specimens on display and the interactive virtual reality exhibit also make it a great educational day out for young explorers.</p>\n<h3 id=\"the-louvre-museum\">The Louvre Museum</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167771038.jpg?k=f25bf43a8aaa822a6176615e04a83966fc90d85620fb2885991b46b1889e88b0&amp;o=?size=S\" alt=\"The Louvre Museum, Paris\"><p class=\"travel-article-image-desc\">The Louvre Museum, Paris</p></div>\n<p><a href=\"https://www.booking.com/attractions/fr/pr3i2bx4bdwg-louvre-museum-admission-and-tour.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">The Louvre</a> is an obvious but still unmissable choice when visiting Paris. Home to some of the best-known works of art in history, it holds the title as the most-visited museum in the world. Spend hours exploring its hallowed halls, finding out first-hand if the <em>Mona Lisa</em> really does follow you with her eyes, and marvelling at the craftsmanship of the <em>Venus de Milo</em>.</p>\n<h3 id=\"carrousel-du-louvre\">Carrousel du Louvre</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587880.jpg?k=6644ac9a0d8bb75bf2f01df51258efba1d699b522b196e2eafab93120c933ad8&amp;o=?size=S\" alt=\"Carrousel du Louvre, Paris\"><p class=\"travel-article-image-desc\">Carrousel du Louvre, Paris</p></div>\n<p>This underground mall is home to the Inverted Pyramid created by artist Ieoh Ming Pei that is also famous as the skylight in The Da Vinci Code. Shopping enthusiasts will be thrilled with the selection of high-end stores here, such as Lacoste, Sandro and Printemps du Louvre.</p>\n<h3 id=\"jardin-des-tuileries\">Jardin des Tuileries</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587921.jpg?k=83c4170f1ed1d7ec91f611dec58e10b05cdc42813b882af2ac5bc3ad36d84407&amp;o=?size=S\" alt=\"Jardin des Tuileries, Paris\"><p class=\"travel-article-image-desc\">Jardin des Tuileries, Paris</p></div>\n<p>Less than ten minutes walk from Carrousel du Louvre, you’ll find this Parisian public garden and UNESCO World Heritage Site famed for its manicured lawns, statues, flowerbeds and fountains, the Jardin des Tuileries is a must-see. It’s a great place to take a break from sightseeing, with plenty of public seating where you can rest while enjoying stunning views of the Place de la Concorde and Arc de Triomphe. If the weather permits, have a picnic  before heading to the Musée de l'Orangerie (bordering the gardens) to discover the sensational impressionist artwork on display.</p>\n<h3 id=\"le-clarence\">Le Clarence</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587897.jpg?k=303d5730efe9605e6af9403dd6b94851f85f75fa9b0a9586ec16e152963bfa00&amp;o=?size=S\" alt=\"Le Clarence, Paris\"><p class=\"travel-article-image-desc\">Le Clarence, Paris</p></div>\n<p>Contemporary takes on French classics are the order of the day at regal restaurant, Le Clarence. The dishes on the tasting menu are kept as a pleasant surprise until they're served, so sit back, admire the antique decor and let the expert chefs decide for you.</p>\n<h3 id=\"caveau-de-la-huchette\">Caveau de la Huchette</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587909.jpg?k=155bcf5bf9c3a8aecd3c35c76a762d61e9e7f23b81fc3a011d30b3983f3f4250&amp;o=?size=S\" alt=\"Caveau de la Huchette, Paris\"><p class=\"travel-article-image-desc\">Caveau de la Huchette, Paris</p></div>\n<p>An underground venue with a keen focus on 1920s jazz, Caveau de la Huchette has welcomed many a Blues legend in its time. Grab a seat and enjoy the show, or take someone for a spin on the dance floor.</p>\n<h2 id=\"day-2\">Day 2</h2>\n<h3 id=\"nemours\">Nemours</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587934.jpg?k=1a6b0e8bb7108031d50fe82692b08db4ad4d9983bacbdd762e42d393b3b57592&amp;o=?size=S\" alt=\"Nemours, Paris\"><p class=\"travel-article-image-desc\">Nemours, Paris</p></div>\n<p>Le Nemours is an elegant eatery that’s frequently full of Parisians enjoying coffee and croque monsieurs. Join them at the bar or on the terrace and order a plate of saucisson or rillettes, washed down with a glass of fine French wine.</p>\n<h3 id=\"bateaux-parisiens\">Bateaux Parisiens</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167770486.jpg?k=3023bd06345ee83b58867ec7c1fa16660dc2cf277220664e76d1f94aa845bf9c&amp;o=?size=S\" alt=\"Bateaux Parisiens, Paris\"><p class=\"travel-article-image-desc\">Bateaux Parisiens, Paris</p></div>\n<p>Departing from the iconic Eiffel Tower, this <a href=\"https://www.booking.com/attractions/fr/prvpg5s3r713-city-sightseeing-cruise.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">sightseeing tour</a> helps you learn the history of the French capital as you sail along the Seine River. Admire some of the best views in the city from the outdoor deck, while cruising past landmarks like Notre-Dame and the Louvre and enjoying panoramic views of the cityscape.</p>\n<h3 id=\"les-balades-sonores\">Les Balades Sonores</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587972.jpg?k=66ecd67cb4138659f00ffe2e5e36352ccffb6a0e5c1ca943a42de9c01bb7eead&amp;o=?size=S\" alt=\"Les Balades Sonores, Paris\"><p class=\"travel-article-image-desc\">Les Balades Sonores, Paris</p></div>\n<p>Balades Sonores is an enticing vinyl shop bursting with records, CDs and cassettes mainly dedicated to French pop and rock. In fact, there’s so much that it spills into a second store next door, where the focus shifts to jazz, world music and soundtracks. Go on a Thursday for the chance to catch an in-store acoustic performance.</p>\n<h3 id=\"willi-s-wine-bar\">Willi's Wine Bar</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587976.jpg?k=65284066db11a1c4f998198b691d29c721bd97aed457ca0086ed7647b90ff6b9&amp;o=?size=S\" alt=\"Willi's Wine Bar, Paris\"><p class=\"travel-article-image-desc\">Willi's Wine Bar, Paris</p></div>\n<p>This place will wow you with its fantastic French wines and reinvented classic dishes. Staff recommendations are always spot on so trust your server and let them do the ordering. On the way in, be sure to stroll the gardens behind the venue and admire the bar’s dozens of wine bottle art posters.</p>\n<h3 id=\"au-virage-lepic\">Au Virage Lepic</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167587996.jpg?k=967d85854899e847d7f40b7a36c82d31a5c96d28f3cc98e4c60d03096c17b071&amp;o=?size=S\" alt=\"Au Virage Lepic, Paris\"><p class=\"travel-article-image-desc\">Au Virage Lepic, Paris</p></div>\n<p>From top to toe, this cosy bistro is unmistakably French. Think faded photographs and red-and-white checked tablecloths – plus a menu packed with continental classics. Tuck into the steak or salmon tartare, and afterwards indulge in the beautiful pecan nut chocolate mousse.</p>\n<h3 id=\"moulin-rouge\">Moulin Rouge</h3>\n<div class=\"travel-article-image travel-article-image-S\"><img src=\"//bstatic.com/xdata/images/xphoto/1182x887/167588016.jpg?k=05b114e9de422dacaa41c5dee59f946c7a6d3f916f21776761198e06e82feeaf&amp;o=?size=S\" alt=\"Moulin Rouge, Paris\"><p class=\"travel-article-image-desc\">Moulin Rouge, Paris</p></div>\n<p>Less than 10 minutes down the road from Au Virage Lepic you’ll find the famous Moulin Rouge. Lavishly-costumed performers and spectacular dancing are two things guaranteed at this Parisian cabaret, one that has been entertaining the public since 1889. Reserve a seat at a table for the best view and check out the dining options available before the show starts.&ZeroWidthSpace;</p>\n<h2 id=\"getting-there\">Getting there</h2>\n<p>Paris is well-connected thanks to the Charles de Gaulle, Orly and Beauvais <a href=\"https://www.booking.com/flights/index.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">airports</a>, as well as trains that arrive at and depart from the city’s central stations from all over Europe. If coming into the city from the airport, you can take a <a href=\"https://www.booking.com/taxi/index.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">taxi</a>, bus or express train.</p>\n<h2 id=\"where-to-stay\">Where to stay</h2>\n<p><a href=\"https://www.booking.com/hotel/fr/des-deux-iles.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hôtel Des Deux-Îles - Notre-Dame</a>: a charming hotel just a 10-minute walk from Le Caveau de la Huchette, on the beautiful Île Saint-Louis.</p>\n<p><a href=\"https://www.booking.com/hotel/fr/hoteldesarts.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Hôtel des Arts Montmartre</a>: a stylish stay that’s only a 6-minute walk from the Moulin Rouge.</p>\n<p><a href=\"https://www.booking.com/hotel/fr/sinner-paris.html?label=gen173nr-1DCAEoggI46AdIM1gEaLUBiAEBmAEJuAEXyAEM2AED6AEBiAIBqAIDuALnt7GaBsACAdICJDRhMWQzOTdkLTdkZmQtNGIzNy1hN2RkLTAwZGQwMGU3YmVmZNgCBOACAQ&amp;sid=a04275ef467dbcea729b942274b30f73\">Sinner Paris</a>: offering luxe, art deco suites and situated in the magical and central Marais district.</p>\n<h2 id=\"listen\">Listen</h2>\n<p>Get in the mood for your Paris city break with this <a href=\"https://open.spotify.com/playlist/6ok7aK7IB5LxrQUvSpIGe5?si=96508f16909740d1\">playlist</a> of top French tracks.</p>\n<iframe style=\"border-radius:12px\" src=\"https://open.spotify.com/embed/playlist/6ok7aK7IB5LxrQUvSpIGe5?utm_source=generator&amp;theme=0\" width=\"100%\" height=\"380\" frameborder=\"0\" allowfullscreen=\"\" allow=\"autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture\"></iframe>\n<div data-component=\"traveltips/article-view-ga-track\" data-component-action=\"\" data-component-label=\"article_bottom\"></div>\n<div class=\"\nbui-u-text-center\ntravel-tips-social\n\">\n<a target=\"_blank\" href=\"https://twitter.com/intent/tweet?text=https%3A%2F%2Fwww.booking.com%2Farticles%2F48-hours-paris.en-gb.html\" aria-label=\"Share article on Twitter\"><svg class=\"bk-icon -streamline-logo_twitter\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M106.9 33a23.4 23.4 0 0 0 10-12.7 47.496 47.496 0 0 1-14.7 5.4 22.6 22.6 0 0 0-16.5-7c-12.702-.11-23.09 10.096-23.2 22.798v.002c.005 1.73.275 3.45.8 5.1a64.6 64.6 0 0 1-47.5-23.9c-6.188 10.469-3.115 23.949 7 30.7a24 24 0 0 1-10.2-3v.3c-.079 10.991 7.63 20.502 18.4 22.7a24.002 24.002 0 0 1-6.1.7 11.1 11.1 0 0 1-4.1-.5 23 23 0 0 0 21.4 16 46.3 46.3 0 0 1-28.5 9.8c-1.869.057-3.74-.01-5.6-.2a64.5 64.5 0 0 0 35.3 10.2c35.787.277 65.023-28.51 65.3-64.296.003-.335.003-.67 0-1.004v-2.9A52.695 52.695 0 0 0 120 29.3a57.395 57.395 0 0 1-13.1 3.7z\"></path></svg></a>\n<a target=\"_blank\" href=\"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.booking.com%2Farticles%2F48-hours-paris.en-gb.html\" aria-label=\"Share article on Facebook\"><svg class=\"bk-icon -streamline-logo_facebook_box\" fill=\"#333333\" height=\"20\" width=\"20\" viewBox=\"0 0 128 128\" role=\"presentation\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M120 16v96a8 8 0 0 1-8 8H85V77h15l2-17H85V49c0-5 2-8 9-8h9V26a112.691 112.691 0 0 0-14-1c-13 0-21 7.5-21 22v13H53v17h15v43H16a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8h96a8 8 0 0 1 8 8z\"></path></svg></a>\n</div>\n</div>",
          "hash": "9841868463164546353153151315",
          "date": "Sun, 08 Oct 2022 19:00:05 GMT"
        }

      ]);

    })
  }

  async http_GetMultiMediaLinks(body: any) {

    let node_env = process.env.NODE_ENV;
    let TARGET_BRANCH: string;
    let PROVIDER_CODE: string;
    let ACCEPT_ENCODING: string;
    let CONTENT_TYPE: string;
    let AUTHORIZATION: string;
    let HOTEL_SERVICE_URL: string;

    if(node_env == 'production'){

      HOTEL_SERVICE_URL = process.env.Production_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Production_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Production_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Production_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Production_CONTENT_TYPE;
      AUTHORIZATION = process.env.Production_AUTHORIZATION;
    
    }
    else
    {

      HOTEL_SERVICE_URL = process.env.Development_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Development_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Development_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Development_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Development_CONTENT_TYPE;
      AUTHORIZATION = process.env.Development_AUTHORIZATION;
    
    }

    return new Promise(async (resolve)=> {

      try {


        let DataLength = body.HotelCodes.length
        let DataMesssage = "";


        for (let i = 0; i < DataLength; i++){

          DataMesssage += '<HotelProperty HotelCode="'+body.HotelCodes[i].HotelCode+'" HotelChain="'+body.HotelCodes[i].HotelChain+'" />'

        }

        let xmlData: string = fs.readFileSync(path.resolve(__dirname, './soapXML/getMultiMediaLinks.xml',), 'utf-8');
        let _replace_data = xmlData.split('--TraceId--').join(body.TraceId);
        _replace_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);
        let _replase_r = _replace_data.split('--ImagesLinks--').join(DataMesssage);

        console.log(_replase_r);

        //soap create request
        let config = {
          method: 'post',
          url:HOTEL_SERVICE_URL,
          headers: {
            'TargetBranch': TARGET_BRANCH,
            'ProviderCode': PROVIDER_CODE,
            'Accept-Encoding': ACCEPT_ENCODING,
            'Content-Type': CONTENT_TYPE,
            'Authorization': AUTHORIZATION,
          },
          data : _replase_r
        };


        let responseData,status=200;

        //soap execute request

        let response = await axios(config)
        if(response.status == 200){
          parseString(response.data, async function(err, result) {

            let requestResult
            requestResult = result['SOAP:Envelope']['SOAP:Body'][0]

            if (requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']) {

              let status = 404;
              let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
              let faultcode = requestResult['SOAP:Fault'][0]['detail'][0]['common_v52_0:ErrorInfo'][0]['common_v52_0:Code'][0]
              let responseData :any = {"status":status, "faultcode": faultcode, "message":message}
              resolve(responseData);

            }
            else {


              let HotelPropertyWithMediaItems = requestResult['hotel:HotelMediaLinksRsp'][0]['hotel:HotelPropertyWithMediaItems'];
              let HotelPropertyWithMediaItemsLength = HotelPropertyWithMediaItems.length;



              try {

                let mediaData = []

                for (let a = 0; a < HotelPropertyWithMediaItemsLength; a++) {

                  let hotelProperty = requestResult['hotel:HotelMediaLinksRsp'][0]['hotel:HotelPropertyWithMediaItems'][a]['hotel:HotelProperty'];
                  let mediaItem = requestResult['hotel:HotelMediaLinksRsp'][0]['hotel:HotelPropertyWithMediaItems'][a]['common_v52_0:MediaItem'];

                  let mediaItemLength = mediaItem.length

                  let allMediaLinks = [];

                  for (let i = 0; i < mediaItemLength; i++) {
                    let assets = {
                      caption: mediaItem[i]['$']['caption'],
                      storage: 'live',
                      height: mediaItem[i]['$']['height'],
                      width: mediaItem[i]['$']['width'],
                      src: mediaItem[i]['$']['url'],
                      type: mediaItem[i]['$']['type'],
                      sizeCode: mediaItem[i]['$']['sizeCode'],
                    }
                    allMediaLinks.push(assets);
                  }

                  let rdata = {
                    HotelChain: hotelProperty[0]['$']['HotelChain'],
                    HotelCode: hotelProperty[0]['$']['HotelCode'],
                    MediaLinks: allMediaLinks
                  }

                  mediaData.push(rdata);

                }


                resolve(ResponseBuilder.successResponse('Data', mediaData));


              } catch (e){

                status = 404;
                responseData={"status":status,"message":'Invalid Hotel Code'}
                resolve(ResponseBuilder.errorResponse('message', responseData));

              }



            }

          });

        }
      } catch(e) {
        console.log('Error:', e.stack);
      }


    })
  }

  async userCurrentLocation(bady, ip) {
    return new Promise(async (resolve)=> {
      let ip_data = await axios.get('http://ip-api.com/json/'+ip).then(function(response) {
        return JSON.parse(JSON.stringify(response.data));
      })

      resolve(ip_data);
    })
  }

  async http_Booking(body: any){

    let node_env = process.env.NODE_ENV;
    let TARGET_BRANCH: string;
    let PROVIDER_CODE: string;
    let ACCEPT_ENCODING: string;
    let CONTENT_TYPE: string;
    let AUTHORIZATION: string;
    let HOTEL_SERVICE_URL: string;

    if(node_env == 'production'){

      HOTEL_SERVICE_URL = process.env.Production_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Production_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Production_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Production_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Production_CONTENT_TYPE;
      AUTHORIZATION = process.env.Production_AUTHORIZATION;
    
    }
    else
    {

      HOTEL_SERVICE_URL = process.env.Development_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Development_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Development_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Development_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Development_CONTENT_TYPE;
      AUTHORIZATION = process.env.Development_AUTHORIZATION;
    
    }

    return new Promise(async (resolve)=> {


        try {

          let xmlData: string = fs.readFileSync(path.resolve(__dirname, './soapXML/booking.xml'), 'utf-8');
          let _replace_data = xmlData.split('--TraceId--').join(body.TraceId);
            _replace_data = _replace_data.split('--TravelerType--').join(body.BookingTraveler.TravelerType);
            _replace_data = _replace_data.split('--Last--').join(body.BookingTraveler.BookingTravelerName.Last);
            _replace_data = _replace_data.split('--First--').join(body.BookingTraveler.BookingTravelerName.First);
            _replace_data = _replace_data.split('--Type--').join(body.BookingTraveler.BookingTravelerName.PhoneNumber.Type);
            _replace_data = _replace_data.split('--Number--').join(body.BookingTraveler.BookingTravelerName.PhoneNumber.Number);
            _replace_data = _replace_data.split('--Location--').join(body.BookingTraveler.BookingTravelerName.PhoneNumber.Location);
            _replace_data = _replace_data.split('--CountryCode--').join(body.BookingTraveler.BookingTravelerName.PhoneNumber.CountryCode);
            _replace_data = _replace_data.split('--AreaCode--').join(body.BookingTraveler.BookingTravelerName.PhoneNumber.AreaCode);
            _replace_data = _replace_data.split('--RatePlanType--').join(body.HotelRateDetail.RatePlanType);
            _replace_data = _replace_data.split('--Base--').join(body.HotelRateDetail.Base);
            _replace_data = _replace_data.split('--Total--').join(body.HotelRateDetail.Total);
            _replace_data = _replace_data.split('--RateChangeIndicator--').join(body.HotelRateDetail.RateChangeIndicator);
            _replace_data = _replace_data.split('--ExtraFeesIncluded--').join(body.HotelRateDetail.ExtraFeesIncluded);
            _replace_data = _replace_data.split('--Name--').join(body.HotelRateDetail.RoomRateDescription.Name);
            _replace_data = _replace_data.split('--Text--').join(body.HotelRateDetail.RoomRateDescription.Text);
            _replace_data = _replace_data.split('--EffectiveDate--').join(body.HotelRateDetail.HotelRateByDate.EffectiveDate);
            _replace_data = _replace_data.split('--ExpireDate--').join(body.HotelRateDetail.HotelRateByDate.ExpireDate);
            _replace_data = _replace_data.split('--HotelRateByDateBase--').join(body.HotelRateDetail.HotelRateByDate.Base);
            _replace_data = _replace_data.split('--Indicator--').join(body.HotelRateDetail.Commission.Indicator);
            _replace_data = _replace_data.split('--NonRefundableStayIndicator--').join(body.HotelRateDetail.CancelInfo.NonRefundableStayIndicator);
            _replace_data = _replace_data.split('--GuaranteeType--').join(body.HotelRateDetail.GuaranteeInfo.GuaranteeType);
            _replace_data = _replace_data.split('--SmokingRoomIndicator--').join(body.HotelRateDetail.Inclusions.SmokingRoomIndicator);
            _replace_data = _replace_data.split('--Code--').join(body.HotelRateDetail.Inclusions.BedTypes.Code);
            _replace_data = _replace_data.split('--Breakfast--').join(body.HotelRateDetail.Inclusions.MealPlans.Breakfast);
            _replace_data = _replace_data.split('--Lunch--').join(body.HotelRateDetail.Inclusions.MealPlans.Lunch);
            _replace_data = _replace_data.split('--Dinner--').join(body.HotelRateDetail.Inclusions.MealPlans.Dinner);
            _replace_data = _replace_data.split('--HotelChain--').join(body.HotelProperty.HotelChain);
            _replace_data = _replace_data.split('--HotelCode--').join(body.HotelProperty.HotelCode);
            _replace_data = _replace_data.split('--HotelLocation--').join(body.HotelProperty.HotelLocation);
            _replace_data = _replace_data.split('--HotelPropertyName--').join(body.HotelProperty.Name);
            _replace_data = _replace_data.split('--ParticipationLevel--').join(body.HotelProperty.ParticipationLevel);
            _replace_data = _replace_data.split('--CheckinDate--').join(body.HotelStay.CheckinDate);
            _replace_data = _replace_data.split('--CheckoutDate--').join(body.HotelStay.CheckoutDate);
            _replace_data = _replace_data.split('--CreditCardGuaranteeType--').join(body.Guarantee.Type);
            _replace_data = _replace_data.split('--GuaranteeKey--').join(body.Guarantee.Key);
            _replace_data = _replace_data.split('--CreditCardType--').join(body.Guarantee.CreditCard.Type);
            _replace_data = _replace_data.split('--CreditCardExpDate--').join(body.Guarantee.CreditCard.ExpDate);
            _replace_data = _replace_data.split('--CreditCardNumber--').join(body.Guarantee.CreditCard.Number);
            _replace_data = _replace_data.split('--NumberOfRooms--').join(body.GuestInformation.NumberOfRooms);
            _replace_data = _replace_data.split('--NumberOfChildren--').join(body.NumberOfChildren);
            _replace_data = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);
            let _replase_r = _replace_data.split('--NumberOfAdults--').join(body.GuestInformation.NumberOfAdults);


          console.log(_replase_r);

          
          //soap create request
          let config = {
            method: 'post',
            url:HOTEL_SERVICE_URL,
            headers: {
            'TargetBranch': TARGET_BRANCH,
            'ProviderCode': PROVIDER_CODE,
            'Accept-Encoding': ACCEPT_ENCODING,
            'Content-Type': CONTENT_TYPE,
            'Authorization': AUTHORIZATION,
            },
            data : _replase_r
          };

          let LogsDate = new Date();
          let hash = md5(LogsDate + body.TraceId);
          let ReqBookingApiData = JSON.stringify(config);
          let logs = {
              TraceId: body.TraceId,
              Hashpair: hash,
              TriggerHit: "Req Booking Api",
              Date: LogsDate,
              Data: ReqBookingApiData
          };
          await this.mongodb.applicationloggedMultiInsert(logs);

          let responseData,status=200;

          //soap execute request

          let response = await axios(config)
          if(response.status == 200){

            let LogsDate = new Date();
            let ResBookingApiData = JSON.stringify(response.data);
            let logsRes = {
                TraceId: body.TraceId,
                Hashpair: hash,
                TriggerHit: "Res Booking Api",
                Date: LogsDate,
                Data: ResBookingApiData
            };
            await this.mongodb.applicationloggedMultiInsert(logsRes);

            parseString(response.data, async function(err, result) {

              let requestResult
              requestResult = result['SOAP:Envelope']['SOAP:Body'][0]

              if (requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']) {

                let status = 404;
                let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
                let faultcode = requestResult['SOAP:Fault'][0]['detail'][0]['common_v52_0:ErrorInfo'][0]['common_v52_0:Code'][0]
                let responseData :any = {"status":status, "faultcode": faultcode, "message":message}
                resolve(responseData);

              }
              else {

                let TransactionId = requestResult['universal:HotelCreateReservationRsp'][0]['$']['TransactionId'];
            
                let HotelReservationData = requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['hotel:HotelReservation']
                let HotelReservationCount =  HotelReservationData.length;
               
                let HotelReservationDataArray = [];
    
                for (let index = 0; index < HotelReservationCount; index++) {
                  
                  let c = {
                    HotelReservation: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['hotel:HotelReservation'][index]['$'],
                    HotelProperty: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['hotel:HotelReservation'][index]['hotel:HotelProperty'][0]['$'],
                    HotelRateDetail: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['hotel:HotelReservation'][index]['hotel:HotelRateDetail'][0]['$'],
                    HotelStay: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['hotel:HotelReservation'][index]['hotel:HotelStay'][0],
                    PropertyAddress: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['hotel:HotelReservation'][index]['hotel:HotelProperty'][0]['hotel:PropertyAddress'][0]['hotel:Address'],
                    PhoneNumber1: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['hotel:HotelReservation'][index]['hotel:HotelProperty'][0]['common_v52_0:PhoneNumber'][0]['$'],
                    PhoneNumber2: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['hotel:HotelReservation'][index]['hotel:HotelProperty'][0]['common_v52_0:PhoneNumber'][1]['$'], 
                  }
                  
                  HotelReservationDataArray.push(c);
                }
    
                let data = {
                    TraceId: requestResult['universal:HotelCreateReservationRsp'][0]['$']['TraceId'],
                    TransactionId: requestResult['universal:HotelCreateReservationRsp'][0]['$']['TransactionId'],
                    HotelReservationData: HotelReservationDataArray,
                    LocatorCode: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['universal:ProviderReservationInfo'][0]['$']['LocatorCode'],
                    OwningPCC: requestResult['universal:HotelCreateReservationRsp'][0]['universal:UniversalRecord'][0]['universal:ProviderReservationInfo'][0]['$']['OwningPCC']
                };
                
                
                let BookingData = {
                    TraceId: body.TraceId,
                    UserID: body.UserID,
                    PairKey: body.PairKey,
                    TransactionId: TransactionId,
                    HotelCreateReservationRsp: data,
                };
                
                
                resolve(BookingData);

              }
            })
          }


        } catch(e) {
          console.log('Error:', e.stack);
        }
        
    });
    
  }

  async userBooking(body: any) {
    return new Promise(async (resolve) => {
          
      
      let BookingAsGuest = body.BookingAsGuest;

      if(BookingAsGuest == true)
      {

        let http_Booking: any = await this.http_Booking(body);
        let httpStatus = http_Booking['status'];
        if (httpStatus == 404) {
          resolve(ResponseBuilder.errorMultiResponse('message', http_Booking['message'], 'faultcode', http_Booking['faultcode']));
        }
        else {

            http_Booking['BookingTravelerName'] = body.BookingTraveler.BookingTravelerName
            await this.mongodb.newHotelBookingDocument(http_Booking);
            let TransactionId = http_Booking.TransactionId;
            let hotelBookingDocument = await this.mongodb.findHotelBookingDocument({ "TransactionId": { $eq: TransactionId } });
            resolve(ResponseBuilder.successResponse('Data', hotelBookingDocument[0]));
        
        
          }

      }
      else
      {
      
          let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
          let accountFindDataLength = accountFindData.length;
          if (accountFindDataLength == 1) {
      
              let http_Booking: any = await this.http_Booking(body);
              let httpStatus = http_Booking['status'];
              if (httpStatus == 404) {
                resolve(ResponseBuilder.errorMultiResponse('message', http_Booking['message'], 'faultcode', http_Booking['faultcode']));
              }
              else {

                  http_Booking['BookingTravelerName'] = body.BookingTraveler.BookingTravelerName
                  await this.mongodb.newHotelBookingDocument(http_Booking);
                  let TransactionId = http_Booking.TransactionId;
                  let hotelBookingDocument = await this.mongodb.findHotelBookingDocument({ "TransactionId": { $eq: TransactionId } });
                  resolve(ResponseBuilder.successResponse('Data', hotelBookingDocument[0]));
              
                }

            }
            else {
                resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
            }

      }

    });
  }

  async userReviews(body: any) {
    return new Promise(async (resolve)=> {

      resolve([
        {
          "name": "Mauro Stettler",
          "image": "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
          "content": "Eve resort is a great little hotel. The staff are wonderful, the food is very nice, well prepared and very tasty. The rooms are a lovely size, clean airy with the best huge beds ever. All in all a thoroughly enjoyable three day stay.",
          "traveler": "Traveler",
          "stayedIn": "Stayed in 05 October 2022",
          "rating": "3.5",
          "date": "Sun, 10 Oct 2022 19:00:05 GMT"
        },
        {
          "name": "Gail Reid",
          "image": "https://images.unsplash.com/profile-1589642197085-ed2d5158a163image?auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff",
          "content": "I have booked with them a few times now. Apartments are always as described. Was welcomed in to their office on arrival. Checked in and given keys efficiently and instructions promptly, as a taxi was waiting en route to our apartment. Would definitely recommend.",
          "traveler": "Traveler",
          "stayedIn": "Stayed in 22 October 2022",
          "rating": "3.4",
          "date": "Sun, 25 Oct 2022 19:00:05 GMT"
        },
        {
          "name": "Mr Dichello",
          "image": "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80",
          "content": "Very good company, I ahve used them multiple times to arrange trips away and everything has always gone smoothly.",
          "traveler": "Traveler",
          "stayedIn": "Stayed in 22 October 2022",
          "rating": "4.0",
          "date": "Sun, 23 Oct 2022 19:00:05 GMT"
        },
        {
          "name": "Stuart Weston",
          "image":"https://images.unsplash.com/photo-1610308479130-5141d71ba6e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEzfHx8ZW58MHx8fHw%3D&w=1000&q=80",
          "content": "Friendly helpful staff, superb service and room. Zsuzsanna was absolutely brilliant nothing was too much trouble for her",
          "traveler": "Traveler",
          "stayedIn": "Stayed in 16 October 2022",
          "rating": "4.2",
          "date": "Sun, 17 Oct 2022 19:00:05 GMT"
        },
        {
          "name": "Apostolos Apostolakis",
          "image": "https://images.unsplash.com/profile-1589642197085-ed2d5158a163image?auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff",
          "content": " I have used Booking many times and never had a bad experience even when I had to cancel once.",
          "traveler": "Traveler",
          "stayedIn": "Stayed in 16 October 2022",
          "rating": "4.5",
          "date": "Sun, 17 Oct 2022 19:00:05 GMT"
        }
      ]);

    })
  }

  async SearchByIataCode(body: any) {
    await this.mongodb.connect();
    return new Promise(async (resolve) => {

      let accountFindData = await this.mongodb.findLocations({ iata: body.iataCode });

      resolve(ResponseBuilder.successResponse('Data',  accountFindData[0]));

    })
  }

  async http_Bookingcancel(body: any) {

    let node_env = process.env.NODE_ENV;
    let TARGET_BRANCH: string;
    let PROVIDER_CODE: string;
    let ACCEPT_ENCODING: string;
    let CONTENT_TYPE: string;
    let AUTHORIZATION: string;
    let HOTEL_SERVICE_URL: string;

    if(node_env == 'production'){

      HOTEL_SERVICE_URL = process.env.Production_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Production_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Production_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Production_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Production_CONTENT_TYPE;
      AUTHORIZATION = process.env.Production_AUTHORIZATION;
    
    }
    else
    {

      HOTEL_SERVICE_URL = process.env.Development_HOTEL_SERVICE_URL;
      TARGET_BRANCH = process.env.Development_TARGET_BRANCH;
      PROVIDER_CODE = process.env.Development_PROVIDER_CODE;
      ACCEPT_ENCODING = process.env.Development_ACCEPT_ENCODING;
      CONTENT_TYPE = process.env.Development_CONTENT_TYPE;
      AUTHORIZATION = process.env.Development_AUTHORIZATION;
    
    }

    return new Promise(async (resolve) => {
	

      try {

        let xmlData: string = fs.readFileSync(path.resolve(__dirname, './soapXML/bookingCancel.xml'), 'utf-8');

        let _replace_data = xmlData.split('--TraceId--').join(body.TraceId);
        _replace_data = _replace_data.split('--LocatorCode--').join(body.LocatorCode);
        let _replase_r = _replace_data.split('--TargetBranch--').join(TARGET_BRANCH);
        


        console.log(_replase_r);

        //soap create request
        let config = {
          method: 'post',
          url:HOTEL_SERVICE_URL,
          headers: {
            'TargetBranch': TARGET_BRANCH,
            'ProviderCode': PROVIDER_CODE,
            'Accept-Encoding': ACCEPT_ENCODING,
            'Content-Type': CONTENT_TYPE,
            'Authorization': AUTHORIZATION,
          },
          data : _replase_r
        };

        let LogsDate = new Date();
        let hash = md5(LogsDate + body.TraceId);
        let ReqBookingCancelApiData = JSON.stringify(config);
        let logs = {
            TraceId: body.TraceId,
            Hashpair: hash,
            TriggerHit: "Req booking Cancel Api",
            Date: LogsDate,
            Data: ReqBookingCancelApiData
        };
        await this.mongodb.applicationloggedMultiInsert(logs);

        let responseData,status=200;

        //soap execute request

        let response = await axios(config)
        if(response.status == 200){

          let LogsDate = new Date();
          let ResBookingApiData = JSON.stringify(response.data);
          let logsRes = {
              TraceId: body.TraceId,
              Hashpair: hash,
              TriggerHit: "Res Booking Cancel Api",
              Date: LogsDate,
              Data: ResBookingApiData
          };
          await this.mongodb.applicationloggedMultiInsert(logsRes);

          parseString(response.data, async function(err, result) {


            let requestResult
            requestResult = result['SOAP:Envelope']['SOAP:Body'][0]

            if (requestResult['SOAP:Fault'] || requestResult['SOAP-ENV:Fault']) {

              let status = 404;
              let message = requestResult['SOAP:Fault'][0]['faultstring'][0];
              let faultcode = requestResult['SOAP:Fault'][0]['detail'][0]['common_v52_0:ErrorInfo'][0]['common_v52_0:Code'][0]
              let responseData :any = {"status":status, "faultcode": faultcode, "message":message}
              resolve(responseData);



            } else {

              let HotelCancelRsp = requestResult['universal:HotelCancelRsp'][0]['$'];
            let UniversalRecord = requestResult['universal:HotelCancelRsp'][0]['universal:UniversalRecord'][0];
            let BookingTraveler = requestResult['universal:HotelCancelRsp'][0]['universal:UniversalRecord'][0]['common_v52_0:BookingTraveler'];
            let OSI = requestResult['universal:HotelCancelRsp'][0]['universal:UniversalRecord'][0]['common_v52_0:OSI'];
            let ProviderReservationInfo = requestResult['universal:HotelCancelRsp'][0]['universal:UniversalRecord'][0]['universal:ProviderReservationInfo'];
            let GeneralRemark = requestResult['universal:HotelCancelRsp'][0]['universal:UniversalRecord'][0]['common_v52_0:GeneralRemark'];
            let AgencyInfo = requestResult['universal:HotelCancelRsp'][0]['universal:UniversalRecord'][0]['common_v52_0:AgencyInfo'];
            let AgentAction = AgencyInfo[0]['common_v52_0:AgentAction'];
            let AgentActionLength = AgentAction.length;
            let AgentActionLengthData = [];
            for (let i = 0; i < AgentActionLength; i++) {
                AgentActionLengthData.push(AgentAction[i]['$']);
            }
            let data = {
                TraceId: HotelCancelRsp['TraceId'],
                TransactionId: HotelCancelRsp['TransactionId'],
                LocatorCode: UniversalRecord['$']['LocatorCode'],
                Version: UniversalRecord['$']['Version'],
                Status: UniversalRecord['$']['Status'],
                BookingTraveler: {
                    TravelerType: BookingTraveler[0]['$']['TravelerType'],
                    BookingTraveler_First: BookingTraveler[0]['common_v52_0:BookingTravelerName'][0]['$']['First'],
                    BookingTraveler_Last: BookingTraveler[0]['common_v52_0:BookingTravelerName'][0]['$']['Last'],
                    BookingTraveler_Type: BookingTraveler[0]['common_v52_0:PhoneNumber'][0]['$']['Type'],
                    BookingTraveler_Location: BookingTraveler[0]['common_v52_0:PhoneNumber'][0]['$']['Location'],
                    BookingTraveler_CountryCode: BookingTraveler[0]['common_v52_0:PhoneNumber'][0]['$']['CountryCode'],
                    BookingTraveler_Number: BookingTraveler[0]['common_v52_0:PhoneNumber'][0]['$']['Number'],
                    BookingTraveler_AreaCode: BookingTraveler[0]['common_v52_0:PhoneNumber'][0]['$']['AreaCode'],
                },
                OSI: {
                    Carrier: OSI[0]['$']['Carrier'],
                    Text: OSI[0]['$']['Text'],
                    ProviderReservationInfoRef: OSI[0]['$']['ProviderReservationInfoRef']
                },
                ProviderReservationInfo: {
                    ProviderCode: ProviderReservationInfo[0]['$']['ProviderCode'],
                    LocatorCode: ProviderReservationInfo[0]['$']['LocatorCode'],
                    CreateDate: ProviderReservationInfo[0]['$']['CreateDate'],
                    ModifiedDate: ProviderReservationInfo[0]['$']['ModifiedDate'],
                    HostCreateDate: ProviderReservationInfo[0]['$']['HostCreateDate'],
                    OwningPCC: ProviderReservationInfo[0]['$']['OwningPCC']
                },
                GeneralRemark: [],
                AgentActionLength: AgentActionLengthData
            };

            let GeneralRemarkLength = GeneralRemark.length;
            for (let index = 0; index < GeneralRemarkLength; index++) {

              let c = {
                SupplierType: GeneralRemark[index]['$']['SupplierType'],
                ProviderCode: GeneralRemark[index]['$']['ProviderCode'],
                ProviderReservationInfoRef: GeneralRemark[index]['$']['ProviderReservationInfoRef'],
                ElStat: GeneralRemark[index]['$']['ElStat'],
                RemarkData: GeneralRemark[index]['common_v52_0:RemarkData'][0],
              }

              data.GeneralRemark.push(c);

            }


            resolve(data);
            }

          })


        }


      } catch(e) {
        console.log('Error:', e.stack);
      }

    })
  }

  async bookingCancel(body: any) {
    return new Promise(async (resolve) => {
      
      let BookingAsGuest = body.BookingAsGuest;

      if(BookingAsGuest == true)
      {


            let http_CancelBooking = await this.http_Bookingcancel(body);
            let httpStatus = http_CancelBooking['status'];
            if (httpStatus == 404) {
              resolve(ResponseBuilder.errorMultiResponse('message', http_CancelBooking['message'], 'faultcode', http_CancelBooking['faultcode']));
            }
            else {

                http_CancelBooking['UserID'] = "BookingAsGuest";
                http_CancelBooking['LocatorCode'] = body.LocatorCode;
                http_CancelBooking['TraceId'] = body.TraceId;
                await this.mongodb.newCancelBooking(http_CancelBooking);
                let hotelCancelBookingDocument = await this.mongodb.findCancelBooking({ "LocatorCode": { $eq: body.LocatorCode } });
                resolve(ResponseBuilder.successResponse('Data', hotelCancelBookingDocument[0]));

            }

      }
      else
      {
      
        let accountFindData = await this.mongodb.findAccountUsersDocument({ _id: { $eq: new ObjectId(body.UserID) }, "ActiveSession": { $eq: body.ActiveSession } });
        let accountFindDataLength = accountFindData.length;
        if (accountFindDataLength == 1) {

            let http_CancelBooking = await this.http_Bookingcancel(body);
            let httpStatus = http_CancelBooking['status'];
            if (httpStatus == 404) {
              resolve(ResponseBuilder.errorMultiResponse('message', http_CancelBooking['message'], 'faultcode', http_CancelBooking['faultcode']));
            }
            else {
                http_CancelBooking['UserID'] = body.UserID;
                http_CancelBooking['LocatorCode'] = body.LocatorCode;
                http_CancelBooking['TraceId'] = body.TraceId;
                await this.mongodb.newCancelBooking(http_CancelBooking);
                let hotelCancelBookingDocument = await this.mongodb.findCancelBooking({ "LocatorCode": { $eq: body.LocatorCode } });
                resolve(ResponseBuilder.successResponse('Data', hotelCancelBookingDocument[0]));
            }
        }
        else {
            resolve(ResponseBuilder.errorResponse('message', "Active Session not Match."));
        }
        
      }

  });


  }

  async userBookingDetails(body: any) {
    return new Promise(async (resolve) => {
    

      console.log(body);
      let bookingid = body.bookingId;

      let hotelBookingDocument = await this.mongodb.findHotelBookingDocument({ _id: { $eq: new ObjectId(bookingid) }});

      let accountFindDataLength = hotelBookingDocument.length

      if(accountFindDataLength == 1){
        resolve(ResponseBuilder.successResponse('Data', hotelBookingDocument[0]));
      }
      else
      {
        resolve(ResponseBuilder.errorResponse('message', "No Booking"));
      }
      

    });
  }

  async FilterBylistCities(client, data: any) {

    for (let index = 0; index < data.length; index++) {
          
      let cls = data[index];

      let Latitude = data[index]['Latitude'];
      let Longitude = data[index]['Longitude'];

     
      let body  = await client.search({
        index: 'hotels',
        body: {
          query: {
            match: { search_Latitude: Latitude }
          }
        }
      });

      data[index]['TotalHotels'] = body.hits.total.value
      
    }

    return data;
  }


  SearchByfilters(data: any) {
    return new Promise(async (resolve) => {

      const client = new Client({
        cloud: {
          id: 'h-Data:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGEyNmJiMDVjZjRhZTQwYjc4YTYzNzA4NmJjZDgwY2E2JDNiZjJhM2QxMDY3MTQ5MDJhMTgxMDgwMmI0NmVjMDVk',
        },
        auth: {
          username: 'elastic',
          password: 'ty9nwSjv6i6OmIO7YWmfeOMl'
        }
      })



      let listCities = [];
      let Country = data['Country'];

      if(Country == undefined || Country == ""){ 
        let gettingCountry =  await this.mongodb.findFiltersSettingsManagementDocument({ "Country": { $eq: "United Kingdom" } });
        listCities = gettingCountry[0]['FilterCities']; 
        listCities = await this.FilterBylistCities(client, listCities);
      }
      else
      {
        let gettingCountry =  await this.mongodb.findFiltersSettingsManagementDocument({ "Country": { $eq: Country } });
        listCities = gettingCountry[0]['FilterCities']; 
        listCities = await this.FilterBylistCities(client, listCities);
      }

      let body  = await client.search({
        index: 'hotels',
        from: data.StartFrom,
        size: 20,
        body: {
          query: {
            match: { search_Latitude: data.Latitude }
          }
        }
      })

      data['TotalHotels'] = body.hits.total.value;

      let TotalHotels = body.hits.hits;
      let TotalHotelsLength = TotalHotels.length;

      console.log(TotalHotelsLength);

      for (let index = 0; index < TotalHotelsLength; index++) {
        
        let element = TotalHotels[index];
        let HotelCode = TotalHotels[index]['_source']['HotelCode'];


        console.log(HotelCode);

        let findHotelDocument = await this.mongodb.findHotelDocument({ "HotelId": { $eq: HotelCode } });
        if (findHotelDocument.length >= 1) {

          TotalHotels[index]['HotelId'] = findHotelDocument[0]['HotelId'];
          TotalHotels[index]['_id'] = findHotelDocument[0]['_id'];
          TotalHotels[index]['IataCode'] = findHotelDocument[0]['IataCode'];
          TotalHotels[index]['rawData'] = findHotelDocument[0]['rawData'];
          

        }

        
      }



      let query = {
        query: data,
        cities: listCities,
        data: body.hits.hits
      };



      resolve(query)

    })
  }


  Syncfilterdata(body: any) {
    return new Promise(async (resolve) => {

      const client = new Client({
        cloud: {
          id: 'h-Data:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGEyNmJiMDVjZjRhZTQwYjc4YTYzNzA4NmJjZDgwY2E2JDNiZjJhM2QxMDY3MTQ5MDJhMTgxMDgwMmI0NmVjMDVk',
        },
        auth: {
          username: 'elastic',
          password: 'ty9nwSjv6i6OmIO7YWmfeOMl'
        }
      })

      console.log('Counting Data ..')
      let findHotelDocumentCount = await this.mongodb.findHotelDocumentCount();
      console.log('Counting Data Done')

      let currentpage = 0;
      while (currentpage < findHotelDocumentCount) {

        console.log('Starting From: '+currentpage);
        

        let HotelDocuments = await this.mongodb.findHotelDocumentWithSkipLimit({}, currentpage, 50);
        let HotelDocumentsLength = HotelDocuments.length;

        for (let i = 0; i < HotelDocumentsLength; i++) {

          // MinimumAmount - MaximumAmount
          let RateInfo_MinimumAmount = HotelDocuments[i]['rawData']['RateInfo']['MinimumAmount'];
          let RateInfo_MaximumAmount = HotelDocuments[i]['rawData']['RateInfo']['MaximumAmount'];
  
  
          let RateInfo_MinimumAmount_Base;
          let RateInfo_MinimumAmount_Price;
  
          if(RateInfo_MinimumAmount == null){
  
            RateInfo_MinimumAmount_Base = "";
            RateInfo_MinimumAmount_Price = "";
  
          }
          else
          {
  
            RateInfo_MinimumAmount_Base = RateInfo_MinimumAmount.slice(0, 3);
            RateInfo_MinimumAmount_Price = RateInfo_MinimumAmount.slice(3, 10);
  
          }
  
  
          let RateInfo_MaximumAmount_Base;
          let RateInfo_MaximumAmount_Price;
  
          if(RateInfo_MaximumAmount == null){
  
            
            RateInfo_MaximumAmount_Base = "";
            RateInfo_MaximumAmount_Price = "";
          }
          else
          {
  
            RateInfo_MaximumAmount_Base = RateInfo_MaximumAmount.slice(0, 3);
            RateInfo_MaximumAmount_Price = RateInfo_MaximumAmount.slice(3, 10);
          }
  
        
  
          // ApproximateMinimumAmount - ApproximateMaximumAmount
          let RateInfo_ApproximateMinimumAmount = HotelDocuments[i]['rawData']['RateInfo']['ApproximateMinimumAmount'];
          let RateInfo_ApproximateMaximumAmount = HotelDocuments[i]['rawData']['RateInfo']['ApproximateMaximumAmount'];
  
          let RateInfo_ApproximateMinimumAmount_Base;
          let RateInfo_ApproximateMinimumAmount_Price;
  
          if(RateInfo_ApproximateMinimumAmount == null){
  
            RateInfo_ApproximateMinimumAmount_Base = "";
            RateInfo_ApproximateMinimumAmount_Price = "";
          
          }
          else
          {
            RateInfo_ApproximateMinimumAmount_Base = RateInfo_ApproximateMinimumAmount.slice(0, 3);
            RateInfo_ApproximateMinimumAmount_Price = RateInfo_ApproximateMinimumAmount.slice(3, 10);
          }
  
          let RateInfo_ApproximateMaximumAmount_Base;
          let RateInfo_ApproximateMaximumAmount_Price;
  
          if(RateInfo_ApproximateMaximumAmount == null){
          
            RateInfo_ApproximateMaximumAmount_Base = "";
            RateInfo_ApproximateMaximumAmount_Price = "";
  
          }
          else
          {
  
            RateInfo_ApproximateMaximumAmount_Base = RateInfo_ApproximateMaximumAmount.slice(0, 3);
            RateInfo_ApproximateMaximumAmount_Price = RateInfo_ApproximateMaximumAmount.slice(3, 10);
  
          }
  
  
          let elastic = {
            HotelId: HotelDocuments[i]['HotelId'],
            IataCode: HotelDocuments[i]['IataCode'],
  
            VendorCode: HotelDocuments[i]['rawData']['VendorCode'],
            VendorLocationID: HotelDocuments[i]['rawData']['VendorLocationID'],
            HotelChain: HotelDocuments[i]['rawData']['HotelChain'],
            HotelCode: HotelDocuments[i]['rawData']['HotelCode'],
            HotelLocation: HotelDocuments[i]['rawData']['HotelLocation'],
            Name: HotelDocuments[i]['rawData']['Name'],
  
            HotelTransportation: HotelDocuments[i]['rawData']['HotelTransportation'],
            ReserveRequirement: HotelDocuments[i]['rawData']['ReserveRequirement'],
            ParticipationLevel: HotelDocuments[i]['rawData']['ParticipationLevel'],
  
            //Distance
            Distance_Units: HotelDocuments[i]['rawData']['Distance']['Units'],
            Distance_Value: HotelDocuments[i]['rawData']['Distance']['Value'],
            Distance_Direction: HotelDocuments[i]['rawData']['Distance']['Direction'],
  
            //HotelRating
            HotelRating_RatingProvider: HotelDocuments[i]['rawData']['HotelRating']['RatingProvider'],
            HotelRating_Rating: HotelDocuments[i]['rawData']['HotelRating']['Rating'],
  
            //Amenity
            Amenity: HotelDocuments[i]['rawData']['Amenity'],
  
            //RateInfo
            RateInfo_MinimumAmount: HotelDocuments[i]['rawData']['RateInfo']['MinimumAmount'],
            RateInfo_MaximumAmount: HotelDocuments[i]['rawData']['RateInfo']['MaximumAmount'],
  
            RateInfo_MinimumAmount_Base: RateInfo_MinimumAmount_Base,
            RateInfo_MinimumAmount_Price: RateInfo_MinimumAmount_Price,
  
            RateInfo_MaximumAmount_Base: RateInfo_MaximumAmount_Base,
            RateInfo_MaximumAmount_Price: RateInfo_MaximumAmount_Price,
  
            RateInfo_ApproximateMinimumAmount: HotelDocuments[i]['rawData']['RateInfo']['ApproximateMinimumAmount'],
            RateInfo_ApproximateMaximumAmount: HotelDocuments[i]['rawData']['RateInfo']['ApproximateMaximumAmount'],
  
            RateInfo_ApproximateMinimumAmount_Base: RateInfo_ApproximateMinimumAmount_Base,
            RateInfo_ApproximateMinimumAmount_Price: RateInfo_ApproximateMinimumAmount_Price,
  
            RateInfo_ApproximateMaximumAmount_Base: RateInfo_ApproximateMaximumAmount_Base,
            RateInfo_ApproximateMaximumAmount_Price: RateInfo_ApproximateMaximumAmount_Price,
  
            RateInfo_MinAmountRateChanged: HotelDocuments[i]['rawData']['RateInfo']['MinAmountRateChanged'],
            RateInfo_MaxAmountRateChanged: HotelDocuments[i]['rawData']['RateInfo']['MaxAmountRateChanged'],
  
            //search Latitude Longitude
            search_Latitude: HotelDocuments[i]['search_Latitude'],
            search_Longitude: HotelDocuments[i]['search_Longitude'],
  
          }
  
  
          let HotelDocumentsHotelId = HotelDocuments[i]['HotelId'];
          let HotelDocumentsElastic = HotelDocuments[i]['elastic'];

          if(HotelDocumentsElastic == true)
          {
              console.log('all ready added');
          }
          else
          {

            let findHotelDocument = await this.mongodb.findHotelDocument({ "HotelId": { $eq: HotelDocumentsHotelId } });
            if (findHotelDocument.length >= 1) {

              findHotelDocument[0]['elastic'] = true;
              await this.mongodb.updateHotelDocument({ "HotelId": HotelDocumentsHotelId }, { $set: findHotelDocument[0] });
              await client.index({ index: 'hotels', body: elastic });
            }
            

          }
          
  
        }

        currentpage = currentpage + 50;
      }


      client.info().then(response => console.log(response)).catch(error => console.error(error));

      resolve('Update Done')
    
    })
  }

}
