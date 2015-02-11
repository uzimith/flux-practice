message-panel
  .message-list
    .message.clearfix(each='{ message, id in messages }')
      h5 { message.authorName }
      .message-date.pull-right { message.date.fromNow() }
      .message-last-message { message.text }
  message-editor(thread-id='{ currentID }')
  script.
    RiotControl = require('riotcontrol')
    MessageStore = require('../stores/MessageStore.coffee')
    ThreadStore = require('../stores/ThreadStore.coffee')

    @messages = []
    @thread = ""

    @on 'mount', =>
      RiotControl.trigger 'message_init'

    RiotControl.on 'message_changed', (data)=>
      @messages = data.messages
      @currentID = data.currentID
      @update()
