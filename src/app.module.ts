import { Module } from '@nestjs/common';
import { mainController } from './app.controller';
import { mainService } from './app.service';
import { SoapModule } from "./module/soap/soap.module";
import { HotelModule } from "./module/hotel/hotel.module"
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongoDatabase } from "./database/mongodb";
import { UsersModule} from "./module/users/users.module";
import { CurrenciesModule } from "./module/currencies/currencies.module";
import { join } from 'path';
import { ServeStaticModule } from "@nestjs/serve-static";


@Module({
  imports: [HotelModule, SoapModule, UsersModule, CurrenciesModule, ScheduleModule.forRoot(), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'views'),
    exclude: ['/api*'],
  }) ],
  controllers: [mainController],
  providers: [mainService, CronService, MongoDatabase],
})

export class AppModule {}
