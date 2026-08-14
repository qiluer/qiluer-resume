// Pure Zod schemas — zero NestJS dependency, shared by frontend & backend
import { z } from 'zod';

export const respondDataSchema = z.object({
  code: z.number().describe('业务状态码，0 表示成功'),
  message: z.string().describe('提示信息'),
  data: z.unknown().describe('业务数据'),
});

export type RespondDataType = z.infer<typeof respondDataSchema>;
