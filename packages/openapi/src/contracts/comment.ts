import { ZTodoComment } from '@tasker/zod';
import { z } from 'zod';

import { getSecurityRequirements } from '../utils.js';

const security = getSecurityRequirements();

const todoIDParams = z.object({
  id: z.uuid(),
});

const commentIDParams = z.object({
  id: z.uuid(),
});

export const addCommentRequestSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const updateCommentRequestSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const todoCommentsPath = {
  post: {
    operationId: 'addComment',
    summary: 'Add a comment to a todo',
    description: 'Add a comment to a todo owned by the authenticated user.',
    tags: ['Comments'],
    security,
    requestParams: {
      path: todoIDParams,
    },
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: addCommentRequestSchema,
        },
      },
    },
    responses: {
      '201': {
        description: 'Comment created successfully.',
        content: {
          'application/json': {
            schema: ZTodoComment,
          },
        },
      },
    },
  },
  get: {
    operationId: 'getCommentsByTodoId',
    summary: 'Get comments for a todo',
    description: 'Get comments belonging to a todo owned by the authenticated user.',
    tags: ['Comments'],
    security,
    requestParams: {
      path: todoIDParams,
    },
    responses: {
      '200': {
        description: 'Comments for the requested todo.',
        content: {
          'application/json': {
            schema: z.array(ZTodoComment),
          },
        },
      },
    },
  },
};

export const commentItemPath = {
  patch: {
    operationId: 'updateComment',
    summary: 'Update a comment',
    description: 'Update a comment owned by the authenticated user.',
    tags: ['Comments'],
    security,
    requestParams: {
      path: commentIDParams,
    },
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: updateCommentRequestSchema,
        },
      },
    },
    responses: {
      '200': {
        description: 'Comment updated successfully.',
        content: {
          'application/json': {
            schema: ZTodoComment,
          },
        },
      },
    },
  },
  delete: {
    operationId: 'deleteComment',
    summary: 'Delete a comment',
    description: 'Delete a comment owned by the authenticated user.',
    tags: ['Comments'],
    security,
    requestParams: {
      path: commentIDParams,
    },
    responses: {
      '204': {
        description: 'Comment deleted successfully. No response body.',
      },
    },
  },
};
