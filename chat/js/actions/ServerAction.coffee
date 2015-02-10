RiotControl = require('../riotcontrol')

ServerAction =
  receive: (text) ->
    rawMessages = JSON.parse(localStorage.getItem('messages'))
    RiotControl.trigger('todo_add', {title: text, done: false})

module.exports = MessageAction
