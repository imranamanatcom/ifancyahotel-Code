import STATUSCODE from '../constants/StatusCode';
import MESSAGE from '../constants/Messages';
import CONSTANTS from '../constants/Constants'


export class ResponseBuilder{

  static successResponse(dataKey:string,data:any):any{
    return {[dataKey]:data, [CONSTANTS.KEY_SUCCESS]:true, [CONSTANTS.KEY_STATUSCODE]:STATUSCODE.SUCCESS, [CONSTANTS.KEY_MESSAGE]:MESSAGE.NO_ERROR}
  }

  static errorResponse(dataKey:string,data:any):any{
    return {[dataKey]:data, [CONSTANTS.KEY_SUCCESS]:false, [CONSTANTS.KEY_STATUSCODE]:STATUSCODE.BAD_REQUEST}
  }

  static errorMultiResponse(dataKey:string,data:any, dataKey1:string,data1:any):any{
    return {[dataKey]:data, [dataKey1]:data1, [CONSTANTS.KEY_SUCCESS]:false, [CONSTANTS.KEY_STATUSCODE]:STATUSCODE.BAD_REQUEST}
  }

  static successResponseMessage(statuscode, message):any{
    return {[CONSTANTS.KEY_SUCCESS]:true, [CONSTANTS.KEY_STATUSCODE]:statuscode, [CONSTANTS.KEY_MESSAGE]:message}
  }

  static errorResponseMessage(statuscode, message):any{
    return {[CONSTANTS.KEY_SUCCESS]:false, [CONSTANTS.KEY_STATUSCODE]:statuscode, [CONSTANTS.KEY_MESSAGE]:message}
  }

}
