import { ZTodoCategory } from '@tasker/zod';
import { z } from 'zod';

import { getSecurityRequirements } from '../utils.js';
import { paginatedResponseSchema } from './pagination.js';

const security = getSecurityRequirements();

export const ZPaginatedCategories = paginatedResponseSchema(ZTodoCategory);

export const createCategoryRequestSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  description: z.string().max(255).nullable().optional(),
});

// The current Go update DTO cannot distinguish an omitted description from
// an explicit null. Send a string to update it; null-clearing can be added
// once the backend adopts a tri-state optional DTO.
export const updateCategoryRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/).optional(),
  description: z.string().max(255).optional(),
});

const categoryIDParams = z.object({
  id: z.uuid(),
});

export const categoryCollectionPath = {
  get: {
    operationId: 'getCategories',
    summary: 'Get categories',
    description: 'Get the authenticated user’s categories with search, sorting and pagination.',
    tags: ['Categories'],
    security,
    requestParams: {
      query: z.object({
        page: z.number().int().min(1).optional(),
        limit: z.number().int().min(1).max(100).optional(),
        sort: z.enum(['created_at', 'updated_at', 'name']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
        search: z.string().min(1).optional(),
      }),
    },
    responses: {
      '200': {
        description: 'Paginated list of categories.',
        content: {
          'application/json': {
            schema: ZPaginatedCategories,
          },
        },
      },
    },
  },
  post: {
    operationId: 'createCategory',
    summary: 'Create a category',
    description: 'Create a category for the authenticated user.',
    tags: ['Categories'],
    security,
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: createCategoryRequestSchema,
        },
      },
    },
    responses: {
      '201': {
        description: 'Category created successfully.',
        content: {
          'application/json': {
            schema: ZTodoCategory,
          },
        },
      },
    },
  },
};

export const categoryItemPath = {
  get: {
    operationId: 'getCategoryById',
    summary: 'Get a category',
    description: 'Get a category owned by the authenticated user.',
    tags: ['Categories'],
    security,
    requestParams: {
      path: categoryIDParams,
    },
    responses: {
      '200': {
        description: 'Category details.',
        content: {
          'application/json': {
            schema: ZTodoCategory,
          },
        },
      },
    },
  },
  patch: {
    operationId: 'updateCategory',
    summary: 'Update a category',
    description: 'Partially update a category owned by the authenticated user.',
    tags: ['Categories'],
    security,
    requestParams: {
      path: categoryIDParams,
    },
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: updateCategoryRequestSchema,
        },
      },
    },
    responses: {
      '200': {
        description: 'Category updated successfully.',
        content: {
          'application/json': {
            schema: ZTodoCategory,
          },
        },
      },
    },
  },
  delete: {
    operationId: 'deleteCategory',
    summary: 'Delete a category',
    description: 'Delete a category owned by the authenticated user.',
    tags: ['Categories'],
    security,
    requestParams: {
      path: categoryIDParams,
    },
    responses: {
      '204': {
        description: 'Category deleted successfully. No response body.',
      },
    },
  },
};
