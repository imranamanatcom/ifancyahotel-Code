import { Module } from '@nestjs/common';
import { HotelController } from "./hotel.controller";
import { HotelService } from "./hotel.service";
import { HotelRepo } from "./hotel.repo";
import { MongoDatabase } from "../../database/mongodb";
import { AmazonSDK } from "../../utils/amazon-sdk";

@Module({
  imports: [],
  controllers: [HotelController],
  providers: [HotelService, HotelRepo, MongoDatabase, AmazonSDK],
  exports: [HotelService]
})
export class HotelModule {}
