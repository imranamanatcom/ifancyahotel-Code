export declare class AmazonSDK {
    db: any;
    Accesskey: string;
    SecretAccess: string;
    BUCKET_NAME: string;
    amazons3: any;
    constructor();
    checkBucket(): Promise<any>;
    amazonUploadFromURLToS3(url: any, folder: any, filename: any): Promise<any>;
}
