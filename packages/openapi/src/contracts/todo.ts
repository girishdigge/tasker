import {
  ZPopulatedTodo,
  ZTodo,
  ZTodoMetadata,
  ZTodoPriority,
  ZTodoStatus,
  ZTodoStats,
} from '@tasker/zod';
import { z } from 'zod';

import { getSecurityRequirements } from '../utils.js';
import { paginatedResponseSchema } from './pagination.js';

const security = getSecurityRequirements();

export const ZPaginatedTodos = paginatedResponseSchema(ZPopulatedTodo);

/** Request schemas are derived from the shared response schema to keep field
 * names and basic types aligned with the Go JSON contract. Server-owned fields
 * (id, userId, timestamps, completedAt and sortOrder) are intentionally absent.
 */
export const createTodoRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).nullable().optional(),
  priority: ZTodoPriority.optional(),
  dueDate: ZTodo.shape.dueDate.optional(),
  parentTodoId: ZTodo.shape.parentTodoId.optional(),
  categoryId: ZTodo.shape.categoryId.optional(),
  metadata: ZTodoMetadata.nullable().optional(),
});

// The current Go PATCH DTOs use pointers, so an omitted field means
// "unchanged". They do not yet distinguish an explicit JSON null from an
// omitted field; nullable relationship/description clearing is therefore
// intentionally not advertised here.
export const updateTodoRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  status: ZTodoStatus.optional(),
  priority: ZTodoPriority.optional(),
  dueDate: ZTodo.shape.dueDate.unwrap().optional(),
  parentTodoId: z.uuid().optional(),
  categoryId: z.uuid().optional(),
  metadata: ZTodoMetadata.optional(),
});

const todoIDParams = z.object({
  id: z.uuid(),
});

export const todoCollectionPath = {
  get: {
    operationId: 'getTodos',
    summary: 'Get todos',
    description:
      'Get the authenticated user’s todos with filtering, sorting and pagination.',
    tags: ['Todos'],
    security,
    requestParams: {
      query: z.object({
        page: z.number().int().min(1).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        sort: z
          .enum([
            'created_at',
            'updated_at',
            'title',
            'priority',
            'due_date',
            'status',
          ])
          .optional(),
        order: z.enum(['asc', 'desc']).optional(),
        search: z.string().min(1).optional(),
        status: ZTodoStatus.optional(),
        priority: ZTodoPriority.optional(),
        categoryId: z.uuid().optional(),
        parentTodoId: z.uuid().optional(),
        dueFrom: z.iso.datetime({ offset: true }).optional(),
        dueTo: z.iso.datetime({ offset: true }).optional(),
        overdue: z.boolean().optional(),
        completed: z.boolean().optional(),
      }),
    },
    responses: {
      '200': {
        description: 'Paginated list of todos.',
        content: {
          'application/json': {
            schema: ZPaginatedTodos,
          },
        },
      },
    },
  },
  post: {
    operationId: 'createTodo',
    summary: 'Create a todo',
    description: 'Create a todo for the authenticated user.',
    tags: ['Todos'],
    security,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: createTodoRequestSchema,
        },
      },
    },
    responses: {
      '201': {
        description: 'Todo created successfully.',
        content: {
          'application/json': {
            schema: ZTodo,
          },
        },
      },
    },
  },
};

export const todoStatsPath = {
  get: {
    operationId: 'getTodoStats',
    summary: 'Get todo statistics',
    description:
      'Get task counts by status and overdue count for the authenticated user.',
    tags: ['Todos'],
    security,
    responses: {
      '200': {
        description: 'Todo statistics.',
        content: {
          'application/json': {
            schema: ZTodoStats,
          },
        },
      },
    },
  },
};

export const todoItemPath = {
  get: {
    operationId: 'getTodoById',
    summary: 'Get a todo',
    description: 'Get a todo and its populated relationships by ID.',
    tags: ['Todos'],
    security,
    requestParams: {
      path: todoIDParams,
    },
    responses: {
      '200': {
        description: 'Todo details.',
        content: {
          'application/json': {
            schema: ZPopulatedTodo,
          },
        },
      },
    },
  },
  patch: {
    operationId: 'updateTodo',
    summary: 'Update a todo',
    description: 'Partially update a todo owned by the authenticated user.',
    tags: ['Todos'],
    security,
    requestParams: {
      path: todoIDParams,
    },
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: updateTodoRequestSchema,
        },
      },
    },
    responses: {
      '200': {
        description: 'Todo updated successfully.',
        content: {
          'application/json': {
            schema: ZTodo,
          },
        },
      },
    },
  },
  delete: {
    operationId: 'deleteTodo',
    summary: 'Delete a todo',
    description: 'Delete a todo owned by the authenticated user.',
    tags: ['Todos'],
    security,
    requestParams: {
      path: todoIDParams,
    },
    responses: {
      '204': {
        description: 'Todo deleted successfully. No response body.',
      },
    },
  },
};
