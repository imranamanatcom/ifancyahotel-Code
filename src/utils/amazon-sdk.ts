import { Injectable, Inject } from '@nestjs/common';

import fetch  from 'node-fetch';
const AWS = require('aws-sdk');


@Injectable()
export class AmazonSDK {


  public db: any;
  public Accesskey: string;
  public SecretAccess: string;
  public BUCKET_NAME: string;
  public amazons3: any;

  constructor() {
    this.Accesskey = "AKIAUCLQCPXIBMPZWESC";
    this.SecretAccess = "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";
    this.BUCKET_NAME = "ifancyhotels";

    this.amazons3 = new AWS.S3({ accessKeyId: this.Accesskey, secretAccessKey: this.SecretAccess });

  };

  async checkBucket(): Promise<any> {

    const params = {
      Bucket: this.BUCKET_NAME,
      CreateBucketConfiguration: {
        LocationConstraint: "eu-west-1"
      }
    };

    await this.amazons3.createBucket(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log('Bucket Created Successfully', data.Location);
    });

  }

  async amazonUploadFromURLToS3(url, folder,filename): Promise<any> {

    const imageURL = url
    const res = await fetch(imageURL)
    const blob = await res.buffer()

    const uploadedImage = await this.amazons3.upload({
      Bucket: this.BUCKET_NAME+"/hotelimages"+folder,
      Key: filename,
      Body: blob,
    }).promise()

    return uploadedImage.Location;

  }


}
