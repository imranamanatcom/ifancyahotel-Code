import { Injectable } from '@nestjs/common';
import { SoapRepo } from './soap.repo'

@Injectable()
export class SoapService {

  constructor(private readonly SoapRepo: SoapRepo) {}

  public getHello(data): any{

    return new Promise(async (resolve)=> {

      let soaprepo = await this.SoapRepo.getHello(data);
      resolve(soaprepo)

    });

  }

}
