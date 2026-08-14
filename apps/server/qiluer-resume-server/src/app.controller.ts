import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AppService } from '@/app.service';
import { RespondDataVO } from '@qiluer-resume/dto/dtos/respond';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@AllowAnonymous()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '检查服务健康状态' })
  @ApiOkResponse({ description: '返回健康状态', type: RespondDataVO })
  @Get('health-check')
  getHealthCheck(): string {
    return this.appService.getHealthCheck();
  }
}
