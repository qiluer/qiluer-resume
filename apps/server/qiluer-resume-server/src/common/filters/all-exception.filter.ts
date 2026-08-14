import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { RespondDataVO } from '@qiluer-resume/dto/dtos/respond';
import { ErrorCodeEnum } from '@qiluer-resume/dto';
import { BusinessException } from '@/common/errors/business.exception';
import { ERROR_CODE_MESSAGE_MAP } from '../enums/error-code-message';

/**
 * 全局异常过滤器
 * - 捕获 HttpException（含 BusinessException） → 取 customCode / message 包装
 * - 捕获其他未知错误 → 统一归为 ErrorCodeEnum.服务内部错误
 * - HTTP 状态恒 200（与 FormatResponseInterceptor 一致），业务状态由 code 字段表达
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let customCode: ErrorCodeEnum;
    let message: string;

    if (exception instanceof BusinessException) {
      const res = exception.getResponse() as { customCode: ErrorCodeEnum; message: string };
      customCode = res.customCode;
      message = res.message;
    } else if (exception instanceof HttpException) {
      // NestJS 内置 HttpException（NotFoundException / ZodValidationPipe 等）
      const res = exception.getResponse() as string | { message: string | string[] };
      const raw = typeof res === 'string' ? res : res?.message;
      message = Array.isArray(raw) ? raw.join(',') : (raw ?? exception.message);
      const StatusCodeMap: Record<number, ErrorCodeEnum> = {
        [HttpStatus.UNAUTHORIZED]: ErrorCodeEnum.未登录,
        [HttpStatus.FORBIDDEN]: ErrorCodeEnum.无权限访问,
        [HttpStatus.NOT_FOUND]: ErrorCodeEnum.资源不存在,
      };
      customCode = StatusCodeMap[exception.getStatus()];
      // 错误若属于StatusCodeMap，message 对前端脱敏
      if (customCode) {
        message = ERROR_CODE_MESSAGE_MAP[customCode];
      } else {
        customCode = ErrorCodeEnum.参数校验失败;
      }
    } else {
      // 未知错误：归为服务内部错误，message 对前端脱敏
      this.logger.error(exception);
      customCode = ErrorCodeEnum.服务内部错误;
      message = '服务内部错误';
    }

    response.statusCode = HttpStatus.OK;
    const body: RespondDataVO = { code: customCode, message, data: {} };
    response.json(body);
  }
}
