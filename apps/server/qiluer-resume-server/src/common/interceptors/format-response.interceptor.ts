import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUCCESS_CODE, type RespondDataType } from '@qiluer-resume/dto/schemas/respond';

/**成功响应格式 */
@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept<TData>(context: ExecutionContext, next: CallHandler<TData>): Observable<RespondDataType<TData>> {
    const response = context.switchToHttp().getResponse<Response>();
    response.statusCode = HttpStatus.OK;
    return next.handle().pipe(
      map((data) => {
        const res: RespondDataType<TData> = {
          code: SUCCESS_CODE,
          message: 'success',
          data,
        };
        return res;
      }),
    );
  }
}
