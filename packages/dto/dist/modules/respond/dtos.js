"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespondDataVO = void 0;
// NestJS-specific DTO wrappers
const dto_1 = require("nestjs-zod/dto");
const schemas_1 = require("./schemas");
class RespondDataVO extends (0, dto_1.createZodDto)(schemas_1.respondDataSchema) {
}
exports.RespondDataVO = RespondDataVO;
//# sourceMappingURL=dtos.js.map