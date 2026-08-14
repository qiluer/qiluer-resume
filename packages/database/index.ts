export * from './generated/prisma/client';
import { Pool } from 'pg';

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
export function createAdapter(dbUrl: string) {
  const pool = new Pool({ connectionString: dbUrl }); // 先创建 Pool 实例
  return new PrismaPg(pool); // 再传入 PrismaPg
}
/**
 * 获取 Prisma 客户端选项
 * @param dbUrl 数据库连接字符串
 * @returns Prisma 客户端选项
 */
export function getPrismaClientOptions(dbUrl: string): PrismaClientOptions {
  return { adapter: createAdapter(dbUrl) };
}
