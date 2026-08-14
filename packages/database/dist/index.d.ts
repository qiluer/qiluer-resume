export * from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { Prisma } from './generated/prisma/client';
/**
 * Prisma 客户端选项
 * @param adapter Prisma 数据库适配器实例
 * @param log 日志级别数组
 */
export type PrismaClientOptions = {
    adapter: ReturnType<typeof createAdapter>;
    log?: Prisma.LogLevel[];
};
/**
 * 创建 Prisma 数据库适配器
 * @param dbUrl 数据库连接字符串
 * @returns Prisma 数据库适配器实例
 */
export declare function createAdapter(dbUrl: string): PrismaPg;
/**
 * 获取 Prisma 客户端选项
 * @param dbUrl 数据库连接字符串
 * @returns Prisma 客户端选项
 */
export declare function getPrismaClientOptions(dbUrl: string): PrismaClientOptions;
//# sourceMappingURL=index.d.ts.map