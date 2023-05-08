import { MongoDatabase } from "../database/mongodb";
import { HotelService } from "../module/hotel/hotel.service";
export declare class CronService {
    mongodb: MongoDatabase;
    hotelService: HotelService;
    runEveryMinute(): Promise<void>;
    sleep: (time: any) => Promise<unknown>;
    LoadMoreData(): Promise<void>;
    elasticSyncHotelData(): Promise<void>;
}
