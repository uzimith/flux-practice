RiotControl = require('riotcontrol')
WebAPIUtils = require('../utils/WebAPIUtils')

ServerAction =

  receiveAll: (rawMessages) ->
    RiotControl.trigger('server_raw_messages', rawMessages)

  receiveCreatedMessage: (createdMessage) ->
    RiotControl.trigger('server_raw_created_message', createdMessage)

module.exports = ServerAction
