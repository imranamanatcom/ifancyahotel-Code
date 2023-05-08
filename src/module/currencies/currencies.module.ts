import { Module } from '@nestjs/common';
import { currenciesController } from "./currencies.controller";
import { CurrenciesService } from "./currencies.service";
import { CurrenciesRepo} from "./currencies.repo";
import { MongoDatabase } from "../../database/mongodb";

@Module({
  imports: [],
  controllers: [currenciesController],
  providers: [CurrenciesService, CurrenciesRepo, MongoDatabase],
})
export class CurrenciesModule {}
