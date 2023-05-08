import { CurrenciesService } from './currencies.service';
export declare class currenciesController {
    private readonly CurrenciesService;
    constructor(CurrenciesService: CurrenciesService);
    currenciesList(body: any): Promise<unknown>;
    currenciesBySymbols(body: any): Promise<unknown>;
    convertPriceToBase(body: any): Promise<unknown>;
    commonCurrency(body: any): Promise<unknown>;
}
