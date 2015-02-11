RiotControl = require('riotcontrol')

ThreadAction =
  select: (currentID) ->
    RiotControl.trigger('thread_select', currentID)

module.exports = ThreadAction
