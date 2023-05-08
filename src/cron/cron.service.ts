import { Inject, Injectable, Next } from "@nestjs/common";
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { MongoDatabase } from "../database/mongodb";
import { HotelService } from "../module/hotel/hotel.service";
import { ResponseBuilder } from '../utils/ResponseBuilder'
const { Client } = require('@elastic/elasticsearch');


import { ObjectId } from "mongodb";

@Injectable()
export class CronService {


  @Inject(MongoDatabase)
  public mongodb: MongoDatabase;

  @Inject(HotelService)
  public hotelService: HotelService;

  @Cron(CronExpression.EVERY_2_HOURS)
  async runEveryMinute() {

    /*
    let HotelDocuments = await this.mongoDatabase.findHotelDocument({});
    let HotelDocumentsLength = HotelDocuments.length;

    for (let i = 0; i < HotelDocumentsLength; i++) {

      let Data = {
        "TargetBranch":"P7178562",
        "HotelChain": HotelDocuments[i]['rawData']['HotelChain'],
        "HotelCode": HotelDocuments[i]['rawData']['HotelCode']
      }

      await this.hotelService.getHotelMediaLinks(Data);

    }
    */
  }

  sleep = time => new Promise(res => setTimeout(res, time, "done sleeping"));

  @Cron(CronExpression.EVERY_2_HOURS)
  async LoadMoreData() {
    
    let syncLoadDataDocument = await this.mongodb.findSyncLoadDataDocument({});
    let syncLoadDataDocumentLength = syncLoadDataDocument.length;

    for (let i = 0; i < syncLoadDataDocumentLength; i++) {

      let nextResultReference = syncLoadDataDocument[i]['nextResultReference']
      let syncLoadDataId = syncLoadDataDocument[i]['_id']

      if(nextResultReference == 'nomore'){



      }
      else
      {

        let page = syncLoadDataDocument[i]['Page'];

        if(page <= 3){
  
        page++
        syncLoadDataDocument[i]['Page'] = page;
        syncLoadDataDocument[i]['QueryData']['SnycByCron'] = true;
        syncLoadDataDocument[i]['QueryData']['Page'] = page;
        syncLoadDataDocument[i]['QueryData']['NextResultReference'] = syncLoadDataDocument[i]['nextResultReference'];

        let NextRows = syncLoadDataDocument[i]['QueryData'];

        console.log(NextRows);

        let getHotelMoreAvailability = await this.hotelService.getHotelMoreAvailability(NextRows)
        console.log(getHotelMoreAvailability)

        await this.mongodb.deleteSyncLoadDataDocument({_id: new ObjectId(syncLoadDataId)})

        }
        else
        {
          await this.mongodb.deleteSyncLoadDataDocument({_id: new ObjectId(syncLoadDataId)})
        }

      }

    }

  }



  @Cron(CronExpression.EVERY_12_HOURS)
  async elasticSyncHotelData() {

    /*
    const client = new Client({
      cloud: { id: '<cloud-id>' },
      auth: { apiKey: 'base64EncodedKey' }
    });
    */

    /*
    let HotelDocuments = await this.mongodb.findHotelDocument({});
    let HotelDocumentsLength = HotelDocuments.length;

    console.log(HotelDocumentsLength);

    for (let i = 0; i < HotelDocumentsLength; i++) {

      //RateInfo
      let RateInfo_MinimumAmount = HotelDocuments[i]['RateInfo']['MinimumAmount'];
      let RateInfo_MaximumAmount = HotelDocuments[i]['RateInfo']['MaximumAmount'];

      let RateInfo_MinimumAmount_Base = RateInfo_MinimumAmount.slice(0, 3);
      let RateInfo_MinimumAmount_Price = RateInfo_MinimumAmount.slice(3, 10);

      let RateInfo_MaximumAmount_Base = RateInfo_MaximumAmount.slice(0, 3);
      let RateInfo_MaximumAmount_Price = RateInfo_MaximumAmount.slice(3, 10);

      let RateInfo_ApproximateMinimumAmount = HotelDocuments[i]['RateInfo']['ApproximateMinimumAmount'];
      let RateInfo_ApproximateMaximumAmount = HotelDocuments[i]['RateInfo']['ApproximateMaximumAmount'];

      let RateInfo_ApproximateMinimumAmount_Base = RateInfo_ApproximateMinimumAmount.slice(0, 3);
      let RateInfo_ApproximateMinimumAmount_Price = RateInfo_ApproximateMinimumAmount.slice(3, 10);

      let RateInfo_ApproximateMaximumAmount_Base = RateInfo_ApproximateMaximumAmount.slice(0, 3);
      let RateInfo_ApproximateMaximumAmount_Price = RateInfo_ApproximateMaximumAmount.slice(3, 10);


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
        HotelRating_RatingProvider: HotelDocuments[i]['HotelRating']['RatingProvider'],
        HotelRating_Rating: HotelDocuments[i]['HotelRating']['Rating'],

        //Amenity
        Amenity: HotelDocuments[i]['Amenity'],

        //RateInfo
        RateInfo_MinimumAmount: HotelDocuments[i]['RateInfo']['MinimumAmount'],
        RateInfo_MaximumAmount: HotelDocuments[i]['RateInfo']['MaximumAmount'],

        RateInfo_MinimumAmount_Base: RateInfo_MinimumAmount_Base,
        RateInfo_MinimumAmount_Price: RateInfo_MinimumAmount_Price,

        RateInfo_MaximumAmount_Base: RateInfo_MaximumAmount_Base,
        RateInfo_MaximumAmount_Price: RateInfo_MaximumAmount_Price,

        RateInfo_ApproximateMinimumAmount: HotelDocuments[i]['RateInfo']['ApproximateMinimumAmount'],
        RateInfo_ApproximateMaximumAmount: HotelDocuments[i]['RateInfo']['ApproximateMaximumAmount'],

        RateInfo_ApproximateMinimumAmount_Base: RateInfo_ApproximateMinimumAmount_Base,
        RateInfo_ApproximateMinimumAmount_Price: RateInfo_ApproximateMinimumAmount_Price,

        RateInfo_ApproximateMaximumAmount_Base: RateInfo_ApproximateMaximumAmount_Base,
        RateInfo_ApproximateMaximumAmount_Price: RateInfo_ApproximateMaximumAmount_Price,

        RateInfo_MinAmountRateChanged: HotelDocuments[i]['RateInfo']['MinAmountRateChanged'],
        RateInfo_MaxAmountRateChanged: HotelDocuments[i]['RateInfo']['MaxAmountRateChanged'],

        //search Latitude Longitude
        search_Latitude: HotelDocuments[i]['search_Latitude'],
        search_Longitude: HotelDocuments[i]['search_Longitude'],



      }


      console.log(elastic);


    }

    */

  }
  
}



