import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RespondDataVO } from '@qiluer-resume/dto/dtos/respond';

/**成功响应格式 */
@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<RespondDataVO> {
    const response = context.switchToHttp().getResponse<Response>();
    response.statusCode = HttpStatus.OK;
    return next.handle().pipe(
      map((data) => {
        const res: RespondDataVO = {
          code: 200,
          message: 'success',
          data: data,
        };
        return res;
      }),
    );
  }
}
