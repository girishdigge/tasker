import { HealthResponseSchema } from '@tasker/zod';

export const healthPath = {
  get: {
    operationId: 'getHealth',
    summary: 'Get health',
    description: 'Get health status',
    tags: ['Health'],

    responses: {
      200: {
        description: 'Health status',
        content: {
          'application/json': {
            schema: HealthResponseSchema,
          },
        },
      },
    },
  },
};
