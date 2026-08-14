import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    UserName: z.ZodString;
}, z.core.$strip>;
export type CreateUserDtoType = z.infer<typeof createUserSchema>;
