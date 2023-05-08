export declare class MongoDatabase {
    node_env: any;
    db: any;
    databaseName: string;
    cacheTable: string;
    hotelsTable: string;
    hotelDetailsTable: string;
    hotelDetailsCached: string;
    hotelMediaLinksCached: string;
    hotelMediaLinks: string;
    hotelTNCCached: string;
    hotelTNC: string;
    HotelRateDetailFilters: string;
    Booking: string;
    CancelBooking: string;
    AccountUsers: string;
    CurrenciesManagement: string;
    CommonCurrency: String;
    Applicationlogged: String;
    MongoClientURL: String;
    SyncLoadData: String;
    FiltersSettings: String;
    constructor();
    connect(): Promise<any>;
    disConnect(): Promise<any>;
    newCacheDocument(json: any): Promise<any>;
    updateCacheDocument(find: any, json: any): Promise<any>;
    findCacheDocument(json: any): Promise<any>;
    newHotelDocument(json: any): Promise<any>;
    updateHotelDocument(find: any, json: any): Promise<any>;
    findHotelDocument(json: any): Promise<any>;
    findHotelDocumentWithSkipLimit(json: any, skip: any, limit: any): Promise<any>;
    findHotelDocumentCount(): Promise<any>;
    newHotelDetailsDocument(json: any): Promise<any>;
    updateHotelDetailsDocument(find: any, json: any): Promise<any>;
    findHotelDetailsDocument(json: any): Promise<any>;
    newCacheHotelDetailsDocument(json: any): Promise<any>;
    updateHotelCacheDetailsDocument(find: any, json: any): Promise<any>;
    findCacheHotelDetailsDocument(json: any): Promise<any>;
    newMediaLinkCacheDocument(json: any): Promise<any>;
    updateMediaLinkCacheDocument(find: any, json: any): Promise<any>;
    findMediaLinkCacheDocument(json: any): Promise<any>;
    newMediaLinkDocument(json: any): Promise<any>;
    updateMediaLinkDocument(find: any, json: any): Promise<any>;
    findMediaLinkDocument(json: any): Promise<any>;
    newHotelTNCCacheDocument(json: any): Promise<any>;
    updateHotelTNCCacheDocument(find: any, json: any): Promise<any>;
    findHotelTNCCacheDocument(json: any): Promise<any>;
    newHotelTNCDocument(json: any): Promise<any>;
    updateHotelTNCDocument(find: any, json: any): Promise<any>;
    findHotelTNCDocument(json: any): Promise<any>;
    findLocations(json: any): Promise<any>;
    newHotelRateDetailFiltersDocument(json: any): Promise<any>;
    updateHotelRateDetailFiltersDocument(find: any, json: any): Promise<any>;
    findHotelRateDetailFiltersDocument(json: any): Promise<any>;
    newHotelBookingDocument(json: any): Promise<any>;
    updateHotelBookingDocument(find: any, json: any): Promise<any>;
    findHotelBookingDocument(json: any): Promise<any>;
    newAccountUsersDocument(json: any): Promise<any>;
    updateAccountUsersDocument(find: any, json: any): Promise<any>;
    findAccountUsersDocument(json: any): Promise<any>;
    newCurrenciesManagementDocument(json: any): Promise<any>;
    updateCurrenciesManagementDocument(find: any, json: any): Promise<any>;
    findCurrenciesManagementDocument(json: any): Promise<any>;
    newCommonCurrencyDocument(json: any): Promise<any>;
    updateCommonCurrencyDocument(find: any, json: any): Promise<any>;
    findCommonCurrencyDocument(json: any): Promise<any>;
    applicationloggedInsert(json: any): Promise<unknown>;
    applicationloggedMultiInsert(json: any): Promise<unknown>;
    applicationloggedFind(find: any, json: any): Promise<unknown>;
    applicationloggedUpdate(json: any): Promise<unknown>;
    newCancelBooking(json: any): Promise<unknown>;
    newMutiCancelBooking(json: any): Promise<unknown>;
    updateCancelBooking(find: any, json: any): Promise<unknown>;
    findCancelBooking(json: any): Promise<unknown>;
    newSyncLoadDataDocument(json: any): Promise<any>;
    updateSyncLoadDataDocument(find: any, json: any): Promise<any>;
    findSyncLoadDataDocument(json: any): Promise<any>;
    deleteSyncLoadDataDocument(json: any): Promise<any>;
    newFiltersSettingsManagementDocument(json: any): Promise<any>;
    updateFiltersSettingsManagementDocument(find: any, json: any): Promise<any>;
    findFiltersSettingsManagementDocument(json: any): Promise<any>;
}
