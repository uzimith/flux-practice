class TodoActions extends Actions
  createTodo: (text) ->
    id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
    {
      id: id
      text: text
      complete: false
    }

  toggleTodo: (todo) ->
    todo.id

  clearCompletedTodos: ->
    null

module.exports = TodoActions
