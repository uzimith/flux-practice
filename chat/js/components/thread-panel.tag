thread-panel
  h2 Thread
  p { currentId }
  ul
    li(each='{ thread, id in threads }' class='{active: id == parent.currentId}' onclick='{ parent.toggleThread }')
      h5 { thread.title }
      .thread-date { thread.lastMessage.date.fromNow() }
      .thread-last-message { thread.lastMessage.text }
  script.
    RiotControl = require('../riotcontrol')

    @currentId = 1
    @threads = []

    @on 'mount', =>
      RiotControl.trigger 'thread_init'

    RiotControl.on 'thread_changed', (threads)=>
      @threads = threads
      @update()

    @toggleThread = (e)=>
      @currentId = e.item.id
