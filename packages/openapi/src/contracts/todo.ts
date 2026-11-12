import {
  ZPopulatedTodo,
  ZTodo,
  ZTodoAttachment,
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

// Create todo
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

// Update todo
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

// Upload attachment
export const uploadTodoAttachmentRequestSchema = z.object({
  file: z.file().meta({
    description: 'File to upload and attach to the todo.',
  }),
});

// Download attachment response
export const getAttachmentPresignedURLResponseSchema = z.object({
  url: z.url(),
});

// Path parameter schemas

const todoIDParams = z.object({
  id: z.uuid(),
});

const todoAttachmentParams = z.object({
  id: z.uuid(),
  attachmentId: z.uuid(),
});

// Todo collection
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

// Todo statistics
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

// Individual todo
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

/**
 * Todo attachment collection
 *
 * POST /api/v1/todos/{id}/attachments
 */

export const todoAttachmentCollectionPath = {
  post: {
    operationId: 'uploadTodoAttachment',
    summary: 'Upload attachment to todo',
    description:
      'Upload a file attachment to a todo owned by the authenticated user.',
    tags: ['Todos'],
    security,
    requestParams: {
      path: todoIDParams,
    },
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: uploadTodoAttachmentRequestSchema,
        },
      },
    },
    responses: {
      '201': {
        description: 'Attachment uploaded successfully.',
        content: {
          'application/json': {
            schema: ZTodoAttachment,
          },
        },
      },
    },
  },
};

/**
 * Individual todo attachment
 *
 * DELETE /api/v1/todos/{id}/attachments/{attachmentId}
 */

export const todoAttachmentItemPath = {
  delete: {
    operationId: 'deleteTodoAttachment',
    summary: 'Delete todo attachment',
    description:
      'Delete an attachment belonging to a todo owned by the authenticated user.',
    tags: ['Todos'],
    security,
    requestParams: {
      path: todoAttachmentParams,
    },
    responses: {
      '204': {
        description: 'Attachment deleted successfully. No response body.',
      },
    },
  },
};

/**
 * Download todo attachment
 *
 * GET /api/v1/todos/{id}/attachments/{attachmentId}/download
 */

export const todoAttachmentDownloadPath = {
  get: {
    operationId: 'getAttachmentPresignedURL',
    summary: 'Get attachment download URL',
    description:
      'Generate a presigned URL to download an attachment belonging to a todo owned by the authenticated user.',
    tags: ['Todos'],
    security,
    requestParams: {
      path: todoAttachmentParams,
    },
    responses: {
      '200': {
        description: 'Presigned attachment download URL.',
        content: {
          'application/json': {
            schema: getAttachmentPresignedURLResponseSchema,
          },
        },
      },
    },
  },
};
