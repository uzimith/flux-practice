todo-count
  span.badge { count }
  script.
    RiotControl = require('../riotcontrol')

    @count = 0

    @on 'mount', =>
      RiotControl.trigger 'todo_init'

    RiotControl.on 'todos_changed', (items)=>
      @count = items.length
      @update()
