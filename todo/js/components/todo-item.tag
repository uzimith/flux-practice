todo-item
  .clearfix(class='todo { completed: opts.task.done }' onmouseover='{ hover }' onmouseout='{ unhover }')
    label
      input(type="checkbox" onclick='{ toggle }' checked='{ opts.task.done }')
      span  { opts.task.title } 
    button.pull-right.btn.btn-xs.btn-default(show='{isHover}' onclick='{ remove }')
      span.glyphicon.glyphicon-remove
  script.
    RiotControl = require('../riotcontrol')
    @isHover = false

    @toggle = (e) =>
      RiotControl.trigger('todo_toggle', opts.task.id)
      true

    @remove = (e) =>
      RiotControl.trigger('todo_remove', opts.task.id)

    @hover = (e) =>
      @isHover = true
    @unhover = (e) =>
      @isHover = false

