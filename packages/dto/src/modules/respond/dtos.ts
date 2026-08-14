// NestJS-specific DTO wrappers
import { createZodDto } from 'nestjs-zod/dto';
import { respondDataSchema } from './schemas';

export class RespondDataVO extends createZodDto(respondDataSchema) {}
