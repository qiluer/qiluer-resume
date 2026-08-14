"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodeEnum = void 0;
/**
 * 业务错误码枚举
 * - 主要服务于服务端抛出与分类
 * - 前端可按需 import 复用，识别到特殊码做差异化处理（如：token 过期跳转登录）
 * - HTTP 状态码统一为 200，业务状态完全由 code 字段表达（前端不会处理 401/403/404 等 HTTP 状态）
 */
var ErrorCodeEnum;
(function (ErrorCodeEnum) {
    // ===== 通用段 1xxxx =====
    ErrorCodeEnum[ErrorCodeEnum["\u5176\u4ED6\u9519\u8BEF"] = 10000] = "\u5176\u4ED6\u9519\u8BEF";
    ErrorCodeEnum[ErrorCodeEnum["\u53C2\u6570\u6821\u9A8C\u5931\u8D25"] = 10001] = "\u53C2\u6570\u6821\u9A8C\u5931\u8D25";
    ErrorCodeEnum[ErrorCodeEnum["\u8BF7\u6C42\u65B9\u6CD5\u4E0D\u88AB\u5141\u8BB8"] = 10002] = "\u8BF7\u6C42\u65B9\u6CD5\u4E0D\u88AB\u5141\u8BB8";
    ErrorCodeEnum[ErrorCodeEnum["\u8D44\u6E90\u4E0D\u5B58\u5728"] = 10004] = "\u8D44\u6E90\u4E0D\u5B58\u5728";
    ErrorCodeEnum[ErrorCodeEnum["\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41"] = 10005] = "\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41";
    // ===== 鉴权段 2xxxx =====
    ErrorCodeEnum[ErrorCodeEnum["\u672A\u767B\u5F55"] = 20001] = "\u672A\u767B\u5F55";
    ErrorCodeEnum[ErrorCodeEnum["Token\u5DF2\u8FC7\u671F"] = 20002] = "Token\u5DF2\u8FC7\u671F";
    ErrorCodeEnum[ErrorCodeEnum["Token\u65E0\u6548"] = 20003] = "Token\u65E0\u6548";
    ErrorCodeEnum[ErrorCodeEnum["\u65E0\u6743\u9650\u8BBF\u95EE"] = 20004] = "\u65E0\u6743\u9650\u8BBF\u95EE";
    // ===== 业务段 3xxxx（按模块继续扩展）=====
    ErrorCodeEnum[ErrorCodeEnum["\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF"] = 30001] = "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF";
    ErrorCodeEnum[ErrorCodeEnum["\u7528\u6237\u5DF2\u5B58\u5728"] = 30002] = "\u7528\u6237\u5DF2\u5B58\u5728";
    ErrorCodeEnum[ErrorCodeEnum["\u90AE\u7BB1\u5DF2\u88AB\u6CE8\u518C"] = 30003] = "\u90AE\u7BB1\u5DF2\u88AB\u6CE8\u518C";
    ErrorCodeEnum[ErrorCodeEnum["\u7528\u6237\u540D\u5DF2\u5B58\u5728"] = 30004] = "\u7528\u6237\u540D\u5DF2\u5B58\u5728";
    ErrorCodeEnum[ErrorCodeEnum["\u7528\u6237\u4E0D\u5B58\u5728"] = 30005] = "\u7528\u6237\u4E0D\u5B58\u5728";
    ErrorCodeEnum[ErrorCodeEnum["\u90AE\u7BB1\u672A\u9A8C\u8BC1"] = 30006] = "\u90AE\u7BB1\u672A\u9A8C\u8BC1";
    ErrorCodeEnum[ErrorCodeEnum["\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF"] = 30007] = "\u90AE\u7BB1\u6216\u5BC6\u7801\u9519\u8BEF";
    // ===== 服务端段 5xxxx =====
    ErrorCodeEnum[ErrorCodeEnum["\u670D\u52A1\u5185\u90E8\u9519\u8BEF"] = 50000] = "\u670D\u52A1\u5185\u90E8\u9519\u8BEF";
    ErrorCodeEnum[ErrorCodeEnum["\u6570\u636E\u5E93\u5F02\u5E38"] = 50001] = "\u6570\u636E\u5E93\u5F02\u5E38";
    ErrorCodeEnum[ErrorCodeEnum["\u7B2C\u4E09\u65B9\u670D\u52A1\u5F02\u5E38"] = 50002] = "\u7B2C\u4E09\u65B9\u670D\u52A1\u5F02\u5E38";
})(ErrorCodeEnum || (exports.ErrorCodeEnum = ErrorCodeEnum = {}));
//# sourceMappingURL=codes.js.map