todo-remove
  button.btn.btn-default(onclick='{ remove }') Clear completed ({ completed })
  script.
    RiotControl = require('../riotcontrol')

    @completed = 0

    @on 'mount', =>
      RiotControl.trigger 'todo_init'

    RiotControl.on 'todos_changed', (items)=>
      @items = items
      console.log(items)
      @completed = (item for item in items when item.done is true).length
      @update()

    @remove = (e) =>
      RiotControl.trigger('todo_removeCompleted')
