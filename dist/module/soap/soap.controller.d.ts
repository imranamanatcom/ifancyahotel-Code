import { SoapService } from './soap.service';
export declare class soapController {
    private readonly appService;
    constructor(appService: SoapService);
    soapHome(body: any): string;
    soapGoogle(body: any): string;
}
