thread-panel
  .unread-count
    span(if='{ unread !== 0 }')
      | Unread Thread : 
      span.badge { unread }
  .list-group
    a.list-group-item(each='{ thread, id in threads }' class='{active: id == parent.currentID}' onclick='{ parent.selectThread }')
      h5.list-group-teim-heading { thread.name }
      p.list-gropu.item-text
        .thread-date { thread.lastMessage.date.fromNow() }
        .thread-last-message { thread.lastMessage.text }
  script.
    RiotControl = require('riotcontrol')
    ThreadAction = require('../actions/ThreadAction.coffee')
    MessageStore = require('../stores/MessageStore.coffee')
    ThreadStore = require('../stores/ThreadStore.coffee')
    UnreadThreadStore = require('../stores/UnreadThreadStore.coffee')

    @currentID = 0
    @threads = []
    @unread = 0

    @on 'mount', =>
      RiotControl.trigger 'thread_init'

    RiotControl.on 'unread_thread_changed thread_changed', =>
      @threads = ThreadStore.getAll()
      @currentID = ThreadStore.getCurrentID()
      @unread = UnreadThreadStore.getCount()
      @update()

    @selectThread = (e) =>
      ThreadAction.select(e.item.id)
      @currentID = e.item.id
      @update()
