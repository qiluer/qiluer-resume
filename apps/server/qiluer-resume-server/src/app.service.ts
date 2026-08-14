import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**检查服务健康状态 */
  getHealthCheck(): string {
    return `服务正常运行: ${new Date().toISOString()}`;
  }
}
