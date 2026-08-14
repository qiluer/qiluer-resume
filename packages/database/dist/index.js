"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdapter = createAdapter;
exports.getPrismaClientOptions = getPrismaClientOptions;
__exportStar(require("./generated/prisma/client"), exports);
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
/**
 * 创建 Prisma 数据库适配器
 * @param dbUrl 数据库连接字符串
 * @returns Prisma 数据库适配器实例
 */
function createAdapter(dbUrl) {
    const pool = new pg_1.Pool({ connectionString: dbUrl }); // 先创建 Pool 实例
    return new adapter_pg_1.PrismaPg(pool); // 再传入 PrismaPg
}
/**
 * 获取 Prisma 客户端选项
 * @param dbUrl 数据库连接字符串
 * @returns Prisma 客户端选项
 */
function getPrismaClientOptions(dbUrl) {
    return { adapter: createAdapter(dbUrl) };
}
//# sourceMappingURL=index.js.map