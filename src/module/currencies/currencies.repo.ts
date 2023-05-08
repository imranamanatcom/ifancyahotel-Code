import { Injectable, Inject } from '@nestjs/common';
import { ResponseBuilder } from "../../utils/ResponseBuilder";
import axios from "axios";
import { replace } from 'replace-xml-text';
let  parseString = require('xml2js').parseString;
let fs = require('fs');
import { MongoDatabase } from "../../database/mongodb";
import { raw } from "express";
import { ObjectId } from "mongodb";
let  md5 = require('md5');

@Injectable()
export class CurrenciesRepo {

  constructor(private readonly mongodb: MongoDatabase) {}

  async timeAgo(input): Promise<number> {

    const date = (input instanceof Date) ? input : new Date(input);
    const secondsElapsed = (date.getTime() - Date.now()) / 1000 / 60;
    let sE = Math.round(secondsElapsed);
    if (sE < 0) {
      sE = sE * -1;
    }
    return sE;

  }


  async commonCurrency(body: any) {
    return new Promise(async (resolve) => {


      let helloworld = [];

      let helloworldKeys = Object.keys(helloworld);


      for (let i = 0; i < helloworldKeys.length; i++) {

        let NameOfSymbol = helloworldKeys[i];

        let data = helloworld[NameOfSymbol];

        await this.mongodb.newCommonCurrencyDocument(data)

      }
      


    })
  }



  async currenciesList(body: any) {
    return new Promise(async (resolve) => {

      resolve({
        "AED": "United Arab Emirates Dirham",
        "AFN": "Afghan Afghani",
        "ALL": "Albanian Lek",
        "AMD": "Armenian Dram",
        "ANG": "Netherlands Antillean Guilder",
        "AOA": "Angolan Kwanza",
        "ARS": "Argentine Peso",
        "AUD": "Australian Dollar",
        "AWG": "Aruban Florin",
        "AZN": "Azerbaijani Manat",
        "BAM": "Bosnia-Herzegovina Convertible Mark",
        "BBD": "Barbadian Dollar",
        "BDT": "Bangladeshi Taka",
        "BGN": "Bulgarian Lev",
        "BHD": "Bahraini Dinar",
        "BIF": "Burundian Franc",
        "BMD": "Bermudan Dollar",
        "BND": "Brunei Dollar",
        "BOB": "Bolivian Boliviano",
        "BRL": "Brazilian Real",
        "BSD": "Bahamian Dollar",
        "BTC": "Bitcoin",
        "BTN": "Bhutanese Ngultrum",
        "BWP": "Botswanan Pula",
        "BYN": "Belarusian Ruble",
        "BZD": "Belize Dollar",
        "CAD": "Canadian Dollar",
        "CDF": "Congolese Franc",
        "CHF": "Swiss Franc",
        "CLF": "Chilean Unit of Account (UF)",
        "CLP": "Chilean Peso",
        "CNH": "Chinese Yuan (Offshore)",
        "CNY": "Chinese Yuan",
        "COP": "Colombian Peso",
        "CRC": "Costa Rican Colón",
        "CUC": "Cuban Convertible Peso",
        "CUP": "Cuban Peso",
        "CVE": "Cape Verdean Escudo",
        "CZK": "Czech Republic Koruna",
        "DJF": "Djiboutian Franc",
        "DKK": "Danish Krone",
        "DOP": "Dominican Peso",
        "DZD": "Algerian Dinar",
        "EGP": "Egyptian Pound",
        "ERN": "Eritrean Nakfa",
        "ETB": "Ethiopian Birr",
        "EUR": "Euro",
        "FJD": "Fijian Dollar",
        "FKP": "Falkland Islands Pound",
        "GBP": "British Pound Sterling",
        "GEL": "Georgian Lari",
        "GGP": "Guernsey Pound",
        "GHS": "Ghanaian Cedi",
        "GIP": "Gibraltar Pound",
        "GMD": "Gambian Dalasi",
        "GNF": "Guinean Franc",
        "GTQ": "Guatemalan Quetzal",
        "GYD": "Guyanaese Dollar",
        "HKD": "Hong Kong Dollar",
        "HNL": "Honduran Lempira",
        "HRK": "Croatian Kuna",
        "HTG": "Haitian Gourde",
        "HUF": "Hungarian Forint",
        "IDR": "Indonesian Rupiah",
        "ILS": "Israeli New Sheqel",
        "IMP": "Manx pound",
        "INR": "Indian Rupee",
        "IQD": "Iraqi Dinar",
        "IRR": "Iranian Rial",
        "ISK": "Icelandic Króna",
        "JEP": "Jersey Pound",
        "JMD": "Jamaican Dollar",
        "JOD": "Jordanian Dinar",
        "JPY": "Japanese Yen",
        "KES": "Kenyan Shilling",
        "KGS": "Kyrgystani Som",
        "KHR": "Cambodian Riel",
        "KMF": "Comorian Franc",
        "KPW": "North Korean Won",
        "KRW": "South Korean Won",
        "KWD": "Kuwaiti Dinar",
        "KYD": "Cayman Islands Dollar",
        "KZT": "Kazakhstani Tenge",
        "LAK": "Laotian Kip",
        "LBP": "Lebanese Pound",
        "LKR": "Sri Lankan Rupee",
        "LRD": "Liberian Dollar",
        "LSL": "Lesotho Loti",
        "LYD": "Libyan Dinar",
        "MAD": "Moroccan Dirham",
        "MDL": "Moldovan Leu",
        "MGA": "Malagasy Ariary",
        "MKD": "Macedonian Denar",
        "MMK": "Myanma Kyat",
        "MNT": "Mongolian Tugrik",
        "MOP": "Macanese Pataca",
        "MRU": "Mauritanian Ouguiya",
        "MUR": "Mauritian Rupee",
        "MVR": "Maldivian Rufiyaa",
        "MWK": "Malawian Kwacha",
        "MXN": "Mexican Peso",
        "MYR": "Malaysian Ringgit",
        "MZN": "Mozambican Metical",
        "NAD": "Namibian Dollar",
        "NGN": "Nigerian Naira",
        "NIO": "Nicaraguan Córdoba",
        "NOK": "Norwegian Krone",
        "NPR": "Nepalese Rupee",
        "NZD": "New Zealand Dollar",
        "OMR": "Omani Rial",
        "PAB": "Panamanian Balboa",
        "PEN": "Peruvian Nuevo Sol",
        "PGK": "Papua New Guinean Kina",
        "PHP": "Philippine Peso",
        "PKR": "Pakistani Rupee",
        "PLN": "Polish Zloty",
        "PYG": "Paraguayan Guarani",
        "QAR": "Qatari Rial",
        "RON": "Romanian Leu",
        "RSD": "Serbian Dinar",
        "RUB": "Russian Ruble",
        "RWF": "Rwandan Franc",
        "SAR": "Saudi Riyal",
        "SBD": "Solomon Islands Dollar",
        "SCR": "Seychellois Rupee",
        "SDG": "Sudanese Pound",
        "SEK": "Swedish Krona",
        "SGD": "Singapore Dollar",
        "SHP": "Saint Helena Pound",
        "SLL": "Sierra Leonean Leone",
        "SOS": "Somali Shilling",
        "SRD": "Surinamese Dollar",
        "SSP": "South Sudanese Pound",
        "STD": "São Tomé and Príncipe Dobra (pre-2018)",
        "STN": "São Tomé and Príncipe Dobra",
        "SVC": "Salvadoran Colón",
        "SYP": "Syrian Pound",
        "SZL": "Swazi Lilangeni",
        "THB": "Thai Baht",
        "TJS": "Tajikistani Somoni",
        "TMT": "Turkmenistani Manat",
        "TND": "Tunisian Dinar",
        "TOP": "Tongan Pa'anga",
        "TRY": "Turkish Lira",
        "TTD": "Trinidad and Tobago Dollar",
        "TWD": "New Taiwan Dollar",
        "TZS": "Tanzanian Shilling",
        "UAH": "Ukrainian Hryvnia",
        "UGX": "Ugandan Shilling",
        "USD": "United States Dollar",
        "UYU": "Uruguayan Peso",
        "UZS": "Uzbekistan Som",
        "VEF": "Venezuelan Bolívar Fuerte (Old)",
        "VES": "Venezuelan Bolívar Soberano",
        "VND": "Vietnamese Dong",
        "VUV": "Vanuatu Vatu",
        "WST": "Samoan Tala",
        "XAF": "CFA Franc BEAC",
        "XAG": "Silver Ounce",
        "XAU": "Gold Ounce",
        "XCD": "East Caribbean Dollar",
        "XDR": "Special Drawing Rights",
        "XOF": "CFA Franc BCEAO",
        "XPD": "Palladium Ounce",
        "XPF": "CFP Franc",
        "XPT": "Platinum Ounce",
        "YER": "Yemeni Rial",
        "ZAR": "South African Rand",
        "ZMW": "Zambian Kwacha",
        "ZWL": "Zimbabwean Dollar"
      })

    })
  }

  async http_currenciesBySymbols(base: any) {
    return new Promise(async (resolve) => {

      var config = {
        method: 'get',
        url: 'https://api.apilayer.com/fixer/latest?base='+base,
        headers: {
          'apikey': 'YAIZvMz69eNEqHZASOZ4Hn2slPZ30FQ3'
        }
      };

      axios(config)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

    })
  }



  async currenciesBySymbols(body: any) {
    return new Promise(async (resolve) => {

      let isCurrenciesAvb = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: body.base } })
      let currenciesAvbLength = isCurrenciesAvb.length;

      if(currenciesAvbLength == 0){

        console.log(currenciesAvbLength);

        let http_data = await this.http_currenciesBySymbols(body.base);

        http_data['lastModified'] = new Date();

        console.log(http_data);

        await this.mongodb.newCurrenciesManagementDocument(http_data);

        let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: body.base } })

        resolve(currencies[0]);

      }
      else{

        console.log(currenciesAvbLength);

        let timeAgo = await this.timeAgo(isCurrenciesAvb[0].lastModified);

        console.log(timeAgo);

        if (timeAgo >= 6000){

          let http_data = await this.http_currenciesBySymbols(body.base);
          http_data['lastModified'] = new Date();

          console.log(http_data);

          await this.mongodb.updateCurrenciesManagementDocument({ "base": body.base }, { $set: http_data });

          let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: body.base } })
          resolve(currencies[0]);

        }
        else
        {


          let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: body.base } })
          resolve(currencies[0]);

        }


      }

    })
  }


  async convertPriceToBase(base: any, Price: any) {
    return new Promise(async (resolve) => {

      let priceBase = Price.slice(0, 3);
      let price = Price.slice(3, 10);

      let isCurrenciesAvb = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: priceBase } })
      let currenciesAvbLength = isCurrenciesAvb.length;

      if(currenciesAvbLength == 0){

        console.log(currenciesAvbLength);

        let http_data = await this.http_currenciesBySymbols(priceBase);

        http_data['lastModified'] = new Date();

        console.log(http_data);

        await this.mongodb.newCurrenciesManagementDocument(http_data);

        let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: priceBase } })

        resolve(currencies[0]);

      }
      else{

        console.log(currenciesAvbLength);

        let timeAgo = await this.timeAgo(isCurrenciesAvb[0].lastModified);

        console.log(timeAgo);

        if (timeAgo >= 6000){

          let http_data = await this.http_currenciesBySymbols(priceBase);
          http_data['lastModified'] = new Date();

          console.log(http_data);

          await this.mongodb.updateCurrenciesManagementDocument({ "base": priceBase }, { $set: http_data });

          let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: priceBase } })

          let cur_priceBase = currencies[0]['rates'][base];
          let original = price * cur_priceBase

          let cur_data = {
            hotelPrice: price,
            from: priceBase,
            To: base,
            marketRate : cur_priceBase,
            price: original,
          }

          resolve(cur_data);

        }
        else
        {


          let currencies = await this.mongodb.findCurrenciesManagementDocument({ "base": { $eq: priceBase } })

          let cur_priceBase = currencies[0]['rates'][base];
          let original = price * cur_priceBase

          let cur_data = {
            hotelPrice: price,
            from: priceBase,
            To: base,
            marketRate : cur_priceBase,
            price: original,
          }

          resolve(cur_data);

        }


      }

    })
  }

}
