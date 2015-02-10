message-list
  ul
    li(each='{ message, id in messages }')
      h5 { message.name }
      .thread-date { message.date.fromNow() }
      .thread-last-message { message.text }
      
  script.
    RiotControl = require('../riotcontrol')

    @messages = []

    @on 'mount', =>
      RiotControl.trigger 'message_init'

    RiotControl.on 'message_changed', (messages)=>
      @messages = messages
      @update()
