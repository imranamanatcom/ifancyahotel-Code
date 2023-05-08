import { MongoDatabase } from "../../database/mongodb";
export declare class CurrenciesRepo {
    private readonly mongodb;
    constructor(mongodb: MongoDatabase);
    timeAgo(input: any): Promise<number>;
    commonCurrency(body: any): Promise<unknown>;
    currenciesList(body: any): Promise<unknown>;
    http_currenciesBySymbols(base: any): Promise<unknown>;
    currenciesBySymbols(body: any): Promise<unknown>;
    convertPriceToBase(base: any, Price: any): Promise<unknown>;
}
