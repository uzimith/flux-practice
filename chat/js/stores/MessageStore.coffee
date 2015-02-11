riot = require('riot')
moment = require('moment')
MessageUtils = require('../utils/MessageUtils.coffee')

class MessageStore

  currentID: 0
  messages: []

  constructor: (@message) ->
    riot.observable(this)
    @on 'server_raw_messages', (rawMessages) =>
      @addMessages(rawMessages)
      @emit()

    @on 'message_init', =>
      @emit()

    @on 'message_add', (message) =>
      @messages.push(message)
      @emit()

    @on 'thread_select', (currentID)=>
      @currentID = currentID
      @emit()

  emit: =>
    @trigger 'message_changed'

  getMessages: =>
    (message for message, id in @messages when message.threadID is @currentID)

  addMessages: (rawMessages) =>
    for message, id in rawMessages
      if !@messages[id]
        @messages[id] = MessageUtils.convertRawMessage(message, @currentID)

module.exports = new MessageStore
