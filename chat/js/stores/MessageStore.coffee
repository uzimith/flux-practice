riot = require('riot')
moment = require('moment')
MessageUtils = require('../utils/MessageUtils.coffee')

MessageStore = ->
  riot.observable(this)

  @currentID = 0
  @messages = []
  @currentMessages = []

  @getMessages = =>
    (message for message, id in @messages when message.threadID is @currentID)

  @addMessages = (rawMessages)=>
    for message, id in rawMessages
      if !@messages[id]
        @messages[id] = MessageUtils.convertRawMessage(message, @currentID)

  @on 'server_raw_messages', (rawMessages) =>
    @addMessages(rawMessages)
    @trigger 'message_changed', @getMessages()

  @on 'message_init', =>
    @trigger 'message_changed', @getMessages()

  @on 'message_add', (message) =>
    @messages.push(message)
    @trigger 'message_changed', @getMessages()

  @on 'thread_select', (currentID)=>
    @currentID = currentID
    @trigger 'message_changed', @getMessages()

module.exports = MessageStore
