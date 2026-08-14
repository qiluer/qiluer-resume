import { z } from 'zod';
export declare const respondDataSchema: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: z.ZodUnknown;
}, z.core.$strip>;
export type RespondDataType = z.infer<typeof respondDataSchema>;
//# sourceMappingURL=schemas.d.ts.map