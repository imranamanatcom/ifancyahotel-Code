import { SoapRepo } from './soap.repo';
export declare class SoapService {
    private readonly SoapRepo;
    constructor(SoapRepo: SoapRepo);
    getHello(data: any): any;
}
