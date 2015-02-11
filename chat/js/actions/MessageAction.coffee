RiotControl = require('riotcontrol')
WebAPIUtils = require('../utils/WebAPIUtils')
ThreadStore = require('../stores/ThreadStore.coffee')

moment = require('moment')

MessageAction =
  add: (text) ->
    message =
      threadID: ThreadStore.getCurrentID()
      authorName: 'Bill'
      date: moment()
      text: text
      isRead: true
    RiotControl.trigger('message_add', message)
    WebAPIUtils.createMessage(message)

module.exports = MessageAction
