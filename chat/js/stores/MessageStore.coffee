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

  @emit = =>
    @trigger 'message_changed', {currentID: @currentID, messages: @getMessages()}

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

module.exports = MessageStore
