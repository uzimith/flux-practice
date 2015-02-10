riot = require('riot')
RiotControl = require('./riotcontrol.js')


require('./components/app.tag')
require('./components/message-panel.tag')
require('./components/message-editor.tag')
require('./components/message-list.tag')
require('./components/thread-panel.tag')
require('./components/thread.tag')

ChatExampleData = require('./ChatExampleData')
ChatExampleData.init()


MessageStore = require('./stores/MessageStore.coffee')
ThreadStore = require('./stores/ThreadStore.coffee')

RiotControl.addStore(new MessageStore)
RiotControl.addStore(new ThreadStore)
riot.mount('*')
