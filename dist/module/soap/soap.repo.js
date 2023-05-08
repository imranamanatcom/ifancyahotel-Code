"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoapRepo = void 0;
const common_1 = require("@nestjs/common");
var parseString = require('xml2js').parseString;
let fs = require('fs');
let SoapRepo = class SoapRepo {
    getHello(data) {
        let dataValues = data;
        return new Promise(async (resolve) => {
            try {
                resolve({ name: "imran" });
            }
            catch (e) {
                console.log('Error:', e.stack);
            }
        });
    }
};
SoapRepo = __decorate([
    (0, common_1.Injectable)()
], SoapRepo);
exports.SoapRepo = SoapRepo;
//# sourceMappingURL=soap.repo.js.map