import { Injectable } from '@nestjs/common';
import { CurrenciesRepo } from './currencies.repo'
import { ResponseBuilder } from "../../utils/ResponseBuilder";

@Injectable()
export class CurrenciesService {
  
  constructor(private readonly CurrenciesRepo: CurrenciesRepo) {}

  public commonCurrency(body: any): Promise<unknown> {
    return new Promise(async (resolve)=> {

      let data_r = await this.CurrenciesRepo.commonCurrency(body);
      resolve(ResponseBuilder.successResponse('Data', data_r));

    });
  }

  public currenciesList(body: any) {
    return new Promise(async (resolve)=> {

      let data_r = await this.CurrenciesRepo.currenciesList(body);
      resolve(ResponseBuilder.successResponse('Data', data_r));

    });
  }

  public currenciesBySymbols(body: any) {
    return new Promise(async (resolve)=> {

      let data_r = await this.CurrenciesRepo.currenciesBySymbols(body);
      resolve(ResponseBuilder.successResponse('Data', data_r));

    });
  }

  convertPriceToBase(body: any) {
    return new Promise(async (resolve)=> {

      let data_r = await this.CurrenciesRepo.convertPriceToBase(body.base, body.price);
      resolve(ResponseBuilder.successResponse('Data', data_r));

    });
  }
}
