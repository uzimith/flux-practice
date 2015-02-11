message-panel
  h3 { title }
  .message-list
    .message.clearfix(each='{ message, id in messages }')
      h5 { message.authorName }
      .message-date.pull-right { message.date.fromNow() }
      .message-last-message { message.text }
  message-editor
  script.
    RiotControl = require('riotcontrol')
    MessageStore = require('../stores/MessageStore.coffee')
    ThreadStore = require('../stores/ThreadStore.coffee')

    @title = ""
    @messages = []
    @thread = ""

    @on 'mount', =>
      RiotControl.trigger 'message_init'

    RiotControl.on 'message_changed', (data)=>
      @messages = MessageStore.getMessages()
      @title = ThreadStore.getCurrentThread().name
      @update()
