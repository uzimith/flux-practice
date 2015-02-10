riot = require('riot')
moment = require('moment')

ThreadStore = ->
  riot.observable(this)

  @threads = [
    {
      title: "1",
      lastMessage: {
        date: moment()
        text: "Looks good to me."
      }
    } ,
    {
      title: "tow",
      lastMessage: {
        date: moment()
        text: "Looks bad to me."
      }
    }
  ]

  @on 'thread_init', =>
    @trigger 'thread_changed', @threads

module.exports = ThreadStore
