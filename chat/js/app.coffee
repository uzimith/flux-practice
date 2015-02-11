riot = require('riot')
RiotControl = require('riotcontrol')
ChatExampleData = require('./ChatExampleData')

MessageStore = require('./stores/MessageStore.coffee')
ThreadStore = require('./stores/ThreadStore.coffee')
UnreadThreadStore = require('./stores/UnreadThreadStore.coffee')

require('./components/app.tag')
require('./components/message-panel.tag')
require('./components/message-editor.tag')
require('./components/thread-panel.tag')

ChatExampleData.init()

RiotControl.addStore(ThreadStore)
RiotControl.addStore(MessageStore)
RiotControl.addStore(UnreadThreadStore)

WebAPIUtils = require('./utils/WebAPIUtils')
WebAPIUtils.getAllMessages()

riot.mount('*')
