RiotControl = require('../riotcontrol')

TodoAction =
  add: (text) ->
    RiotControl.trigger('todo_add', {title: text, done: false})
  toggle: (task)->
    RiotControl.trigger('todo_toggle', task.id)
  destroy: (task)->
    RiotControl.trigger('todo_remove', task.id)
  destroyCompleted: ->
    RiotControl.trigger('todo_removeCompleted')

module.exports = TodoAction
