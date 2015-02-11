riot = require('riot')
RiotControl = require('riotcontrol')
ChatExampleData = require('./ChatExampleData')
MessageStore = require('./stores/MessageStore.coffee')
ThreadStore = require('./stores/ThreadStore.coffee')

require('./components/app.tag')
require('./components/message-panel.tag')
require('./components/message-editor.tag')
require('./components/thread-panel.tag')
require('./components/thread.tag')

ChatExampleData.init()

RiotControl.addStore(new ThreadStore())
RiotControl.addStore(new MessageStore())

WebAPIUtils = require('./utils/WebAPIUtils')
WebAPIUtils.getAllMessages()

riot.mount('*')
