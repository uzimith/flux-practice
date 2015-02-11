moment = require('moment')

MessageUtils =
  convertRawMessage: (rawMessage, currentThreadID) ->
    id: rawMessage.id
    threadID: rawMessage.threadID
    authorName: rawMessage.authorName
    date: moment(new Date(rawMessage.timestamp))
    text: rawMessage.text
    isRead: rawMessage.threadID is currentThreadID

module.exports = MessageUtils
