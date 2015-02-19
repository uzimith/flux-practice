window.React = require('react')
Store = require('flummox').Store

class TodoStore extends Store
  constructor: (flux) ->
    super
    todoActions = flux.getActionIds('todo')
    @register(todoActions.createTodo, @handleNewTodo)
    @register(todoActions.toggleTodo, @toggleTodo)
    @register(todoActions.clearCompletedTodos, @clearCompletedTodos)
    @state = {
      todos: {
        1: {
          id: 1
          complete: true
          text: "hoge"
        },
        2: {
          id: 2
          complete: false
          text: "fuga"
        }
      }
    }

  handleNewTodo: (todo) =>
    todos = @state.todos
    todos[todo.id] = todo
    @setState todos: todos

  toggleTodo: (id) =>
    todos = @state.todos
    todos[id].complete = !todos[id].complete
    @setState todos: todos

  clearCompletedTodos: =>
    todos = @state.todos
    newTodos = {}
    for index, todo of todos
      newTodos[todo.id] = todo unless todo.complete
    @setState todos: newTodos

module.exports = TodoStore
