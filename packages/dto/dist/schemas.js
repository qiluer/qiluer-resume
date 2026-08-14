"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
// Pure Zod schemas — zero NestJS dependency, shared by frontend & backend
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    UserName: zod_1.z
        .string({ message: 'UserName must be a string' })
        .min(3, { message: 'UserName must be at least 3 characters long' }),
});
//# sourceMappingURL=schemas.js.map