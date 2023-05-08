export declare class ResponseBuilder {
    static successResponse(dataKey: string, data: any): any;
    static errorResponse(dataKey: string, data: any): any;
    static errorMultiResponse(dataKey: string, data: any, dataKey1: string, data1: any): any;
    static successResponseMessage(statuscode: any, message: any): any;
    static errorResponseMessage(statuscode: any, message: any): any;
}
