"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonSDK = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
const AWS = require('aws-sdk');
let AmazonSDK = class AmazonSDK {
    constructor() {
        this.Accesskey = "AKIAUCLQCPXIBMPZWESC";
        this.SecretAccess = "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";
        this.BUCKET_NAME = "ifancyhotels";
        this.amazons3 = new AWS.S3({ accessKeyId: this.Accesskey, secretAccessKey: this.SecretAccess });
    }
    ;
    async checkBucket() {
        const params = {
            Bucket: this.BUCKET_NAME,
            CreateBucketConfiguration: {
                LocationConstraint: "eu-west-1"
            }
        };
        await this.amazons3.createBucket(params, function (err, data) {
            if (err)
                console.log(err, err.stack);
            else
                console.log('Bucket Created Successfully', data.Location);
        });
    }
    async amazonUploadFromURLToS3(url, folder, filename) {
        const imageURL = url;
        const res = await (0, node_fetch_1.default)(imageURL);
        const blob = await res.buffer();
        const uploadedImage = await this.amazons3.upload({
            Bucket: this.BUCKET_NAME + "/hotelimages" + folder,
            Key: filename,
            Body: blob,
        }).promise();
        return uploadedImage.Location;
    }
};
AmazonSDK = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AmazonSDK);
exports.AmazonSDK = AmazonSDK;
//# sourceMappingURL=amazon-sdk.js.map