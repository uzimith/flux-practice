RiotControl = require('riotcontrol')
WebAPIUtils = require('../utils/WebAPIUtils')
moment = require('moment')

MessageAction =
  add: (text, threadID) ->
    message =
      threadID: threadID
      authorName: 'Bill'
      date: moment()
      text: text
      isRead: true
    RiotControl.trigger('message_add', message)
    WebAPIUtils.createMessage(message)

module.exports = MessageAction
