"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondDataSchema = void 0;
// Pure Zod schemas — zero NestJS dependency, shared by frontend & backend
const zod_1 = require("zod");
exports.respondDataSchema = zod_1.z.object({
    code: zod_1.z.number().describe('业务状态码，0 表示成功'),
    message: zod_1.z.string().describe('提示信息'),
    data: zod_1.z.unknown().describe('业务数据'),
});
//# sourceMappingURL=schemas.js.map