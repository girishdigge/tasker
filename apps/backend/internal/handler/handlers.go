package handler

import (
	"github.com/girishdigge/tasker/internal/server"
	"github.com/girishdigge/tasker/internal/service"
)

type Handlers struct {
	Health   *HealthHandler
	OpenAPI  *OpenAPIHandler
	Todo     *TodoHandler
	Comment  *CommentHandler
	Category *CategoryHandler
}

func NewHandlers(s *server.Server, servcies *service.Services) *Handlers {
	return &Handlers{
		Health:   NewHealthHandler(s),
		OpenAPI:  NewOpenAPIHandler(s),
		Todo:     NewTodoHandler(s, servcies.Todo),
		Comment:  NewCommentHandler(s, servcies.Comment),
		Category: NewCategoryHandler(s, servcies.Category),
	}
}
