riot = require('riot')
MessageUtils = require('../utils/MessageUtils.coffee')

class ThreadStore

  currentID: 0
  threads: []

  constructor: (@message) ->
    riot.observable(this)

    @on 'server_raw_messages', (rawMessages) =>
      @initThreads(rawMessages)
      @emit()

    @on 'thread_init', =>
      @emit()

    @on 'thread_select', (currentID)=>
      @currentID = currentID
      @emit()

  emit: ->
    @trigger 'thread_changed', @threads

  getCurrentID: =>
    @currentID

  getCurrentThread: =>
    @threads[@currentID]

  getThreads: =>
    @threads

  getAllChrono: =>
    orderedThreads = []
    for thread in @threads
      orderedThreads.push(thread)
    orderedThreads.sort (a, b) ->
      if a.lastMessage.date < b.lastMessage.date
        return -1
      else if a.lastMessage.date > b.lastMessage.date
        return 1
      return 0
    return orderedThreads

  initThreads: (rawMessages) =>
    for message, id in rawMessages
      threadID = message.threadID
      thread = @threads[threadID]
      if (thread and thread.lastTimestamp > message.timestamp)
        return
      @threads[threadID] =
        id: threadID
        name: message.threadName
        lastMessage: MessageUtils.convertRawMessage(message, @currentID)
    if (!@currentID)
      allChrono = @getAllChrono()
      @currentID = allChrono[allChrono.length - 1].id
    @threads[@currentID].lastMessage.isRead = true

module.exports = new ThreadStore
