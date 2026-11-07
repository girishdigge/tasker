import { createDocument } from 'zod-openapi';
import type { oas32 } from 'zod-openapi';
import {
  HealthCheckSchema,
  HealthResponseSchema,
  ZPopulatedTodo,
  ZTodo,
  ZTodoAttachment,
  ZTodoCategory,
  ZTodoComment,
  ZTodoMetadata,
  ZTodoPriority,
  ZTodoStats,
  ZTodoStatus,
} from '@tasker/zod';

import { paths } from './contracts/index.js';
import { ZPaginatedCategories } from './contracts/category.js';
import { ZPaginatedTodos } from './contracts/todo.js';

export const OpenAPI: oas32.OpenAPIObject = createDocument({
  openapi: '3.1.0',

  info: {
    version: '1.0.0',
    title: 'Tasker REST API',
    description:
      'Tasker REST API for managing personal todos, categories and comments.',
  },

  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Local Server',
    },
  ],

  tags: [
    { name: 'Health', description: 'Service health endpoints.' },
    { name: 'Todos', description: 'Todo management and statistics.' },
    { name: 'Categories', description: 'Todo category management.' },
    { name: 'Comments', description: 'Comments attached to todos.' },
  ],

  paths,

  components: {
    schemas: {
      HealthCheck: HealthCheckSchema,
      HealthResponse: HealthResponseSchema,
      Todo: ZTodo,
      PopulatedTodo: ZPopulatedTodo,
      TodoMetadata: ZTodoMetadata,
      TodoPriority: ZTodoPriority,
      TodoStatus: ZTodoStatus,
      TodoAttachment: ZTodoAttachment,
      TodoCategory: ZTodoCategory,
      TodoComment: ZTodoComment,
      TodoStats: ZTodoStats,
      PaginatedTodos: ZPaginatedTodos,
      PaginatedCategories: ZPaginatedCategories,
    },

    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },

      'x-service-token': {
        type: 'apiKey',
        name: 'x-service-token',
        in: 'header',
      },
    },
  },
});

export { getSecurityRequirements } from './utils.js';
