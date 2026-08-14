import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodeEnum } from '@qiluer-resume/dto';
import { ERROR_CODE_MESSAGE_MAP } from '@/common/enums/error-code-message';

/**
 * 业务异常
 * - 继承自 HttpException，完美兼容 NestJS 异常链路
 * - 默认 message 取自 ERROR_CODE_MESSAGE_MAP，调用方可显式覆盖
 * - HTTP 状态固定传 HttpStatus.OK（仅为满足 HttpException 构造签名，实际响应状态由过滤器统一覆盖为 200）
 */
export class BusinessException extends HttpException {
  constructor(
    public readonly customCode: ErrorCodeEnum = ErrorCodeEnum.其他错误,
    message?: string,
  ) {
    super({ customCode, message: message ?? ERROR_CODE_MESSAGE_MAP[customCode] }, HttpStatus.OK);
  }
}
