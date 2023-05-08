import { Injectable, Inject } from '@nestjs/common';
let MongoClient = require('mongodb').MongoClient;

@Injectable()
export class MongoDatabase {

  public node_env: any;

  public db:any;
  public databaseName: string;

  public cacheTable: string;
  public hotelsTable: string;

  public hotelDetailsTable: string;
  public hotelDetailsCached: string;

  public hotelMediaLinksCached: string;
  public hotelMediaLinks: string;

  public hotelTNCCached: string;
  public hotelTNC: string;

  public HotelRateDetailFilters: string;

  public Booking: string;
  public CancelBooking: string;

  public AccountUsers: string;

  public CurrenciesManagement: string;
  public CommonCurrency: String;

  public Applicationlogged: String;

  public MongoClientURL: String;

  public SyncLoadData: String;

  public FiltersSettings: String;

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

    if(node_env == 'production'){
      this.MongoClientURL = process.env.MONGODB_Production
    }
    else
    {
      this.MongoClientURL = process.env.MONGODB_Development
    }

    console.log(node_env);
    console.log(this.MongoClientURL);

    this.db = new MongoClient(this.MongoClientURL);

  };

  async connect(): Promise<any> {
    await this.db.connect(function(err) {
      if (err) throw err;
      console.log("Mongo DB connected");
    });

  }

  async disConnect(): Promise<any> {

    await this.db.close(function(err) {
      if (err) throw err;
      console.log("Mongo DB disconnected");
    });

  }

  /********************************************************************/
  // Table name: SearchCached , Hotels
  /********************************************************************/

  //Hotel Searching Table
  async newCacheDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.cacheTable).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateCacheDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.cacheTable).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findCacheDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.cacheTable).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  //Hotel Searching Table
  async newHotelDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelsTable).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateHotelDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelsTable).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findHotelDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelsTable).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }


  async findHotelDocumentWithSkipLimit(json,  skip, limit): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelsTable).find(json).skip(skip).limit(limit).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  async findHotelDocumentCount(): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelsTable).estimatedDocumentCount({}, function(err, numOfDocs){
        if (err) throw err;
        resolve(numOfDocs);
      });

    
    });

  }

  /********************************************************************/
  // Table name: HotelDetails , HotelDetailsCached
  /********************************************************************/

  //Hotel Details Table // Table name: HotelDetails
  async newHotelDetailsDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelDetailsTable).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateHotelDetailsDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelDetailsTable).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findHotelDetailsDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelDetailsTable).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  //Hotel Details Table Cache  //Table name: HotelDetailsCached
  async newCacheHotelDetailsDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelDetailsCached).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateHotelCacheDetailsDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelDetailsCached).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findCacheHotelDetailsDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelDetailsCached).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }


  /********************************************************************/
  // Table name: HotelMediaLinks , HotelMediaLinksCached
  /********************************************************************/

  //Table: hotelMediaLinksCached
  async newMediaLinkCacheDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelMediaLinksCached).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateMediaLinkCacheDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelMediaLinksCached).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findMediaLinkCacheDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelMediaLinksCached).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  //Table: hotelMediaLinks
  async newMediaLinkDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelMediaLinks).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateMediaLinkDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelMediaLinks).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findMediaLinkDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelMediaLinks).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  /********************************************************************/
  // Table name: HotelTNC , HotelTNCCached
  /********************************************************************/

  //Table: HotelTNCCached
  async newHotelTNCCacheDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelTNCCached).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateHotelTNCCacheDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelTNCCached).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findHotelTNCCacheDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelTNCCached).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  //Table: HotelTNC
  async newHotelTNCDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelTNC).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateHotelTNCDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelTNC).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findHotelTNCDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.hotelTNC).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  /********************************************************************/
  // Table name: HotelTNC , HotelTNCCached
  /********************************************************************/

  async findLocations(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection('Locations').find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  /********************************************************************/
  // Table name: HotelRateDetailFilters
  /********************************************************************/

  //Table: HotelTNC
  async newHotelRateDetailFiltersDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.HotelRateDetailFilters).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateHotelRateDetailFiltersDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.HotelRateDetailFilters).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findHotelRateDetailFiltersDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.HotelRateDetailFilters).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  /********************************************************************/
  // Table name: Booking
  /********************************************************************/

  async newHotelBookingDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.Booking).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateHotelBookingDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.Booking).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findHotelBookingDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.Booking).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }


  /********************************************************************/
  // Table name: Account Users
  /********************************************************************/

  async newAccountUsersDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.AccountUsers).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateAccountUsersDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.AccountUsers).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findAccountUsersDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.AccountUsers).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }


  /********************************************************************/
  // Table name: Currencies Management
  /********************************************************************/

  async newCurrenciesManagementDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.CurrenciesManagement).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateCurrenciesManagementDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.CurrenciesManagement).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findCurrenciesManagementDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.CurrenciesManagement).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }


  /********************************************************************/
  // Table name: Common Currency
  /********************************************************************/

  async newCommonCurrencyDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.CommonCurrency).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateCommonCurrencyDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.CommonCurrency).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findCommonCurrencyDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.CommonCurrency).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
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


  /********************************************************************/
  // Table name: Currencies Management
  /********************************************************************/

  async newSyncLoadDataDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.SyncLoadData).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateSyncLoadDataDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.SyncLoadData).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findSyncLoadDataDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.SyncLoadData).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

  async deleteSyncLoadDataDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.SyncLoadData).deleteOne(json, function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }


  /********************************************************************/
  // Table name: Currencies Management
  /********************************************************************/

  async newFiltersSettingsManagementDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.FiltersSettings).insertOne(json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async updateFiltersSettingsManagementDocument(find, json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.FiltersSettings).updateOne(find, json, function(err, result) {
        if (err) throw err;
        resolve(result);
      });

    });

  }

  async findFiltersSettingsManagementDocument(json): Promise<any> {

    return await new Promise(async (resolve)=> {

      await this.db.db(this.databaseName).collection(this.FiltersSettings).find(json).toArray(function(err, result) {
        if (err) throw err;
        resolve(result)
      });

    });

  }

}