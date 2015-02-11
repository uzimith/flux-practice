riot = require('riot')
moment = require('moment')
MessageUtils = require('../utils/MessageUtils.coffee')
ThreadStore = require('../stores/ThreadStore.coffee')

class MessageStore

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
    (message for message, id in @messages when message.threadID is ThreadStore.getCurrentID())

  addMessages: (rawMessages) =>
    for message, id in rawMessages
      if !@messages[id]
        @messages[id] = MessageUtils.convertRawMessage(message, ThreadStore.getCurrentID())

module.exports = new MessageStore
