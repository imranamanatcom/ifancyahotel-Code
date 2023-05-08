import { Injectable, Inject } from '@nestjs/common';
import { ResponseBuilder } from "../../utils/ResponseBuilder";
import axios from "axios";
import { replace } from 'replace-xml-text';
var parseString = require('xml2js').parseString;
let fs = require('fs');



@Injectable()
export class SoapRepo {
  public getHello(data): any {
    
    let dataValues = data;

    return new Promise(async (resolve)=> {

      try {


        resolve({name:"imran"})

      } catch(e) {
        console.log('Error:', e.stack);
      }

    });

  }

}
