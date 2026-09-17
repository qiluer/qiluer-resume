import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AppService } from '@/app.service.js';
import { respondDataSchema } from '@qiluer-resume/dto/schemas/respond';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@AllowAnonymous()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '检查服务健康状态' })
  @ApiOkResponse({ description: '返回健康状态', standardSchema: respondDataSchema })
  @Get('health-check')
  getHealthCheck(): string {
    return this.appService.getHealthCheck();
  }
}
