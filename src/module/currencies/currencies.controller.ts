import { 
  Body, Controller, Get , Post , HttpCode , HttpStatus, Query, ValidationPipe , } from "@nestjs/common";
import { CurrenciesService } from './currencies.service';

@Controller('/currencies')
export class currenciesController {
  constructor(private readonly CurrenciesService: CurrenciesService) {}

  @Post('/currenciesList')
  public currenciesList(@Body() body: any): Promise<unknown> {
    return this.CurrenciesService.currenciesList(body);
  }

  @Post('/currenciesBySymbols')
  public currenciesBySymbols(@Body() body: any): Promise<unknown> {
    return this.CurrenciesService.currenciesBySymbols(body);
  }


  @Post('/convertPriceToBase')
  public convertPriceToBase(@Body() body: any): Promise<unknown> {
    return this.CurrenciesService.convertPriceToBase(body);
  }

  @Post('/commonCurrency')
  public commonCurrency(@Body() body: any): Promise<unknown> {
    return this.CurrenciesService.commonCurrency(body);
  }

}
