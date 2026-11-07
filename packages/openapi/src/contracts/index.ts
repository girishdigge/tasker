import { healthPath } from './health.js';
import { categoryCollectionPath, categoryItemPath } from './category.js';
import { commentItemPath, todoCommentsPath } from './comment.js';
import { todoCollectionPath, todoItemPath, todoStatsPath } from './todo.js';

export const paths = {
  '/status': healthPath,

  '/api/v1/todos': todoCollectionPath,
  '/api/v1/todos/stats': todoStatsPath,
  '/api/v1/todos/{id}': todoItemPath,
  '/api/v1/todos/{id}/comments': todoCommentsPath,

  '/api/v1/categories': categoryCollectionPath,
  '/api/v1/categories/{id}': categoryItemPath,

  '/api/v1/comments/{id}': commentItemPath,
};

export {
  healthPath,
  todoCollectionPath,
  todoStatsPath,
  todoItemPath,
  todoCommentsPath,
  categoryCollectionPath,
  categoryItemPath,
  commentItemPath,
};
