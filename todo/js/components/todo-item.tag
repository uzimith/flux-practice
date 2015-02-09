todo-item
  .clearfix(class='todo { completed: opts.task.done }' onmouseover='{ hover }' onmouseout='{ unhover }')
    label
      input(type="checkbox" onclick='{ toggle }' checked='{ opts.task.done }')
      span  { opts.task.title } 
    button.pull-right.btn.btn-xs.btn-default(show='{isHover}' onclick='{ remove }')
      span.glyphicon.glyphicon-remove
  script.
    RiotControl = require('../riotcontrol')
    TodoAction = require('../actions/TodoAction.coffee')

    @isHover = false

    @toggle = (e) =>
      TodoAction.toggle(opts.task)
      true

    @remove = (e) =>
      TodoAction.destroy(opts.task)

    @hover = (e) =>
      @isHover = true
    @unhover = (e) =>
      @isHover = false

