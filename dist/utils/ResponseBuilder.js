"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = void 0;
const StatusCode_1 = require("../constants/StatusCode");
const Messages_1 = require("../constants/Messages");
const Constants_1 = require("../constants/Constants");
class ResponseBuilder {
    static successResponse(dataKey, data) {
        return { [dataKey]: data, [Constants_1.default.KEY_SUCCESS]: true, [Constants_1.default.KEY_STATUSCODE]: StatusCode_1.default.SUCCESS, [Constants_1.default.KEY_MESSAGE]: Messages_1.default.NO_ERROR };
    }
    static errorResponse(dataKey, data) {
        return { [dataKey]: data, [Constants_1.default.KEY_SUCCESS]: false, [Constants_1.default.KEY_STATUSCODE]: StatusCode_1.default.BAD_REQUEST };
    }
    static errorMultiResponse(dataKey, data, dataKey1, data1) {
        return { [dataKey]: data, [dataKey1]: data1, [Constants_1.default.KEY_SUCCESS]: false, [Constants_1.default.KEY_STATUSCODE]: StatusCode_1.default.BAD_REQUEST };
    }
    static successResponseMessage(statuscode, message) {
        return { [Constants_1.default.KEY_SUCCESS]: true, [Constants_1.default.KEY_STATUSCODE]: statuscode, [Constants_1.default.KEY_MESSAGE]: message };
    }
    static errorResponseMessage(statuscode, message) {
        return { [Constants_1.default.KEY_SUCCESS]: false, [Constants_1.default.KEY_STATUSCODE]: statuscode, [Constants_1.default.KEY_MESSAGE]: message };
    }
}
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=ResponseBuilder.js.map