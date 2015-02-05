riot = require('riot')
TodoStore = ->
  riot.observable(this)

  @todos = [
    { title: 'Task 1', done: false},
    { title: 'Task 2', done: false},
  ]

  @on 'todo_add', (newTodo) =>
    @todos.push(newTodo)
    @trigger 'todos_changed', @todos

  @on 'todo_remove', =>
    @todos.pop()
    @trigger 'todos_changed', @todos

  @on 'todo_init', =>
    @trigger 'todos_changed', @todos

module.exports = TodoStore
window.TodoStore = TodoStore
