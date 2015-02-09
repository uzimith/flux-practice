riot = require('riot')
TodoStore = ->
  riot.observable(this)

  @todos = {}

  @on 'todo_add', (newTodo) =>
    id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36)
    newTodo['id'] = id
    @todos[id] = newTodo
    @trigger 'todos_changed', @todos

  @on 'todo_remove', (id)=>
    delete @todos[id]
    @trigger 'todos_changed', @todos

  @on 'todo_toggle', (id)=>
    @todos[id].done = !@todos[id].done
    @trigger 'todos_changed', @todos

  @on 'todo_removeCompleted', =>
    for id, task of @todos
      if task.done
        delete @todos[task.id]
    @trigger 'todos_changed', @todos

  @on 'todo_init', =>
    @trigger 'todos_changed', @todos

module.exports = TodoStore
