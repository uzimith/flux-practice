RiotControl = require('riotcontrol')
WebAPIUtils = require('../utils/WebAPIUtils')

ServerAction =
  receiveAll: (rawMessages) ->
    RiotControl.trigger('server_raw_messages', rawMessages)

module.exports = ServerAction
