thread-panel
  .list-group
    a.list-group-item(each='{ thread, id in threads }' class='{active: id == parent.currentID}' onclick='{ parent.selectThread }')
      h5.list-group-teim-heading { thread.name }
      p.list-gropu.item-text
        .thread-date { thread.lastMessage.date.fromNow() }
        .thread-last-message { thread.lastMessage.text }
  script.
    RiotControl = require('riotcontrol')
    ThreadAction = require('../actions/ThreadAction.coffee')

    @currentID = 0
    @threads = []

    @on 'mount', =>
      RiotControl.trigger 'thread_init'

    RiotControl.on 'thread_changed', (threads) =>
      @threads = threads
      @update()

    @selectThread = (e) =>
      ThreadAction.select(e.item.id)
      @currentID = e.item.id
      @update()
