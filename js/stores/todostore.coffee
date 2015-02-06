riot = require('riot')
TodoStore = ->
  riot.observable(this)

  @todos = [
    { id: 1, title: 'Task 1', done: false},
    { id: 2, title: 'Task 2', done: true},
  ]

  @on 'todo_add', (newTodo) =>
    @todos.push(newTodo)
    @trigger 'todos_changed', @todos

  @on 'todo_remove', (id)=>
    delete @todos[id]
    @trigger 'todos_changed', @todos

  @on 'todo_removeCompleted', =>
    for todo,id in @todos
      if todo.done
        delete @todos[id]

  @on 'todo_init', =>
    @trigger 'todos_changed', @todos

module.exports = TodoStore
window.TodoStore = TodoStore
