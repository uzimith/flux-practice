todo-remove
  button.btn.btn-default(if='{ completed != 0}' onclick='{ remove }') Clear completed ({ completed })
  script.
    RiotControl = require('../riotcontrol')

    @completed = 0

    @on 'mount', =>
      RiotControl.trigger 'todo_init'

    RiotControl.on 'todos_changed', (todos)=>
      @completed = (item for _, item of todos when item.done is true).length
      @update()

    @remove = (e) =>
      RiotControl.trigger('todo_removeCompleted')
