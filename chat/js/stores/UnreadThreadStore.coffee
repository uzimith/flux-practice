riot = require('riot')
ThreadStore = require('../stores/ThreadStore.coffee')
class UnreadThreadStore

  constructor: (@message) ->
    riot.observable(this)

    @on 'thread_select', (currentID)=>
      @emit()

  emit: ->
    @trigger 'unread_thread_changed'

  getCount: ->
    (thread for thread in ThreadStore.getAll() when !thread.lastMessage.isRead).length


module.exports = new UnreadThreadStore
