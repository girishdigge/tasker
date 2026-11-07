import { z } from 'zod';

/**
 * The API pagination envelope mirrors model.PaginatedResponse[T] in Go.
 * Keep this schema local to the OpenAPI package unless the same envelope is
 * also needed for runtime validation in @tasker/zod.
 */
export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });
