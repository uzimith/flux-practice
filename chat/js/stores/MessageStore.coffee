riot = require('riot')
moment = require('moment')
MessageStore = ->
  riot.observable(this)

  @messages = []

  @on 'message_init', =>
    @trigger 'message_changed', @messages

module.exports = MessageStore
