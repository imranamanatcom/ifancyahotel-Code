import { CurrenciesRepo } from './currencies.repo';
export declare class CurrenciesService {
    private readonly CurrenciesRepo;
    constructor(CurrenciesRepo: CurrenciesRepo);
    commonCurrency(body: any): Promise<unknown>;
    currenciesList(body: any): Promise<unknown>;
    currenciesBySymbols(body: any): Promise<unknown>;
    convertPriceToBase(body: any): Promise<unknown>;
}
