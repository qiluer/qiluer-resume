// Pure Zod schemas — zero NestJS dependency, shared by frontend & backend
import { z } from 'zod';

/** 所有 JSON API 成功响应使用的唯一业务码。 */
export const SUCCESS_CODE = 0 as const;

/** 创建统一响应 Schema。 */
export function createRespondDataSchema<TData extends z.ZodType>(dataSchema: TData) {
  return z.object({
    code: z.literal(SUCCESS_CODE).meta({
      description: '业务状态码',
      examples: [SUCCESS_CODE],
    }),
    message: z.string().meta({
      description: '响应消息',
      examples: ['success'],
    }),
    data: dataSchema.meta({
      description: '响应数据',
    }),
  });
}

/** 包含成功和失败结果的通用响应 Schema，供客户端在判断业务码前解析。 */
export const respondDataSchema = z.object({
  code: z.number().meta({
    description: '业务状态码，0 表示成功',
    examples: [SUCCESS_CODE],
  }),
  message: z.string().meta({
    description: '响应消息',
    examples: ['success'],
  }),
  data: z.unknown().meta({
    description: '响应数据',
  }),
});

/** 统一响应类型。 */
export type RespondDataType<TData = Record<string, unknown>> = {
  code: number;
  message: string;
  data: TData;
};
