import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Redis 服务
 * - 基于 ioredis 客户端；通过 ConfigService 从 .env 读取连接配置
 * - 启动期在 onModuleInit 主动建立连接；连接失败仅记录日志，不阻塞应用启动
 * - 模块销毁时优雅 quit，释放 socket
 * - 暴露 9 个高频基础方法 + getClient() 透传原生客户端，覆盖大多数缓存/计数器/分布式锁场景
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private readonly host: string;
  private readonly port: number;
  private readonly db: number;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('redis_server_host');
    const port = this.configService.get<number>('redis_server_port');
    const db = this.configService.get<number>('redis_server_db');

    if (!host || !port) {
      throw new Error('RedisService: redis 配置缺失，请检查 .env 中的 redis_server_host / redis_server_port');
    }

    this.host = host;
    this.port = Number(port);
    this.db = Number(db ?? 0);

    // 构造期不连接，连接延后到 onModuleInit，与 PrismaService 保持一致
    // ioredis 默认内置 retryStrategy（指数退避，无限重试），无需自定义
    this.client = new Redis({
      host: this.host,
      port: this.port,
      db: this.db,
      lazyConnect: true,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.log(`✅ Redis connected: ${this.host}:${this.port}/${this.db}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Redis 属于辅助能力，启动期不可达不应阻塞主链路
      this.logger.error(`❌ Redis connect failed: ${message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis quit failed: ${message}`);
    }
  }

  /**
   * 读取键值；键不存在时返回 null
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * 写入键值；ttl（秒）通过 SET ... EX 一条命令完成，避免 SET + EXPIRE 非原子导致的中间态
   * @param ttl 可选过期时间（秒），不传则永不过期
   */
  async set(key: string, value: string | number, ttl?: number): Promise<void> {
    if (ttl !== undefined && ttl > 0) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * 仅当键不存在时设置；常用于分布式锁、幂等控制
   * @returns true 表示设置成功（此前不存在），false 表示键已存在
   */
  async setNX(key: string, value: string | number, ttl?: number): Promise<boolean> {
    const result = ttl !== undefined && ttl > 0 ? await this.client.set(key, value, 'EX', ttl, 'NX') : await this.client.set(key, value, 'NX');
    return result === 'OK';
  }

  /**
   * 删除一个或多个键
   * @returns 受影响的键数量
   */
  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return await this.client.del(...keys);
  }

  /**
   * 判断键是否存在
   */
  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) > 0;
  }

  /**
   * 设置键的过期时间（秒）
   * @returns true 表示设置成功，false 表示键不存在
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    return (await this.client.expire(key, ttl)) === 1;
  }

  /**
   * 获取键的剩余过期时间（秒）
   * - -1：键存在但无过期时间
   * - -2：键不存在
   */
  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  /**
   * 自增 1
   */
  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  /**
   * 自减 1
   */
  async decr(key: string): Promise<number> {
    return await this.client.decr(key);
  }

  /**
   * 健康检查
   */
  async ping(): Promise<string> {
    return await this.client.ping();
  }

  /**
   * 透传原生 ioredis 客户端，供 Hash/List/Set/Stream/PubSub 等高级场景直接使用
   */
  getClient(): Redis {
    return this.client;
  }
}
